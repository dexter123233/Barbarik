export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-1">barbarik</h1>
      <p className="text-zinc-500 text-sm mb-8">zero-employee startup toolkit — deploy AI agents, not employees</p>

      <p className="mb-6">
        Zero-shot agent prompts for building a{' '}
        <strong>zero-employee (agent-based) startup</strong> on{' '}
        <a href="https://architect.new" className="text-blue-600 underline">Lyzr architect.new</a>.
      </p>

      <blockquote className="border-l-4 border-zinc-300 pl-4 text-zinc-600 text-sm mb-6">
        Instead of hiring employees, a single founder deploys specialized AI agents — Dev, Scout, Archer,
        Pulse, Sentinel — orchestrated by a CEO agent that decomposes business goals into parallel workstreams.
      </blockquote>

      <h2 className="text-lg font-semibold mb-3">Prompt Library</h2>
      <p className="text-sm text-zinc-500 mb-4">Deploy these on <a href="https://architect.new" className="text-blue-600 underline">Lyzr architect.new</a>. Each prompt is self-contained with input/output schemas, tool bindings, and budget caps.</p>

      <div className="space-y-3 mb-8">
        {[
          { name: 'orchestrator.md', role: 'CEO — goal decomposition & dispatch', deps: 'entry point', budget: '$500/workstream', input: '{"goal": "string", "context": {"industry": "...", "target_revenue": 1000000}}', output: '{"plan_id": "uuid", "workstreams": [{"agent": "dev|scout|...", "task": "..."}]}', key_rules: ['Parse goal → emit parallel workstreams', 'Each workstream gets scoped API keys + budget cap', 'Human review pause if cost > $500', 'Fail-fast on agent errors'] },
          { name: 'dev.md', role: 'Production — code, test, deploy', deps: 'none (parallel)', budget: '$10k/mo', input: '{"spec": {"repo": "...", "feature": "..."}, "guardrails": {...}}', output: '{"pr_url": "string", "test_status": "passed|failed", "deploy_status": "..."}', key_rules: ['Feature branch from main before any write', 'Write tests alongside every change', 'Never use eval/exec/rm -rf (enforced by Lyzr security)', 'Max 10 PRs/day — queue if exceeded'] },
          { name: 'scout.md', role: 'Market intel — lead gen, competitors', deps: 'none (parallel)', budget: '$20k/mo', input: '{"target_market": "string", "sources": ["crunchbase", "linkedin"], "max_prospects": 200}', output: '{"prospects": [{name, company, confidence}], "trends": [{keyword, velocity}]}', key_rules: ['Query all sources in parallel', 'Deduplicate by company+email via vector memory', 'Store every prospect in Pinecone/Chroma', 'Max 500 API calls/day per source'] },
          { name: 'archer.md', role: 'Growth — outbound, A/B, Stripe promos', deps: 'after scout', budget: '$50k/mo', input: '{"campaign_name": "...", "prospects": [...], "channels": ["email","linkedin","x"], "budget_cents": 50000}', output: '{"delivered": 0, "meetings_booked": 0, "variant_winner": "...", "roi_estimate": 0.0}', key_rules: ['Requires Scout prospects — do not run without', 'Rotate A/B variants, throttle losers after 50', 'Max 200 email, 50 LinkedIn, 100 X DMs/day', 'Pause all if spend > 90% of budget_cents'] },
          { name: 'pulse.md', role: 'Support — ticket triage, escalation', deps: 'none (parallel)', budget: '$5k/mo', input: '{"tickets": [{id, subject, body, severity}], "max_auto_resolve": 50}', output: '{"resolved": 0, "escalated": [{ticket_id, github_issue_url}], "sla_breaches": 0}', key_rules: ['Vector-match past solutions — auto-reply if similarity > 0.85', 'Critical severity → immediately file GitHub issue', 'High severity with no match → GitHub issue, no ping', 'Max 50 auto-resolves per run'] },
          { name: 'sentinel.md', role: 'Ops — P&L, budget enforcement, infra', deps: 'after all (aggregator)', budget: 'read-only', input: '{"workstreams": [{agent, status, cost_cents}], "budgets": {monthly_cents: 1500000, per_agent_caps: {...}}}', output: '{"total_spend_cents": 0, "burn_rate_daily": 0, "p_and_l": {...}, "flags": ["string"]}', key_rules: ['Runs last — aggregates all prior agent outputs', 'Flag any agent exceeding per-agent budget cap', 'Check infra health — any down service = alert', 'Append row to Google Sheets ledger', 'If spend > 80% → flag approaching_cap'] },
        ].map((p) => (
          <details key={p.name} className="bg-zinc-50 border border-zinc-200 rounded-lg overflow-hidden">
            <summary className="px-4 py-3 cursor-pointer text-sm font-mono hover:bg-zinc-100 transition-colors flex items-center justify-between">
              <span><span className="text-blue-600">{p.name}</span> <span className="text-zinc-500 font-sans text-xs">{p.role}</span></span>
              <span className="text-[10px] text-zinc-400 font-sans">{p.deps} · {p.budget}</span>
            </summary>
            <div className="px-4 pb-4 text-xs space-y-2 border-t border-zinc-200 pt-3">
              <div><span className="font-medium text-zinc-700">Input:</span> <code className="text-zinc-600">{p.input}</code></div>
              <div><span className="font-medium text-zinc-700">Output:</span> <code className="text-zinc-600">{p.output}</code></div>
              <div><span className="font-medium text-zinc-700">Rules:</span>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-zinc-500">
                  {p.key_rules.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <a href={`https://github.com/dexter123233/Barbarik/blob/main/prompts/${p.name}`} className="text-blue-600 underline inline-block mt-1">View full prompt →</a>
            </div>
          </details>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-3">Architecture</h2>
      <div className="bg-zinc-100 rounded p-4 mb-6 text-xs font-mono leading-relaxed whitespace-pre overflow-x-auto">
{`                  ┌───────────────────────┐
                  │   Orchestrator (CEO)   │
                  └──────┬────┬────┬───────┘
                         │    │    │
              ┌──────────┘    │    └──────────┐
              ▼               ▼               ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │  Dev (Prod)  │ │Scout (Market)│ │Pulse(Support)│
     │  git/deploy  │ │  lead gen    │ │  triage      │
     └──────┬───────┘ └──────┬───────┘ └──────────────┘
            │                │
            │                ▼
            │        ┌──────────────┐
            │        │Archer(Growth)│
            │        │ outbound A/B │
            │        └──────┬───────┘
            └───────┬───────┘
                    ▼
            ┌──────────────┐
            │Sentinel (Ops)│
            │ P&L, budgets │
            └──────────────┘`}
      </div>

      <p className="text-sm text-zinc-500 mb-6">
        Dev, Scout, Pulse are independent → <strong>parallel</strong>. Archer depends on Scout.
        Sentinel aggregates all outputs.
      </p>

      <h2 className="text-lg font-semibold mb-3">The 5-Step Launch</h2>
      <ol className="text-sm text-zinc-700 space-y-1 mb-8 list-decimal pl-5">
        <li><strong>Define Micro-SaaS</strong> — hyper-specific B2B pain point (tax compliance, SEO tuning)</li>
        <li><strong>Build Agent Swarm</strong> — deploy these prompts on Lyzr architect.new with API keys &amp; guardrails</li>
        <li><strong>Connect Infrastructure</strong> — GitHub, Stripe, SendGrid, HubSpot via Lyzr MCP tools</li>
        <li><strong>Set Financial Guardrails</strong> — per-agent daily caps, Sentinel monitors burn rate</li>
        <li><strong>Launch HITL</strong> — human-in-the-loop 30-60 days, then remove yourself gradually</li>
      </ol>

      <h2 className="text-lg font-semibold mb-3">Infra Stack</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-300 text-left">
              <th className="py-2 pr-4 font-medium">Layer</th>
              <th className="py-2 font-medium">Tool</th>
            </tr>
          </thead>
          <tbody>
            {[['Agent framework','Lyzr / architect.new'],['Code exec','GitHub MCP + Lyzr sandbox'],['Vector memory','Pinecone / Chroma'],['Outbound','SendGrid (via Lyzr Email API)'],['Payments','Stripe'],['Social','LinkedIn, X APIs'],['Support','Intercom / Zendesk'],['Monitoring','Vercel, CloudWatch'],['Ledger','Google Sheets']].map(([l,t]) => (
              <tr key={l} className="border-b border-zinc-200">
                <td className="py-2 pr-4 text-zinc-600">{l}</td>
                <td className="py-2 font-mono text-sm">{t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-zinc-200 pt-6 text-sm text-zinc-500">
        <a href="https://github.com/dexter123233/Barbarik" className="text-blue-600 underline mr-4">GitHub</a>
        <a href="https://architect.new" className="text-blue-600 underline mr-4">Lyzr architect.new</a>
        <a href="https://calendly.com/ericosiu/single-brain" className="text-blue-600 underline">Contact</a>
      </div>
    </div>
  )
}
