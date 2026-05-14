'use client'

import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface OutlinedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  icon?: ReactNode
}

/**
 * Secondary action button — transparent bg, 0.5px border.
 */
export function OutlinedButton({ children, icon, disabled, style, ...props }: OutlinedButtonProps) {
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
        fontWeight: 500,
        fontSize: 12,
        fontFamily: 'var(--font-inter), sans-serif',
        borderRadius: 'var(--radius-md)',
        padding: '6px 12px',
        border: '0.5px solid var(--border-hover)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
