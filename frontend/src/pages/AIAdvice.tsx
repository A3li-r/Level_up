import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { paths } from './DevPaths'

type PathItem = typeof paths[number]
type AnsKey = 'time' | 'goal' | 'level'
type Ans = Record<AnsKey, string>

// Demand is not stored on DevPaths items; we keep a small local map keyed by title.
// (Values reflect the roadmap.sh / rpg-learning-app research: 'عالي' | 'متوسط' | 'منخفض')
const demandMap: Record<string, 'عالي' | 'متوسط' | 'منخفض'> = {
  'Full Stack Developer': 'عالي',
  'Data Scientist': 'عالي',
  'Mobile Developer': 'متوسط',
  'DevOps Engineer': 'عالي',
  'UI/UX Designer': 'عالي',
  'Cloud Architect': 'عالي',
  'AR/VR Developer': 'منخفض',
  'Prompt Engineer': 'عالي',
  'QA Automation': 'متوسط'
}

const demandScore: Record<string, number> = { 'عالي': 30, 'متوسط': 18, 'منخفض': 8 }

const questions: { key: AnsKey; q: string; options: { v: string; l: string }[] }[] = [
  {
    key: 'time',
    q: 'كم ساعات تقدر تستثمر بالأسبوع؟',
    options: [
      { v: 'قليل', l: 'أقل من 5 ساعات' },
      { v: 'متوسط', l: '5 - 10 ساعات' },
      { v: 'كثير', l: 'أكثر من 10 ساعات' }
    ]
  },
  {
    key: 'goal',
    q: 'إيش هدفك الأساسي؟',
    options: [
      { v: 'دخل', l: 'دخل عالي' },
      { v: 'سرعة', l: 'بداية سريعة في سوق العمل' },
      { v: 'شغف', l: 'شغف وإبداع تقني' }
    ]
  },
  {
    key: 'level',
    q: 'مستواك الحالي؟',
    options: [
      { v: 'مبتدئ', l: 'مبتدئ تماماً' },
      { v: 'متوسط', l: 'عندي خلفية بسيطة' }
    ]
  }
]

function scorePath(p: PathItem, a: Ans): number {
  let score = 0
  const demand = demandMap[p.title] ?? 'متوسط'
  score += demandScore[demand]

  if (a.goal === 'دخل') {
    score += demand === 'عالي' ? 25 : 5
  }
  if (a.goal === 'سرعة') {
    if (p.difficulty === 'متوسط') score += 20
    if (p.xp <= 900) score += 15
  }
  if (a.goal === 'شغف') {
    if (/تصم|إبداع|لع|تجارب|غامرة|ذكاء/.test(p.description)) score += 22
  }

  if (a.time === 'قليل') {
    if (p.xp <= 900) score += 22
    if (p.difficulty === 'صعب') score -= 10
  }
  if (a.time === 'كثير') {
    if (p.xp > 1000) score += 12
  }

  if (a.level === 'مبتدئ' && p.difficulty === 'متوسط') score += 12

  return score
}

function reasonFor(p: PathItem, a: Ans): string {
  const demand = demandMap[p.title] ?? 'متوسط'
  let goalLine = ''
  if (a.goal === 'دخل') goalLine = 'يناسب رغبتك في دخل عالي لكونه من المسارات المطلوبة بقوة في السوق. '
  else if (a.goal === 'سرعة') goalLine = 'خطواته عملية وتمكنك من دخول سوق العمل بسرعة نسبية. '
  else goalLine = 'يغذي شغفك الإبداعي والتقني بمشاريع ممتعة. '

  const timeLine =
    a.time === 'قليل'
      ? `مدته ${p.duration} مناسبة لوقتك المحدود. `
      : a.time === 'كثير'
      ? `يمنحك مساحة كافية للتعمق بفضل ${p.xp} نقطة خبرة. `
      : `يتوافق مع استثمارك الأسبوعي المعتدل. `

  return `مسار ذو طلب ${demand}، ${goalLine}${timeLine}`
}

