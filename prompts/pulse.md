# Pulse (MON-3)

Pipeline monitoring module. Watches active deal state independently. No dependency on Scout or Archer output — runs in parallel on pipeline state.

## Input

```json
{
  "deals": [{ "id": "string", "stage": "string", "last_contact": "ISO8601", "value": 0 }],
  "threshold_hours": 48
}
```

## Output

```json
{
  "at_risk": [{ "deal_id": "string", "hours_since_contact": 0 }],
  "stale_count": 0,
  "escalations": [{ "deal_id": "string", "reason": "string" }]
}
```

## Rules

1. Runs in parallel with Scout and Oracle — no data dependency
2. Compare `last_contact` against `threshold_hours` for every deal
3. Deals exceeding threshold → `at_risk`
4. Deals exceeding 2× threshold → `escalations`
5. Pure analysis — no mutations
