import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const paths = [
  {
    id: 1,
    title: 'Full Stack Developer',
    duration: '6-12 شهر',
    steps: ['HTML/CSS/JS', 'React', 'Node.js', 'Database', 'Deployment'],
    color: '#a855f7',
    difficulty: 'متوسط',
    xp: 1000,
    description: 'كن مطور Full Stack محترف وقادر على بناء تطبيقات ويب كاملة'
  },
  {
    id: 2,
    title: 'Data Scientist',
    duration: '8-14 شهر',
    steps: ['Python', 'Statistics', 'Machine Learning', 'Deep Learning', 'Projects'],
    color: '#3b82f6',
    difficulty: 'صعب',
    xp: 1200,
    description: 'احترف تحليل البيانات والذكاء الاصطناعي'
  },
  {
    id: 3,
    title: 'Mobile Developer',
    duration: '4-8 شهر',
    steps: ['Dart', 'Flutter', 'State Management', 'APIs', 'Publishing'],
    color: '#22d3ee',
    difficulty: 'متوسط',
    xp: 800,
    description: 'ابنِ تطبيقات Android و iOS باستخدام Flutter'
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    duration: '6-10 شهر',
    steps: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Cloud'],
    color: '#34d399',
    difficulty: 'صعب',
    xp: 1100,
    description: 'أتقن البنية التحتية وأتمتة النشر'
  }
]

export default function DevPaths() {
  const [selectedPath, setSelectedPath] = useState<typeof paths[0] | null>(null)

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
          <span style={{ color: '#f87171' }}>⬡</span> مسارات التطوير
        </motion.h2>
        <p className="section-subtitle">
          مسارات تعليمية مفصلة من الصفر حتى الاحتراف
        </p>
      </div>

      {/* Paths */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {paths.map((path, i) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ x: -6 }}
            onClick={() => setSelectedPath(path)}
            style={{
              padding: 24,
              borderRadius: 16,
              background: 'rgba(17, 17, 40, 0.7)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 4,
              height: '100%',
              background: `linear-gradient(180deg, ${path.color}, transparent)`
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
                  {path.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {path.description}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <span className="tag" style={{ 
                  borderColor: `${getDifficultyColor(path.difficulty)}40`,
                  color: getDifficultyColor(path.difficulty),
                  background: `${getDifficultyColor(path.difficulty)}10`
                }}>
                  {path.difficulty}
                </span>
                <span className="tag tag-orange">⏱ {path.duration}</span>
              </div>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {path.steps.map((step, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <motion.span 
                    className="tag tag-purple"
                    style={{ fontSize: 12, padding: '4px 10px' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {step}
                  </motion.span>
                  {j < path.steps.length - 1 && (
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>←</span>
                  )}
                </div>
              ))}
            </div>

            {/* XP */}
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: path.color }}>
                +{path.xp} XP
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                اضغط للتفاصيل ←
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Path Detail Modal */}
      <AnimatePresence>
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPath(null)}
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
              style={{ padding: 32, maxWidth: 560, width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `${selectedPath.color}20`,
                  border: `2px solid ${selectedPath.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 900,
                  color: selectedPath.color
                }}>
                  {selectedPath.title.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 900 }}>{selectedPath.title}</h3>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <span className="tag" style={{ 
                      borderColor: `${getDifficultyColor(selectedPath.difficulty)}40`,
                      color: getDifficultyColor(selectedPath.difficulty),
                      background: `${getDifficultyColor(selectedPath.difficulty)}10`
                    }}>
                      {selectedPath.difficulty}
                    </span>
                    <span className="tag tag-orange">⏱ {selectedPath.duration}</span>
                    <span className="tag tag-green">+{selectedPath.xp} XP</span>
                  </div>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                {selectedPath.description}
              </p>

              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
                خطوات المسار:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {selectedPath.steps.map((step, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: j * 0.1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: `${selectedPath.color}20`,
                      border: `1px solid ${selectedPath.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      color: selectedPath.color
                    }}>
                      {j + 1}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{step}</span>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary" style={{ flex: 1 }}>
                  ابدأ المسار
                </button>
                <button className="btn-secondary" onClick={() => setSelectedPath(null)}>
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
