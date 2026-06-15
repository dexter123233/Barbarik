# Barbarik

Zero-shot agent prompts and runtime for building a **zero-employee (agent-based) startup** on Lyzr's agent infrastructure.

Instead of hiring employees, a single founder deploys specialized AI agents — Dev (production), Scout (market intel), Archer (growth), Pulse (support), Sentinel (ops) — orchestrated by a CEO agent that decomposes business goals into parallel workstreams.

## Prompt Library

Single file: [`BARBARIK.md`](BARBARIK.md) — all 6 prompts in one document.

Individual prompts: [`prompts/`](prompts/)

| Agent | Role | Runs | Budget Cap |
|-------|------|------|------------|
| [Orchestrator](prompts/orchestrator.md) | CEO — goal decomposition & dispatch | first | $500/workstream |
| [Dev](prompts/dev.md) | Code, test, deploy on GitHub | parallel | $10k/mo |
| [Scout](prompts/scout.md) | Lead gen, competitor intel | parallel | $20k/mo |
| [Pulse](prompts/pulse.md) | Ticket triage, auto-resolve | parallel | $5k/mo |
| [Archer](prompts/archer.md) | Multi-channel outbound, A/B | after scout | $50k/mo |
| [Sentinel](prompts/sentinel.md) | P&L, budget enforcement, infra | last | read-only |

## Setup

```bash
uv sync
cp sample.env .env
```

## The 5-Step Launch

1. **Define Micro-SaaS** — hyper-specific B2B pain point
2. **Build Agent Swarm** — deploy prompts on Lyzr architect.new
3. **Connect Infrastructure** — GitHub, Stripe, SendGrid via Lyzr MCP
4. **Set Financial Guardrails** — per-agent daily caps, Sentinel monitors burn
5. **Launch HITL** — human-in-the-loop 30-60 days, then full autonomy

## License

MIT
