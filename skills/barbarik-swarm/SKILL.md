---
name: barbarik-swarm
description: >-
  Zero-employee startup orchestration skill. Deploys and manages a 6-agent swarm
  (Orchestrator CEO, Dev Production, Scout Market Intel, Archer Growth, Pulse Support,
  Sentinel Ops) on Lyzr Studio. Use when building an autonomous software organisation
  with no human employees — the agents handle code, sales, support, and finance.
license: MIT
compatibility: Lyzr Studio with Anthropic Claude models. Requires GitHub MCP, Stripe,
  SendGrid, and Pinecone/Chroma API keys configured in the agent's tool connections.
metadata:
  author: barbarik
  version: "1.0.0"
  swarm_size: "6"
  category: "autonomous-organisation"
allowed-tools: "Agent(create) Agent(chat) Tool(github-mcp) Tool(sendgrid) Tool(stripe)"
---

# Barbarik Swarm

Zero-employee startup agent orchestration skill. This skill configures and
orchestrates a 6-agent swarm that replaces an entire company: CEO, Engineering,
Market Intelligence, Growth, Customer Support, and Finance/Operations.

## Architecture

```
                  ┌───────────────────────┐
                  │   Orchestrator (CEO)   │
                  └──────┬────┬────┬───────┘
                         │    │    │
              ┌──────────┘    │    └──────────┐
              ▼               ▼               ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │  Dev (Prod)  │ │Scout (Market)│ │Pulse(Support)│
     │  git/deploy  │ │  lead gen    │ │  triage      │
     └──────┬───────┘ └──────┬───────┘ └──────────────┘
            │                │
            │                ▼
            │        ┌──────────────┐
            │        │Archer(Growth)│
            │        │ outbound A/B │
            │        └──────┬───────┘
            └───────┬───────┘
                    ▼
            ┌──────────────┐
            │Sentinel (Ops)│
            │ P&L, budgets │
            └──────────────┘
```

Dev, Scout, Pulse run in **parallel**. Archer depends on Scout leads.
Sentinel aggregates all outputs last.

## Agent Configuration

### 1. Orchestrator (CEO)

- **ID**: `6a30641de3422d56b320eab9`
- **Model**: Claude Opus 4.8 (complex reasoning for planning)
- **Role**: Decomposes business goals into parallel workstreams
- **Input**: `{"goal": "string", "context": {"industry": "...", "target_revenue": 1000000}}`
- **Output**: Workstream plan with agent assignments, dependencies, and dashboard URL
- **Rules**: Dispatch Dev+Scout+Pulse in parallel, Archer after Scout, Sentinel last.
  Pause for human review if any workstream exceeds $500. Fail-fast on agent errors.

### 2. Dev (Production)

- **ID**: `6a306424fccbb5ab5ba43ed3`
- **Model**: Claude Sonnet 4.6
- **Role**: Writes code, tests, opens PRs, deploys via GitHub MCP
- **Tools**: GitHub MCP (create_branch, commit_files, open/merge PR), Lyzr Code Sandbox
- **Input**: `{"spec": {"repo": "...", "feature": "..."}, "guardrails": {...}}`
- **Output**: PR URL, branch, test/deploy status
- **Guardrails**: Max 10 PRs/day, no eval/exec/rm -rf, tests required, feature branches only

### 3. Scout (Market Intelligence)

- **ID**: `6a306427f852da49f067816d`
- **Model**: Claude Sonnet 4.6
- **Role**: Lead generation from Crunchbase, LinkedIn, news, tech blogs
- **Tools**: Lyzr Web Scraper, Pinecone/Chroma vector memory
- **Input**: `{"target_market": "...", "sources": [...], "max_prospects": 200}`
- **Output**: Ranked prospects with confidence scores, trending keywords
- **Rules**: Deduplicate via vector memory, score by signal (funding>hiring>tech),
  max 500 API calls/day per source

### 4. Archer (Growth)

- **ID**: `6a30642ae3422d56b320eabb`
- **Model**: Claude Sonnet 4.6
- **Role**: Multi-channel outbound campaigns with A/B testing
- **Dependencies**: Requires Scout output (prospect list)
- **Tools**: Lyzr Email API (SendGrid), LinkedIn/X APIs, Stripe
- **Input**: `{"prospects": [...], "channels": ["email","linkedin","x"], "budget_cents": 50000}`
- **Output**: Delivery stats, meetings booked, ROI estimate
- **Rules**: A/B rotate variants for first 50 sends, pause at 90% budget,
  max 200 email/50 LinkedIn/100 X DMs per day

### 5. Pulse (Customer Support)

- **ID**: `6a30642dd67f0122444ede19`
- **Model**: Claude Sonnet 4.6
- **Role**: Ticket triage, auto-resolve, bug escalation
- **Tools**: Lyzr Ticket API (Intercom/Zendesk), GitHub MCP, vector DB
- **Input**: `{"tickets": [{id, subject, body, severity}], "max_auto_resolve": 50}`
- **Output**: Resolved/escalated counts, SLA breaches, CSAT delta
- **Rules**: Vector-match auto-reply at similarity > 0.85, critical→immediate
  GitHub issue with Dev ping, SLA: critical 1h / high 4h / med 24h / low 72h

### 6. Sentinel (Finance & Ops)

- **ID**: `6a3064308d4d81831be75f94`
- **Model**: Claude Sonnet 4.6
- **Role**: Budget enforcement, P&L, infrastructure monitoring
- **Dependencies**: Requires all prior agent outputs (runs last)
- **Tools**: Lyzr Budget API, Lyzr Infra API, Google Sheets
- **Input**: `{"workstreams": [{agent, status, cost_cents}], "budgets": {monthly_cents: 1500000, per_agent_caps: {...}}}`
- **Output**: Total spend, burn rate, infra alerts, P&L, flags
- **Rules**: Flag overages, check infra health, append ledger to Sheets,
  flag at 80% (approaching_cap) and 100% (over_cap)

## Launch Sequence

| Step | Action | Details |
|------|--------|---------|
| 1 | Define Micro-SaaS | Hyper-specific B2B pain point (tax compliance, SEO tuning, etc.) |
| 2 | Build Agent Swarm | Deploy these prompts on Lyzr architect.new with API keys & guardrails |
| 3 | Connect Infrastructure | GitHub, Stripe, SendGrid, HubSpot via Lyzr MCP tools |
| 4 | Set Financial Guardrails | Per-agent daily caps, Sentinel monitors burn rate |
| 5 | Launch HITL | Human-in-the-loop 30-60 days, then remove yourself gradually |

## Example Workflow

1. User provides a business goal: "Launch a creator tax compliance SaaS"
2. Orchestrator creates parallel workstreams: Dev builds the app,
   Scout researches creators needing tax help, Pulse sets up support
3. Scout delivers leads → Archer runs outbound campaigns
4. Pulse resolves tickets, escalates bugs to Dev
5. Sentinel aggregates costs, checks infra, reports P&L
6. Orchestrator returns merged dashboard with all workstream statuses
