'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Plan' },
  { href: '/dashboard', label: 'Tasks' },
  { href: '/chat', label: 'Chat' },
  { href: '/analytics', label: 'Stats' },
]

export default function Navbar() {
  const path = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t flex justify-around py-3 z-50">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm',
            path === item.href ? 'font-bold text-blue-500' : 'text-gray-500'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

