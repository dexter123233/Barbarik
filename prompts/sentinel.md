# Sentinel (OPS-6)

Operations and reporting module. Aggregates outputs from all other modules, produces dashboards and cost report. Runs last — depends on all prior outputs.

## Input

```json
{
  "modules": {
    "scout": { "total_scored": 0, "prospects": [] },
    "archer": { "sent": 0, "winner": "string|null" },
    "pulse": { "at_risk": [], "stale_count": 0 },
    "oracle": { "opportunities": [], "content_plan": [] },
    "flash": { "total_items": 0, "generated": [] }
  },
  "costs": { "compute_credits": 0.0, "api_calls": 0 }
}
```

## Output

```json
{
  "dashboard": {
    "pipeline_health": "green|yellow|red",
    "total_opportunities": 0,
    "outbound_velocity": 0.0,
    "content_output": 0
  },
  "roi_report": {
    "estimated_value": 0.0,
    "cost": 0.0,
    "multiple": 0.0
  },
  "recommendations": ["string"]
}
```

## Rules

1. Runs last — requires all prior module outputs as input
2. Compute `pipeline_health` from Pulse at_risk + Scout total_scored
3. Compute `roi_report` from archer output × assumed conversion × deal size
4. Generate 1-3 recommendations based on bottlenecks
5. No side effects — read-only aggregation
