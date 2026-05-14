'use client'

import { CSSProperties } from 'react'

/* ── Shared styles ── */
export const S = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', paddingTop: 36, paddingBottom: 60, paddingLeft: 20, paddingRight: 20, background: 'var(--bg-page)' } as CSSProperties,
  card: { width: '100%', maxWidth: 520, background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: 14, padding: '40px 44px' } as CSSProperties,
  heading: { fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' as const, fontSize: 32, color: 'var(--ember)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 8, textAlign: 'center' as const } as CSSProperties,
  sub: { fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center' as const, maxWidth: 400, margin: '0 auto 28px', fontFamily: "'Inter', sans-serif" } as CSSProperties,
  label: { display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 6, fontFamily: "'Inter', sans-serif" } as CSSProperties,
  input: { width: '100%', height: 44, padding: '0 14px', fontSize: 14, fontFamily: "'Inter', sans-serif", color: 'var(--text-primary)', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: 8, outline: 'none', transition: 'border-color 0.15s' } as CSSProperties,
  btnEmber: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 20px', borderRadius: 8, border: 'none', background: 'var(--ember)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'opacity 0.15s' } as CSSProperties,
  btnGhost: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 20px', borderRadius: 8, border: '0.5px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif" } as CSSProperties,
  skip: { fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' as const, padding: '12px 0', cursor: 'pointer', border: 'none', background: 'none', width: '100%', fontFamily: "'Inter', sans-serif" } as CSSProperties,
  err: { fontSize: 12, color: '#f87171', marginTop: 8, textAlign: 'center' as const } as CSSProperties,
}

/* ── Progress dots ── */
export function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 28 }}>
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const active = step === current
        const done = step < current
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <div style={{ width: 28, height: 1, background: done ? 'var(--ember)' : 'var(--border)', transition: 'background 0.3s' }} />}
            <div style={{
              width: active ? 8 : 6, height: active ? 8 : 6, borderRadius: '50%',
              background: active || done ? 'var(--ember)' : 'var(--border)',
              boxShadow: active ? '0 0 8px rgba(255,107,53,0.4)' : 'none',
              transition: 'all 0.3s',
            }} />
          </div>
        )
      })}
    </div>
  )
}

/* ── Bottom nav ── */
export function NavButtons({ onBack, onContinue, backHidden, disabled, loading, label }: {
  onBack?: () => void; onContinue: () => void; backHidden?: boolean; disabled?: boolean; loading?: boolean; label?: string
}) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
      {!backHidden && <button style={S.btnGhost} onClick={onBack}>← Back</button>}
      <button style={{ ...S.btnEmber, flex: 1, opacity: disabled ? 0.5 : 1 }} onClick={onContinue} disabled={disabled}>
        {loading ? <Spinner /> : label || 'Continue →'}
      </button>
    </div>
  )
}

/* ── Spinner ── */
export function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  )
}

/* ── Voice DNA heuristics ── */
export function analyzeHeuristics(texts: string[]): { storytelling: number; technical: number; provocative: number; datadriven: number; formality: number } {
  const combined = texts.join(' ').toLowerCase()
  const words = combined.split(/\s+/).filter(Boolean)
  const total = words.length || 1

  const storyWords = ['i', 'my', 'me', 'when', 'then', 'journey', 'realized', 'felt', 'story', 'remember']
  const techWords = ['how', 'because', 'therefore', 'system', 'process', 'framework', 'method', 'algorithm']
  const provWords = ['wrong', 'myth', 'nobody', 'stop', 'actually', 'truth', 'unpopular', 'controversial']
  const dataWords = ['research', 'study', 'data', 'statistics', 'percent', 'survey', 'analysis', 'report']

  const count = (list: string[]) => words.filter(w => list.includes(w)).length
  const cap = (n: number) => Math.min(100, Math.max(0, Math.round(n)))

  const questions = (combined.match(/\?/g) || []).length
  const exclamations = (combined.match(/!/g) || []).length
  const contractions = (combined.match(/\b(don't|can't|won't|i'm|it's|we're|they're|isn't|aren't)\b/g) || []).length
  const numbers = (combined.match(/\d+/g) || []).length

  return {
    storytelling: cap(count(storyWords) / total * 200),
    technical: cap((count(techWords) + numbers * 0.3) / total * 300),
    provocative: cap((count(provWords) + questions * 2 + exclamations) / total * 250),
    datadriven: cap((count(dataWords) + numbers) / total * 300),
    formality: cap(100 - (contractions / total * 500)),
  }
}

export function getPersonaLine(v: { storytelling: number; technical: number; provocative: number; datadriven: number; formality: number }): string {
  const traits: string[] = []
  if (v.storytelling > 50) traits.push('storytelling')
  if (v.technical > 50) traits.push('technical')
  if (v.provocative > 50) traits.push('provocative')
  if (v.datadriven > 50) traits.push('data-driven')
  if (v.formality > 60) traits.push('formal')
  else if (v.formality < 40) traits.push('conversational')

  if (traits.length === 0) return 'Keep typing to see your voice profile emerge...'
  const top = traits.slice(0, 2)
  return `A ${top[0]} voice${top[1] ? ` with a ${top[1]} edge` : ''}`
}
