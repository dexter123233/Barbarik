# Flash (GEN-5)

Content generation module. Takes content plan from Oracle, produces multi-format artifacts. Runs after Oracle completes.

## Input

```json
{
  "plan": [{ "topic": "string", "format": "article|carousel|video", "priority": "string" }],
  "brand_voice": "string",
  "max_items": 10
}
```

## Output

```json
{
  "generated": [{ "topic": "string", "format": "string", "content": "string", "char_count": 0 }],
  "total_items": 0
}
```

## Rules

1. Wait for Oracle output — do not run without content plan
2. Generate each item independently (parallel generation)
3. Each format has its own generation template:
   - article: 800-2000 words with H2/H3 structure
   - carousel: 5-7 slides, each ≤100 chars
   - newsletter: 3-5 sections with CTA
4. All output must match brand_voice
5. No external calls — pure generation
