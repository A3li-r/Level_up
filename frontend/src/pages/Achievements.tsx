import { useState } from 'react'
import { motion } from 'framer-motion'

const achievements = [
  { id: 1, title: 'البداية', description: 'أكملت أول درس', icon: '🌟', tier: 'bronze', unlocked: true },
  { id: 2, title: 'المتعلم', description: 'أكملت 5 دروس', icon: '📚', tier: 'bronze', unlocked: true },
  { id: 3, title: 'الماهر', description: 'أكملت 10 دروس', icon: '⚡', tier: 'silver', unlocked: true },
  { id: 4, title: 'البطل', description: 'أكملت كويست كامل', icon: '🏆', tier: 'silver', unlocked: false },
  { id: 5, title: 'العبقري', description: 'حصلت على 1000 XP', icon: '🧠', tier: 'gold', unlocked: false },
  { id: 6, title: 'الأسطورة', description: 'وصلت للمستوى 10', icon: '👑', tier: 'gold', unlocked: false },
  { id: 7, title: 'القمر', description: '3 أيام متتالية تعلم', icon: '🌙', tier: 'silver', unlocked: false },
  { id: 8, title: 'الشمس', description: '7 أيام متتالية تعلم', icon: '☀', tier: 'gold', unlocked: false },
  { id: 9, title: 'الكوكب', description: '30 يوم متتالي تعلم', icon: '🌍', tier: 'diamond', unlocked: false },
  { id: 10, title: 'المجرة', description: 'أكملت كل المهارات', icon: '🌌', tier: 'diamond', unlocked: false },
  { id: 11, title: 'السريع', description: 'أنهيت كويست في يوم', icon: '⚡', tier: 'silver', unlocked: false },
  { id: 12, title: 'المثابر', description: '10 كويستات مكتملة', icon: '💪', tier: 'gold', unlocked: false },
]

export default function Achievements() {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  const filtered = filter === 'all' 
    ? achievements 
    : filter === 'unlocked' 
    ? achievements.filter(a => a.unlocked)
    : achievements.filter(a => !a.unlocked)

  const tierColors: Record<string, string> = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    diamond: '#b9f2ff'
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span style={{ color: '#fbbf24' }}>★</span> الإنجازات
          </motion.h2>
          <p className="section-subtitle">
            افتح إنجازات جديدة مع تقدمك
          </p>
        </div>
        <div style={{ 
          padding: '8px 16px', 
          background: 'rgba(251, 191, 36, 0.1)', 
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--accent-yellow)'
        }}>
          {unlockedCount}/{achievements.length} مفتوح
        </div>
      </div>

      {/* Filters */}
      <motion.div 
        style={{ display: 'flex', gap: 8 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { id: 'all' as const, label: 'الكل' },
          { id: 'unlocked' as const, label: 'مفتوحة' },
          { id: 'locked' as const, label: 'مقفلة' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filter === f.id ? 'var(--accent-yellow)' : 'var(--border)',
              background: filter === f.id ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
              color: filter === f.id ? 'var(--accent-yellow)' : 'var(--text-secondary)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Tajawal, sans-serif'
            }}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Achievements Grid */}
      <div className="card-grid-sm">
        {filtered.map((achievement, i) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: achievement.unlocked ? 1.03 : 1.01 }}
            style={{
              padding: 20,
              borderRadius: 14,
              background: achievement.unlocked 
                ? `linear-gradient(135deg, ${tierColors[achievement.tier]}10, rgba(17, 17, 40, 0.8))`
                : 'rgba(17, 17, 40, 0.5)',
              border: `1px solid ${achievement.unlocked ? `${tierColors[achievement.tier]}30` : 'var(--border)'}`,
              opacity: achievement.unlocked ? 1 : 0.5,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {achievement.unlocked && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${tierColors[achievement.tier]}, transparent)`
              }} />
            )}

            <div className={`achievement-badge ${achievement.tier}`} style={{ margin: '0 auto 12px' }}>
              {achievement.icon}
            </div>
            
            <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>
              {achievement.title}
            </h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {achievement.description}
            </p>

            {achievement.unlocked && (
              <div style={{ 
                marginTop: 10, 
                fontSize: 11, 
                color: tierColors[achievement.tier],
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                {achievement.tier}
              </div>
            )}

            {!achievement.unlocked && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: 14
              }}>
                <span style={{ fontSize: 24 }}>🔒</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
