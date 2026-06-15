import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'barbarik — autonomous software organisation',
  description: 'A composable runtime for deploying teams of AI agents that run revenue operations. Six modules from lead ingestion to executive reporting.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-900">{children}</body>
    </html>
  )
}
