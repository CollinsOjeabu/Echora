'use client'

import type { ReactNode } from 'react'

interface EmptyStateProps {
  headline: string
  body?: string
  icon?: ReactNode
  keyboardHint?: ReactNode
}

/**
 * Centered empty state with Playfair italic headline.
 */
export function EmptyState({ headline, body, icon, keyboardHint }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 40,
        textAlign: 'center',
      }}
    >
      {icon && (
        <div style={{ marginBottom: 20 }}>{icon}</div>
      )}
      <h3 className="text-display-sm" style={{ color: 'var(--text-primary)', margin: '0 0 8px' }}>
        {headline}
      </h3>
      {body && (
        <p className="text-body-sm" style={{ color: 'var(--text-muted)', maxWidth: 280, margin: 0, lineHeight: 1.6 }}>
          {body}
        </p>
      )}
      {keyboardHint && (
        <div style={{ marginTop: 16 }}>{keyboardHint}</div>
      )}
    </div>
  )
}
