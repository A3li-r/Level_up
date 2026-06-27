import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Resource {
  id: string
  name: string
  type: string
  url: string
  duration: string
  xpReward: number
  difficulty: string
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

const mockResources: Resource[] = [
  { id: '1', name: 'JavaScript for Beginners', type: 'فيديو', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', duration: '3 ساعات', xpReward: 50, difficulty: 'مبتدئ' },
  { id: '2', name: 'freeCodeCamp JS', type: 'دورة', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', duration: '30 ساعة', xpReward: 200, difficulty: 'مبتدئ' },
  { id: '3', name: 'MDN Web Docs', type: 'مرجع', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', duration: 'قراءة مستمرة', xpReward: 30, difficulty: 'متوسط' },
  { id: '4', name: 'JavaScript.info', type: 'كتاب', url: 'https://javascript.info/', duration: '20 ساعة', xpReward: 100, difficulty: 'متوسط' },
]

const mockQuiz: QuizQuestion[] = [
  { id: 1, question: 'ما هو نوع المتغير في JavaScript؟', options: ['var', 'let', 'const', 'كل ما سبق'], correctAnswer: 3 },
  { id: 2, question: 'ما هي الدالة اللي تضيف عنصر لنهاية المصفوفة؟', options: ['push()', 'pop()', 'shift()', 'unshift()'], correctAnswer: 0 },
  { id: 3, question: 'ما نتيجة: typeof []؟', options: ['array', 'object', 'undefined', 'list'], correctAnswer: 1 },
  { id: 4, question: 'أي من التالي مش نوع بيانات في JS؟', options: ['string', 'boolean', 'float', 'symbol'], correctAnswer: 2 },
  { id: 5, question: 'ما نتيجة: 2 + "2"؟', options: ['4', '22', 'error', 'NaN'], correctAnswer: 1 },
]

const mockRoadmap = {
  steps: [
    { title: 'المتغيرات وأنواع البيانات', description: 'تعلم var, let, const وأنواع البيانات الأساسية', duration: 'يوم واحد' },
    { title: 'التحكم في التدفق', description: 'if/else, switch, loops (for, while, do-while)', duration: 'يومين' },
    { title: 'الدوال', function: 'function declaration, arrow functions, callbacks', duration: '3 أيام' },
    { title: 'المصفوفات والكائنات', description: 'Array methods, object manipulation, destructuring', duration: '3 أيام' },
    { title: 'DOM وEvents', description: 'التعامل مع عناصر الصفحة والأحداث', duration: 'يومين' },
    { title: 'Async JavaScript', description: 'Promises, async/await, fetch API', duration: '4 أيام' },
    { title: 'مشروع تطبيقي', description: 'بناء مشروع كامل يجمع كل اللي تعلمته', duration: 'أسبوع' },
  ]
}

export default function SkillDetail() {
  const [activeTab, setActiveTab] = useState<'resources' | 'quiz' | 'roadmap'>('resources')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    if (answerIndex === mockQuiz[currentQuestion].correctAnswer) {
      setScore(s => s + 1)
    }
    setTimeout(() => {
      if (currentQuestion < mockQuiz.length - 1) {
        setCurrentQuestion(c => c + 1)
        setSelectedAnswer(null)
      } else {
        setQuizFinished(true)
      }
    }, 1500)
  }

  const resetQuiz = () => {
    setQuizStarted(false)
    setQuizFinished(false)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '48px' }}>🟨</span>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: 0 }}>
              أساسيات جافاسكريبت
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0' }}>JavaScript Basics | تقنية</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 12px', borderRadius: '12px',
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                fontSize: '12px', fontWeight: 600
              }}>
                🔓 مفتوح
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Level 2/5
              </span>
            </div>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, margin: '12px 0' }}>
          تعلم أساسيات لغة البرمجة جافاسكريبت - المتغيرات، الدوال، التحكم في التدفق، المصفوفات، والكائنات. هذا المهارة هي الأساس لتطوير الويب الحديث.
        </p>
        
        {/* XP Progress */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#a78bfa', fontSize: '13px', fontWeight: 600 }}>XP Progress</span>
            <span style={{ color: '#a78bfa', fontSize: '13px' }}>150/300</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '50%' }}
              transition={{ duration: 1 }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)', borderRadius: '4px' }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {(['resources', 'quiz', 'roadmap'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === tab ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
              fontWeight: activeTab === tab ? 700 : 400,
              transition: 'all 0.3s',
              fontSize: '14px'
            }}
          >
            {tab === 'resources' ? '📚 الموارد' : tab === 'quiz' ? '🧪 الاختبار' : '🗺️ الرود ماب'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'resources' && (
          <motion.div
            key="resources"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'grid', gap: '12px' }}
          >
            {mockResources.map((resource, i) => (
              <motion.a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  textDecoration: 'none',
                  color: '#fff',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
                whileHover={{ scale: 1.01, background: 'rgba(139,92,246,0.1)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <span style={{ fontSize: '24px' }}>
                    {resource.type === 'فيديو' ? '🎬' : resource.type === 'دورة' ? '🎓' : resource.type === 'مرجع' ? '📖' : '📚'}
                  </span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{resource.name}</h3>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>⏱️ {resource.duration}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {resource.difficulty === 'مبتدئ' ? '🟢' : resource.difficulty === 'متوسط' ? '🟡' : '🔴'} {resource.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '8px',
                    background: 'rgba(139,92,246,0.2)', color: '#a78bfa', fontSize: '12px', fontWeight: 700
                  }}>
                    +{resource.xpReward} XP
                  </span>
                  <span style={{ fontSize: '18px' }}>←</span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}

        {activeTab === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {!quizStarted ? (
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🧪</span>
                <h2 style={{ color: '#fff', marginBottom: '12px' }}>اختبار: أساسيات جافاسكريبت</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {mockQuiz.length} أسئلة - اختبر معلوماتك!
                </p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '13px' }}>
                  كل سؤال = 20 XP | إذا جاوبت 80%+ تحصل على مكافأة
                </p>
                <button
                  onClick={() => setQuizStarted(true)}
                  style={{
                    padding: '14px 40px', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    color: '#fff', fontSize: '16px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  🚀 ابدأ الاختبار
                </button>
              </div>
            ) : quizFinished ? (
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>
                  {score >= 4 ? '🏆' : score >= 3 ? '⭐' : '📚'}
                </span>
                <h2 style={{ color: '#fff', marginBottom: '8px' }}>النتيجة: {score}/{mockQuiz.length}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  {score >= 4 ? 'ممتاز! أنت متقن هذا الموضوع! 🎉' : 
                   score >= 3 ? 'كويس! بس يحتاج مراجعة أكثر 💪' : 
                   'تحتاج تراجع الكورس وتحاول مرة ثانية 📖'}
                </p>
                <p style={{ color: '#a78bfa', fontWeight: 700, fontSize: '18px' }}>+{score * 20} XP</p>
                <button
                  onClick={resetQuiz}
                  style={{
                    marginTop: '16px', padding: '12px 32px', borderRadius: '12px', border: 'none',
                    background: 'rgba(139,92,246,0.2)', color: '#a78bfa', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  🔄 إعادة الاختبار
                </button>
              </div>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    سؤال {currentQuestion + 1} من {mockQuiz.length}
                  </span>
                  <span style={{ color: '#a78bfa', fontSize: '13px', fontWeight: 600 }}>
                    Score: {score}
                  </span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '24px', overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${((currentQuestion + 1) / mockQuiz.length) * 100}%` }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)', borderRadius: '2px' }}
                  />
                </div>
                <h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '24px', lineHeight: 1.6 }}>
                  {mockQuiz[currentQuestion].question}
                </h2>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {mockQuiz[currentQuestion].options.map((option, i) => {
                    const isCorrect = i === mockQuiz[currentQuestion].correctAnswer
                    const isSelected = selectedAnswer === i
                    let border = '1px solid rgba(255,255,255,0.2)'
                    let bg = 'rgba(255,255,255,0.05)'
                    if (selectedAnswer !== null) {
                      if (isCorrect) { border = '2px solid #22c55e'; bg = 'rgba(34,197,94,0.1)' }
                      else if (isSelected) { border = '2px solid #ef4444'; bg = 'rgba(239,68,68,0.1)' }
                    }
                    return (
                      <motion.button
                        key={i}
                        onClick={() => selectedAnswer === null ? handleAnswer(i) : undefined}
                        whileHover={selectedAnswer === null ? { scale: 1.01 } : {}}
                        style={{
                          padding: '16px 20px',
                          borderRadius: '12px',
                          border,
                          background: bg,
                          color: '#fff',
                          textAlign: 'right',
                          cursor: selectedAnswer === null ? 'pointer' : 'default',
                          fontSize: '15px',
                          transition: 'all 0.3s'
                        }}
                      >
                        {selectedAnswer !== null && isCorrect ? '✅ ' : 
                         isSelected && !isCorrect ? '❌ ' : ''}
                        {option}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'roadmap' && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <h2 style={{ color: '#fff', marginBottom: '24px' }}>🗺️ Roadmap: أساسيات جافاسكريبت</h2>
            <div style={{ position: 'relative', paddingRight: '24px' }}>
              <div style={{
                position: 'absolute', right: '11px', top: '0', bottom: '0',
                width: '2px', background: 'linear-gradient(180deg, #8b5cf6, #06b6d4)'
              }} />
              {mockRoadmap.steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    display: 'flex', gap: '16px', marginBottom: '20px',
                    padding: '16px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 800, color: '#fff',
                    flexShrink: 0, zIndex: 1
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '15px', fontWeight: 700 }}>{step.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '4px 0', lineHeight: 1.6 }}>{step.description}</p>
                    <span style={{ color: '#a78bfa', fontSize: '12px' }}>⏱️ {step.duration}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
