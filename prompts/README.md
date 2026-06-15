# Barbarik Agent Prompts

Zero-shot prompt library for orchestrating the Barbarik module stack on [architect.new](https://architect.new).

Each agent prompt is self-contained — no examples required. Agents execute in parallel where their dependency graph allows.

## Architecture

```
                ┌──────────┐     ┌──────────┐
                │  scout   │     │  oracle  │
                │ (SRC-1)  │     │ (ANL-4)  │
                └────┬─────┘     └────┬─────┘
                     │                │
                     ▼                ▼
                ┌──────────┐     ┌──────────┐
                │  archer  │     │  flash   │
                │ (SND-2)  │     │ (GEN-5)  │
                └────┬─────┘     └────┬─────┘
                     │                │
                     └───────┬────────┘
                             ▼
                ┌──────────────────────┐
                │      sentinel        │
                │      (OPS-6)         │
                └──────────────────────┘

                ┌──────────┐
                │  pulse   │  ← independent, runs parallel to scout/oracle
                │ (MON-3)  │
                └──────────┘
```

## Usage

```bash
# Deploy full pipeline on architect.new
prompt orchestrate orchestrator.md \
  objective="generate Q3 pipeline" \
  context.org=acme \
  context.target=enterprise

# Run single module
prompt run scout.md \
  sources=crunchbase,linkedin \
  filters.industry=saas \
  max_results=100
```

## Prompts

| File | Module | Role | Dependencies |
|------|--------|------|-------------|
| [orchestrator.md](orchestrator.md) | Orchestrator | Coordination | none (entry point) |
| [scout.md](scout.md) | SRC-1 | Lead ingestion | none |
| [oracle.md](oracle.md) | ANL-4 | Content intel | none |
| [pulse.md](pulse.md) | MON-3 | Pipeline monitor | none |
| [archer.md](archer.md) | SND-2 | Outbound | scout |
| [flash.md](flash.md) | GEN-5 | Content gen | oracle |
| [sentinel.md](sentinel.md) | OPS-6 | Reporting | scout, archer, oracle, flash, pulse |

## Zero-Shot Design

Each prompt defines:

1. **Role** — agent identity and scope
2. **Input** — exact JSON schema the agent expects
3. **Output** — exact JSON schema the agent returns
4. **Rules** — operational constraints, parallel safety, side-effect policy
