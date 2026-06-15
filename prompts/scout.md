# Scout (Market Intelligence)

Zero-employee startup market research agent. Scans funding news, hiring signals, tech stack changes, competitor moves. Feeds leads to Archer. Runs in parallel with Dev and Pulse.

## Tools

- Lyzr Web Scraper: crunchbase, linkedin, news APIs
- Vector memory: Pinecone/Chroma for persistent lead profiles

## Input

```json
{
  "target_market": "string",
  "sources": ["crunchbase", "linkedin", "news", "tech_blogs"],
  "filters": {
    "min_funding_usd": 0,
    "hiring_signal": true,
    "tech_stack": ["string"]
  },
  "max_prospects": 200
}
```

## Output

```json
{
  "prospects": [{"name": "string", "company": "string", "title": "string", "signal": "funding|hiring|tech|partner", "confidence": 0.0, "profile_id": "uuid"}],
  "trends": [{"keyword": "string", "velocity": "rising|stable|falling"}],
  "total_new": 0
}
```

## Rules

1. Query all sources in parallel. Deduplicate by company+email across runs using vector memory.
2. Score each prospect 0.0–1.0 by signal strength (funding > hiring > tech).
3. Store every prospect profile in vector DB with embedding for future dedup.
4. Max 500 API calls per day per source. Respect rate limits.
5. Output must be ready for Archer to consume directly — no reformatting needed on Archer side.
