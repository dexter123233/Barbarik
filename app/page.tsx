export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-1">barbarik</h1>
      <p className="text-zinc-500 text-sm mb-8">autonomous software organisation</p>

      <p className="mb-6">
        This project contains the runtime and configuration for the paper{' '}
        <a href="https://arxiv.org/abs/2502.12115" className="text-blue-600 underline">Barbarik: Autonomous Software Organisation</a>.
      </p>

      <blockquote className="border-l-4 border-zinc-300 pl-4 text-zinc-600 text-sm mb-6">
        Barbarik is a composable runtime for deploying teams of AI agents that run
        revenue operations. It provides six modules — Scout, Archer, Pulse, Oracle,
        Flash, Sentinel — that form a directed pipeline from lead ingestion to
        executive reporting.
      </blockquote>

      <h2 className="text-lg font-semibold mb-3">Prompt Library</h2>
      <p className="text-sm text-zinc-600 mb-4">
        Zero-shot agent prompts for orchestrating the Barbarik module stack on architct.new.
        Each prompt is self-contained with input/output schemas and parallel execution rules.
      </p>

      <div className="bg-zinc-100 rounded p-3 mb-6 text-sm font-mono overflow-x-auto">
        <span className="text-zinc-500">prompts/</span><br />
        ├── <a href="https://github.com/dexter123233/Barbarik/blob/main/prompts/orchestrator.md" className="text-blue-600">orchestrator.md</a><br />
        ├── <a href="https://github.com/dexter123233/Barbarik/blob/main/prompts/scout.md" className="text-blue-600">scout.md</a>          SRC-1  Lead ingestion<br />
        ├── <a href="https://github.com/dexter123233/Barbarik/blob/main/prompts/archer.md" className="text-blue-600">archer.md</a>         SND-2  Outbound delivery<br />
        ├── <a href="https://github.com/dexter123233/Barbarik/blob/main/prompts/pulse.md" className="text-blue-600">pulse.md</a>          MON-3  Pipeline monitor<br />
        ├── <a href="https://github.com/dexter123233/Barbarik/blob/main/prompts/oracle.md" className="text-blue-600">oracle.md</a>         ANL-4  Content intel<br />
        ├── <a href="https://github.com/dexter123233/Barbarik/blob/main/prompts/flash.md" className="text-blue-600">flash.md</a>          GEN-5  Content gen<br />
        └── <a href="https://github.com/dexter123233/Barbarik/blob/main/prompts/sentinel.md" className="text-blue-600">sentinel.md</a>       OPS-6  Reporting
      </div>

      <h2 className="text-lg font-semibold mb-3">Setup</h2>
      <pre className="bg-zinc-100 text-sm p-3 rounded mb-2">uv sync</pre>
      <pre className="bg-zinc-100 text-sm p-3 rounded mb-6">cp sample.env .env</pre>

      <h2 className="text-lg font-semibold mb-3">Running</h2>
      <pre className="bg-zinc-100 text-sm p-3 rounded mb-4 overflow-x-auto">
uv run barbarik deploy \ {'\n'}
{'  '}barbarik.modules=scout,oracle,flash,archer,pulse,sentinel \ {'\n'}
{'  '}barbarik.target=content_engine \ {'\n'}
{'  '}barbarik.dry_run=False
      </pre>

      <h2 className="text-lg font-semibold mb-3">Modules</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-300 text-left">
              <th className="py-2 pr-4 font-medium">Module</th>
              <th className="py-2 pr-4 font-medium">Signal</th>
              <th className="py-2 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {[['scout','SRC-1','Lead ingestion & scoring'],['archer','SND-2','Outbound delivery & A/B test'],['pulse','MON-3','Pipeline monitoring & escalation'],['oracle','ANL-4','Content intelligence & gap analysis'],['flash','GEN-5','Multi-format content generation'],['sentinel','OPS-6','Dashboards & cost reporting']].map(([m,s,r]) => (
              <tr key={m} className="border-b border-zinc-200">
                <td className="py-2 pr-4 font-mono text-sm">{m}</td>
                <td className="py-2 pr-4 text-zinc-500 font-mono text-xs">{s}</td>
                <td className="py-2 text-zinc-600">{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-zinc-200 pt-6 text-sm text-zinc-500">
        <a href="https://github.com/dexter123233/Barbarik" className="text-blue-600 underline mr-4">GitHub</a>
        <a href="https://calendly.com/ericosiu/single-brain" className="text-blue-600 underline">Contact</a>
      </div>
    </div>
  )
}
