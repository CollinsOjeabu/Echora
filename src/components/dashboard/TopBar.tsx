'use client'

import { usePathname, useRouter } from 'next/navigation'

const PAGE_NAMES: Record<string, string> = {
  '/dashboard': 'Home',
  '/dashboard/canvas': 'Canvas',
  '/dashboard/library': 'Library',
  '/dashboard/agents': 'Agents',
  '/dashboard/schedule': 'Schedule',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/settings': 'Settings',
}

export function TopBar({
  collapsed,
  onToggle,
  onSearchOpen,
}: {
  collapsed: boolean
  onToggle: () => void
  onSearchOpen: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const pageName = PAGE_NAMES[pathname] || 'Home'

  return (
    <header style={{
      height: 44, flexShrink: 0,
      background: 'var(--bg-page)',
      borderBottom: '0.5px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 16px', gap: 10,
    }}>
      {/* Collapsed: utility box + separator + page name */}
      {collapsed && (
        <>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'var(--bg-elevated)', border: '0.5px solid var(--border)',
            borderRadius: 7, padding: '3px 5px', gap: 2,
          }}>
            {/* New Synthesis */}
            <UtilityButton
              tooltip="New Synthesis"
              color="var(--ember)"
              onClick={() => router.push('/dashboard/canvas')}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="7" y1="2" x2="7" y2="12"/><line x1="2" y1="7" x2="12" y2="7"/>
              </svg>
            </UtilityButton>
            {/* Search */}
            <UtilityButton
              tooltip="Search"
              color="var(--text-muted)"
              onClick={onSearchOpen}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="6" cy="6" r="4"/><line x1="9" y1="9" x2="13" y2="13"/>
              </svg>
            </UtilityButton>
            {/* Add to Library */}
            <UtilityButton
              tooltip="Add to Library"
              color="var(--text-muted)"
              onClick={() => router.push('/dashboard/library/new')}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <rect x="2" y="1" width="10" height="12" rx="1.5"/><line x1="5" y1="5" x2="9" y2="5"/><line x1="5" y1="8" x2="7.5" y2="8"/>
              </svg>
            </UtilityButton>
            {/* Expand sidebar */}
            <UtilityButton
              tooltip="Expand sidebar"
              color="var(--text-muted)"
              onClick={onToggle}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M5 4l4 3-4 3"/>
              </svg>
            </UtilityButton>
          </div>

          {/* Separator */}
          <div style={{ width: 0.5, height: 18, background: 'var(--border)' }} />
        </>
      )}

      {/* Page name */}
      <span style={{
        fontSize: 12, fontFamily: "'Inter', sans-serif",
        color: 'var(--text-muted)',
      }}>
        {pageName}
      </span>
    </header>
  )
}

/* ─── Utility button with tooltip ─── */
function UtilityButton({
  children,
  tooltip,
  color,
  onClick,
}: {
  children: React.ReactNode
  tooltip: string
  color: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="topbar-util"
      style={{
        position: 'relative',
        width: 24, height: 24, borderRadius: 4,
        background: 'transparent', border: 'none',
        color, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {children}
      <span className="topbar-tooltip" style={{
        position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)',
        background: 'var(--bg-elevated)', border: '0.5px solid var(--border)',
        borderRadius: 4, padding: '3px 8px', fontSize: 10,
        color: 'var(--text-primary)', whiteSpace: 'nowrap',
        pointerEvents: 'none', opacity: 0, transition: 'opacity 0.12s',
        zIndex: 100,
      }}>
        {tooltip}
      </span>

      <style jsx>{`
        .topbar-util:hover { background: var(--bg-hover) !important; }
        .topbar-util:hover .topbar-tooltip { opacity: 1 !important; }
      `}</style>
    </button>
  )
}
