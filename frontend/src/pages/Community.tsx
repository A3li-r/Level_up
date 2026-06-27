import { useState } from 'react'
import { motion } from 'framer-motion'

const leaderboard = [
  { rank: 1, name: 'Ahmed', level: 15, xp: 4500, avatar: '⚡' },
  { rank: 2, name: 'Sara', level: 12, xp: 3800, avatar: '🔥' },
  { rank: 3, name: 'Omar', level: 11, xp: 3200, avatar: '🌟' },
  { rank: 4, name: 'Layla', level: 10, xp: 2900, avatar: '💎' },
  { rank: 5, name: 'Khalid', level: 9, xp: 2500, avatar: '🚀' },
  { rank: 6, name: 'Nora', level: 8, xp: 2100, avatar: '✨' },
  { rank: 7, name: 'Ali', level: 7, xp: 1800, avatar: '🎯' },
  { rank: 8, name: 'Huda', level: 6, xp: 1500, avatar: '🌙' },
]

const forumPosts = [
  { id: 1, title: 'كيف تبدأ في تعلم البرمجة؟', author: 'Ahmed', replies: 23, likes: 45, time: 'منذ ساعة' },
  { id: 2, title: 'أفضل مصادر لتعلم Python', author: 'Sara', replies: 15, likes: 32, time: 'منذ 3 ساعات' },
  { id: 3, title: 'شاركني مشروعي الأول!', author: 'Omar', replies: 8, likes: 28, time: 'منذ 5 ساعات' },
  { id: 4, title: 'نصائح للحفاظ على التركيز', author: 'Layla', replies: 12, likes: 56, time: 'منذ يوم' },
]

export default function Community() {
  const [activeSection, setActiveSection] = useState<'leaderboard' | 'forum'>('leaderboard')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span style={{ color: '#06b6d4' }}>◉</span> المجتمع
        </motion.h2>
        <p className="section-subtitle">
          تواصل مع المتعلمين الآخرين وتحديهم
        </p>
      </div>

      {/* Section Tabs */}
      <motion.div 
        style={{ display: 'flex', gap: 8 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { id: 'leaderboard' as const, label: 'لائحة المتصدرين', icon: '🏆' },
          { id: 'forum' as const, label: 'المنتدى', icon: '💬' },
        ].map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: activeSection === tab.id ? 'var(--accent-cyan)' : 'var(--border)',
              background: activeSection === tab.id 
                ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(6, 182, 212, 0.05))' 
                : 'rgba(255, 255, 255, 0.03)',
              color: activeSection === tab.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Tajawal, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Leaderboard */}
      {activeSection === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{ padding: 24 }}
        >
          {/* Top 3 Podium */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 16, 
            marginBottom: 24,
            flexWrap: 'wrap'
          }}>
            {leaderboard.slice(0, 3).map((user, i) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                style={{
                  padding: '20px 24px',
                  borderRadius: 16,
                  background: i === 0 
                    ? 'linear-gradient(135deg, rgba(250, 204, 21, 0.15), rgba(250, 204, 21, 0.05))'
                    : i === 1
                    ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.05))'
                    : 'linear-gradient(135deg, rgba(205, 127, 50, 0.15), rgba(205, 127, 50, 0.05))',
                  border: `1px solid ${i === 0 ? 'rgba(250, 204, 21, 0.3)' : i === 1 ? 'rgba(192, 192, 192, 0.3)' : 'rgba(205, 127, 50, 0.3)'}`,
                  textAlign: 'center',
                  minWidth: 120,
                  order: i === 0 ? -1 : i === 1 ? 0 : 1
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                </div>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{user.avatar}</div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Level {user.level} • {user.xp} XP
                </div>
              </motion.div>
            ))}
          </div>

          {/* Rest of leaderboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {leaderboard.slice(3).map((user, i) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ x: -4, background: 'rgba(255, 255, 255, 0.05)' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ 
                  fontSize: 18, 
                  fontWeight: 900, 
                  color: 'var(--text-muted)',
                  width: 28,
                  textAlign: 'center'
                }}>
                  {user.rank}
                </span>
                <span style={{ fontSize: 20 }}>{user.avatar}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{user.name}</div>
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Level {user.level}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-purple)' }}>
                  {user.xp} XP
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Forum */}
      {activeSection === 'forum' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {forumPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ x: -4, borderColor: 'rgba(6, 182, 212, 0.3)' }}
              style={{
                padding: 18,
                borderRadius: 14,
                background: 'rgba(17, 17, 40, 0.7)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>
                  {post.title}
                </h4>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', marginRight: 12 }}>
                  {post.time}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                <span>👤 {post.author}</span>
                <span>💬 {post.replies} ردود</span>
                <span>❤️ {post.likes} إعجاب</span>
              </div>
            </motion.div>
          ))}

          {/* New Post Button */}
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{ marginTop: 8 }}
          >
            + موضوع جديد
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
