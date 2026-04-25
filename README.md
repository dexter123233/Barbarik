# Barbarik - LYZR MCP GitHub Integration

A complete setup and integration guide for connecting LYZR MCP (Model Context Protocol) with GitHub. This enables AI agents to interact with your development workflows - creating branches, commits, pull requests, and managing CI/CD pipelines.

## Features

- **Branch Management** - Create and manage GitHub branches
- **File Committing** - Commit files directly from AI agents
- **Pull Request Automation** - Open, review, and merge PRs
- **CI/CD Integration** - Get CI results and coverage reports
- **Security Scanning** - Trigger security scans on PRs
- **Full Pipeline** - Automated Coder → QA → Security → Verifier workflow

## Quick Start

### Prerequisites

1. **Python 3.10+** - [python.org](https://python.org)
2. **uv package manager** - `pip install uv` or [install guide](https://docs.astral.sh/uv/)
3. **GitHub Personal Access Token** - With `repo` scope
4. **MCP-compatible client** - opencode, Claude Desktop, or Cursor

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/dexter123233/Barbarik.git
cd Barbarik

# 2. Install setup script
chmod +x setup-mcp-github.sh

# 3. Run the setup
./setup-mcp-github.sh
```

### Configuration

The setup script will prompt for:

- **GitHub Personal Access Token** - Your PAT with `repo` scope
- **GitHub Owner** - Organization or username
- **GitHub Repo name** - Repository to manage
- **MCP Server Host** - Default: `localhost`
- **MCP Server Port** - Default: `8003`

### Starting the MCP Server

```bash
# In a separate terminal:
python mcp_github.py
```

### Launching opencode

```bash
opencode
```

## Usage

### Slash Commands

In the opencode TUI, type `/` to access:

| Command | Description |
|---------|------------|
| `/mcp-branch` | Create a new GitHub branch |
| `/mcp-commit` | Commit current file to a branch |
| `/mcp-pr` | Open a pull request |
| `/mcp-status` | Check PR status |
| `/mcp-ci` | Get CI result + coverage |
| `/mcp-security` | Trigger security scan |
| `/mcp-merge` | Merge a PR |
| `/mcp-pipeline` | Run full CI/CD pipeline |

### Specialized Agents

Switch to scoped agents using Tab or `-a` flag:

```bash
opencode -a mcp-coder      # Creates branches, commits, opens PRs
opencode -a mcp-qa        # Verifies CI checks and coverage
opencode -a mcp-security  # Runs security scans
opencode -a mcp-verifier # Final gatekeeper - merges PRs
```

### Non-Interactive (CI/CD)

```bash
oc-branch feature/auth-fix
oc-commit feature/auth-fix src/auth.js 'add token refresh'
oc-pr feature/auth-fix 'Add token refresh logic'
oc-status 47
oc-ci 47
oc-security 47
oc-merge 47
oc-pipeline 'rate-limiter middleware' rate-limiter
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      opencode TUI                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐   │
│  │/branch │  │/commit │  │  /pr    │  │ /pipeline│   │
│  └─────────┘  └─────────┘  └─────────┘  └──────────┘   │
│                            │                             │
│                            ▼                             │
│  ┌──────────────────────────────────────────────┐      │
│  │         mcp-github MCP Server                 │      │
│  │  (Python + mcp library + uvicorn)          │      │
│  └──────────────────────────────────────────────┘      │
│                            │                             │
│                            ▼                             │
│  ┌──────────────────────────────────────────────┐      │
│  │         GitHub API                          │      │
│  │  (REST: branches, commits, PRs, status)      │      │
│  └──────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Pipeline Flow

```
┌─────────┐    ┌─────────┐    ┌───────────┐    ┌──────────┐
│ Coder   │───▶│   QA    │───▶│ Security │───▶│ Verifier │
│ Agent   │    │ Agent   │    │  Agent  │    │  Agent  │
└─────────┘    └─────────┘    └───────────┘    └──────────┘
     │             │             │              │
     ▼             ▼             ▼              ▼
  branch      checks &      scan &       merge
  + commit    coverage     wait         PR
  + PR
```

## Environment Variables

Credentials are stored in `~/.config/mcp-gh/.env`:

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_OWNER=dexter123233
GITHUB_REPO=Barbarik
MCP_HOST=localhost
MCP_PORT=8003
MCP_BASE=http://localhost:8003
```

## Tools

Each MCP tool corresponds to a GitHub API endpoint:

| Tool | GitHub API | Description |
|------|----------|------------|
| `create_branch` | `POST /git/refs` | Create new branch |
| `commit_files` | `POST /git/commits` | Commit file |
| `open_pull_request` | `POST /pulls` | Open PR |
| `get_pr_status` | `GET /pulls/{n}` | Get PR status |
| `get_ci_result` | `GET /commits/{sha}/status` | Get CI result |
| `get_coverage_report` | Parse CI output | Get coverage % |
| `run_security_scan` | Trigger scan | Security check |
| `merge_pull_request` | `PUT /pulls/{n}/merge` | Merge PR |

## Troubleshooting

### Tool not appearing in MCP client

1. Restart your client after making changes
2. Verify credentials in `~/.config/mcp-gh/.env`
3. Check syntax in `opencode.json`
4. Ensure both `GITHUB_TOKEN` and `GITHUB_OWNER` are set
5. Confirm your account has access to the repository

### 422 Branch exists error

The script automatically appends `-2` and retries.

### 401 Authentication error

Check your GitHub token has `repo` scope.

### Server connection refused

Ensure `mcp_github.py` is running in a separate terminal.

## License

MIT License - See LICENSE file

## Resources

- [LYZR Documentation](https://docs.lyzr.ai)
- [MCP Specification](https://spec.modelcontextprotocol.io)
- [GitHub API](https://docs.github.com/rest)
- [opencode](https://opencode.ai)