import { useState } from 'react'
import { motion } from 'framer-motion'

const stats = [
  { label: 'XP', value: '0', icon: '⚡', color: '#facc15', bg: 'rgba(250, 204, 21, 0.08)' },
  { label: 'Level', value: '1', icon: '◆', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.08)' },
  { label: 'Skills', value: '0', icon: '⬡', color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.08)' },
  { label: 'Quests', value: '0', icon: '⚔', color: '#34d399', bg: 'rgba(52, 211, 153, 0.08)' },
]

const recentActivity = [
  { text: 'أكملت درس JavaScript الأساسي', time: 'منذ ساعتين', xp: '+50 XP' },
  { text: 'بدأت كويست "بناء أول مشروع"', time: 'منذ 3 ساعات', xp: '+25 XP' },
  { text: 'حصلت على إنجاز "المبتدئ"', time: 'منذ يوم', xp: '+100 XP' },
]

const dailyGoals = [
  { text: 'أكمل درس واحد', progress: 100, done: true },
  { text: 'مارس 25 دقيقة Focus', progress: 60, done: false },
  { text: 'أكمل كويست واحد', progress: 0, done: false },
]

export default function Dashboard() {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '28px 32px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(34, 211, 238, 0.1))',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: -30,
          left: -30,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2), transparent)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.2), transparent)',
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.h1 
            style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            مرحباً بك في Level Up 👋
          </motion.h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            ابدأ رحلتك في تطوير نفسك. كل مهارة تتعلمها تقربك من هدفك!
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onHoverStart={() => setHoveredStat(i)}
            onHoverEnd={() => setHoveredStat(null)}
            style={{
              transform: hoveredStat === i ? 'translateY(-6px) scale(1.02)' : undefined,
              borderColor: hoveredStat === i ? `${stat.color}44` : undefined,
            }}
          >
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12, 
              background: stat.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              marginBottom: 12,
              border: `1px solid ${stat.color}22`
            }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: stat.color, marginBottom: 2 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Daily Goals */}
        <motion.div
          className="glass"
          style={{ padding: 24 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#facc15' }}>◎</span> أهداف اليوم
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'rgba(250, 204, 21, 0.1)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
              {dailyGoals.filter(g => g.done).length}/{dailyGoals.length}
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {dailyGoals.map((goal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: goal.done ? 'rgba(52, 211, 153, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${goal.done ? 'rgba(52, 211, 153, 0.2)' : 'var(--border)'}`,
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ 
                    fontSize: 14, 
                    fontWeight: goal.done ? 600 : 500,
                    textDecoration: goal.done ? 'line-through' : 'none',
                    color: goal.done ? 'var(--accent-green)' : 'var(--text-primary)'
                  }}>
                    {goal.text}
                  </span>
                  {goal.done && <span style={{ color: 'var(--accent-green)', fontSize: 16 }}>✓</span>}
                </div>
                <div className="xp-bar" style={{ height: 4 }}>
                  <motion.div
                    className="xp-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.15 }}
                    style={goal.done ? { background: 'var(--accent-green)' } : {}}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="glass"
          style={{ padding: 24 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 style={{ fontSize: 17, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ color: '#a855f7' }}>◈</span> النشاط الأخير
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                whileHover={{ background: 'rgba(255, 255, 255, 0.06)', borderColor: 'rgba(168, 85, 247, 0.2)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--accent-purple)',
                    boxShadow: '0 0 8px var(--glow-purple)'
                  }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{activity.text}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{activity.time}</div>
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-green)' }}>
                  {activity.xp}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
      >
        <button className="btn-primary">
          ⬡ ابدأ تعلم مهارة جديدة
        </button>
        <button className="btn-secondary">
          ◎ ابدأ Focus Session
        </button>
        <button className="btn-secondary">
          ⚔ كويستس جديدة
        </button>
      </motion.div>
    </div>
  )
}
