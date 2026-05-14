'use client'

import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface EmberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  icon?: ReactNode
}

/**
 * Primary action button — solid Ember background, white text.
 */
export function EmberButton({ children, icon, disabled, style, ...props }: EmberButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        background: disabled ? 'var(--bg-elevated)' : 'var(--ember)',
        color: disabled ? 'var(--text-muted)' : '#fff',
        fontWeight: 600,
        fontSize: 13,
        fontFamily: 'var(--font-inter), sans-serif',
        borderRadius: 'var(--radius-md)',
        padding: '8px 16px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
