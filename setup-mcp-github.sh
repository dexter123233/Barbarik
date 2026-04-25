#!/usr/bin/env bash
set -euo pipefail

# ── Paths ─────────────────────────────────────────────────────────────────────
OC_CFG="${XDG_CONFIG_HOME:-$HOME/.config}/opencode"
CMD_DIR="$OC_CFG/commands"
AGENT_DIR="$OC_CFG/agents"
MCP_DIR="$HOME/.config/mcp-gh"
ENV_FILE="$MCP_DIR/.env"
OC_JSON="$OC_CFG/opencode.json"

mkdir -p "$CMD_DIR" "$AGENT_DIR" "$MCP_DIR"

# ── Check opencode is installed ───────────────────────────────────────────────
if ! command -v opencode &>/dev/null; then
  echo "→ Installing opencode..."
  curl -fsSL https://opencode.ai/install | bash
  # Reload PATH for the rest of this script
  export PATH="$HOME/.local/bin:$HOME/bin:$PATH"
fi
echo "✓ opencode $(opencode --version 2>/dev/null || echo 'installed')"

# ── Check other dependencies ──────────────────────────────────────────────────
for cmd in curl jq fzf python3; do
  command -v "$cmd" &>/dev/null || { echo "✗ Missing: $cmd"; exit 1; }
done
echo "✓ Dependencies OK"

# ── Credentials ───────────────────────────────────────────────────────────────
if [[ ! -f "$ENV_FILE" ]]; then
  echo ""
  echo "── mcp-github credentials ─────────────────────────────"
  read -rp "GitHub Personal Access Token (ghp_...): " GH_TOKEN
  read -rp "GitHub Owner (org or username):          " GH_OWNER
  read -rp "GitHub Repo name:                        " GH_REPO
  read -rp "MCP server host [localhost]:             " MCP_HOST
  MCP_HOST="${MCP_HOST:-localhost}"
  read -rp "MCP server port [8003]:                  " MCP_PORT
  MCP_PORT="${MCP_PORT:-8003}"

  cat > "$ENV_FILE" <<EOF
GITHUB_TOKEN=$GH_TOKEN
GITHUB_OWNER=$GH_OWNER
GITHUB_REPO=$GH_REPO
MCP_HOST=$MCP_HOST
MCP_PORT=$MCP_PORT
MCP_BASE=http://${MCP_HOST}:${MCP_PORT}
EOF
  chmod 600 "$ENV_FILE"
  echo "✓ Credentials saved to $ENV_FILE"
fi

source "$ENV_FILE"

# ── Python MCP server deps ────────────────────────────────────────────────────
pip3 install --quiet mcp uvicorn starlette httpx python-dotenv 2>/dev/null || python3 -m pip install --quiet mcp uvicorn starlette httpx python-dotenv 2>/dev/null || true
echo "✓ Python packages installed"

# ── Low-level MCP call helper ─────────────────────────────────────────────────
cat > "$MCP_DIR/mcp-call.sh" <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail
source "$HOME/.config/mcp-gh/.env"
TOOL="$1"; PARAMS="${2:-{}}"
curl -sf "$MCP_BASE/messages/" \
  -H "Content-Type: application/json" \
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"$TOOL\",\"arguments\":$PARAMS}}" \
  | jq -r '.result // .error // .'
SCRIPT
chmod +x "$MCP_DIR/mcp-call.sh"

# ── Wrapper scripts (same as neovim setup, usable from opencode shell tool) ───
for name in branch commit pr status ci security merge; do
  ln -sf "$MCP_DIR/mcp-${name}.sh" "$HOME/.local/bin/mcp-${name}" 2>/dev/null || true
done

# ══════════════════════════════════════════════════════════════════════════════
# opencode.json  — register mcp-github as a remote MCP server
# ══════════════════════════════════════════════════════════════════════════════
# Merge into existing config if present, otherwise create fresh
if [[ -f "$OC_JSON" ]]; then
  TMP=$(mktemp)
  jq --arg host "$MCP_HOST" --arg port "$MCP_PORT" '
    .mcp["mcp-github"] = {
      "type": "remote",
      "url": ("http://" + $host + ":" + $port + "/sse"),
      "enabled": true,
      "oauth": false
    } |
    .permission.mcp["mcp-github"] = "allow"
  ' "$OC_JSON" > "$TMP" && mv "$TMP" "$OC_JSON"
