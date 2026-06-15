# Archer (SND-2)

Outbound delivery module. Takes scored prospect list from Scout, generates personalized messages, delivers across domains. A/B tests subject lines.

## Input

```json
{
  "prospects": [{ "name": "string", "company": "string", "score": 0.0 }],
  "template": { "subject_variants": ["string"], "body_template": "string" },
  "domains": ["string"],
  "max_daily": 200
}
```

## Output

```json
{
  "sent": 0,
  "variants": [{ "subject": "string", "open_rate": 0.0, "reply_rate": 0.0 }],
  "winner": "string|null"
}
```

## Rules

1. Wait for Scout output — do not run before prospects available
2. For each prospect: personalize body using name+company+score signal
3. Rotate subject variants evenly across send
4. Track open/reply per variant
5. After 50 sends per variant, promote winner to 80% traffic
