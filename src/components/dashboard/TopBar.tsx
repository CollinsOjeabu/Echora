'use client'

import { usePathname } from 'next/navigation'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const BREADCRUMBS: Record<string, string> = {
  '/dashboard': 'Home',
  '/dashboard/canvas': 'Canvas',
  '/dashboard/library': 'Library',
  '/dashboard/agents': 'Agents',
  '/dashboard/schedule': 'Schedule',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/settings': 'Settings',
}

export function TopBar() {
  const pathname = usePathname()
  const currentPage = BREADCRUMBS[pathname] || 'Home'
  const { profile, isLoading } = useCurrentUser()
  const initial = profile?.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <header style={{
      height: 48, flexShrink: 0,
      background: 'var(--bg-page)',
      borderBottom: '0.5px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', gap: 14,
    }}>
      {/* Left — breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          <span>Echora</span>
          <span style={{ opacity: 0.3 }}>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{currentPage}</span>
        </div>
      </div>

      {/* Centre — search */}
      <div
        aria-label="Search (coming soon)"
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'var(--bg-surface)', border: '0.5px solid var(--border)',
          borderRadius: 8, padding: '6px 12px', fontSize: 12,
          color: 'var(--text-muted)', cursor: 'text',
          minWidth: 200,
        }}
        className="topbar-search"
      >
        <svg width="12" height="12" fill="none" viewBox="0 0 13 13" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
          <circle cx="5.5" cy="5.5" r="4"/><line x1="8.5" y1="8.5" x2="12" y2="12"/>
        </svg>
        Search anything...
        <kbd style={{
          marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9, background: 'var(--bg-elevated)', padding: '1px 5px',
          borderRadius: 4, color: 'var(--text-faint)',
        }}>⌘K</kbd>
      </div>

      {/* Right — actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Notification bell */}
        <button className="tbtn" style={{
          width: 30, height: 30, borderRadius: 7,
          background: 'transparent', border: '0.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-muted)', position: 'relative',
        }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M7 1.5a4.5 4.5 0 00-4.5 4.5v2.5l-1 2h11l-1-2V6A4.5 4.5 0 007 1.5zM5.5 12a1.5 1.5 0 003 0"/>
          </svg>
          {/* Orange dot */}
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--ember)', border: '1.5px solid var(--bg-page)',
          }}/>
        </button>

        {/* Help */}
        <button className="tbtn" style={{
          width: 30, height: 30, borderRadius: 7,
          background: 'transparent', border: '0.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-muted)',
        }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="7" cy="7" r="5"/>
            <path d="M5.5 5.5a1.5 1.5 0 113 0c0 1.5-1.5 1.5-1.5 2.8"/>
            <circle cx="7" cy="11" r=".4" fill="currentColor" stroke="none"/>
          </svg>
        </button>

        {/* Separator */}
        <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 2px' }}/>

        {/* User avatar */}
        {isLoading ? (
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--bg-elevated)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ) : (
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--ember)', border: '1.5px solid var(--border-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: '#fff', cursor: 'pointer',
            fontFamily: "'DM Serif Display', serif",
          }}>{initial}</div>
        )}
      </div>

      <style jsx>{`
        .topbar-search:hover { border-color: var(--border-hover) !important; }
        .tbtn:hover { background: var(--bg-hover) !important; border-color: var(--border-hover) !important; color: var(--text-primary) !important; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </header>
  )
}
