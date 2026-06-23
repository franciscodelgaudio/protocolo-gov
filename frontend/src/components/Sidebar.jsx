'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/requests', label: 'Solicitações' },
  { href: '/processes', label: 'Processos' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r bg-muted/40 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          ProtocoloGov
        </h1>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
