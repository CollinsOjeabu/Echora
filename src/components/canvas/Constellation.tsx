'use client'

import { useMemo, useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { Id } from '../../../convex/_generated/dataModel'
import { EmptyState } from './EmptyState'

/* ─── Types ─── */
interface ContentNode {
  _id: Id<'contentItems'>
  title: string
  type: string
}

interface GraphEdge {
  _id: string
  sourceA: string
  sourceB: string
  similarity: number
}

interface ConstellationProps {
  nodes: ContentNode[]
  edges: GraphEdge[]
  selectedIds: Set<string>
  onToggleNode: (id: string) => void
  canvasState: 'constellation' | 'session' | 'post-preview'
  onStartSession: () => void
  onSynthesise: () => void
  onGeneratePost: () => void
  sourcesCount: number
}



/* ─── Source Node (satellites) ─── */
function SourceNodeComponent({ data }: NodeProps) {
  const isSelected = (data as Record<string, unknown>).isSelected as boolean
  const isActiveSession = (data as Record<string, unknown>).isActiveSession as boolean
  const title = (data as Record<string, unknown>).title as string

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
      <svg width="28" height="28" viewBox="0 0 28 28" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="ember-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="var(--ember)" floodOpacity="0.35" />
          </filter>
        </defs>
        {/* Aura */}
        {isSelected && (
          <circle cx="14" cy="14" r="14" fill="rgba(255,107,53,0.055)" />
        )}
        {/* Rim */}
        {isSelected && (
          <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(255,107,53,0.18)" strokeWidth="0.5" />
        )}
        {/* Inner circle */}
        <circle
          cx="14" cy="14" r="9.5"
          fill={isSelected ? 'var(--ember-muted)' : 'var(--bg-page)'}
          stroke={isSelected ? 'var(--ember)' : 'var(--border)'}
          strokeWidth={isSelected ? 1 : 0.75}
          filter={isSelected && isActiveSession ? 'url(#ember-glow)' : undefined}
        />
        {/* Center dot */}
        <circle
          cx="14" cy="14" r="3.5"
          fill={isSelected ? 'var(--ember)' : 'var(--text-muted)'}
        />
      </svg>
      <span className="font-mono" style={{
        fontSize: 8,
        color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
        maxWidth: 90, textAlign: 'center',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        transition: 'color 150ms ease',
      }}>
        {title}
      </span>
    </div>
  )
}

const nodeTypes = {
  sourceNode: SourceNodeComponent,
}

/* ─── Layout algorithm ─── */
function computeLayout(
  nodes: ContentNode[],
  edges: GraphEdge[],
  selectedIds: Set<string>,
  isActiveSession: boolean,
  cx: number, cy: number, radius: number,
): Node[] {
  if (nodes.length === 0) return []

  const rfNodes: Node[] = []

  // Calculate degree for each node
  const degreeMap = new Map<string, number>()
  for (const node of nodes) degreeMap.set(String(node._id), 0)
  for (const edge of edges) {
    degreeMap.set(edge.sourceA, (degreeMap.get(edge.sourceA) ?? 0) + 1)
    degreeMap.set(edge.sourceB, (degreeMap.get(edge.sourceB) ?? 0) + 1)
  }

  // Sort by degree descending
  const sorted = [...nodes].sort((a, b) => {
    const degA = degreeMap.get(String(a._id)) ?? 0
    const degB = degreeMap.get(String(b._id)) ?? 0
    return degB - degA
  })

  if (sorted.length === 1) {
    rfNodes.push({
      id: String(sorted[0]._id),
      type: 'sourceNode',
      position: { x: cx - 14, y: cy - 80 },
      data: { 
        title: sorted[0].title, 
        type: sorted[0].type, 
        isSelected: selectedIds.has(String(sorted[0]._id)),
        isActiveSession,
      },
      draggable: false,
      selectable: false,
    })
    return rfNodes
  }

  const angleStep = (2 * Math.PI) / sorted.length
  const startAngle = -Math.PI / 2

  sorted.forEach((node, i) => {
    const angle = startAngle + i * angleStep
    rfNodes.push({
      id: String(node._id),
      type: 'sourceNode',
      position: {
        x: cx + radius * Math.cos(angle) - 14,
        y: cy + radius * Math.sin(angle) - 14,
      },
      data: {
        title: node.title,
        type: node.type,
        isSelected: selectedIds.has(String(node._id)),
        isActiveSession,
      },
      draggable: false,
      selectable: false,
    })
  })

  return rfNodes
}

