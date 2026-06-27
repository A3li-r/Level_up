import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const quests = [
  { id: 1, title: 'بناء أول صفحة ويب', xp: 100, status: 'completed', category: 'Frontend', difficulty: 'سهل' },
  { id: 2, title: 'تطوير تطبيق TODO', xp: 200, status: 'active', category: 'JavaScript', difficulty: 'متوسط' },
  { id: 3, title: 'إنشاء API كامل', xp: 300, status: 'available', category: 'Backend', difficulty: 'صعب' },
  { id: 4, title: 'بناء متجر إلكتروني', xp: 500, status: 'available', category: 'Full Stack', difficulty: 'صعب' },
  { id: 5, title: 'تطوير تطبيق جوال', xp: 400, status: 'available', category: 'Mobile', difficulty: 'متوسط' },
  { id: 6, title: 'تحليل بيانات حقيقية', xp: 250, status: 'available', category: 'Data', difficulty: 'متوسط' },
  { id: 7, title: 'أتمتة المهام اليومية', xp: 150, status: 'active', category: 'Python', difficulty: 'سهل' },
  { id: 8, title: 'بناء DevOps Pipeline', xp: 350, status: 'available', category: 'DevOps', difficulty: 'صعب' },
]

export default function Quests() {
  const [filter, setFilter] = useState<'all' | 'active' | 'available' | 'completed'>('all')
  const [selectedQuest, setSelectedQuest] = useState<typeof quests[0] | null>(null)

  const filtered = filter === 'all' 
    ? quests 
    : quests.filter(q => q.status === filter)

  const statusColors: Record<string, string> = {
    completed: 'var(--accent-green)',
    active: 'var(--accent-cyan)',
    available: 'var(--accent-orange)'
  }

  const statusLabels: Record<string, string> = {
    completed: 'مكتمل',
    active: 'جاري',
    available: 'متاح'
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
          <span style={{ color: '#e879f9' }}>⚔</span> الكويستس
        </motion.h2>
        <p className="section-subtitle">
          مهمات حقيقية تنفذها وتكسب منها خبرة
        </p>
      </div>

      {/* Filters */}
      <motion.div 
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { id: 'all' as const, label: 'الكل', icon: '◈' },
          { id: 'active' as const, label: 'جارية', icon: '◉' },
          { id: 'available' as const, label: 'متاحة', icon: '✧' },
          { id: 'completed' as const, label: 'مكتملة', icon: '✓' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filter === f.id ? 'var(--accent-pink)' : 'var(--border)',
              background: filter === f.id ? 'rgba(232, 121, 249, 0.1)' : 'transparent',
              color: filter === f.id ? 'var(--accent-pink)' : 'var(--text-secondary)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Tajawal, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Quests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((quest, i) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ x: quest.status === 'available' ? -4 : 0 }}
            onClick={() => quest.status === 'available' && setSelectedQuest(quest)}
            className={`quest-card ${quest.status === 'completed' ? 'completed' : ''}`}
            style={{
              opacity: quest.status === 'completed' ? 0.65 : 1,
              cursor: quest.status === 'available' ? 'pointer' : 'default',
              padding: '18px 20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `${statusColors[quest.status]}15`,
                  border: `1px solid ${statusColors[quest.status]}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 900,
                  color: statusColors[quest.status]
                }}>
                  {quest.status === 'completed' ? '✓' : quest.status === 'active' ? '►' : '!'}
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
                    {quest.title}
                  </h4>
                  <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>{quest.category}</span>
                    <span>•</span>
                    <span>{quest.difficulty}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="tag" style={{ 
                  borderColor: `${statusColors[quest.status]}40`,
                  color: statusColors[quest.status],
                  background: `${statusColors[quest.status]}10`
                }}>
                  {statusLabels[quest.status]}
                </span>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent-orange)' }}>
                  +{quest.xp} XP
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Start Quest Modal */}
      <AnimatePresence>
        {selectedQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedQuest(null)}
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
              style={{ padding: 32, maxWidth: 440, width: '100%', textAlign: 'center' }}
            >
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: 'var(--bg-card)',
                border: '2px solid var(--accent-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                margin: '0 auto 16px'
              }}>
                ⚔
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>
                {selectedQuest.title}
              </h3>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
                <span className="tag tag-purple">{selectedQuest.category}</span>
                <span className="tag tag-orange">{selectedQuest.difficulty}</span>
                <span className="tag tag-green">+{selectedQuest.xp} XP</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                هل أنت مستعد لبدء هذه المهمة؟ أكملها واحصل على الـ XP!
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary" style={{ flex: 1 }}>
                  ابدأ المهمة
                </button>
                <button className="btn-secondary" onClick={() => setSelectedQuest(null)}>
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
