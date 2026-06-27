import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const courses = [
  {
    id: 1,
    title: 'أساسيات تطوير الويب',
    provider: 'freeCodeCamp',
    duration: '300 ساعة',
    level: 'مبتدئ',
    category: 'Frontend',
    url: 'https://www.freecodecamp.org/learn/',
    description: 'تعلم HTML, CSS, JavaScript, React من الصفر حتى الاحتراف',
    color: '#facc15',
    xp: 500
  },
  {
    id: 2,
    title: 'Machine Learning Specialization',
    provider: 'Coursera / Andrew Ng',
    duration: '60 ساعة',
    level: 'متوسط',
    category: 'AI',
    url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    description: 'مقدمة شاملة في تعلم الآلة من جامعة ستانفورد',
    color: '#3b82f6',
    xp: 400
  },
  {
    id: 3,
    title: 'Complete Python Developer',
    provider: 'Udemy',
    duration: '40 ساعة',
    level: 'مبتدئ',
    category: 'Backend',
    url: 'https://www.udemy.com/course/complete-python-developer/',
    description: 'احترف Python من الصفر مع مشاريع عملية',
    color: '#34d399',
    xp: 350
  },
  {
    id: 4,
    title: 'Deep Learning Specialization',
    provider: 'deeplearning.ai',
    duration: '80 ساعة',
    level: 'متقدم',
    category: 'AI',
    url: 'https://www.deeplearning.ai/courses/deep-learning-specialization/',
    description: 'تعمق في الشبكات العصبية و CNN و RNN و Transformers',
    color: '#a855f7',
    xp: 600
  },
  {
    id: 5,
    title: 'Full Stack Open',
    provider: 'University of Helsinki',
    duration: '200 ساعة',
    level: 'متوسط',
    category: 'Full Stack',
    url: 'https://fullstackopen.com/',
    description: 'دورة شاملة في Full Stack مع React, Node.js, GraphQL, Docker',
    color: '#22d3ee',
    xp: 550
  },
  {
    id: 6,
    title: 'AWS Certified Solutions Architect',
    provider: 'A Cloud Guru',
    duration: '50 ساعة',
    level: 'متوسط',
    category: 'Cloud',
    url: 'https://acloudguru.com/',
    description: 'حضّر لشهادة AWS وتعلم تصميم الأنظمة السحابية',
    color: '#fb923c',
    xp: 450
  },
  {
    id: 7,
    title: 'Flutter Development',
    provider: 'Google',
    duration: '30 ساعة',
    level: 'مبتدئ',
    category: 'Mobile',
    url: 'https://docs.flutter.dev/get-started/learn',
    description: 'ابنِ تطبيقات Android و iOS من كود واحد',
    color: '#06b6d4',
    xp: 300
  },
  {
    id: 8,
    title: 'Docker & Kubernetes',
    provider: 'KodeKloud',
    duration: '35 ساعة',
    level: 'متوسط',
    category: 'DevOps',
    url: 'https://kodekloud.com/',
    description: 'احترف الحاويات وأدوات DevOps الحديثة',
    color: '#f472b6',
    xp: 400
  },
  {
    id: 9,
    title: 'CS50: Intro to Computer Science',
    provider: 'Harvard',
    duration: '40 ساعة',
    level: 'مبتدئ',
    category: 'CS',
    url: 'https://cs50.harvard.edu/',
    description: 'مقدمة رائعة من هارفارد لعلوم الحاسوب والبرمجة',
    color: '#f87171',
    xp: 350
  }
]

const categories = ['الكل', 'Frontend', 'Backend', 'AI', 'Full Stack', 'Cloud', 'Mobile', 'DevOps', 'CS']

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState('الكل')
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null)

  const filteredCourses = selectedCategory === 'الكل'
    ? courses
    : courses.filter(c => c.category === selectedCategory)

  const getLevelColor = (level: string) => {
    if (level === 'مبتدئ') return 'var(--accent-green)'
    if (level === 'متوسط') return 'var(--accent-orange)'
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
          <span style={{ color: '#fb923c' }}>◆</span> مركز الكورسات
        </motion.h2>
        <p className="section-subtitle">
          كورسات حقيقية من أفضل المنصات العالمية - روابط مباشرة
        </p>
      </div>

      {/* Category Filter */}
      <motion.div 
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {categories.map(cat => (
          <motion.button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: selectedCategory === cat ? 'var(--accent-orange)' : 'var(--border)',
              background: selectedCategory === cat 
                ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(251, 146, 60, 0.05))' 
                : 'rgba(255, 255, 255, 0.03)',
              color: selectedCategory === cat ? 'var(--accent-orange)' : 'var(--text-secondary)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Tajawal, sans-serif'
            }}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Courses Grid */}
      <div className="card-grid">
        {filteredCourses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedCourse(course)}
            style={{
              padding: 20,
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
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${course.color}, ${course.color}44)`
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${course.color}15`,
                border: `1px solid ${course.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 900,
                color: course.color
              }}>
                {course.provider.charAt(0)}
              </div>
              <span className="tag" style={{ 
                borderColor: `${getLevelColor(course.level)}40`,
                color: getLevelColor(course.level),
                background: `${getLevelColor(course.level)}10`
              }}>
                {course.level}
              </span>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, lineHeight: 1.4 }}>
              {course.title}
            </h3>
            
            <p style={{ fontSize: 12, color: course.color, fontWeight: 600, marginBottom: 10 }}>
              {course.provider}
            </p>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
              {course.description}
            </p>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              paddingTop: 12,
              borderTop: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                <span>⏱ {course.duration}</span>
                <span>+{course.xp} XP</span>
              </div>
              <span style={{ fontSize: 12, color: course.color, fontWeight: 600 }}>
                التفاصيل ←
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCourse(null)}
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
                  background: `${selectedCourse.color}20`,
                  border: `2px solid ${selectedCourse.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontWeight: 900,
                  color: selectedCourse.color
                }}>
                  {selectedCourse.provider.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900 }}>{selectedCourse.title}</h3>
                  <p style={{ fontSize: 13, color: selectedCourse.color, fontWeight: 600 }}>
                    {selectedCourse.provider}
                  </p>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                {selectedCourse.description}
              </p>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                <span className="tag tag-blue">{selectedCourse.category}</span>
                <span className="tag" style={{ 
                  borderColor: `${getLevelColor(selectedCourse.level)}40`,
                  color: getLevelColor(selectedCourse.level),
                  background: `${getLevelColor(selectedCourse.level)}10`
                }}>
                  {selectedCourse.level}
                </span>
                <span className="tag tag-orange">⏱ {selectedCourse.duration}</span>
                <span className="tag tag-green">+{selectedCourse.xp} XP</span>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <a 
                  href={selectedCourse.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', flex: 1 }}
                >
                  <button className="btn-primary" style={{ width: '100%' }}>
                    ابدأ الكورس ←
                  </button>
                </a>
                <button className="btn-secondary" onClick={() => setSelectedCourse(null)}>
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
