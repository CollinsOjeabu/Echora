'use client'

import { StatusDot } from '@/components/ui/StatusDot'

interface AgentHeaderProps {
  canvasState: 'constellation' | 'session' | 'post-preview'
  activeAgent: 'authority' | 'catalyst'
  sourcesCount: number
}

const AGENTS = {
  authority: { name: 'THE AUTHORITY', code: 'E-LI-772', initial: 'A' },
  catalyst: { name: 'THE CATALYST', code: 'E-TW-119', initial: 'C' },
}

/**
 * Agent identity header for the right panel.
 * Three states: idle (constellation), active (session), refinement (post-preview).
 */
export function AgentHeader({ canvasState, activeAgent, sourcesCount }: AgentHeaderProps) {
  const isActive = canvasState === 'session' || canvasState === 'post-preview'
  const agent = AGENTS[activeAgent]

  return (
    <div
      style={{
        padding: '10px 10px',
        borderBottom: '0.5px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 'var(--radius-sm)',
          background: isActive ? 'var(--ember-muted)' : 'var(--bg-elevated)',
          border: `0.5px solid ${isActive ? 'rgba(255,107,53,0.22)' : 'var(--border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: isActive ? 'var(--ember)' : 'var(--text-faint)',
        }}
      >
        <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.08em' }}>
          {isActive ? agent.initial : '∅'}
        </span>
      </div>

      {/* Name + status */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="font-mono"
          style={{
            fontSize: 8,
            color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {isActive ? agent.name : 'No session'}
        </div>
        <div className="font-mono" style={{
          fontSize: 7.5, color: 'var(--text-faint)', marginTop: 1,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {canvasState === 'session' && (
            <>
              <StatusDot color="var(--success)" />
              <span>Reading {sourcesCount} source{sourcesCount !== 1 ? 's' : ''}</span>
            </>
          )}
          {canvasState === 'post-preview' && (
            <>
              <StatusDot color="var(--ember)" />
              <span>Refinement mode</span>
            </>
          )}
          {canvasState === 'constellation' && (
            <span>Select sources to open</span>
          )}
        </div>
      </div>

      {/* Badge */}
      <div
        className="font-mono"
        style={{
          padding: '2px 6px',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--bg-elevated)',
          color: isActive ? 'var(--text-muted)' : 'var(--text-faint)',
          fontSize: 7,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}
      >
        {isActive ? agent.code : 'IDLE'}
      </div>
    </div>
  )
}
