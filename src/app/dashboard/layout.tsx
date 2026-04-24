'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullscreen = pathname === '/dashboard/canvas'

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('echora-theme') || 'void'
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar />
        <div style={{
          flex: 1,
          overflowY: isFullscreen ? 'hidden' : 'auto',
          overflowX: 'hidden',
          padding: isFullscreen ? 0 : 26,
        }}>
          {children}
        </div>
      </main>

      <style jsx>{`
        div::-webkit-scrollbar { width: 4px; }
        div::-webkit-scrollbar-track { background: transparent; }
        div::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 2px; }
      `}</style>
    </div>
  )
}
