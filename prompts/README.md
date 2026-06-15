# Barbarik Agent Prompts

Zero-shot prompt library for building a **zero-employee (agent-based) startup** — a single-founder company where AI agents handle production, growth, support, and finance under an Orchestrator CEO agent running on Lyzr's agent infrastructure.

## Architecture

```
                         ┌───────────────────────┐
                         │    Orchestrator (CEO)  │
                         │  decomposes goals into │
                         │  parallel workstreams  │
                         └──────┬────┬────┬───────┘
                                │    │    │
              ┌─────────────────┘    │    └─────────────────┐
              ▼                      ▼                      ▼
     ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
     │  Dev (Prod)    │   │ Scout (Market) │   │Pulse (Support) │
     │  code, test,   │   │  lead gen,     │   │  ticket triage,│
     │  deploy, PRs   │   │  competitor    │   │  auto-resolve, │
     │  [GitHub MCP]  │   │  intel         │   │  escalate bugs │
     └───────┬────────┘   └───────┬────────┘   └────────────────┘
             │                    │
             │                    ▼
             │           ┌────────────────┐
             │           │Archer (Growth) │
             │           │ multi-channel  │
             │           │ outbound, A/B, │
             │           │ promo codes    │
             │           └───────┬────────┘
             │                    │
             └──────────┬────────┘
                        ▼
                ┌────────────────┐
                │Sentinel (Ops)  │
                │ P&L, budgets,  │
                │ infra monitor  │
                │ [Stripe, Vercel]│
                └────────────────┘
```

Dev, Scout, Pulse are independent → **parallel**. Archer depends on Scout leads. Sentinel aggregates all outputs.

## The 5-Step Launch Sequence

1. **Define Micro-SaaS** — hyper-specific B2B pain point (tax compliance, SEO tuning, etc.)
2. **Build Agent Swarm** — deploy these prompts on Lyzr architect.new with API keys and guardrails
3. **Connect Infrastructure** — link agents to GitHub, Stripe, SendGrid, HubSpot via Lyzr MCP tools
4. **Set Financial Guardrails** — per-agent daily caps, virtual card spending limits, Sentinel monitors burn
5. **Launch HITL** — human-in-the-loop for first 30-60 days, then remove yourself gradually

## Prompts

| File | Agent | Role | Deps | Budget Cap |
|------|-------|------|------|------------|
| [orchestrator.md](orchestrator.md) | CEO | Goal decomposition, dispatch, conflict resolution | — | $500/workstream |
| [dev.md](dev.md) | Production | Code, test, deploy on GitHub | — | $10k/mo |
| [scout.md](scout.md) | Market Intel | Lead gen, competitor tracking | — | $20k/mo |
| [pulse.md](pulse.md) | Support | Ticket triage, auto-resolve, escalation | — | $5k/mo |
| [archer.md](archer.md) | Growth | Multi-channel outbound, A/B, Stripe promos | scout | $50k/mo |
| [sentinel.md](sentinel.md) | Ops | P&L, budget enforcement, infra health | all | read-only |

## Infra Stack

| Layer | Tool |
|-------|------|
| Agent framework | Lyzr / architect.new |
| Code execution | GitHub MCP + Lyzr sandbox |
| Vector memory | Pinecone / Chroma |
| Outbound email | SendGrid (via Lyzr Email API) |
| Payments | Stripe |
| Social | LinkedIn, X APIs |
| Support | Intercom / Zendesk |
| Monitoring | Vercel, CloudWatch |
| Ledger | Google Sheets |
