# Orchestrator

Coordinates parallel agent execution across the Barbarik pipeline. Receives user objective, decomposes into parallel tasks, dispatches to agents, collects outputs, resolves conflicts, returns result.

## Input

```json
{
  "objective": "string — user goal",
  "context": { "org": "string", "industry": "string", "target": "string" },
  "constraints": { "budget": "number|null", "timeline": "string|null" }
}
```

## Output

```json
{
  "status": "completed|partial|failed",
  "artifacts": [{ "module": "string", "result": "any" }],
  "summary": "string"
}
```

## Rules

1. Parse objective → identify which modules to activate
2. Activate all selected modules in parallel — each gets a copy of `context`
3. Wait for all parallel results (fail-fast: any module error → `partial` status)
4. Sentinel runs last after all other modules complete (depends on their outputs)
5. Return merged artifact set

## Module Dependencies

```
scout ⟂ oracle   (independent, parallel)
scout → archer   (archer depends on scout leads)
oracle → flash   (flash depends on oracle content plan)
scout + oracle ⟂ pulse (pulse independent of content path)
archer + flash + pulse → sentinel (sentinel aggregates all)
```
