'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useAction } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Id } from '../../../../convex/_generated/dataModel'
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

/* ─── Type color map ─── */
const TYPE_COLORS: Record<string, string> = {
  article: 'var(--success)',
  note: 'var(--warning)',
  video: 'var(--info)',
  tweet: 'var(--ember)',
  pdf: 'var(--info)',
}

/* ─── Source Node Component ─── */
function SourceNode({ data }: { data: { title: string; type: string } }) {
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '12px 16px',
      minWidth: 180,
      maxWidth: 240,
    }}>
      <div style={{
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.08em',
        color: TYPE_COLORS[data.type] || 'var(--cream-muted)',
        marginBottom: 6,
      }}>
        {data.type}
      </div>
      <div style={{
        fontSize: 13,
        color: 'var(--text-primary)',
        lineHeight: 1.4,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical' as const,
      }}>
        {data.title}
      </div>
    </div>
  )
}

const nodeTypes = { source: SourceNode }

/* ─── Main Page ─── */
export default function CanvasPage() {
  const { profile, isLoading: userLoading } = useCurrentUser()
  const userId = profile?._id

  /* ─── State ─── */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [activeSessionId, setActiveSessionId] = useState<Id<'canvasSessions'> | null>(null)
  const [sessionState, setSessionState] = useState<'idle' | 'loading' | 'active'>('idle')
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'agent' | 'system'; content: string }>>([])
  const [chatInput, setChatInput] = useState('')
  const [showRecentSessions, setShowRecentSessions] = useState(false)
  const chatBodyRef = useRef<HTMLDivElement>(null)

  /* ─── React Flow state ─── */
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, , onEdgesChange] = useEdgesState<Edge>([])

  /* ─── Convex queries ─── */
  const contentItems = useQuery(
    api.content.list,
    userId ? { userId } : 'skip',
  )
  const sessions = useQuery(api.canvas.listSessions)
  const activeSession = useQuery(
    api.canvas.getSession,
    activeSessionId ? { sessionId: activeSessionId } : 'skip',
  )

  /* ─── Convex mutations & actions ─── */
  const createSession = useMutation(api.canvas.createSession)
  const deleteSessionMut = useMutation(api.canvas.deleteSession)
  const sendMessageAction = useAction(api.canvasChat.sendMessage)
  const generatePostAction = useAction(api.generation.generatePost)
  const [isSending, setIsSending] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [genInstruction, setGenInstruction] = useState('')
  const [genToast, setGenToast] = useState<string | null>(null)

  /* ─── Build React Flow nodes from active session sources ─── */
  const sessionSourceItems = useMemo(() => {
    if (!activeSession || !contentItems) return []
    const idSet = new Set(activeSession.sourceIds.map(String))
    return contentItems.filter((item) => idSet.has(String(item._id)))
  }, [activeSession, contentItems])

  useEffect(() => {
    if (sessionState !== 'active' || sessionSourceItems.length === 0) return

    const cols = Math.ceil(Math.sqrt(sessionSourceItems.length))
    const newNodes: Node[] = sessionSourceItems.map((item, i) => ({
      id: String(item._id),
      type: 'source',
      position: {
        x: (i % cols) * 280 + Math.random() * 30,
        y: Math.floor(i / cols) * 140 + Math.random() * 20,
      },
      data: { title: item.title, type: item.type },
      draggable: true,
    }))
    setNodes(newNodes)
  }, [sessionSourceItems, sessionState, setNodes])

  /* ─── Restore session from chatHistory ─── */
  useEffect(() => {
    if (activeSession?.chatHistory && activeSession.chatHistory.length > 0 && sessionState === 'active') {
      const existingMessages = activeSession.chatHistory.map((m) => ({
        role: m.role as 'user' | 'agent',
        content: m.content,
      }))
      // Prepend the greeting if missing
      if (existingMessages[0]?.role !== 'agent' || !existingMessages[0]?.content.includes('read all')) {
        setChatMessages([
          { role: 'agent', content: `I've read all ${activeSession.sourceIds.length} sources. What angle are you exploring?` },
          ...existingMessages,
        ])
      } else {
        setChatMessages(existingMessages)
      }
    }
  }, [activeSession, sessionState])

  /* ─── Auto-scroll chat ─── */
  useEffect(() => {
    chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [chatMessages])

  /* ─── Toggle source selection ─── */
  const toggleSource = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  /* ─── Start a new session ─── */
  const handleStartSession = useCallback(async () => {
    if (selectedIds.size === 0) return
    setSessionState('loading')

    const sourceIds = Array.from(selectedIds) as Id<'contentItems'>[]
    const sessionId = await createSession({
      name: `Session · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      sourceIds,
    })

    setActiveSessionId(sessionId)

    // Simulate "reading sources" animation
    const sourceNames = contentItems
      ?.filter((item) => selectedIds.has(String(item._id)))
      .map((item) => item.title) ?? []

    setChatMessages([])
    for (let i = 0; i < sourceNames.length; i++) {
      await new Promise((r) => setTimeout(r, 300))
      setChatMessages((prev) => [
        ...prev,
        { role: 'system', content: `Reading: ${sourceNames[i].slice(0, 50)}...` },
      ])
    }
    await new Promise((r) => setTimeout(r, 400))
    setChatMessages([
      { role: 'agent', content: `I've read all ${sourceNames.length} sources. What angle are you exploring?` },
    ])
    setSessionState('active')
  }, [selectedIds, createSession, contentItems])

  /* ─── Load a recent session ─── */
  const handleLoadSession = useCallback((sessionId: Id<'canvasSessions'>) => {
    setActiveSessionId(sessionId)
    setSessionState('active')
    setShowRecentSessions(false)
  }, [])

  /* ─── New session (reset) ─── */
  const handleNewSession = useCallback(() => {
    setActiveSessionId(null)
    setSessionState('idle')
    setChatMessages([])
    setSelectedIds(new Set())
    setNodes([])
  }, [setNodes])

  /* ─── Auto-scroll chat to bottom ─── */
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [chatMessages])

  /* ─── Send chat message via Claude ─── */
  const handleSend = useCallback(async () => {
    if (!chatInput.trim() || !activeSessionId || isSending) return
    const userMsg = chatInput.trim()
    setChatInput('')

    // Optimistic: show user message immediately
    setChatMessages((prev) => [...prev, { role: 'user', content: userMsg }])

    // Show typing indicator
    setIsSending(true)
    setChatMessages((prev) => [...prev, { role: 'agent', content: '...' }])

    try {
      const agentResponse = await sendMessageAction({
        sessionId: activeSessionId,
        message: userMsg,
      })

      // Replace ellipsis with real response
      setChatMessages((prev) => {
        const updated = [...prev]
        const typingIdx = updated.findLastIndex((m) => m.role === 'agent' && m.content === '...')
        if (typingIdx >= 0) {
          updated[typingIdx] = { role: 'agent', content: agentResponse }
        } else {
          updated.push({ role: 'agent', content: agentResponse })
        }
        return updated
      })
    } catch {
      // Replace typing indicator with error message
      setChatMessages((prev) => {
        const updated = [...prev]
        const typingIdx = updated.findLastIndex((m) => m.role === 'agent' && m.content === '...')
        if (typingIdx >= 0) {
          updated[typingIdx] = { role: 'agent', content: 'Sorry, I hit an error. Please try again.' }
        }
        return updated
      })
    } finally {
      setIsSending(false)
    }
  }, [chatInput, activeSessionId, isSending, sendMessageAction])

  /* ─── Loading state ─── */
  if (userLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--bg-page)' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading canvas...</div>
      </div>
    )
  }

  const recentSessions = sessions?.slice(0, 3) ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--bg-page)' }}>

      {/* ─── TopBar ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--ember)" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Canvas</span>
          {activeSession && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>
              · {activeSession.name}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
          {recentSessions.length > 0 && sessionState === 'idle' && (
            <button
              onClick={() => setShowRecentSessions(!showRecentSessions)}
              style={{
                background: 'transparent', border: '1px solid var(--border)', borderRadius: 6,
                color: 'var(--text-muted)', fontSize: 12, padding: '6px 12px', cursor: 'pointer',
                transition: '0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              Recent sessions ▾
            </button>
          )}

          {/* Recent sessions dropdown */}
          {showRecentSessions && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 4,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 8, padding: 4, minWidth: 220, zIndex: 50,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
              {recentSessions.map((s: { _id: Id<'canvasSessions'>; name: string; sourceIds: Id<'contentItems'>[] }) => (
                <button
                  key={String(s._id)}
                  onClick={() => handleLoadSession(s._id)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    background: 'transparent', border: 'none', borderRadius: 6,
                    padding: '8px 10px', cursor: 'pointer', color: 'var(--text-primary)',
                    fontSize: 13, transition: '0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {s.sourceIds.length} sources
                  </div>
                </button>
              ))}
            </div>
          )}

          {sessionState !== 'idle' && (
            <button
              onClick={handleNewSession}
              style={{
                background: 'var(--ember)', border: 'none', borderRadius: 6,
                color: '#fff', fontSize: 12, fontWeight: 600, padding: '6px 14px',
                cursor: 'pointer', transition: '0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#E85A28'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--ember)'}
            >
              + New Session
            </button>
          )}
        </div>
      </div>

      {/* ─── Three-panel layout ─── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ═══ Left: Sources Panel ═══ */}
        <div style={{
          width: 280, flexShrink: 0,
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Panel header */}
          <div style={{
            padding: '14px 16px 10px',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{
              fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const,
              letterSpacing: '0.1em', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              Sources
              {contentItems && (
                <span style={{
                  fontSize: 10, background: 'var(--bg-elevated)',
                  borderRadius: 4, padding: '1px 6px',
                  color: 'var(--text-muted)',
                }}>
                  {contentItems.length}
                </span>
              )}
            </div>
            {selectedIds.size > 0 && sessionState === 'idle' && (
              <div style={{ fontSize: 11, color: 'var(--ember)', marginTop: 4 }}>
                {selectedIds.size} selected
              </div>
            )}
          </div>

          {/* Source items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
            {!contentItems ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 56, borderRadius: 8,
                    background: 'var(--bg-elevated)',
                    marginBottom: 6, animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              ))
            ) : contentItems.length === 0 ? (
              // Empty state
              <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>📚</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
                  Add research to your Library first
                </div>
                <a
                  href="/dashboard/library/new"
                  style={{
                    fontSize: 12, color: 'var(--ember)',
                    textDecoration: 'underline', textUnderlineOffset: 3,
                  }}
                >
                  Add new item →
                </a>
              </div>
            ) : (
              contentItems.map((item: { _id: Id<'contentItems'>; title: string; type: string }) => {
                const isSelected = selectedIds.has(String(item._id))
                return (
                  <button
                    key={String(item._id)}
                    onClick={() => sessionState === 'idle' && toggleSource(String(item._id))}
                    disabled={sessionState !== 'idle'}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      width: '100%', textAlign: 'left',
                      background: isSelected ? 'var(--ember-muted)' : 'transparent',
                      border: 'none',
                      borderLeft: isSelected ? '3px solid var(--ember)' : '3px solid transparent',
                      borderRadius: 6, padding: '10px 10px', cursor: sessionState === 'idle' ? 'pointer' : 'default',
                      marginBottom: 2, transition: '0.2s ease',
                      opacity: sessionState !== 'idle' && !isSelected ? 0.4 : 1,
                    }}
                  >
                    {/* Checkbox */}
                    <div style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1,
                      border: isSelected ? 'none' : '1.5px solid var(--border)',
                      background: isSelected ? 'var(--ember)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: '0.2s ease',
                    }}>
                      {isSelected && (
                        <svg width="10" height="10" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.35,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const,
                        letterSpacing: '0.06em', marginTop: 3,
                        color: TYPE_COLORS[item.type] || 'var(--text-muted)',
                      }}>
                        {item.type}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {/* Start session button */}
          {sessionState === 'idle' && contentItems && contentItems.length > 0 && (
            <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={handleStartSession}
                disabled={selectedIds.size === 0}
                style={{
                  width: '100%', padding: '10px 0',
                  background: selectedIds.size === 0 ? 'var(--bg-elevated)' : 'var(--ember)',
                  color: selectedIds.size === 0 ? 'var(--text-muted)' : '#fff',
                  border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer',
                  transition: '0.2s ease',
                }}
              >
                Start Session → ({selectedIds.size})
              </button>
            </div>
          )}
        </div>

        {/* ═══ Center: Graph/Canvas Area ═══ */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {sessionState === 'idle' ? (
            /* Empty state */
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '100%', padding: 40, textAlign: 'center',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'var(--ember-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--ember)" strokeWidth="2" strokeLinecap="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                Select sources to begin
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 320, lineHeight: 1.6, margin: 0 }}>
                Choose research from the left panel. The agent will read everything before your conversation starts.
              </p>
            </div>
          ) : sessionState === 'loading' ? (
            /* Loading skeletons */
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 16, padding: 40,
              alignItems: 'flex-start', justifyContent: 'center',
            }}>
              {Array.from({ length: selectedIds.size }).map((_, i) => (
                <div key={i} style={{
                  width: 200, height: 80, borderRadius: 10,
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  animation: `pulse 1.5s ease-in-out infinite ${i * 150}ms`,
                }} />
              ))}
            </div>
          ) : (
            /* React Flow graph */
            <div style={{ width: '100%', height: '100%' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                proOptions={{ hideAttribution: true }}
                style={{ background: 'var(--bg-page)' }}
              >
                <Background color="var(--border)" gap={24} size={1} />
                <Controls
                  showInteractive={false}
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                  }}
                />
              </ReactFlow>
            </div>
          )}
        </div>

        {/* ═══ Right: Chat Panel ═══ */}
        <div style={{
          width: 360, flexShrink: 0,
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Chat header */}
          <div style={{
            padding: '14px 16px 10px',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{
              fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const,
              letterSpacing: '0.1em', color: 'var(--text-muted)',
            }}>
              {sessionState === 'active' ? 'The Authority' : 'Chat'}
            </div>
            {sessionState === 'active' && activeSession && (
              <div style={{
                fontSize: 11, color: 'var(--text-muted)', marginTop: 4,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{
                  display: 'inline-block', width: 6, height: 6,
                  borderRadius: '50%', background: 'var(--success)',
                }} />
                Reading {activeSession.sourceIds.length} sources
              </div>
            )}
          </div>

          {/* Chat body */}
          <div ref={chatBodyRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}>
            {sessionState === 'idle' ? (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100%', color: 'var(--text-muted)', fontSize: 13,
                fontStyle: 'italic',
              }}>
                Session will appear here
              </div>
            ) : sessionState === 'loading' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{
                    fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic',
                    display: 'flex', alignItems: 'center', gap: 8,
                    animation: 'fadeUp 0.3s ease both',
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--ember)', animation: 'pulse 1s ease-in-out infinite',
                    }} />
                    {msg.content}
                  </div>
                ))}
                <div style={{
                  fontSize: 12, color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', gap: 6, marginTop: 8,
                }}>
                  <span className="animate-pulse" style={{ color: 'var(--ember)' }}>●</span>
                  Reading sources...
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {chatMessages.map((msg, i) => {
                  const prevMsg = i > 0 ? chatMessages[i - 1] : null
                  const senderSwitch = !prevMsg || prevMsg.role !== msg.role
                  const isTyping = msg.role === 'agent' && msg.content === '...'

                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.role === 'user' ? 'flex-end' : msg.role === 'system' ? 'center' : 'flex-start',
                        marginTop: senderSwitch ? 16 : 6,
                      }}
                    >
                      {/* Agent label — show on first agent msg or after sender switch */}
                      {msg.role === 'agent' && senderSwitch && !isTyping && (
                        <div style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                          color: 'var(--ember)', letterSpacing: '0.08em',
                          textTransform: 'uppercase' as const, marginBottom: 4, paddingLeft: 2,
                        }}>
                          The Authority
                        </div>
                      )}

                      {msg.role === 'system' ? (
                        <div style={{
                          fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic',
                          textAlign: 'center', padding: '4px 12px',
                        }}>
                          {msg.content}
                        </div>
                      ) : isTyping ? (
                        /* Typing indicator */
                        <div style={{
                          maxWidth: '85%', padding: '10px 14px',
                          borderRadius: '2px 12px 12px 12px',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          display: 'flex', gap: 4, alignItems: 'center',
                        }}>
                          <span style={{ color: 'var(--ember)', fontSize: 14, animation: 'pulse 1s ease-in-out infinite' }}>●</span>
                          <span style={{ color: 'var(--ember)', fontSize: 14, animation: 'pulse 1s ease-in-out 0.3s infinite' }}>●</span>
                          <span style={{ color: 'var(--ember)', fontSize: 14, animation: 'pulse 1s ease-in-out 0.6s infinite' }}>●</span>
                        </div>
                      ) : msg.role === 'user' ? (
                        /* User bubble */
                        <div style={{
                          maxWidth: '80%', padding: '10px 14px',
                          borderRadius: '12px 12px 2px 12px',
                          fontSize: 14, lineHeight: 1.55,
                          background: 'rgba(255,107,53,0.12)',
                          border: '1px solid rgba(255,107,53,0.2)',
                          color: 'var(--text-primary)',
                        }}>
                          {msg.content}
                        </div>
                      ) : (
                        /* Agent bubble */
                        <div style={{
                          maxWidth: '85%', padding: '10px 14px',
                          borderRadius: '2px 12px 12px 12px',
                          fontSize: 14, lineHeight: 1.55,
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                        }}>
                          {msg.content}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Generate Post row */}
          {sessionState === 'active' && (
            <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)' }}>
              {genToast && (
                <div style={{
                  background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.25)',
                  borderRadius: 7, padding: '7px 12px', marginBottom: 8,
                  fontSize: 12, color: 'var(--ember)', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span>✓</span> {genToast}
                  <button onClick={() => setGenToast(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--ember)', cursor: 'pointer', fontSize: 14 }}>×</button>
                </div>
              )}
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={async () => {
                    if (!activeSessionId) return
                    setIsGenerating(true)
                    try {
                      const result = await generatePostAction({
                        sessionId: activeSessionId,
                        agent: 'authority',
                        platform: 'linkedin',
                        userInstruction: genInstruction || undefined,
                      })
                      setGenInstruction('')
                      setGenToast(`Draft sent to Agents — '${result.title}'. Voice match: ${result.voiceMatchScore}%`)
                      setChatMessages((prev) => [...prev, { role: 'agent', content: `✨ Draft created — "${result.title}". Voice match: ${result.voiceMatchScore}%. Review it in your Agents inbox →` }])
                    } catch (e) {
                      setGenToast(`Error: ${e instanceof Error ? e.message : 'Generation failed'}`)
                    } finally {
                      setIsGenerating(false)
                    }
                  }}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 7, border: 'none',
                    background: isGenerating ? 'var(--bg-elevated)' : 'var(--ember)',
                    color: isGenerating ? 'var(--text-muted)' : '#fff',
                    fontSize: 12, fontWeight: 600, cursor: isGenerating ? 'wait' : 'pointer',
                    fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    transition: 'all 0.14s',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 1v10M1 6l5-5 5 5" />
                  </svg>
                  {isGenerating ? 'Generating…' : 'Generate for LinkedIn'}
                </button>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={async () => {
                    if (!activeSessionId) return
                    setIsGenerating(true)
                    try {
                      const result = await generatePostAction({
                        sessionId: activeSessionId,
                        agent: 'catalyst',
                        platform: 'x',
                        userInstruction: genInstruction || undefined,
                      })
                      setGenInstruction('')
                      setGenToast(`Draft sent to Agents — '${result.title}'. Voice match: ${result.voiceMatchScore}%`)
                      setChatMessages((prev) => [...prev, { role: 'agent', content: `✨ Draft created — "${result.title}". Voice match: ${result.voiceMatchScore}%. Review it in your Agents inbox →` }])
                    } catch (e) {
                      setGenToast(`Error: ${e instanceof Error ? e.message : 'Generation failed'}`)
                    } finally {
                      setIsGenerating(false)
                    }
                  }}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 7,
                    border: '1px solid var(--border)', background: 'transparent',
                    color: isGenerating ? 'var(--text-muted)' : 'var(--text-primary)',
                    fontSize: 12, fontWeight: 500, cursor: isGenerating ? 'wait' : 'pointer',
                    fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    transition: 'all 0.14s',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 1l1.5 3.5L11 6l-3.5 1.5L6 11 4.5 7.5 1 6l3.5-1.5z" />
                  </svg>
                  {isGenerating ? 'Generating…' : 'Generate for X'}
                </button>
              </div>
              <input
                value={genInstruction}
                onChange={(e) => setGenInstruction(e.target.value)}
                placeholder="Any specific angle or instruction? (optional)"
                style={{
                  width: '100%', background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)', borderRadius: 7,
                  padding: '7px 10px', color: 'var(--text-primary)',
                  fontSize: 11, outline: 'none', marginBottom: 8,
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
          )}

          {/* Chat input */}
          {sessionState === 'active' && (
            <div style={{
              padding: '10px 12px', borderTop: '1px solid var(--border)',
              display: 'flex', gap: 8,
            }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask about your sources, explore angles, request a draft..."
                style={{
                  flex: 1, background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)', borderRadius: 8,
                  padding: '9px 12px', color: 'var(--text-primary)',
                  fontSize: 13, outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isSending || !chatInput.trim()}
                style={{
                  background: chatInput.trim() ? 'var(--ember)' : 'var(--bg-elevated)',
                  border: chatInput.trim() ? 'none' : '1px solid var(--border)',
                  borderRadius: 8, padding: '0 14px',
                  color: chatInput.trim() ? '#fff' : 'var(--text-muted)',
                  fontSize: 13, cursor: chatInput.trim() ? 'pointer' : 'default',
                  fontWeight: 600, transition: 'all 0.14s',
                }}
              >
                {isSending ? '...' : 'Send'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pulse animation for loading states */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