export default function AIAdvice() {
  const [answers, setAnswers] = useState<Partial<Ans>>({})

  const allAnswered =
    answers.time !== undefined && answers.goal !== undefined && answers.level !== undefined

  const results = allAnswered
    ? (paths as PathItem[])
        .map(p => {
          const a = answers as Ans
          return { p, score: scorePath(p, a), reason: reasonFor(p, a) }
        })
        .sort((x, y) => y.score - x.score)
        .slice(0, 3)
    : []

  const choose = (key: AnsKey, v: string) =>
    setAnswers(prev => ({ ...prev, [key]: v }))

  const reset = () => setAnswers({})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span style={{ color: '#c084fc' }}>✨</span> مستشار المسار
        </motion.h2>
        <p className="section-subtitle">
          جاوب على الأسئلة ونعطيك أنسب مسار تعلّمي لك 🎯
        </p>
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {questions.map((question, qi) => (
          <motion.div
            key={question.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qi * 0.08 }}
            style={{
              padding: 20,
              borderRadius: 16,
              background: 'rgba(17, 17, 40, 0.7)',
              border: '1px solid var(--border)'
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>
              {qi + 1}. {question.q}
            </h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {question.options.map(opt => {
                const selected = answers[question.key] === opt.v
                return (
                  <motion.button
                    key={opt.v}
                    onClick={() => choose(question.key, opt.v)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="tag"
                    style={{
                      cursor: 'pointer',
                      fontSize: 13,
                      padding: '8px 14px',
                      borderColor: selected ? 'var(--accent-purple)' : 'var(--border)',
                      color: selected ? 'var(--accent-purple)' : 'var(--text-secondary)',
                      background: selected ? 'rgba(168, 85, 247, 0.12)' : 'transparent'
                    }}
                  >
                    {opt.l}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Results */}
      <AnimatePresence>
        {allAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap'
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent-purple)' }}>
                ✨ أنسب ٣ مسارات لك
              </h3>
              <button className="btn-secondary" onClick={reset}>
                إعادة الاختيار
              </button>
            </div>

            {results.map((r, i) => (
              <motion.div
                key={r.p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: -6 }}
                style={{
                  padding: 22,
                  borderRadius: 16,
                  background: 'rgba(17, 17, 40, 0.7)',
                  border: `1px solid ${r.p.color}40`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 4,
                    height: '100%',
                    background: `linear-gradient(180deg, ${r.p.color}, transparent)`
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    gap: 12,
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: `${r.p.color}20`,
                        border: `1px solid ${r.p.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        color: r.p.color
                      }}
                    >
                      {i + 1}
                    </div>
                    <h4 style={{ fontSize: 17, fontWeight: 800 }}>{r.p.title}</h4>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span
                      className="tag tag-purple"
                      style={{ fontSize: 12 }}
                    >
                      +{r.p.xp} XP
                    </span>
                    <span className="tag tag-orange" style={{ fontSize: 12 }}>
                      ⏱ {r.p.duration}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    marginBottom: 12
                  }}
                >
                  {r.reason}
                </p>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {r.p.steps.map((step: string, j: number) => (
                    <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="tag tag-purple" style={{ fontSize: 12, padding: '4px 10px' }}>
                        {step}
                      </span>
                      {j < r.p.steps.length - 1 && (
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>←</span>
                      )}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Tip box */}
            <div
              style={{
                padding: 18,
                borderRadius: 14,
                background: 'rgba(34, 211, 238, 0.06)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                fontSize: 14,
                color: 'var(--text-secondary)',
                lineHeight: 1.7
              }}
            >
              💡 <strong style={{ color: 'var(--accent-cyan)' }}>نصيحة:</strong> ركّز على مسار
              واحد فقط في البداية، وخصّص ساعات ثابتة أسبوعياً حتى تبني عادة التعلم. التكرار
              أهم من انتقاء المسار المثالي.
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
              هذا المستشار يعمل بدون إنترنت بقواعد ذكية. قريباً: نسخة مدعومة بالذكاء الاصطناعي
              تحلّل تقدّمك الحقيقي.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
