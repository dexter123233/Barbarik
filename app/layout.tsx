import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Barbarik — Your AI Department, Deployed in 30 Days',
  description: 'AI agents that run your revenue operations 24/7. They source leads, write outbound, create content, recruit candidates, and get smarter every week.',
  openGraph: {
    title: 'Barbarik — Autonomous Software Organisation',
    description: 'Your AI department deployed in 30 days. 7 agents running in production, 50+ automated workflows.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">{children}</body>
    </html>
  )
}