else
  cat > "$OC_JSON" <<JSONC
{
  "\$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-6",
  "mcp": {
    "mcp-github": {
      "type": "remote",
      "url": "http://${MCP_HOST}:${MCP_PORT}/sse",
      "enabled": true,
      "oauth": false
    }
  },
  "permission": {
    "ask": "allow",
    "mcp": {
      "mcp-github": "allow"
    }
  }
}
JSONC
fi
echo "✓ opencode.json updated with mcp-github server"

# ══════════════════════════════════════════════════════════════════════════════
# SLASH COMMANDS  — one .md file per workflow step
# ~/.config/opencode/commands/<name>.md  →  /mcp-<name> in the TUI
# ══════════════════════════════════════════════════════════════════════════════

# /mcp-branch
cat > "$CMD_DIR/mcp-branch.md" <<'MD'
# Create a GitHub branch via mcp-github

Use the `mcp-github` MCP server tool `create_branch` to create a new feature branch.

- Ask the user for the branch name if $BRANCH_NAME is not supplied.
- Use `from_branch: "main"` unless the user specifies otherwise.
- If the tool returns a 422 error (branch exists), append `-2` to the name and retry.
- Report the created branch name and SHA when done.

Arguments: $BRANCH_NAME
MD

# /mcp-commit
cat > "$CMD_DIR/mcp-commit.md" <<'MD'
# Commit the current file to a branch via mcp-github

Use the `mcp-github` MCP server tool `commit_files` to push the current file.

Steps:
1. Read the current open file path ($FILE_PATH) and its full content.
2. Use branch $BRANCH_NAME (ask the user if not set).
3. Ask for a commit message if $COMMIT_MSG is not supplied.
4. Call `commit_files` with branch_name, file_path, file_content, and commit_message.
5. Report the resulting commit SHA.

Arguments: $BRANCH_NAME $FILE_PATH $COMMIT_MSG
MD

# /mcp-pr
cat > "$CMD_DIR/mcp-pr.md" <<'MD'
# Open a pull request via mcp-github

Use the `mcp-github` MCP server tool `open_pull_request`.

Steps:
1. Ask for branch name ($BRANCH_NAME), PR title ($PR_TITLE), and optionally a body.
2. Set base_branch to "main" unless the user says otherwise.
3. The PR body must describe: what changed, files affected, and known risks.
4. Call `open_pull_request` and report the PR number and URL.

Arguments: $BRANCH_NAME $PR_TITLE
MD

# /mcp-status
cat > "$CMD_DIR/mcp-status.md" <<'MD'
# Check pull request status via mcp-github

Use the `mcp-github` MCP server tool `get_pr_status`.

Steps:
1. Ask for PR number ($PR_NUMBER) if not supplied.
2. Call `get_pr_status` with pr_number.
3. Display: state, mergeable, allPassed, and a table of check names with their conclusions.
4. Highlight any failing checks in your response.

Arguments: $PR_NUMBER
MD

# /mcp-ci
cat > "$CMD_DIR/mcp-ci.md" <<'MD'
# Get CI result and coverage for a PR via mcp-github

Use the `mcp-github` MCP server tools `get_ci_result` and `get_coverage_report`.

Steps:
1. Ask for PR number ($PR_NUMBER) if not supplied.
2. Call `get_ci_result` — report SHA, allConcluded, testsPassed, ciOutputHash.
3. Call `get_coverage_report` — report coveragePct.
4. If coveragePct < 80, flag it as a coverage failure.
5. If coveragePct is null, tell the user their CI must post a comment in format: `Coverage: N%`

Arguments: $PR_NUMBER
MD

# /mcp-security
cat > "$CMD_DIR/mcp-security.md" <<'MD'
# Trigger a security scan on a PR via mcp-github

Use the `mcp-github` MCP server tool `run_security_scan`.

Steps:
1. Ask for PR number ($PR_NUMBER) if not supplied.
2. Call `run_security_scan`.
3. Inform the user the scan takes ~2 minutes.
4. After confirming the trigger, suggest they run /mcp-ci in 2 minutes to check results.

