'use client'

import { use, useEffect, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { timeAgo } from '@/lib/time'
import ReactMarkdown from 'react-markdown'

const TYPE_CONFIG: Record<string, { label: string; bg: string; stroke: string }> = {
  article: { label: 'Article', bg: 'rgba(29,158,117,0.1)', stroke: '#1D9E75' },
  pdf: { label: 'PDF', bg: 'var(--ember-muted)', stroke: '#FF6B35' },
  note: { label: 'Note', bg: 'rgba(55,138,221,0.1)', stroke: '#378ADD' },
  video: { label: 'Video', bg: 'rgba(239,159,39,0.1)', stroke: '#EF9F27' },
  tweet: { label: 'Tweet', bg: 'rgba(29,161,242,0.1)', stroke: '#1DA1F2' },
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  ready: { color: '#1D9E75', label: 'Ready' },
  processing: { color: '#EF9F27', label: 'Processing' },
  queued: { color: 'rgba(237,232,224,0.35)', label: 'Queued' },
  error: { color: '#E24B4A', label: 'Error' },
}

export default function LibraryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const itemId = resolvedParams.id as Id<"contentItems">
  const item = useQuery(api.content.get, { id: itemId })
  const removeItem = useMutation(api.content.remove)

  const [expanded, setExpanded] = useState(false)

  // Escape key → back to library
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.push('/dashboard/library')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [router])

  const handleDelete = async () => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    await removeItem({ contentId: itemId })
    router.push('/dashboard/library')
  }

  // Loading
  if (item === undefined) {
    return (
      <div style={{ maxWidth: 780, animation: 'fadeIn 0.18s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          <Skeleton className="h-3 rounded" style={{ width: 60 }} />
          <span style={{ color: 'var(--text-faint)' }}>/</span>
          <Skeleton className="h-3 rounded" style={{ width: 180 }} />
        </div>
        <Skeleton className="h-4 rounded" style={{ width: '50%', marginBottom: 12 }} />
        <Skeleton className="h-8 rounded" style={{ width: '80%', marginBottom: 8 }} />
        <Skeleton className="h-3 rounded" style={{ width: '30%', marginBottom: 32 }} />
        <Skeleton className="rounded" style={{ width: '100%', height: 200 }} />
        <style jsx>{`@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    )
  }

  // Not found
  if (item === null) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', animation: 'fadeIn 0.18s ease' }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Item not found</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>This item may have been deleted.</div>
        <Link href="/dashboard/library" style={{ fontSize: 13, color: 'var(--ember)', textDecoration: 'none' }}>← Back to Library</Link>
        <style jsx>{`@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    )
  }

  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.article!
  const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.queued!
  const wordCount = item.rawText ? item.rawText.split(/\s+/).length : 0
  const isLong = item.rawText && item.rawText.length > 5000
  const displayText = isLong && !expanded ? item.rawText!.substring(0, 2000) : item.rawText

  return (
    <div style={{ maxWidth: 780, animation: 'fadeIn 0.18s ease' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/dashboard/library" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.12s' }} className="breadcrumb-back">
            <svg width="12" height="12" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="7,2 3,6 7,10"/></svg>
            Library
          </Link>
          <span style={{ color: 'var(--text-faint)', fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, color: 'var(--text-primary)', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7,
              fontSize: 11, fontWeight: 500, border: '0.5px solid var(--border)', background: 'transparent',
              color: 'var(--text-muted)', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.14s',
            }} className="action-btn">
              <svg width="11" height="11" fill="none" viewBox="0 0 11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 3L4.5 6.5"/><polyline points="6,2 9,2 9,5"/><path d="M9 7v2a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1h2"/></svg>
              Open source ↗
            </a>
          )}
          <button onClick={handleDelete} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7,
            fontSize: 11, fontWeight: 500, border: '0.5px solid var(--border)', background: 'transparent',
            color: 'var(--text-faint)', cursor: 'pointer', transition: 'all 0.14s',
          }} className="delete-btn">
            <svg width="12" height="12" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <polyline points="3,4 4,12 10,12 11,4"/><line x1="2" y1="4" x2="12" y2="4"/><line x1="5.5" y1="2" x2="8.5" y2="2"/>
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Metadata header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: '2px 7px',
          borderRadius: 20, background: cfg.bg, color: cfg.stroke,
        }}>{cfg.label}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: statusCfg.color }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusCfg.color, ...(item.status === 'processing' ? { animation: 'pulse 1.5s ease-in-out infinite' } : {}) }} />
          {statusCfg.label}
        </span>
      </div>

      <h1 style={{
        fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(24px, 3vw, 32px)',
        fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.02em',
        lineHeight: 1.3, marginBottom: 8,
      }}>{item.title}</h1>

      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'var(--ember)',
          textDecoration: 'none', marginBottom: 4, transition: 'opacity 0.12s',
        }} className="source-link">
          <svg width="12" height="12" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 7a2.5 2.5 0 003.54 0l1.25-1.25a2.5 2.5 0 00-3.54-3.54L5.63 2.83"/><path d="M7 5a2.5 2.5 0 00-3.54 0L2.21 6.25a2.5 2.5 0 003.54 3.54L6.38 9.17"/></svg>
          {item.url.replace(/^https?:\/\/(www\.)?/, '')}
        </a>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 0 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Saved {timeAgo(item._creationTime)}</span>
        {wordCount > 0 && (
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
            {wordCount.toLocaleString()} words
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', margin: '24px 0' }} />

      {/* Summary (Phase E) */}
      {item.summary && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--ember)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Summary</div>
          <div style={{
            background: 'var(--ember-muted)', borderLeft: '2px solid var(--ember)',
            padding: 16, borderRadius: '0 8px 8px 0', fontSize: 14,
            color: 'var(--text-primary)', lineHeight: 1.7,
          }}><p style={{ margin: 0 }}>{item.summary}</p></div>
        </div>
      )}

      {/* Tags (Phase E) */}
      {item.tags && item.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {item.tags.map((tag: string, i: number) => (
            <span key={i} style={{
              background: 'var(--bg-surface)', border: '0.5px solid var(--border)',
              color: 'var(--text-muted)', padding: '4px 10px', borderRadius: 6, fontSize: 12,
            }}>{tag}</span>
          ))}
        </div>
      )}

      {/* Content body */}
      {item.rawText ? (
        <div style={{ maxWidth: 720 }}>
          <div className="prose prose-invert prose-sm max-w-none" style={{ lineHeight: 1.8 }}>
            <ReactMarkdown>{displayText ?? ''}</ReactMarkdown>
          </div>
          {isLong && !expanded && (
            <button onClick={() => setExpanded(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '7px 14px',
              borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              border: '0.5px solid var(--border)', background: 'var(--bg-surface)',
              color: 'var(--ember)', marginTop: 8,
            }}>
              Read more ↓
            </button>
          )}
        </div>
      ) : item.status === 'processing' ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF9F27', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>Content is being processed…</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 340, margin: '0 auto' }}>
            Our AI pipeline is extracting and indexing this content. Check back shortly.
          </p>
        </div>
      ) : item.status === 'error' ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#E24B4A', marginBottom: 8 }}>Failed to process this item</div>
          {item.errorMessage && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{item.errorMessage}</p>}
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--ember)', textDecoration: 'none' }}>View original source →</a>
          )}
        </div>
      ) : (
        /* Queued / no content */
        <div style={{ maxWidth: 400, margin: '0 auto', border: '1px dashed var(--border)', borderRadius: 12, padding: 48, textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--ember-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 16 16" stroke="var(--ember)" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="8" cy="8" r="6"/><polyline points="8,4 8,8 11,9.5"/>
            </svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Content not yet available</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
            This item will be scraped and indexed when the AI pipeline is active.
          </div>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 16px', borderRadius: 7,
              fontSize: 13, fontWeight: 500, border: '0.5px solid var(--border)', background: 'transparent',
              color: 'var(--ember)', textDecoration: 'none', cursor: 'pointer',
            }}>
              View original source →
            </a>
          )}
        </div>
      )}

      {/* Bottom action bar */}
      <div style={{ borderTop: '1px solid var(--border)', margin: '32px 0 0', padding: '16px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 7,
            fontSize: 12, fontWeight: 500, border: '0.5px solid var(--border)', background: 'transparent',
            color: 'var(--text-primary)', textDecoration: 'none', cursor: 'pointer',
          }}>
            Open source ↗
          </a>
        )}
        <button disabled title="Coming in Phase E" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 7,
          fontSize: 12, fontWeight: 500, border: 'none', cursor: 'not-allowed', opacity: 0.5,
          background: 'var(--ember)', color: '#fff',
        }}>
          Add to Canvas →
        </button>
        <button onClick={handleDelete} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 7,
          fontSize: 12, fontWeight: 500, border: '0.5px solid var(--border)', background: 'transparent',
          color: '#E24B4A', cursor: 'pointer', marginLeft: 'auto',
        }}>
          Delete
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .breadcrumb-back:hover { color: var(--text-primary) !important; }
        .source-link:hover { opacity: 0.8; text-decoration: underline !important; }
        .action-btn:hover { background: var(--bg-surface) !important; color: var(--text-primary) !important; }
        .delete-btn:hover { background: rgba(226,75,74,0.08) !important; color: #E24B4A !important; }
      `}</style>
    </div>
  )
}
