'use client'

import type { ReactNode } from 'react'

interface CanvasShellProps {
  sourcesSlot: ReactNode
  canvasSlot: ReactNode
  rightSlot: ReactNode
  hideRightPanel?: boolean
}

/**
 * Three-column shell for the Canvas page.
 * Left: sources (168px), Center: canvas (flex-1), Right: agent panel (380px).
 * When hideRightPanel is true (State 3), the right column is removed entirely.
 */
export function CanvasShell({ sourcesSlot, canvasSlot, rightSlot, hideRightPanel }: CanvasShellProps) {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
      }}
    >
      {/* ═══ Left: Sources Panel ═══ */}
      <aside
        style={{
          width: 168,
          flexShrink: 0,
          background: 'var(--bg-surface)',
          borderRight: '0.5px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {sourcesSlot}
      </aside>

      {/* ═══ Center: Canvas Area ═══ */}
      <main
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          background: 'var(--bg-page)',
        }}
      >
        {canvasSlot}
      </main>

      {/* ═══ Right: Agent Panel ═══ */}
      {!hideRightPanel && (
        <aside
          style={{
            width: 380,
            flexShrink: 0,
            background: 'var(--bg-surface)',
            borderLeft: '0.5px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {rightSlot}
        </aside>
      )}
    </div>
  )
}
