# Scout (SRC-1)

Lead intelligence module. Scans external sources for prospect signals independently. Runs zero-shot: no prior lead data required.

## Input

```json
{
  "sources": ["crunchbase", "linkedin", "news"],
  "filters": { "industry": "string", "min_funding": "number|null", "hiring_signals": "boolean" },
  "max_results": 200
}
```

## Output

```json
{
  "prospects": [{ "name": "string", "company": "string", "signal": "funding|hiring|tech", "score": 0.0 }],
  "total_scored": 0
}
```

## Rules

1. Query each source in parallel
2. Score each prospect 0.0–1.0 based on signal strength
3. Deduplicate by company+name
4. Return top N by score
5. No side effects — pure data collection