Arguments: $PR_NUMBER
MD

# /mcp-merge
cat > "$CMD_DIR/mcp-merge.md" <<'MD'
# Merge a pull request via mcp-github

Use the `mcp-github` MCP server tool `merge_pull_request`.

Pre-conditions — refuse to merge unless ALL of the following are true:
- `get_pr_status` returns allPassed: true
- `get_pr_status` returns mergeable: true or mergeable_state: "clean"
- The user has explicitly confirmed they want to merge

Steps:
1. Ask for PR number ($PR_NUMBER).
2. Call `get_pr_status` to verify the pre-conditions above.
3. Ask: "PR #N looks good. Confirm merge? [y/N]"
4. Only if confirmed: call `merge_pull_request` with merge_method: "squash".
5. Report the merge SHA or any error.

Arguments: $PR_NUMBER
MD

# /mcp-pipeline
cat > "$CMD_DIR/mcp-pipeline.md" <<'MD'
# Run the full Coder → QA → Security → Verifier pipeline via mcp-github

Orchestrate the complete CI/CD pipeline using the `mcp-github` MCP server.

Arguments: $TASK_DESCRIPTION $BRANCH_SLUG

Steps:
1. **Coder phase**
   - Call `create_branch` with branch_name="feature/$BRANCH_SLUG"
   - Ask the user which files to create/modify. For each file, call `commit_files`.
   - Call `open_pull_request` with a detailed body. Save the prNumber.

2. **QA phase**
   - Poll `get_pr_status` every 60s until allPassed=true (max 10 retries).
   - If any check fails, report failing checks and STOP.
   - Call `get_coverage_report`. If coveragePct < 80, report shortfall and STOP.
   - Output QA verdict: APPROVED with coveragePct.

3. **Security phase**
   - Call `run_security_scan`.
   - Wait 120 seconds, then poll `get_ci_result` for security check conclusion.
   - If security check failed, output BLOCKED with details and STOP.
   - Output Security verdict: CLEARED.

4. **Verifier phase**
   - Call `get_pr_status` one final time and confirm mergeable=true.
   - Ask the user: "All checks passed. Merge PR #N? [y/N]"
   - On confirmation: call `merge_pull_request` with merge_method="squash".
   - Output MERGE_RECEIPT with SHA, verdicts, and timestamp.
MD

echo "✓ Slash commands written to $CMD_DIR"

# ══════════════════════════════════════════════════════════════════════════════
# AGENTS  — specialized agents scoped to each pipeline role
# ~/.config/opencode/agents/<name>.md
# ══════════════════════════════════════════════════════════════════════════════

cat > "$AGENT_DIR/mcp-coder.md" <<'MD'
---
name: mcp-coder
description: Coder agent for the mcp-github CI/CD pipeline. Creates branches, commits files, opens PRs.
tools:
  - mcp-github_create_branch
  - mcp-github_commit_files
  - mcp-github_open_pull_request
---

You are a Coder Agent in an automated CI/CD pipeline powered by GitHub.
Your sole job: implement tasks by writing code and pushing it via the mcp-github tools.

## Workflow
1. Call `create_branch` with branch_name="feature/<task-slug>" from_branch="main".
2. For each file: call `commit_files` with branch_name, file_path, file_content, commit_message.
3. After all commits: call `open_pull_request`. The body must include what changed, files affected, and known risks.
4. Return the prNumber and URL.

## Rules
- Always create the branch first. Never skip step 1.
- Commit files one at a time. Do not open the PR until all commits are done.
- Do not merge or close PRs — that is the Verifier agent's job.
- On 422 branch-exists error: append -2 to the branch name and retry.
MD

cat > "$AGENT_DIR/mcp-qa.md" <<'MD'
---
name: mcp-qa
description: QA agent for the mcp-github CI/CD pipeline. Verifies CI checks and coverage.
tools:
  - mcp-github_get_pr_status
  - mcp-github_get_ci_result
  - mcp-github_get_coverage_report
---

You are a QA Agent in an automated CI/CD pipeline.
Your job: verify that CI passed and coverage meets the 80% threshold.

