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

      <div className="bg-zinc-100 rounded p-3 mb-6 text-sm font-mono overflow-x-auto">
        <span className="text-zinc-500">prompts/</span><br />
        ├── <a href="https://github.com/dexter123233/Barbarik/blob/main/prompts/orchestrator.md" className="text-blue-600">orchestrator.md</a>     CEO — goal decomposition &amp; dispatch<br />
        ├── <a href="https://github.com/dexter123233/Barbarik/blob/main/prompts/dev.md" className="text-blue-600">dev.md</a>               Production — code, test, deploy<br />
        ├── <a href="https://github.com/dexter123233/Barbarik/blob/main/prompts/scout.md" className="text-blue-600">scout.md</a>             Market intel — lead gen, competitors<br />
        ├── <a href="https://github.com/dexter123233/Barbarik/blob/main/prompts/archer.md" className="text-blue-600">archer.md</a>            Growth — outbound, A/B, Stripe promos<br />
        ├── <a href="https://github.com/dexter123233/Barbarik/blob/main/prompts/pulse.md" className="text-blue-600">pulse.md</a>             Support — ticket triage, escalation<br />
        └── <a href="https://github.com/dexter123233/Barbarik/blob/main/prompts/sentinel.md" className="text-blue-600">sentinel.md</a>          Ops — P&amp;L, budget enforcement, infra
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
