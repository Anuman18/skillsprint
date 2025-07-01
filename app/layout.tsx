import './globals.css'
import { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Navbar from '@/components/global/Navbar'

export const metadata = {
  title: 'SkillSprint',
  description: 'AI-powered learning companion',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="flex">
            <head>
  <title>SkillSprint</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Plan and track your learning goals with AI" />
  <link rel="icon" href="/favicon.ico" />
</head>
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow h-screen p-6 hidden md:block">
            <h1 className="text-2xl font-bold mb-6">🏃 SkillSprint</h1>
            <nav className="space-y-4">
              <NavItem href="/">🏠 Home</NavItem>
              <NavItem href="/dashboard">✅ Dashboard</NavItem>
              <NavItem href="/chat">💬 Chat</NavItem>
              <NavItem href="/analytics">📊 Analytics</NavItem>
              <NavItem href="/rewards">🎉 Rewards</NavItem>
              <NavItem href="/u/anumanmodi">🌐 Portfolio</NavItem>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}

function NavItem({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        'block px-3 py-2 rounded hover:bg-gray-100 transition text-sm font-medium'
      )}
    >
      {children}
    </Link>
  )
}
<Navbar />