## Workflow
1. Receive prNumber.
2. Call `get_pr_status`. If checks are not completed, wait 60s and retry (max 10 times).
3. If any check conclusion is "failure": report the failing checks and STOP.
4. Call `get_ci_result` to get the proof hash.
5. Call `get_coverage_report`. If coveragePct < 80 or null: report and STOP.
6. Output:
   QA_REPORT:
     prNumber: N
     allChecksPassed: true
     coveragePct: N
     ciOutputHash: <hash>
     verdict: APPROVED

## Rules
- Never approve PRs with failing checks or coverage below 80%.
- Do not merge.
MD

cat > "$AGENT_DIR/mcp-security.md" <<'MD'
---
name: mcp-security
description: Security agent for the mcp-github CI/CD pipeline. Triggers SAST and dependency scans.
tools:
  - mcp-github_run_security_scan
  - mcp-github_get_ci_result
  - mcp-github_get_pr_status
---

You are a Security Agent in an automated CI/CD pipeline.
Only proceed if you have received a QA_REPORT with verdict: APPROVED.

## Workflow
1. Call `run_security_scan` on the prNumber.
2. Wait 120 seconds.
3. Poll `get_ci_result` until allConcluded=true (max 5 retries, 60s apart).
4. Check `get_pr_status` for any check whose name contains "security".
5. Output:
   SECURITY_REPORT:
     prNumber: N
     scanTriggered: true
     securityCheckConclusion: success | failure
     verdict: CLEARED | BLOCKED
     notes: <findings>

## Rules
- Refuse to proceed without a QA_REPORT verdict: APPROVED.
- Never merge. Only the Verifier agent merges.
MD

cat > "$AGENT_DIR/mcp-verifier.md" <<'MD'
---
name: mcp-verifier
description: Verifier agent for the mcp-github CI/CD pipeline. Final gatekeeper — merges PRs only after QA and Security approval.
tools:
  - mcp-github_merge_pull_request
  - mcp-github_get_pr_status
---

You are the Verifier Agent — the final gatekeeper in the CI/CD pipeline.
You merge PRs ONLY when both QA and Security have given clearance.

## Pre-conditions (ALL must be true)
- QA_REPORT with verdict: APPROVED
- SECURITY_REPORT with verdict: CLEARED
- Both reports reference the same prNumber

## Workflow
1. Validate both reports. If missing or not approved/cleared: output MERGE_BLOCKED and stop.
2. Call `get_pr_status`. Confirm state="open" and mergeable=true. If not: report and stop.
3. Ask the user: "PR #N: QA approved, security cleared. Confirm merge? [y/N]"
4. On confirmation: call `merge_pull_request` with merge_method="squash".
5. Output:
   MERGE_RECEIPT:
     prNumber: N
     merged: true
     mergeSha: <sha>
     qaVerdict: APPROVED
     securityVerdict: CLEARED
     mergeMethod: squash

## Rules
- NEVER merge without both verdicts.
- NEVER merge if mergeable=false.
- On merge failure: report and wait for human review — do not auto-retry.
MD

echo "✓ Agents written to $AGENT_DIR"

# ══════════════════════════════════════════════════════════════════════════════
# Non-interactive wrappers  — opencode -p mode for scripting / CI
# ══════════════════════════════════════════════════════════════════════════════════════
BIN="$HOME/.local/bin"
mkdir -p "$BIN"

cat > "$BIN/oc-branch" <<SCRIPT
#!/usr/bin/env bash
# Usage: oc-branch <branch-name> [base-branch]
BRANCH="\${1:?branch name required}"
BASE="\${2:-main}"
opencode -p "Using the mcp-github server, create a branch named '\$BRANCH' from '\$BASE'. Report the SHA when done." -q
SCRIPT

cat > "$BIN/oc-commit" <<SCRIPT
#!/usr/bin/env bash
# Usage: oc-commit <branch> <file-path> "<commit-message>"
BRANCH="\${1:?branch required}"
FILE="\${2:?file path required}"
MSG="\${3:?commit message required}"
CONTENT=\$(cat "\$FILE")
opencode -p "Using the mcp-github server, commit the file '\$FILE' on branch '\$BRANCH' with message: '\$MSG'. File content follows:

