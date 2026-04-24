'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const NAV_ITEMS = [
  {
    section: 'Workspace',
    items: [
      { label: 'Home', href: '/dashboard', icon: 'grid', badge: null },
      { label: 'Canvas', href: '/dashboard/canvas', icon: 'canvas', badge: { text: 'new', variant: 'success' } },
      { label: 'Library', href: '/dashboard/library', icon: 'doc', badge: null },
    ],
  },
  {
    section: 'Agents',
    items: [
      { label: 'Agents', href: '/dashboard/agents', icon: 'wave', badge: null },
      { label: 'Schedule', href: '/dashboard/schedule', icon: 'calendar', badge: null },
      { label: 'Analytics', href: '/dashboard/analytics', icon: 'chart', badge: null },
    ],
  },
  {
    section: 'Account',
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: 'gear', badge: null },
    ],
  },
]

function NavIcon({ name }: { name: string }) {
  switch (name) {
    case 'grid':
      return (<svg fill="none" viewBox="0 0 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="1" width="5.5" height="5.5" rx="1.2"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2"/></svg>)
    case 'canvas':
      return (<svg fill="none" viewBox="0 0 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="3.5" cy="3.5" r="1.8"/><circle cx="11.5" cy="3.5" r="1.8"/><circle cx="7.5" cy="11.5" r="1.8"/><line x1="5.3" y1="3.5" x2="9.7" y2="3.5"/><line x1="4.5" y1="5" x2="7" y2="9.8"/><line x1="10.5" y1="5" x2="8" y2="9.8"/></svg>)
    case 'doc':
      return (<svg fill="none" viewBox="0 0 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="1" width="13" height="13" rx="2"/><line x1="4" y1="5" x2="11" y2="5"/><line x1="4" y1="8" x2="8" y2="8"/></svg>)
    case 'wave':
      return (<svg fill="none" viewBox="0 0 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 13 C2 8 5 3 11 2"/><path d="M5.5 13 C5.5 10 7.5 7 11 5.5"/><line x1="4" y1="1.5" x2="6.5" y2="13.5" strokeWidth="1.2"/></svg>)
    case 'calendar':
      return (<svg fill="none" viewBox="0 0 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="2.5" width="13" height="11" rx="2"/><line x1="5" y1="1" x2="5" y2="4.5"/><line x1="10" y1="1" x2="10" y2="4.5"/><line x1="1" y1="7" x2="14" y2="7"/></svg>)
    case 'chart':
      return (<svg fill="none" viewBox="0 0 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="1,12 5,7 9,9 14,3"/><circle cx="14" cy="3" r="1.5" fill="currentColor" stroke="none"/></svg>)
    case 'gear':
      return (<svg fill="none" viewBox="0 0 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="7.5" cy="7.5" r="2.5"/><path d="M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2M2.7 2.7l1.4 1.4M10.9 10.9l1.4 1.4M2.7 12.3l1.4-1.4M10.9 4.1l1.4-1.4"/></svg>)
    default:
      return null
  }
}

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  // Hydration-safe: read from localStorage after mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved === 'true') setCollapsed(true)
  }, [])

  // Persist collapse state
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed))
  }, [collapsed])

  // Keyboard shortcut: Ctrl+B / Cmd+B
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        setCollapsed(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const { signOut } = useClerk()
  const { profile, isLoading } = useCurrentUser()

  const displayName = profile?.name ?? ''
  const initial = displayName.charAt(0).toUpperCase() || '?'

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside
      style={{
        width: collapsed ? 48 : 220,
        background: 'var(--bg-page)',
        borderRight: '0.5px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0, position: 'relative', zIndex: 20,
        transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}
    >
      {/* Brand */}
      <div style={{
        padding: collapsed ? '10px 0 8px' : '14px 12px 12px', borderBottom: '0.5px solid var(--border)',
        display: 'flex', flexDirection: collapsed ? 'column' : 'row',
        alignItems: 'center', gap: collapsed ? 6 : 8,
        flexShrink: 0, overflow: 'hidden', minHeight: collapsed ? 'auto' : 52,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'var(--ember)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M4 12 C4 7 7 3 12 2" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
            <path d="M6 12 C6 8 8.5 5 12 4" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
            <line x1="5.5" y1="1.5" x2="8" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: 'var(--text-primary)', fontStyle: 'italic', display: 'block', lineHeight: 1.2 }}>Threadda</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--text-faint)', letterSpacing: '0.04em', display: 'block' }}>early access</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
          className="sidebar-toggle-btn"
          style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'transparent', border: 'none',
            color: 'var(--text-faint)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s', flexShrink: 0,
          }}
        >
          <svg width="13" height="13" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s ease' }}>
            <path d="M9 4l-4 3 4 3"/><rect x="1" y="1" width="12" height="12" rx="2"/><line x1="5" y1="1" x2="5" y2="13"/>
          </svg>
        </button>
      </div>

      {/* Nav */}
      {NAV_ITEMS.map((section) => (
        <div key={section.section}>
          <div style={{
            padding: collapsed ? '0' : '14px 10px 5px 12px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9, color: 'var(--text-faint)',
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            whiteSpace: 'nowrap', overflow: 'hidden',
            opacity: collapsed ? 0 : 1, height: collapsed ? 0 : 'auto',
            transition: 'opacity 0.15s',
          }}>
            {section.section}
          </div>
          {section.items.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '8px 10px 8px 12px',
                  margin: '1px 6px', borderRadius: 8,
                  fontSize: 13, color: active ? 'var(--ember)' : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.14s',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                  userSelect: 'none', textDecoration: 'none',
                  background: active ? 'var(--ember-muted)' : 'transparent',
                  width: 'calc(100% - 12px)',
                }}
                className="nav-item-link"
              >
                {active && (
                  <span style={{
                    position: 'absolute', left: 0, top: '20%', height: '60%',
                    width: 2.5, background: 'var(--ember)',
                    borderRadius: '0 2px 2px 0',
                  }}/>
                )}
                <span style={{ width: 15, height: 15, flexShrink: 0, opacity: active ? 1 : 0.75, display: 'flex' }}>
                  <NavIcon name={item.icon} />
                </span>
                <span style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', overflow: 'hidden', transition: 'opacity 0.15s, width 0.22s' }}>
                  {item.label}
                </span>
                {item.badge && !collapsed && (
                  <span style={{
                    marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9, padding: '1px 5px', borderRadius: 8,
                    background: item.badge.variant === 'success' ? 'var(--success-muted)' : 'var(--ember-muted)',
                    color: item.badge.variant === 'success' ? 'var(--success)' : 'var(--ember)',
                    flexShrink: 0, transition: 'opacity 0.15s',
                  }}>
                    {item.badge.text}
                  </span>
                )}
                {/* Tooltip when collapsed */}
                <span className="sidebar-tooltip" style={{
                  position: 'absolute', left: 54, top: '50%', transform: 'translateY(-50%)',
                  background: 'var(--bg-elevated)', border: '0.5px solid var(--border-hover)',
                  color: 'var(--text-primary)', fontSize: 12, fontWeight: 500,
                  padding: '5px 10px', borderRadius: 7, whiteSpace: 'nowrap',
                  pointerEvents: 'none', opacity: 0, transition: 'opacity 0.15s',
                  zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      ))}

      {/* Bottom */}
      <div style={{ marginTop: 'auto', padding: '10px 6px', borderTop: '0.5px solid var(--border)', flexShrink: 0 }}>
        {/* User card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 6px', borderRadius: 7, cursor: 'pointer', overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-elevated)', flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ) : (
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--ember)', border: '1.5px solid var(--border-hover)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0,
              fontFamily: "'DM Serif Display', serif",
            }}>{initial}</div>
          )}
          <div style={{ overflow: 'hidden', opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', transition: 'opacity 0.15s' }}>
            {isLoading ? (
              <div style={{ width: 72, height: 10, borderRadius: 4, background: 'var(--bg-elevated)', marginBottom: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
            ) : (
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{displayName}</div>
            )}
          </div>
        </div>
        {/* Sign out */}
        <button
          onClick={() => signOut({ redirectUrl: '/' })}
          aria-label="Sign out"
          className="nav-item-link signout-btn"
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 10px 8px 12px',
            margin: '4px 6px 0', borderRadius: 8,
            fontSize: 13, color: 'var(--text-muted)',
            cursor: 'pointer', transition: 'all 0.14s',
            whiteSpace: 'nowrap', overflow: 'hidden',
            background: 'transparent',
            border: 'none', width: 'calc(100% - 12px)',
            position: 'relative',
          }}
        >
          <span style={{ width: 15, height: 15, flexShrink: 0, opacity: 0.75, display: 'flex' }}>
            <svg fill="none" viewBox="0 0 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 1H3a2 2 0 00-2 2v9a2 2 0 002 2h3"/><path d="M10 11l4-4-4-4"/><line x1="5" y1="7" x2="14" y2="7"/>
            </svg>
          </span>
          <span style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', overflow: 'hidden', transition: 'opacity 0.15s, width 0.22s' }}>
            Sign out
          </span>
          <span className="sidebar-tooltip" style={{
            position: 'absolute', left: 54, top: '50%', transform: 'translateY(-50%)',
            background: 'var(--bg-elevated)', border: '0.5px solid var(--border-hover)',
            color: 'var(--text-primary)', fontSize: 12, fontWeight: 500,
            padding: '5px 10px', borderRadius: 7, whiteSpace: 'nowrap',
            pointerEvents: 'none', opacity: 0, transition: 'opacity 0.15s',
            zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            Sign out
          </span>
        </button>
      </div>

      <style jsx>{`
        .nav-item-link:hover { background: var(--bg-hover) !important; color: var(--text-primary) !important; }
        .nav-item-link:hover .sidebar-tooltip { opacity: ${collapsed ? 1 : 0} !important; }
        .signout-btn:hover { color: #f87171 !important; }
        .sidebar-toggle-btn:hover { background: var(--bg-elevated) !important; color: var(--text-primary) !important; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </aside>
  )
}
