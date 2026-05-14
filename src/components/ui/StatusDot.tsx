'use client'

interface StatusDotProps {
  color?: string
  pulse?: boolean
  size?: number
}

/**
 * 6px status indicator circle.
 * Pulse animation defaults to false (Sprint 3 — V1 adds animation).
 */
export function StatusDot({ color = 'currentColor', pulse = false, size = 6 }: StatusDotProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        flexShrink: 0,
        animation: pulse ? 'pulseGlow 2s ease-in-out infinite' : undefined,
      }}
    />
  )
}
