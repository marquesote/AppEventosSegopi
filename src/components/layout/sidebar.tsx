'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface NavItem {
  href: string
  label: string
  icon: React.FC<{ className?: string }>
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/events', label: 'Eventos', icon: CalendarIcon },
  { href: '/registrations', label: 'Inscripciones', icon: UsersIcon },
  { href: '/workflows', label: 'Workflows', icon: WorkflowIcon },
  { href: '/analytics', label: 'Analytics', icon: ChartBarIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Usuario'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 gradient-primary text-white flex flex-col z-40">
      {/* Branding */}
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center">
          <Image src="/logo-segopi.png" alt="Eventos SEGOPI" width={140} height={50} className="h-11 w-auto brightness-0 invert" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
        ) : (
          <>
            <p className="text-[10px] uppercase tracking-wider text-white/40 px-4 mb-3">
              Principal
            </p>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item${isActive ? ' active' : ''}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-white/10 space-y-2">
        {loading ? (
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-4 w-24 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.15)' }} />
              <div className="h-3 w-32 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              <span className="text-sm font-semibold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-[11px] text-white/50 truncate">{user?.email ?? ''}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="nav-item w-full text-left"
        >
          <LogoutIcon className="w-5 h-5 flex-shrink-0" />
          <span>Cerrar Sesion</span>
        </button>
      </div>
    </aside>
  )
}

// Icons
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function WorkflowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function ChartBarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}
