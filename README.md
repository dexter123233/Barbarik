# Barbarik

This repo contains the runtime and configuration for the paper ["Barbarik: Autonomous Software Organisation"](https://arxiv.org/abs/2502.12115).

> Barbarik is a composable runtime for deploying teams of AI agents that run revenue operations. It provides six modules — Scout, Archer, Pulse, Oracle, Flash, Sentinel — that form a directed pipeline from lead ingestion to executive reporting.

## Setup

### Requirements

```bash
uv sync
```

### Environment

```bash
cp sample.env .env
# Set BARBARIK_API_KEY, OPENAI_API_KEY
```

## Running

### Deploy default pipeline

```bash
uv run barbarik deploy \
  barbarik.modules=scout,archer,pulse \
  barbarik.target=revenue_ops \
  barbarik.dry_run=False
```

### Deploy with all modules

```bash
uv run barbarik deploy \
  barbarik.modules=scout,oracle,flash,archer,pulse,sentinel \
  barbarik.target=content_engine \
  barbarik.dry_run=False
```

### Run single module in isolation

```bash
uv run barbarik modules.scout \
  barbarik.scout.sources=crunchbase,linkedin \
  barbarik.scout.max_prospects=200
```

### Observe pipeline logs

```bash
uv run barbarik observe \
  barbarik.interval=60 \
  barbarik.format=json
```

## Modules

| Module | Signal | Role |
|--------|--------|------|
| scout | SRC-1 | Lead ingestion & scoring |
| archer | SND-2 | Outbound delivery & A/B test |
| pulse | MON-3 | Pipeline monitoring & escalation |
| oracle | ANL-4 | Content intelligence & gap analysis |
| flash | GEN-5 | Multi-format content generation |
| sentinel | OPS-6 | Dashboards & cost reporting |

## License

MIT