\$CONTENT" -q
SCRIPT

cat > "$BIN/oc-pr" <<SCRIPT
#!/usr/bin/env bash
# Usage: oc-pr <branch> "<title>" [base]
BRANCH="\${1:?branch required}"
TITLE="\${2:?title required}"
BASE="\${3:-main}"
opencode -p "Using the mcp-github server, open a pull request from branch '\$BRANCH' to '\$BASE' with title: '\$TITLE'. Include a descriptive PR body summarising the change." -q
SCRIPT

cat > "$BIN/oc-status" <<SCRIPT
#!/usr/bin/env bash
# Usage: oc-status <pr-number>
PR="\${1:?PR number required}"
opencode -p "Using the mcp-github server, get the status of PR #\$PR. Show: state, mergeable, allPassed, and list each check name with its conclusion." -q
SCRIPT

cat > "$BIN/oc-ci" <<SCRIPT
#!/usr/bin/env bash
# Usage: oc-ci <pr-number>
PR="\${1:?PR number required}"
opencode -p "Using the mcp-github server, get the CI result and coverage report for PR #\$PR. Flag any coverage below 80%." -q
SCRIPT

cat > "$BIN/oc-security" <<SCRIPT
#!/usr/bin/env bash
# Usage: oc-security <pr-number>
PR="\${1:?PR number required}"
opencode -p "Using the mcp-github server, trigger a security scan on PR #\$PR and report that the user should check results in ~2 minutes." -q
SCRIPT

cat > "$BIN/oc-merge" <<SCRIPT
#!/usr/bin/env bash
# Usage: oc-merge <pr-number>
PR="\${1:?PR number required}"
opencode -p "Using the mcp-github server, first call get_pr_status for PR #\$PR to confirm it is mergeable and all checks passed, then merge it with squash method. Report the merge SHA." -q
SCRIPT

cat > "$BIN/oc-pipeline" <<SCRIPT
#!/usr/bin/env bash
# Usage: oc-pipeline "<task description>" <branch-slug>
TASK="\${1:?task description required}"
SLUG="\${2:?branch slug required}"
opencode -p "Run the full mcp-github CI/CD pipeline for this task: \$TASK

Branch slug: \$SLUG

Follow these phases in order using the mcp-github MCP server tools:
1. Coder: create branch feature/\$SLUG, implement and commit all files, open PR.
2. QA: poll get_pr_status until all checks pass, verify coverage >= 80%.
3. Security: run_security_scan, wait 2 min, check conclusion.
4. Verifier: final status check, then merge with squash if everything is clear.
Report each phase outcome before proceeding to the next." -q
SCRIPT

chmod +x "$BIN"/oc-*
echo "✓ Non-interactive wrappers written to $BIN"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Setup complete!"
echo ""
echo "  1. Start the MCP server in a separate terminal:"
echo "     python3 mcp_github.py"
echo ""
echo "  2. Launch opencode:"
echo "     opencode"
echo ""
echo "  3. Slash commands (in the TUI — type / to search):"
echo "     /mcp-branch      create a branch"
echo "     /mcp-commit      commit current file"
echo "     /mcp-pr          open a pull request"
echo "     /mcp-status      check PR status"
echo "     /mcp-ci          CI result + coverage"
echo "     /mcp-security    trigger security scan"
echo "     /mcp-merge       merge the PR"
echo "     /mcp-pipeline    run full pipeline end-to-end"
echo ""
echo "  4. Switch to a scoped agent (Tab in TUI or -a flag):"
echo "     opencode -a mcp-coder"
echo "     opencode -a mcp-qa"
echo "     opencode -a mcp-security"
echo "     opencode -a mcp-verifier"
echo ""
echo "  5. Non-interactive (scripts / CI):"
echo "     oc-branch feature/auth-fix"
echo "     oc-commit feature/auth-fix src/auth.js 'add token refresh'"
echo "     oc-pr feature/auth-fix 'Add token refresh logic'"
echo "     oc-status 47"
echo "     oc-ci 47"
echo "     oc-security 47"
echo "     oc-merge 47"
echo "     oc-pipeline 'rate-limiter middleware' rate-limiter"
echo "═══════════════════════════════════════════════════════"