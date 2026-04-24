'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useCurrentUser } from '@/hooks/useCurrentUser'

function SkeletonBar({ width, height }: { width: number; height: number }) {
  return (
    <div style={{
      width, height, borderRadius: 4,
      background: 'var(--bg-elevated)',
      animation: 'pulse 1.5s ease-in-out infinite',
    }} />
  )
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

export default function DashboardHome() {
  const { profile, isLoading: userLoading } = useCurrentUser()

  // Queries — skip until profile is loaded
  const contentItems = useQuery(
    api.content.list,
    profile?._id ? { userId: profile._id } : 'skip'
  )
  const agentPosts = useQuery(
    api.posts.list,
    profile?._id ? { userId: profile._id } : 'skip'
  )

  // Derived data
  const firstName = profile?.name?.split(' ')[0] ?? ''
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  // Stats
  const libraryCount = contentItems?.length ?? 0
  const publishedPosts = agentPosts?.filter((p: { status: string }) => p.status === 'published') ?? []
  const publishedCount = publishedPosts.length

  // Agent drafts
  const pendingDrafts = agentPosts?.filter((p: { status: string }) => p.status === 'draft' || p.status === 'review') ?? []
  const linkedinDrafts = pendingDrafts.filter((p: { platform: string }) => p.platform === 'linkedin')
  const xDrafts = pendingDrafts.filter((p: { platform: string }) => p.platform === 'x')

  // Loading states
  const statsLoading = contentItems === undefined || agentPosts === undefined
  const postsLoading = agentPosts === undefined

  return (
    <div style={{ animation: 'fadeIn 0.18s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          {userLoading ? (
            <SkeletonBar width={180} height={24} />
          ) : (
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 21, color: 'var(--text-primary)', marginBottom: 2 }}>
              {greeting}, <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>{firstName}.</em>
            </div>
          )}
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-faint)', marginTop: 4 }}>
            {dateStr}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          <Link href="/dashboard/library" className="btn-sec" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '0.5px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>Add to library</Link>
          <Link href="/dashboard/canvas" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'var(--ember)', color: '#fff', fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>New synthesis</Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
        {/* Library items */}
        <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 7 }}>Library items</div>
          {statsLoading ? (
            <SkeletonBar width={40} height={28} />
          ) : (
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 5 }}>
              <span style={{ color: 'var(--ember)' }}>{libraryCount}</span>
            </div>
          )}
        </div>

        {/* Graph connections */}
        <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 7 }}>Graph connections</div>
          {statsLoading ? (
            <SkeletonBar width={40} height={28} />
          ) : (
            <>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 5 }}>
                <span style={{ color: 'var(--ember)' }}>0</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-faint)', lineHeight: 1.4 }}>Builds as your library grows</div>
            </>
          )}
        </div>

        {/* Posts published */}
        <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 7 }}>Posts published</div>
          {statsLoading ? (
            <SkeletonBar width={40} height={28} />
          ) : (
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 5 }}>
              <span style={{ color: 'var(--ember)' }}>{publishedCount}</span>
            </div>
          )}
        </div>

        {/* Avg voice match */}
        <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 7 }}>Avg voice match</div>
          {statsLoading ? (
            <SkeletonBar width={40} height={28} />
          ) : (
            <>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 5 }}>
                <span style={{ color: 'var(--text-faint)' }}>–</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-faint)', lineHeight: 1.4 }}>Train your voice to see this</div>
            </>
          )}
        </div>
      </div>

      {/* Two column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Left — Content ideas / empty state */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>
            Content ideas
          </div>

          {statsLoading ? (
            <div style={{ background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: 10, padding: 20 }}>
              <SkeletonBar width={200} height={14} />
              <div style={{ marginTop: 8 }}><SkeletonBar width={280} height={10} /></div>
            </div>
          ) : libraryCount >= 3 ? (
            /* Has enough items — show synthesis prompt */
            <div style={{
              background: 'var(--bg-elevated)', border: '0.5px solid var(--border)',
              borderRadius: 10, padding: 16,
            }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontSize: 14, color: 'var(--text-primary)', marginBottom: 6 }}>
                You have {libraryCount} research items ready to synthesise
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
                Open the Canvas to connect your sources and generate content.
              </div>
              <Link href="/dashboard/canvas" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', border: 'none', background: 'var(--ember)',
                color: '#fff', fontFamily: "'Inter', sans-serif", textDecoration: 'none',
              }}>
                Open Canvas →
              </Link>
            </div>
          ) : (
            /* Empty / not enough items — show onboarding prompt */
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px dashed var(--border)',
              borderRadius: 10, padding: 20, textAlign: 'center',
            }}>
              {/* BookOpen icon */}
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" style={{ margin: '0 auto 10px', display: 'block', opacity: 0.5 }}>
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z"/>
              </svg>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
                Add research to get started
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14, maxWidth: 300, margin: '0 auto 14px' }}>
                Save articles, PDFs, or notes to your library.
                Once you have 3+ sources, the Canvas will suggest synthesis ideas.
              </div>
              <Link href="/dashboard/library" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', border: '0.5px solid var(--border)',
                background: 'var(--bg-elevated)', color: 'var(--text-primary)',
                fontFamily: "'Inter', sans-serif", textDecoration: 'none',
              }}>
                Add to library →
              </Link>
            </div>
          )}
        </div>

        {/* Right — Agents + Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>Agent status</div>

            {/* The Authority — LinkedIn */}
            <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--ember-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 16 16" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round"><path d="M2 14 C2 9 5 3 12 2"/><path d="M6 14 C6 10 8.5 6 12 5"/><line x1="4" y1="1.5" x2="7" y2="14.5" stroke="#EDE8E0" strokeWidth="1.2"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>The Authority</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    LinkedIn · {postsLoading ? '...' : linkedinDrafts.length > 0 ? `${linkedinDrafts.length} draft${linkedinDrafts.length > 1 ? 's' : ''} pending` : 'No drafts'}
                  </div>
                </div>
                {postsLoading ? (
                  <SkeletonBar width={50} height={18} />
                ) : linkedinDrafts.length > 0 ? (
                  <span style={{ display: 'inline-flex', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: '2px 7px', borderRadius: 20, background: 'rgba(239,159,39,0.1)', color: 'var(--warning)' }}>Awaiting</span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: '2px 7px', borderRadius: 20, background: 'var(--success-muted)', color: 'var(--success)', border: '0.5px solid rgba(29,158,117,0.2)' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)' }}/>Ready
                  </span>
                )}
              </div>
              {linkedinDrafts.length > 0 ? (
                <Link href="/dashboard/agents" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '0.5px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', width: '100%', fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>Review drafts →</Link>
              ) : (
                <Link href="/dashboard/canvas" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '0.5px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', width: '100%', fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>Generate from Canvas →</Link>
              )}
            </div>

            {/* The Catalyst — X */}
            <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: 12, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(55,138,221,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 16 16" stroke="#378ADD" strokeWidth="1.5" strokeLinecap="round"><path d="M2 14 C2 9 5 3 12 2"/><path d="M6 14 C6 10 8.5 6 12 5"/><line x1="4" y1="1.5" x2="7" y2="14.5" stroke="#EDE8E0" strokeWidth="1.2"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>The Catalyst</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    X/Twitter · {postsLoading ? '...' : xDrafts.length > 0 ? `${xDrafts.length} draft${xDrafts.length > 1 ? 's' : ''} pending` : 'No drafts'}
                  </div>
                </div>
                {postsLoading ? (
                  <SkeletonBar width={50} height={18} />
                ) : xDrafts.length > 0 ? (
                  <span style={{ display: 'inline-flex', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: '2px 7px', borderRadius: 20, background: 'rgba(239,159,39,0.1)', color: 'var(--warning)' }}>Awaiting</span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: '2px 7px', borderRadius: 20, background: 'var(--success-muted)', color: 'var(--success)', border: '0.5px solid rgba(29,158,117,0.2)' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)' }}/>Ready
                  </span>
                )}
              </div>
              {xDrafts.length > 0 ? (
                <Link href="/dashboard/agents" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '0.5px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', width: '100%', fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>Review drafts →</Link>
              ) : (
                <Link href="/dashboard/canvas" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '0.5px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', width: '100%', fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>Generate from Canvas →</Link>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>Recent activity</div>
            <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: 12, padding: 18 }}>
              {postsLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <SkeletonBar width={260} height={12} />
                  <SkeletonBar width={200} height={12} />
                </div>
              ) : publishedPosts.length > 0 ? (
                /* Show up to 3 most recent published posts */
                publishedPosts.slice(0, 3).map((post: { _id: string; body: string; platform: string; publishedAt?: number }, i: number) => (
                  <div key={post._id} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '9px 0', borderBottom: i < Math.min(publishedPosts.length, 3) - 1 ? '0.5px solid var(--border)' : 'none' }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--success-muted)' }}>
                      <svg width="12" height="12" fill="none" viewBox="0 0 13 13" stroke="var(--success)" strokeWidth="1.5"><circle cx="6.5" cy="6.5" r="5"/><path d="M4 6.5l2 2 3-3"/></svg>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>
                      <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Post published</strong> — &quot;{post.body.length > 60 ? post.body.slice(0, 60) + '...' : post.body}&quot; on {post.platform === 'linkedin' ? 'LinkedIn' : 'X'}
                    </div>
                    {post.publishedAt && (
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-faint)' }}>
                        {formatRelativeTime(post.publishedAt)}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                /* Empty state */
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 0' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--bg-elevated)' }}>
                    {/* Zap icon */}
                    <svg width="12" height="12" fill="none" viewBox="0 0 13 13" stroke="var(--text-faint)" strokeWidth="1.5" strokeLinecap="round"><path d="M7 1L3 7.5h3.5L5.5 12 10 5.5H6.5L7 1z"/></svg>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Your activity will appear here once you start publishing.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .btn-sec:hover { border-color: var(--border-hover) !important; background: var(--bg-hover) !important; }
      `}</style>
    </div>
  )
}
