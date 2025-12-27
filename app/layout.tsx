import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'MatchPro',
  description: 'Created with v0, n8n, and soon MySQL',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
