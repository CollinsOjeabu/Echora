'use client'

interface KeyboardHintProps {
  keys: string[]
  label: string
}

/**
 * Small pill showing keyboard shortcuts.
 */
export function KeyboardHint({ keys, label }: KeyboardHintProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--bg-elevated)',
        border: '0.5px solid var(--border)',
      }}
    >
      {keys.map((key) => (
        <kbd
          key={key}
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 10,
            fontWeight: 500,
            padding: '1px 5px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-hover)',
            border: '0.5px solid var(--border-hover)',
            color: 'var(--text-primary)',
            lineHeight: 1.4,
          }}
        >
          {key}
        </kbd>
      ))}
      <span className="text-mono-xs" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  )
}
