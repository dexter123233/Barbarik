'use client'

import { useState } from 'react'

const AGENTS = [
  { name: 'Scout', role: 'Lead Intelligence', emoji: '🔍', desc: 'Scans funding rounds, hiring signals, tech stack changes. Scores 200+ prospects per week.' },
  { name: 'Archer', role: 'Outbound Sales', emoji: '🎯', desc: '200 personalized emails per day across 14 sender domains. A/B tests every subject line and angle.' },
  { name: 'Pulse', role: 'Pipeline Manager', emoji: '📡', desc: 'Monitors every active deal. No prospect goes 48 hours without a touchpoint.' },
  { name: 'Oracle', role: 'SEO & Content Intelligence', emoji: '🔮', desc: 'Keyword opportunities, content decay detection, competitive gap analysis.' },
  { name: 'Flash', role: 'Content Production', emoji: '⚡', desc: 'Daily articles, data visualizations, carousels, newsletter drafts.' },
  { name: 'Sentinel', role: 'Operations & Reporting', emoji: '🛡️', desc: 'Daily executive dashboards, weekly ROI reports, cost monitoring.' },
]

const FAQS = [
  { q: 'How is this different from hiring an AI consultant?', a: 'Consultants give you a strategy deck. We deploy working agents that produce measurable output from week 1. And the agents get smarter every week — consultants don\'t.' },
  { q: 'Is our data secure?', a: 'We deploy on NVIDIA NemoClaw with kernel-level isolation, HIPAA-eligible architecture, and full audit trails. Your data never leaves your environment.' },
  { q: 'What if it doesn\'t work?', a: '30-day pilot. 2-3 agents, measurable outcomes, no long-term commitment. You\'ll know within a month.' },
  { q: 'How much does it cost?', a: 'Most engagements start at $10-15K/month for a 3-agent team. Book a call and we\'ll scope it.' },
]

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">Barbarik</span>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">AI</span>
        </div>
        <a
          href="https://calendly.com/ericosiu/single-brain"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Book a call
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </a>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-zinc-950 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 text-center pt-24 pb-32">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          7 agents running in production
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Your AI Department.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Deployed in 30 Days.</span>
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          We build and manage teams of AI agents that run your revenue operations 24/7.
          They source leads, write outbound, create content, recruit candidates,
          and get smarter every week.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://calendly.com/ericosiu/single-brain"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all text-lg"
          >
            Deploy Your AI Team →
          </a>
          <a
            href="#agents"
            className="px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl transition-all text-lg"
          >
            See the agents
          </a>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div><div className="text-2xl font-bold text-white">7</div><div className="text-sm text-zinc-500">Agents</div></div>
          <div><div className="text-2xl font-bold text-white">50+</div><div className="text-sm text-zinc-500">Workflows</div></div>
          <div><div className="text-2xl font-bold text-white">200+</div><div className="text-sm text-zinc-500">Daily Touches</div></div>
        </div>
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section className="py-24 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              Your team spends <span className="text-indigo-400">60%</span> of their time on work AI agents can do better.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-6">
              Hiring an AI team costs $500K+/year. Building internally takes 6-12 months.
              Most &ldquo;AI tools&rdquo; are chatbots with a nice UI.
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed">
              You need an AI department that works today. We deploy one in 30 days.
            </p>
          </div>
          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8">
            <div className="space-y-4">
              {[
                { label: 'AI Consultants', status: 'Strategy decks only', color: 'text-red-400' },
                { label: 'DIY AI Build', status: '6-12 months', color: 'text-amber-400' },
                { label: 'Barbarik', status: 'Deployed in 30 days', color: 'text-green-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                  <span className="text-zinc-300">{item.label}</span>
                  <span className={`text-sm font-medium ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Agents() {
  return (
    <section id="agents" className="py-24 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Meet Your AI Team</h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Each agent has a name, a role, a budget, and a security clearance.
            They report to you through Slack, email, or a custom dashboard.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AGENTS.map((agent) => (
            <div
              key={agent.name}
              className="group relative bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-6 transition-all"
            >
              <div className="text-3xl mb-3">{agent.emoji}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">{agent.role}</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">{agent.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="py-24 border-t border-zinc-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 via-transparent to-purple-900/10 pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 text-center relative">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12">By the Numbers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { value: '200', unit: '/day', label: 'Personalized emails — A/B tested' },
            { value: '80', unit: '/week', label: 'Candidates scored, with outreach drafted' },
            { value: '5x', unit: '', label: 'ROI in 90 days — or we rearchitect for free' },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                {stat.value}<span className="text-2xl text-zinc-500">{stat.unit}</span>
              </div>
              <p className="text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { week: 'Week 1', title: 'Strategy & Design', desc: 'We learn your operations, map pain points, design your agent team.' },
    { week: 'Weeks 2-4', title: 'Deploy & Pilot', desc: '2-3 agents go live. Full audit trails. Human approval gates. Results within first week.' },
    { week: 'Month 2+', title: 'Scale & Compound', desc: 'Add agents. Expand workflows. Experiment engine promotes winners automatically.' },
  ]
  return (
    <section className="py-24 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.week} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                <span className="text-sm font-medium text-indigo-400">{step.week}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Security() {
  return (
    <section className="py-24 border-t border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Enterprise Security</h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
          Deployed on NVIDIA&apos;s enterprise AI runtime. Kernel-level agent isolation.
          HIPAA-eligible architecture. Every action logged to tamper-evident audit trail.
          Your data stays in your environment.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {['NVIDIA NemoClaw', 'Kernel Isolation', 'HIPAA Eligible', 'Audit Trail'].map((item) => (
            <div key={item} className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-zinc-300">{item}</div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UseCases() {
  const cases = [
    { title: 'Revenue Operations', desc: '200+ qualified leads per week, 40+ booked meetings per month, zero stale pipeline.' },
    { title: 'Recruiting at Scale', desc: '5 recruiting agents sourcing 80 candidates per day across 5 roles. Scored, deduplicated, with outreach drafted.' },
    { title: 'Content Engine', desc: 'Daily X articles, weekly newsletters, Instagram carousels, LinkedIn posts. 362K peak daily impressions.' },
  ]
  return (
    <section className="py-24 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-4">Use Cases</h2>
        <p className="text-zinc-400 text-center max-w-xl mx-auto mb-12">
          Currently powering operations for a $40M+ marketing company with client pilots in insurance, healthcare, and PE-backed portfolio companies.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <div key={c.title} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">{c.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="py-24 border-t border-zinc-800">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12">FAQ</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-zinc-200 font-medium hover:bg-zinc-800/50 transition-colors"
              >
                {faq.q}
                <svg className={`w-5 h-5 text-zinc-500 transition-transform ${open === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-zinc-400 text-sm leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-24 border-t border-zinc-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-3xl mx-auto px-4 text-center relative">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Ready to Deploy Your AI Team?</h2>
        <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
          30-day pilot. 2-3 agents, measurable outcomes, no long-term commitment.
          You&apos;ll know within a month.
        </p>
        <a
          href="https://calendly.com/ericosiu/single-brain"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all text-lg"
        >
          Book a Call
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-8 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Barbarik</span>
          <span className="text-xs text-zinc-600">Autonomous Software Organisation</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <a href="mailto:eric@singlegrain.com" className="hover:text-zinc-300 transition-colors">eric@singlegrain.com</a>
          <span className="text-zinc-700">·</span>
          <a href="https://calendly.com/ericosiu/single-brain" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">Book a call</a>
        </div>
      </div>
    </footer>
  )
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Agents />
        <Stats />
        <HowItWorks />
        <Security />
        <UseCases />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
