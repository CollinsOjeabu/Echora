'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { ConvexError } from 'convex/values'
import { api } from '../../../convex/_generated/api'

/* ── Helpers ── */

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function getHourGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

/* ── Spinner SVG — replaces lucide-react Loader2 ── */
function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  )
}

/* ── Bar values (placeholder — Phase E replaces with real Claude analysis) ── */
const barValues = [
  { label: 'Formality',    value: 65 },
  { label: 'Storytelling', value: 72 },
  { label: 'Technical',    value: 48 },
  { label: 'Provocative',  value: 61 },
  { label: 'Data-driven',  value: 58 },
]

/* ══════════════════════════════════════ */
/*  Onboarding Page                      */
/* ══════════════════════════════════════ */

export default function OnboardingPage() {
  const router = useRouter()

  // Step state
  const [step, setStep]               = useState<1 | 2 | 3>(1)
  const [samplesText, setSamplesText] = useState('')
  const [activeTab, setActiveTab]     = useState<'url' | 'text' | 'note'>('url')
  const [researchUrl, setResearchUrl] = useState('')
  const [researchTitle, setResearchTitle] = useState('')
  const [researchContent, setResearchContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showNotice, setShowNotice]   = useState(false)
  const [step2Error, setStep2Error]   = useState('')
  const [step3Error, setStep3Error]   = useState('')
  const [barsVisible, setBarsVisible] = useState(false)

  // Convex
  const profile          = useQuery(api.users.getCurrent)
  const completeOnboard  = useMutation(api.users.completeOnboarding)
  const saveVoiceSamples = useMutation(api.users.saveVoiceSamples)
  const createContent    = useMutation(api.content.createFromAuth)

  // Existing user reconciliation — if already onboarded, set cookie + redirect
  useEffect(() => {
    if (profile?.onboardingComplete === true) {
      setCookie('echora-onboarded', 'true', 31536000)
      router.push('/dashboard')
    }
  }, [profile, router])

  // LinkedIn notice auto-hide
  useEffect(() => {
    if (!showNotice) return
    const t = setTimeout(() => setShowNotice(false), 5000)
    return () => clearTimeout(t)
  }, [showNotice])

  // Char count + bar visibility
  const charCount = samplesText.length
  const showBars  = barsVisible || charCount > 80
  useEffect(() => {
    if (charCount > 80) setBarsVisible(true)
  }, [charCount])

  // Step helpers
  const goStep = (n: 1 | 2 | 3) => {
    setStep(n)
    setStep2Error('')
    setStep3Error('')
  }

  const finishOnboarding = async () => {
    try {
      await completeOnboard()
      setCookie('echora-onboarded', 'true', 31536000)
      router.push('/dashboard')
    } catch (err) {
      setStep3Error(
        err instanceof ConvexError ? (err as ConvexError<string>).data : 'Something went wrong. Try again.'
      )
      setIsSubmitting(false)
    }
  }

  const handleSaveSamples = async () => {
    if (samplesText.trim().length < 50) {
      setStep2Error('Add at least one writing sample before continuing.')
      return
    }
    setStep2Error('')
    setIsSubmitting(true)
    try {
      const samples = samplesText
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
      await saveVoiceSamples({ samples })
      goStep(3)
    } catch (err) {
      setStep2Error(
        err instanceof ConvexError ? (err as ConvexError<string>).data : 'Failed to save. Try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveResearch = async () => {
    setStep3Error('')
    if (activeTab === 'url' && !researchUrl.trim()) {
      setStep3Error('Please enter a URL.')
      return
    }
    if (activeTab !== 'url' && !researchTitle.trim()) {
      setStep3Error('Please enter a title.')
      return
    }
    if (activeTab !== 'url' && !researchContent.trim()) {
      setStep3Error('Please add some content.')
      return
    }
    setIsSubmitting(true)
    try {
      const title = researchTitle.trim() || (() => {
        try { return new URL(researchUrl).hostname } catch { return researchUrl }
      })()
      await createContent({
        title,
        url:     activeTab === 'url' ? researchUrl.trim() : undefined,
        content: activeTab !== 'url' ? researchContent.trim() : '',
        type:    activeTab === 'note' ? 'note' : 'article',
      })
      await finishOnboarding()
    } catch (err) {
      if (!(err instanceof ConvexError && (err as ConvexError<string>).data === 'Not authenticated')) {
        setStep3Error(
          err instanceof ConvexError ? (err as ConvexError<string>).data : 'Failed to save. Try again.'
        )
        setIsSubmitting(false)
      }
    }
  }

  /* ── Shared styles ── */
  const s = {
    page: {
      minHeight: '100vh', display: 'flex', flexDirection: 'column' as const,
      alignItems: 'center', paddingTop: 40, paddingBottom: 64, paddingLeft: 20, paddingRight: 20,
      background: 'var(--bg-page, #070E09)',
    },
    container: { width: '100%', maxWidth: 500 },
    heading: {
      fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' as const,
      fontSize: 26, color: 'var(--text-primary, #EDE8E0)',
      letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 6, textAlign: 'center' as const,
    },
    subtext: {
      fontSize: 13, color: 'rgba(237,232,224,0.50)', lineHeight: 1.65,
      textAlign: 'center' as const, maxWidth: 380, margin: '0 auto 28px',
    },
    card: {
      background: 'var(--bg-surface, #0D1610)', border: '1px solid var(--border, #1E2E22)',
      borderRadius: 14, padding: '18px 16px',
    },
    cardEmber: {
      background: 'var(--bg-surface, #0D1610)',
      border: '1px solid rgba(255,107,53,0.22)',
      borderRadius: 14, padding: '18px 16px',
    },
    btnEmber: {
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      width: '100%', padding: '10px 16px', borderRadius: 10, border: 'none',
      background: 'var(--ember, #FF6B35)', color: '#fff',
      fontSize: 13, fontWeight: 600, cursor: 'pointer',
      fontFamily: "'Inter', sans-serif", transition: 'background 0.15s',
    },
    btnGhost: {
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      width: '100%', padding: '10px 16px', borderRadius: 10,
      border: '1px solid var(--border, #1E2E22)', background: 'transparent',
      color: 'rgba(237,232,224,0.50)', fontSize: 13, fontWeight: 600,
      cursor: 'pointer', fontFamily: "'Inter', sans-serif",
      transition: 'all 0.15s',
    },
    btnGhostEmber: {
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      width: '100%', padding: '10px 16px', borderRadius: 10,
      border: '1px solid rgba(255,107,53,0.22)', background: 'transparent',
      color: 'var(--ember, #FF6B35)', fontSize: 13, fontWeight: 600,
      cursor: 'pointer', fontFamily: "'Inter', sans-serif",
      transition: 'all 0.15s',
    },
    skipLink: {
      fontSize: 12, color: 'rgba(237,232,224,0.22)', textAlign: 'center' as const,
      padding: '10px 0', cursor: 'pointer', border: 'none', background: 'none',
      width: '100%', fontFamily: "'Inter', sans-serif", transition: 'color 0.15s',
    },
    errorText: {
      fontSize: 12, color: '#f87171', marginTop: 8, textAlign: 'center' as const,
    },
    inputBase: {
      width: '100%', background: 'transparent',
      border: 'none', outline: 'none', resize: 'none' as const,
      color: 'var(--text-primary, #EDE8E0)', fontSize: 13,
      fontFamily: "'Inter', sans-serif", lineHeight: 1.65,
    },
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* ── Logo + branding ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: 'var(--ember, #FF6B35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
          }}>
            <svg viewBox="0 0 14 14" fill="none" width="16" height="16">
              <path d="M4 12 C4 7 7 3 12 2" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M6 12 C6 8 8.5 5 12 4" stroke="white" strokeWidth="2.4" strokeLinecap="round"/>
              <line x1="5.5" y1="1.5" x2="8" y2="13" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: 18, color: 'var(--text-primary, #EDE8E0)' }}>
            Echora
          </span>
        </div>

        {/* ── Step pills ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          {([1, 2, 3] as const).map((n) => {
            const isActive = step === n
            const isDone = step > n
            return (
              <button
                key={n}
                onClick={() => goStep(n)}
                className="step-pill"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 100,
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.2s',
                  border: isActive
                    ? '1.5px solid var(--ember, #FF6B35)'
                    : isDone
                    ? '1.5px solid var(--success, #1D9E75)'
                    : '1.5px solid var(--border, #1E2E22)',
                  background: isActive ? 'var(--ember, #FF6B35)' : 'transparent',
                  color: isActive ? '#fff' : isDone ? 'var(--success, #1D9E75)' : 'rgba(237,232,224,0.25)',
                }}
              >
                {isDone && (
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="10" height="10">
                    <polyline points="2,6 5,9 10,3"/>
                  </svg>
                )}
                Step {n}
              </button>
            )
          })}
        </div>

        {/* ════════ STEP 1 ════════ */}
        {step === 1 && (
          <div key="step1" style={{ animation: 'fadeUp 0.25s ease' }}>
            <div style={s.heading}>
              Good {getHourGreeting()}, let&apos;s set up your voice.
            </div>
            <div style={s.subtext}>
              Choose how you&apos;d like to train Echora to write in your style.
              This takes about 2 minutes.
            </div>

            {/* Cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {/* LinkedIn card */}
              <div style={s.card}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: 'rgba(0,119,181,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#0077B5">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.712-2.165 1.213V6.169H6.29c.032.684 0 7.225 0 7.225h2.36z"/>
                  </svg>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary, #EDE8E0)', marginBottom: 4 }}>
                  Connect LinkedIn
                </div>
                <div style={{ fontSize: 12, color: 'rgba(237,232,224,0.50)', lineHeight: 1.55, marginBottom: 14 }}>
                  Import your recent posts and let AI analyse your existing voice.
                </div>
                <button
                  style={s.btnEmber}
                  onClick={() => setShowNotice(true)}
                  className="btn-hover-ember"
                >
                  Connect LinkedIn →
                </button>
              </div>

              {/* Manual samples card */}
              <div style={s.cardEmber}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: 'rgba(255,107,53,0.10)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="var(--ember, #FF6B35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.5 1.5l2 2L4 12H2v-2L10.5 1.5z"/>
                  </svg>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary, #EDE8E0)', marginBottom: 4 }}>
                  Paste samples
                </div>
                <div style={{ fontSize: 12, color: 'rgba(237,232,224,0.50)', lineHeight: 1.55, marginBottom: 14 }}>
                  Paste a few paragraphs you&apos;ve written — emails, posts, or notes.
                </div>
                <button
                  style={s.btnGhostEmber}
                  onClick={() => goStep(2)}
                  className="btn-hover-ghost-ember"
                >
                  Add samples →
                </button>
              </div>
            </div>

            {/* Notice banner */}
            {showNotice && (
              <div style={{
                background: 'rgba(239,159,39,0.10)', border: '1px solid rgba(239,159,39,0.22)',
                borderRadius: 9, padding: '10px 13px', marginBottom: 12,
                fontSize: 12, color: '#EF9F27', lineHeight: 1.55,
                animation: 'fadeUp 0.2s ease',
              }}>
                <strong style={{ fontWeight: 600 }}>Coming soon.</strong>{' '}
                LinkedIn import is not available yet. Use manual samples for now.
              </div>
            )}

            {/* Skip */}
            <button
              style={s.skipLink}
              onClick={() => goStep(3)}
              className="skip-link"
            >
              Skip for now →
            </button>
          </div>
        )}

        {/* ════════ STEP 2 ════════ */}
        {step === 2 && (
          <div key="step2" style={{ animation: 'fadeUp 0.25s ease' }}>
            <div style={s.heading}>
              Paste your writing samples.
            </div>
            <div style={s.subtext}>
              Paste a few paragraphs of your writing — blog posts, emails, LinkedIn posts,
              or notes. The more you paste, the better we can capture your voice.
            </div>

            {/* Textarea container */}
            <div
              className="textarea-focus-ring"
              style={{
                background: 'var(--bg-elevated, #152219)',
                border: '1px solid var(--border, #1E2E22)',
                borderRadius: 12, overflow: 'hidden', marginBottom: 8,
                transition: 'border-color 0.15s',
              }}
            >
              <textarea
                placeholder="Paste your writing here... Separate multiple samples with a blank line."
                value={samplesText}
                onChange={(e) => setSamplesText(e.target.value)}
                style={{
                  ...s.inputBase,
                  display: 'block', minHeight: 130, padding: '13px 14px',
                  resize: 'vertical' as const,
                }}
              />
              {/* Char count row */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '6px 14px 8px', fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                color: 'rgba(237,232,224,0.22)',
              }}>
                <span>{charCount} chars</span>
                <span>300+ words recommended</span>
              </div>
            </div>

            {/* Voice preview bars */}
            {showBars && (
              <div style={{
                background: 'var(--bg-surface, #0D1610)',
                border: '1px solid var(--border, #1E2E22)',
                borderRadius: 12, padding: '14px 16px', marginBottom: 16,
                animation: 'fadeUp 0.25s ease',
              }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: 'rgba(237,232,224,0.22)', letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                  }}>
                    Voice preview
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: 'rgba(237,232,224,0.22)',
                    border: '1px solid var(--border, #1E2E22)',
                    borderRadius: 100, padding: '2px 8px',
                  }}>
                    AI analysis · Phase E
                  </span>
                </div>
                {/* Bars */}
                {barValues.map((bar) => (
                  <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 10 }}>
                    <span style={{
                      width: 86, flexShrink: 0,
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                      color: 'rgba(237,232,224,0.22)', textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                    }}>
                      {bar.label}
                    </span>
                    <div style={{
                      flex: 1, height: 3, borderRadius: 100,
                      background: 'var(--border, #1E2E22)', overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', borderRadius: 100,
                        background: 'var(--ember, #FF6B35)',
                        width: showBars ? `${bar.value}%` : '0%',
                        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                      }} />
                    </div>
                    <span style={{
                      width: 26, textAlign: 'right' as const, flexShrink: 0,
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                      color: 'var(--ember, #FF6B35)',
                    }}>
                      {bar.value}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {step2Error && <div style={s.errorText}>{step2Error}</div>}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button style={s.btnGhost} onClick={() => goStep(1)} className="btn-hover-ghost">
                ← Back
              </button>
              <button
                style={{ ...s.btnEmber, opacity: isSubmitting ? 0.7 : 1 }}
                onClick={handleSaveSamples}
                disabled={isSubmitting}
                className="btn-hover-ember"
              >
                {isSubmitting ? <Spinner /> : 'Save samples →'}
              </button>
            </div>

            <button
              style={s.skipLink}
              onClick={() => goStep(3)}
              className="skip-link"
            >
              Skip this step →
            </button>
          </div>
        )}

        {/* ════════ STEP 3 ════════ */}
        {step === 3 && (
          <div key="step3" style={{ animation: 'fadeUp 0.25s ease' }}>
            <div style={s.heading}>
              Save your first research item.
            </div>
            <div style={s.subtext}>
              Add an article, write a note, or paste some text you want to synthesise later.
              This is the foundation of your knowledge graph.
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex', gap: 0,
              background: 'var(--bg-elevated, #152219)', borderRadius: 10,
              padding: 3, marginBottom: 18,
            }}>
              {([
                { id: 'url' as const, label: 'URL', icon: (
                  <svg width="12" height="12" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 8a3 3 0 004.24 0l2.12-2.12a3 3 0 00-4.24-4.24L7 2.76"/>
                    <path d="M8 6a3 3 0 00-4.24 0L1.64 8.12a3 3 0 004.24 4.24L7 11.24"/>
                  </svg>
                )},
                { id: 'text' as const, label: 'Text', icon: (
                  <svg width="12" height="12" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="1" y="1" width="12" height="12" rx="2"/>
                    <line x1="4" y1="5" x2="10" y2="5"/>
                    <line x1="4" y1="8" x2="8" y2="8"/>
                  </svg>
                )},
                { id: 'note' as const, label: 'Note', icon: (
                  <svg width="12" height="12" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M10.5 1.5l2 2L4 12H2v-2L10.5 1.5z"/>
                  </svg>
                )},
              ]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 5, padding: '8px 12px', borderRadius: 8, border: 'none',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif", transition: 'all 0.15s',
                    background: activeTab === tab.id ? 'var(--bg-surface, #0D1610)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--text-primary, #EDE8E0)' : 'rgba(237,232,224,0.50)',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content — URL */}
            {activeTab === 'url' && (
              <div style={{ animation: 'fadeUp 0.2s ease' }}>
                <div
                  className="textarea-focus-ring"
                  style={{
                    background: 'var(--bg-elevated, #152219)',
                    border: '1px solid var(--border, #1E2E22)',
                    borderRadius: 12, padding: '13px 14px', marginBottom: 10,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <input
                    type="url"
                    placeholder="https://example.com/article"
                    value={researchUrl}
                    onChange={(e) => setResearchUrl(e.target.value)}
                    style={{ ...s.inputBase, padding: 0, height: 20 }}
                  />
                </div>
                <div
                  className="textarea-focus-ring"
                  style={{
                    background: 'var(--bg-elevated, #152219)',
                    border: '1px solid var(--border, #1E2E22)',
                    borderRadius: 12, padding: '13px 14px', marginBottom: 10,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Title (optional — we'll extract it from the page)"
                    value={researchTitle}
                    onChange={(e) => setResearchTitle(e.target.value)}
                    style={{ ...s.inputBase, padding: 0, height: 20 }}
                  />
                </div>
                <div style={{
                  fontSize: 11, color: 'rgba(237,232,224,0.22)',
                  fontFamily: "'JetBrains Mono', monospace",
                  lineHeight: 1.55, marginBottom: 16, padding: '0 2px',
                }}>
                  The URL will be saved now. Content extraction happens in Phase E when
                  the scraping pipeline is connected.
                </div>
              </div>
            )}

            {/* Tab content — Text */}
            {activeTab === 'text' && (
              <div style={{ animation: 'fadeUp 0.2s ease' }}>
                <div
                  className="textarea-focus-ring"
                  style={{
                    background: 'var(--bg-elevated, #152219)',
                    border: '1px solid var(--border, #1E2E22)',
                    borderRadius: 12, padding: '13px 14px', marginBottom: 10,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Title"
                    value={researchTitle}
                    onChange={(e) => setResearchTitle(e.target.value)}
                    style={{ ...s.inputBase, padding: 0, height: 20 }}
                  />
                </div>
                <div
                  className="textarea-focus-ring"
                  style={{
                    background: 'var(--bg-elevated, #152219)',
                    border: '1px solid var(--border, #1E2E22)',
                    borderRadius: 12, overflow: 'hidden', marginBottom: 16,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <textarea
                    placeholder="Paste or type the article content..."
                    value={researchContent}
                    onChange={(e) => setResearchContent(e.target.value)}
                    style={{
                      ...s.inputBase,
                      display: 'block', minHeight: 110, padding: '13px 14px',
                      resize: 'vertical' as const,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Tab content — Note */}
            {activeTab === 'note' && (
              <div style={{ animation: 'fadeUp 0.2s ease' }}>
                <div
                  className="textarea-focus-ring"
                  style={{
                    background: 'var(--bg-elevated, #152219)',
                    border: '1px solid var(--border, #1E2E22)',
                    borderRadius: 12, padding: '13px 14px', marginBottom: 10,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Note title"
                    value={researchTitle}
                    onChange={(e) => setResearchTitle(e.target.value)}
                    style={{ ...s.inputBase, padding: 0, height: 20 }}
                  />
                </div>
                <div
                  className="textarea-focus-ring"
                  style={{
                    background: 'var(--bg-elevated, #152219)',
                    border: '1px solid var(--border, #1E2E22)',
                    borderRadius: 12, overflow: 'hidden', marginBottom: 16,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <textarea
                    placeholder="Write your thoughts, observations, or ideas..."
                    value={researchContent}
                    onChange={(e) => setResearchContent(e.target.value)}
                    style={{
                      ...s.inputBase,
                      display: 'block', minHeight: 110, padding: '13px 14px',
                      resize: 'vertical' as const,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {step3Error && <div style={s.errorText}>{step3Error}</div>}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button style={s.btnGhost} onClick={() => goStep(2)} className="btn-hover-ghost">
                ← Back
              </button>
              <button
                style={{ ...s.btnEmber, opacity: isSubmitting ? 0.7 : 1 }}
                onClick={handleSaveResearch}
                disabled={isSubmitting}
                className="btn-hover-ember"
              >
                {isSubmitting ? <Spinner /> : 'Save to library →'}
              </button>
            </div>

            {/* Or divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              margin: '16px 0 6px', color: 'rgba(237,232,224,0.22)',
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border, #1E2E22)' }} />
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border, #1E2E22)' }} />
            </div>

            <button
              style={s.skipLink}
              onClick={async () => {
                setIsSubmitting(true)
                await finishOnboarding()
              }}
              disabled={isSubmitting}
              className="skip-link"
            >
              {isSubmitting ? 'Finishing...' : 'Skip for now →'}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .btn-hover-ember:hover { background: #e85f2a !important; }
        .btn-hover-ghost:hover { border-color: #2A3E2E !important; color: var(--text-primary, #EDE8E0) !important; }
        .btn-hover-ghost-ember:hover { border-color: var(--ember, #FF6B35) !important; background: rgba(255,107,53,0.06) !important; }
        .skip-link:hover { color: rgba(237,232,224,0.50) !important; }
        .textarea-focus-ring:focus-within { border-color: rgba(255,107,53,0.5) !important; }
        textarea::placeholder, input::placeholder { color: rgba(237,232,224,0.22); }
        .step-pill:hover { border-color: #2A3E2E !important; }
      `}</style>
    </div>
  )
}
