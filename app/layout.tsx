import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'SkillSprint',
  description: 'AI-powered learning tracker & mentor',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  )
}