/* ─── Compute edges ─── */
function computeEdges(graphEdges: GraphEdge[], selectedIds: Set<string>): Edge[] {
  const edges: Edge[] = []

  // Graph edges
  for (const ge of graphEdges) {
    const bothSelected = selectedIds.has(ge.sourceA) && selectedIds.has(ge.sourceB)
    edges.push({
      id: ge._id,
      source: ge.sourceA,
      target: ge.sourceB,
      style: {
        stroke: bothSelected ? 'var(--ember)' : 'var(--border)',
        strokeWidth: bothSelected ? 1 : 0.75,
        strokeDasharray: bothSelected ? undefined : '3 5',
        opacity: bothSelected ? 0.45 : 0.6,
      },
      animated: false,
    })
  }

  return edges
}

/* ─── Toolbar ─── */
function CanvasToolbar({ onSynthesise, canvasState }: { onSynthesise: () => void; canvasState: string }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow()
  const [activeTool, setActiveTool] = useState<'select' | 'pan'>('select')

  const tools = [
    { id: 'select' as const, label: 'Select' },
    { id: 'pan' as const, label: 'Pan' },
  ]

  const actions = [
    { label: 'Zoom+', action: () => zoomIn() },
    { label: 'Zoom−', action: () => zoomOut() },
    { label: 'Fit', action: () => fitView({ padding: 0.3 }) },
  ]

  return (
    <div style={{
      position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
      zIndex: 10, display: 'flex', alignItems: 'center', gap: 1,
      background: 'var(--bg-surface)', border: '0.5px solid var(--border)',
      borderRadius: 6, padding: '3px 4px',
    }}>
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setActiveTool(tool.id)}
          className="font-mono"
          style={{
            fontSize: 9.5, padding: '4px 8px', borderRadius: 4,
            border: 'none', cursor: 'pointer',
            background: activeTool === tool.id ? 'var(--bg-elevated)' : 'transparent',
            color: activeTool === tool.id ? 'var(--text-primary)' : 'var(--text-muted)',
            transition: 'all 100ms ease',
          }}
        >
          {tool.label}
        </button>
      ))}

      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.action}
          className="font-mono"
          style={{
            fontSize: 9.5, padding: '4px 8px', borderRadius: 4,
            border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'var(--text-muted)',
            transition: 'all 100ms ease',
          }}
        >
          {action.label}
        </button>
      ))}

      <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.06)', margin: '0 2px' }} />

      <button
        className="font-mono"
        style={{
          fontSize: 9.5, padding: '4px 8px', borderRadius: 4,
          border: 'none', cursor: 'pointer',
          background: 'transparent', color: 'var(--text-muted)',
        }}
      >
        Graph
      </button>

      <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.06)', margin: '0 2px' }} />

      <button
        onClick={onSynthesise}
        style={{
          fontSize: 9.5, padding: '4px 8px', borderRadius: 4,
          border: 'none', cursor: 'pointer',
          background: 'rgba(255,107,53,0.12)', color: 'var(--ember)',
        }}
      >
        💡
      </button>
    </div>
  )
}

