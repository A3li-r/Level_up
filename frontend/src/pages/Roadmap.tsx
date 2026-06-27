import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const roadmapSteps = [
  {
    id: 1,
    title: 'الأساسيات',
    duration: '4 أسابيع',
    tasks: ['تعلم HTML/CSS', 'أساسيات JavaScript', 'Git و GitHub', 'أول مشروع شخصي'],
    color: '#facc15',
    progress: 100
  },
  {
    id: 2,
    title: 'المتقدم',
    duration: '6 أسابيع',
    tasks: ['React أو Vue', 'Node.js و Express', 'قواعد البيانات', 'REST APIs'],
    color: '#22d3ee',
    progress: 40
  },
  {
    id: 3,
    title: 'التخصص',
    duration: '8 أسابيع',
    tasks: ['اختر مسارك', 'مشاريع متقدمة', 'أفضل الممارسات', 'Code Review'],
    color: '#a855f7',
    progress: 0
  },
  {
    id: 4,
    title: 'احترافي',
    duration: 'مستمر',
    tasks: ['System Design', 'DevOps & CI/CD', 'الأداء والأمان', 'مشاريع مفتوحة المصدر'],
    color: '#34d399',
    progress: 0
  }
]

export default function Roadmap() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span style={{ color: '#f472b6' }}>◇</span> خارطة الطريق
        </motion.h2>
        <p className="section-subtitle">
          خطة واضحة من الصفر حتى الاحتراف
        </p>
      </div>

      {/* Progress Overview */}
      <motion.div
        className="glass"
        style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {roadmapSteps.map(step => (
          <div key={step.id} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: step.color, marginBottom: 4 }}>
              {step.progress}%
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{step.title}</div>
            <div className="xp-bar" style={{ marginTop: 8, height: 4 }}>
              <motion.div
                className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${step.progress}%` }}
                transition={{ duration: 1, delay: step.id * 0.2 }}
                style={{ background: step.color }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingRight: 24 }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          right: 8,
          top: 0,
          bottom: 0,
          width: 2,
          background: 'linear-gradient(180deg, #facc15, #22d3ee, #a855f7, #34d399)',
          borderRadius: 2
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {roadmapSteps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ position: 'relative' }}
            >
              {/* Timeline dot */}
              <div style={{
                position: 'absolute',
                right: -20,
                top: 20,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: step.progress > 0 ? step.color : 'var(--bg-card)',
                border: `3px solid ${step.color}`,
                boxShadow: step.progress > 0 ? `0 0 12px ${step.color}40` : 'none',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 8,
                color: 'white'
              }}>
                {step.progress === 100 ? '✓' : step.id}
              </div>

              {/* Content Card */}
              <motion.div
                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                whileHover={{ x: -4 }}
                style={{
                  padding: 20,
                  borderRadius: 14,
                  background: expandedStep === step.id 
                    ? `linear-gradient(135deg, ${step.color}10, rgba(17, 17, 40, 0.8))`
                    : 'rgba(17, 17, 40, 0.7)',
                  border: `1px solid ${expandedStep === step.id ? `${step.color}30` : 'var(--border)'}`,
                  cursor: 'pointer',
                  marginRight: 16,
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: expandedStep === step.id ? 16 : 0 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: step.color }}>
                      {step.title}
                    </h3>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {step.duration}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedStep === step.id ? 180 : 0 }}
                    style={{ fontSize: 14, color: 'var(--text-muted)' }}
                  >
                    ▼
                  </motion.div>
                </div>

                <AnimatePresence>
                  {expandedStep === step.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {step.tasks.map((task, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.08 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '10px 14px',
                              borderRadius: 10,
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid var(--border)'
                            }}
                          >
                            <div style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              border: `2px solid ${step.color}`,
                              background: j < step.tasks.length * (step.progress / 100) ? step.color : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              flexShrink: 0
                            }}>
                              {j < step.tasks.length * (step.progress / 100) ? '✓' : ''}
                            </div>
                            <span style={{ 
                              fontSize: 13, 
                              fontWeight: 600,
                              color: j < step.tasks.length * (step.progress / 100) ? 'var(--text-primary)' : 'var(--text-secondary)'
                            }}>
                              {task}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
