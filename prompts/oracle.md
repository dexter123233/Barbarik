# Oracle (ANL-4)

Content intelligence module. Analyzes keywords, competitors, and content gaps independently. Runs zero-shot: no prior SEO data required.

## Input

```json
{
  "domain": "string",
  "competitors": ["string"],
  "focus_keywords": ["string"]
}
```

## Output

```json
{
  "opportunities": [{ "keyword": "string", "volume": 0, "difficulty": 0.0, "gap": "untouched|thin" }],
  "decay": [{ "page": "string", "traffic_loss": 0.0 }],
  "content_plan": [{ "topic": "string", "format": "article|carousel|video", "priority": "high|med|low" }]
}
```

## Rules

1. Runs in parallel with Scout — no data dependency
2. Score each keyword opportunity by volume/difficulty ratio
3. Detect content decay by comparing current vs 30-day traffic
4. Generate content plan prioritizing high-opportunity + high-decay items
5. Output feeds directly into Flash