/* ─── Inner component (needs ReactFlowProvider) ─── */
function ConstellationInner({
  nodes, edges, selectedIds, onToggleNode,
  canvasState, onStartSession, onSynthesise, onGeneratePost, sourcesCount,
}: ConstellationProps) {
  const radius = Math.min(220, Math.max(100, nodes.length * 28))
  const cx = 350
  const cy = 260

  const rfNodes = useMemo(
    () => computeLayout(nodes, edges, selectedIds, canvasState === 'session', cx, cy, radius),
    [nodes, edges, selectedIds, canvasState, cx, cy, radius],
  )

  const rfEdges = useMemo(
    () => computeEdges(edges, selectedIds),
    [edges, selectedIds],
  )

  const edgeCount = edges.length
  const insightCount = Math.min(edges.length, 3)

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.id !== 'synthesis') {
        onToggleNode(node.id)
      }
    },
    [onToggleNode],
  )

  if (nodes.length === 0) {
    return (
      <EmptyState
        headline="Your constellation is quiet."
        body="Add research to your library to see connections appear here."
        icon={
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-lg)',
            background: 'var(--ember-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--ember)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" /><circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" />
              <circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" />
              <line x1="9.5" y1="10.5" x2="6.5" y2="7.5" /><line x1="14.5" y1="10.5" x2="17.5" y2="7.5" />
              <line x1="9.5" y1="13.5" x2="6.5" y2="16.5" /><line x1="14.5" y1="13.5" x2="17.5" y2="16.5" />
            </svg>
          </div>
        }
      />
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Toolbar */}
      <CanvasToolbar onSynthesise={onSynthesise} canvasState={canvasState} />

      {/* Insight bubble */}
      {selectedIds.size > 0 && (
        <div style={{
          position: 'absolute', top: 14, right: 14, zIndex: 10,
          background: 'var(--bg-surface)', border: '0.5px solid rgba(255,107,53,0.22)',
          borderRadius: 6, padding: '8px 10px', maxWidth: 120,
        }}>
          <div className="font-mono" style={{ fontSize: 7, color: 'var(--ember)', opacity: 0.65, marginBottom: 4 }}>
            💡 INSIGHT
          </div>
          <div style={{ fontSize: 9.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {selectedIds.size > 1
              ? 'Select sources to reveal connections'
              : 'Select sources to reveal connections'}
          </div>
        </div>
      )}

      {/* Graph */}
      <ReactFlow
        key={`constellation-${rfNodes.length}-${rfEdges.length}-${selectedIds.size}`}
        nodes={rfNodes}
        edges={rfEdges}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        zoomOnScroll
        zoomOnDoubleClick={false}
        panOnDrag
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.4}
        maxZoom={2}
        style={{ background: 'var(--bg-page)' }}
      >
        <Background color="var(--border)" gap={28} size={0.5} variant={'dots' as never} />
      </ReactFlow>

      {/* Connections pill */}
      <div style={{
        position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10,
        background: 'var(--bg-surface)', border: '0.5px solid var(--border)',
        borderRadius: 8, padding: '4px 12px',
      }}>
        <span className="font-mono" style={{ fontSize: 7.5, color: 'var(--text-muted)' }}>
          {edgeCount} connections found
        </span>
      </div>

      {/* Status bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        background: 'var(--bg-surface)', borderTop: '0.5px solid var(--border)',
        padding: '8px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span className="font-mono" style={{ fontSize: 8.5, color: 'var(--text-muted)' }}>
          {nodes.length} sources · {edgeCount} connections · {insightCount} insights
        </span>

        {canvasState === 'session' && (
          <button
            onClick={onGeneratePost}
            style={{
              background: 'var(--ember)',
              color: 'var(--bg-page)',
              border: 'none', borderRadius: 4,
              padding: '6px 14px', fontSize: 10.5, fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-inter), sans-serif',
              transition: 'all 150ms ease',
            }}
          >
            Synthesise →
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Wrapper with provider ─── */
export function Constellation(props: ConstellationProps) {
  return (
    <ReactFlowProvider>
      <ConstellationInner {...props} />
    </ReactFlowProvider>
  )
}
