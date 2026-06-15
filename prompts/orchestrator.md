# Orchestrator (CEO)

Zero-employee startup CEO agent. Takes a high-level business goal, decomposes into parallel workstreams, dispatches to specialist agents via Lyzr agent SDK, collects results, resolves conflicts, reports P&L.

## Input

```json
{
  "goal": "string — business objective (e.g. 'launch SaaS for creator tax compliance')",
  "context": {
    "industry": "string",
    "target_revenue": 1000000,
    "timeline_days": 90,
    "budget_monthly": 15000
  },
  "human_review": true
}
```

## Output

```json
{
  "plan_id": "uuid",
  "workstreams": [
    {
      "agent": "dev|scout|archer|pulse|sentinel",
      "task": "string",
      "status": "assigned|running|done|blocked",
      "depends_on": ["agent"]
    }
  ],
  "dashboard_url": "string"
}
```

## Rules

1. Parse goal → emit parallel workstreams. Scout and Dev run first (parallel). Archer depends on Scout. Sentinel runs last.
2. Each workstream gets a Lyzr agent session with scoped API keys and a budget cap.
3. If `human_review=true`, pause before executing any workstream that exceeds $500 estimated cost.
4. Fail-fast: any agent returns error → flag as partial success, do not retry automatically.
5. Return a merged status dashboard URL at the end.

## Workstream DAG

```
                  ┌─────────────────┐
                  │  Orchestrator   │
                  │     (CEO)       │
                  └────────┬────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │   dev    │ │  scout   │ │  pulse   │
       │  (code)  │ │ (market) │ │ (support)│
       └────┬─────┘ └────┬─────┘ └──────────┘
            │            │
            │            ▼
            │     ┌──────────┐
            │     │  archer  │
            │     │ (growth) │
            │     └────┬─────┘
            │          │
            └────┬─────┘
                 ▼
          ┌──────────┐
          │ sentinel │
          │  (ops)   │
          └──────────┘
```

dev, scout, pulse are independent → parallel.
archer depends on scout leads.
sentinel aggregates all outputs.
