import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ideas = [
  {
    id: 1,
    title: 'تطبيق إدارة المهام الذكي',
    description: 'تطبيق يستخدم AI لترتيب مهامك تلقائياً بناءً على أولويتك ووقتك المتاح',
    difficulty: 'متوسط',
    xp: 200,
    tags: ['React', 'Node.js', 'AI'],
    color: '#a855f7'
  },
  {
    id: 2,
    title: 'منصة تبادل المهارات',
    description: 'موقع يتيح للناس تبادل المهارات - تعلم لغة مقابل تعليم البرمجة',
    difficulty: 'صعب',
    xp: 350,
    tags: ['Full Stack', 'Real-time', 'Database'],
    color: '#22d3ee'
  },
  {
    id: 3,
    title: 'لعبة تعليمة للأطفال',
    description: 'لعبة تفاعلية تعلم الأطفال أساسيات البرمجة بطريقة ممتعة',
    difficulty: 'سهل',
    xp: 150,
    tags: ['Unity', 'C#', 'Education'],
    color: '#34d399'
  },
  {
    id: 4,
    title: 'نظام تتبع العادات اليومية',
    description: 'تطبيق يساعدك على بناء عادات إيجابية مع إحصائيات وتحفيز يومي',
    difficulty: 'سهل',
    xp: 100,
    tags: ['Flutter', 'Firebase', 'UX'],
    color: '#facc15'
  },
  {
    id: 5,
    title: 'مساعد صوتي للبرمجة',
    description: 'مساعد صوتي يساعدك في كتابة الكود وإصلاح الأخطاء صوتياً',
    difficulty: 'صعب',
    xp: 400,
    tags: ['AI', 'Voice', 'Python'],
    color: '#f472b6'
  },
  {
    id: 6,
    title: 'منصة مراجعة الكود',
    description: 'موقع لمراجعة الكود بين المطورين مع نظام تقييم ومكافآت',
    difficulty: 'متوسط',
    xp: 250,
    tags: ['React', 'GitHub API', 'Community'],
    color: '#fb923c'
  },
]

export default function Ideas() {
  const [selectedIdea, setSelectedIdea] = useState<typeof ideas[0] | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const getDifficultyColor = (d: string) => {
    if (d === 'سهل') return 'var(--accent-green)'
    if (d === 'متوسط') return 'var(--accent-orange)'
    return 'var(--accent-red)'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span style={{ color: '#facc15' }}>✧</span> مركز الأفكار والمشاريع
        </motion.h2>
        <p className="section-subtitle">
          اختر فكرة مشروع ونفذها لكسب XP والخبرة
        </p>
      </div>

      {/* Ideas Grid */}
      <div className="card-grid">
        {ideas.map((idea, i) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.01 }}
            onHoverStart={() => setHoveredId(idea.id)}
            onHoverEnd={() => setHoveredId(null)}
            onClick={() => setSelectedIdea(idea)}
            style={{
              padding: 20,
              borderRadius: 16,
              background: hoveredId === idea.id 
                ? `linear-gradient(135deg, ${idea.color}15, rgba(17, 17, 40, 0.9))` 
                : 'rgba(17, 17, 40, 0.7)',
              border: `1px solid ${hoveredId === idea.id ? `${idea.color}30` : 'var(--border)'}`,
              cursor: 'pointer',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${idea.color}, transparent)`,
              opacity: hoveredId === idea.id ? 1 : 0.5,
              transition: 'opacity 0.3s'
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: `${idea.color}15`,
                border: `1px solid ${idea.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18
              }}>
                💡
              </div>
              <motion.span 
                className="tag"
                style={{ 
                  borderColor: `${getDifficultyColor(idea.difficulty)}40`,
                  color: getDifficultyColor(idea.difficulty),
                  background: `${getDifficultyColor(idea.difficulty)}10`
                }}
                animate={{ scale: hoveredId === idea.id ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                {idea.difficulty}
              </motion.span>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, lineHeight: 1.4 }}>
              {idea.title}
            </h3>
            
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
              {idea.description}
            </p>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {idea.tags.map(tag => (
                <span key={tag} className="tag tag-blue" style={{ fontSize: 11, padding: '3px 8px' }}>
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              paddingTop: 12,
              borderTop: '1px solid var(--border)'
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: idea.color }}>
                +{idea.xp} XP
              </span>
              <motion.span 
                style={{ fontSize: 13, color: 'var(--text-muted)' }}
                animate={{ x: hoveredId === idea.id ? [0, -3, 0] : 0 }}
                transition={{ duration: 0.3 }}
              >
                عرض التفاصيل ←
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedIdea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdea(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 20
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="glass-strong"
              style={{ padding: 32, maxWidth: 520, width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `${selectedIdea.color}20`,
                  border: `2px solid ${selectedIdea.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24
                }}>
                  💡
                </div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 900 }}>{selectedIdea.title}</h3>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <span className="tag" style={{ 
                      borderColor: `${getDifficultyColor(selectedIdea.difficulty)}40`,
                      color: getDifficultyColor(selectedIdea.difficulty),
                      background: `${getDifficultyColor(selectedIdea.difficulty)}10`
                    }}>
                      {selectedIdea.difficulty}
                    </span>
                    <span className="tag tag-orange">+{selectedIdea.xp} XP</span>
                  </div>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
                {selectedIdea.description}
              </p>

              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>
                  التقنيات المطلوبة:
                </h4>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {selectedIdea.tags.map(tag => (
                    <span key={tag} className="tag tag-cyan">{tag}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary">
                  ابدأ المشروع
                </button>
                <button className="btn-secondary" onClick={() => setSelectedIdea(null)}>
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
