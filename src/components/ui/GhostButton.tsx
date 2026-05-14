'use client'

import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  icon?: ReactNode
}

/**
 * Tertiary action button — no background, no border, muted text.
 */
export function GhostButton({ children, icon, disabled, style, ...props }: GhostButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        background: 'transparent',
        color: disabled ? 'var(--text-faint)' : 'var(--text-muted)',
        fontWeight: 400,
        fontSize: 12,
        fontFamily: 'var(--font-inter), sans-serif',
        borderRadius: 'var(--radius-md)',
        padding: '6px 10px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        ...style,
      }}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
