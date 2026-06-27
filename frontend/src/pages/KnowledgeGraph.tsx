import { useState } from 'react'
import { motion } from 'framer-motion'

const knowledgeNodes = [
  { id: 1, name: 'JavaScript', category: 'Frontend', level: 3, connections: [2, 3, 4] },
  { id: 2, name: 'React', category: 'Frontend', level: 0, connections: [1, 5] },
  { id: 3, name: 'TypeScript', category: 'Frontend', level: 0, connections: [1] },
  { id: 4, name: 'Node.js', category: 'Backend', level: 0, connections: [1, 6] },
  { id: 5, name: 'Next.js', category: 'Frontend', level: 0, connections: [2] },
  { id: 6, name: 'Express', category: 'Backend', level: 0, connections: [4] },
  { id: 7, name: 'Python', category: 'Backend', level: 2, connections: [8, 9] },
  { id: 8, name: 'Django', category: 'Backend', level: 0, connections: [7] },
  { id: 9, name: 'Machine Learning', category: 'AI', level: 0, connections: [7] },
  { id: 10, name: 'Docker', category: 'DevOps', level: 1, connections: [11] },
  { id: 11, name: 'Kubernetes', category: 'DevOps', level: 0, connections: [10] },
  { id: 12, name: 'PostgreSQL', category: 'Database', level: 2, connections: [4, 6] },
]

const categories: Record<string, string> = {
  Frontend: '#facc15',
  Backend: '#34d399',
  AI: '#a855f7',
  DevOps: '#22d3ee',
  Database: '#3b82f6'
}

export default function KnowledgeGraph() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [selectedNode, setSelectedNode] = useState<typeof knowledgeNodes[0] | null>(null)

  // Simple circular layout
  const centerX = 300
  const centerY = 250
  const radius = 160

  const getNodePosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    }
  }

  const total = knowledgeNodes.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span style={{ color: '#3b82f6' }}>⬢</span> خريطة المعرفة
        </motion.h2>
        <p className="section-subtitle">
          شوف كيف تترابط المهارات مع بعض
        </p>
      </div>

      {/* Category Legend */}
      <motion.div 
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {Object.entries(categories).map(([cat, color]) => (
          <span key={cat} className="tag" style={{ 
            borderColor: `${color}40`,
            color: color,
            background: `${color}10`
          }}>
            {cat}
          </span>
        ))}
      </motion.div>

      {/* Graph */}
      <motion.div
        className="glass"
        style={{ padding: 24, overflow: 'hidden' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <svg width="100%" height="500" viewBox="0 0 600 500" style={{ maxWidth: 600 }}>
          {/* Connections */}
          {knowledgeNodes.map(node => 
            node.connections.map(connId => {
              const target = knowledgeNodes.find(n => n.id === connId)
              if (!target) return null
              const pos1 = node.connections.indexOf(connId) >= 0 
                ? getNodePosition(knowledgeNodes.indexOf(node), total) 
                : { x: centerX, y: centerY }
              const pos2 = getNodePosition(knowledgeNodes.indexOf(target), total)
              const isHighlighted = hoveredNode === node.id || hoveredNode === connId
              
              return (
                <line
                  key={`${node.id}-${connId}`}
                  x1={pos1.x}
                  y1={pos1.y}
                  x2={pos2.x}
                  y2={pos2.y}
                  stroke={isHighlighted ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.08)'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  style={{ transition: 'all 0.3s' }}
                />
              )
            })
          )}

          {/* Nodes */}
          {knowledgeNodes.map((node, i) => {
            const pos = getNodePosition(i, total)
            const color = categories[node.category] || '#888'
            const isHovered = hoveredNode === node.id
            const isLearned = node.level > 0

            return (
              <g key={node.id}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? 28 : 22}
                  fill={isLearned ? `${color}30` : 'rgba(255,255,255,0.03)'}
                  stroke={isLearned ? color : 'rgba(255,255,255,0.15)'}
                  strokeWidth={isHovered ? 3 : 2}
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(node)}
                />
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isLearned ? color : 'var(--text-muted)'}
                  fontSize={isHovered ? 13 : 11}
                  fontWeight={isHovered ? 800 : 600}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {node.name.length > 10 ? node.name.substring(0, 8) + '..' : node.name}
                </text>
                {isLearned && (
                  <text
                    x={pos.x}
                    y={pos.y + 38}
                    textAnchor="middle"
                    fill={color}
                    fontSize={10}
                    fontWeight={700}
                    style={{ pointerEvents: 'none' }}
                  >
                    Lv.{node.level}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </motion.div>

      {/* Selected Node Info */}
      {selectedNode && (
        <motion.div
          className="glass"
          style={{ padding: 20 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: `${categories[selectedNode.category]}20`,
              border: `1px solid ${categories[selectedNode.category]}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 900,
              color: categories[selectedNode.category]
            }}>
              {selectedNode.name.charAt(0)}
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 800 }}>{selectedNode.name}</h4>
              <span className="tag tag-blue" style={{ fontSize: 11 }}>{selectedNode.category}</span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
            المستوى: {selectedNode.level > 0 ? `Level ${selectedNode.level}` : 'لم تبدأ بعد'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            المهارات المرتبطة: {selectedNode.connections.map(id => 
              knowledgeNodes.find(n => n.id === id)?.name
            ).join(', ')}
          </p>
        </motion.div>
      )}
    </div>
  )
}
