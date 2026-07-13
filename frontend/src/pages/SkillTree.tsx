import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ===================== Types ===================== */
type Course = { title: string; url: string; provider: string }
type Guest = { name: string; role: string; url?: string }
type TNode = {
  id: string
  title: string
  ar?: string
  subtitle?: string
  icon?: string
  tier?: 'intro' | 'branch' | 'leaf' | 'crown'
  color?: string
  course?: Course
  guest?: Guest
  children?: TNode[]
}
type Pos = { x: number; y: number; depth: number }

/* ===================== Verified-free course tree =====================
   Every URL below was HTTP-checked (200) before embedding.            */
const TREE: TNode = {
  id: 'intro',
  title: 'ابدأ رحلتك',
  ar: 'Start Your Journey',
  subtitle: 'Introduction — every branch grows from here',
  icon: '🌱',
  tier: 'intro',
  color: '#a855f7',
  children: [
    /* ---------- Systems & Logic ---------- */
    {
      id: 'systems', title: 'Systems & Logic', ar: 'الأنظمة والمنطق', icon: '🧩', color: '#3b82f6', subtitle: 'How things work',
      children: [
        {
          id: 'programming', title: 'Programming', ar: 'برمجة', subtitle: 'Build with code',
          children: [
            { id: 'cs50', title: 'CS50', ar: 'علوم الحاسوب', course: { title: 'CS50: Introduction to Computer Science', url: 'https://cs50.harvard.edu/x/', provider: 'Harvard' } },
            { id: 'fcc-rwd', title: 'Responsive Web Design', ar: 'تصميم ويب', course: { title: 'Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', provider: 'freeCodeCamp' } },
            { id: 'mit-6001', title: 'Intro to CS (Python)', ar: 'بايثون', course: { title: '6.0001 Intro to CS & Programming in Python', url: 'https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/', provider: 'MIT OCW' } }
          ]
        },
        {
          id: 'math', title: 'Mathematics', ar: 'رياضيات', subtitle: 'The language of the universe',
          children: [
            { id: 'khan-math', title: 'Math (all levels)', ar: 'رياضيات', course: { title: 'Mathematics', url: 'https://www.khanacademy.org/math', provider: 'Khan Academy' } },
            { id: 'mit-math', title: 'MIT Math Courses', ar: 'رياضيات MIT', course: { title: 'Mathematics Course Listing', url: 'https://ocw.mit.edu/courses/mathematics/', provider: 'MIT OCW' } },
            { id: 'mit-calc', title: 'Single Variable Calculus', ar: 'تفاضل وتكامل', course: { title: '18.01SC Single Variable Calculus', url: 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/', provider: 'MIT OCW' } }
          ]
        },
        { id: 'logic', title: 'Logic & Thinking', ar: 'المنطق', subtitle: 'Reason clearly', tier: 'leaf' }
      ]
    },
    /* ---------- Creativity & Making ---------- */
    {
      id: 'creativity', title: 'Creativity & Making', ar: 'الإبداع', icon: '🎨', color: '#ec4899', subtitle: 'Make things',
      children: [
        {
          id: 'writing', title: 'Writing', ar: 'كتابة', subtitle: 'Words that move',
          children: [
            { id: 'cw-spec', title: 'Creative Writing', ar: 'كتابة إبداعية', course: { title: 'Creative Writing Specialization', url: 'https://www.coursera.org/specializations/creative-writing', provider: 'Wesleyan / Coursera' } },
            { id: 'edx-cw', title: 'Creative Writing', ar: 'كتابة', course: { title: 'Creative Writing', url: 'https://www.edx.org/learn/creative-writing', provider: 'edX' } }
          ]
        },
        {
          id: 'design', title: 'Design', ar: 'تصميم', subtitle: 'Make it beautiful',
          children: [
            { id: 'gd-spec', title: 'Graphic Design', ar: 'تصميم جرافيكي', course: { title: 'Graphic Design Specialization', url: 'https://www.coursera.org/specializations/graphic-design', provider: 'CalArts / Coursera' } },
            { id: 'hackdesign', title: 'Hack Design', ar: 'تصميم', course: { title: 'Hack Design', url: 'https://hackdesign.org/', provider: 'Hack Design' } }
          ]
        },
        {
          id: 'music', title: 'Music', ar: 'موسيقى', subtitle: 'Sound & soul',
          children: [
            { id: 'music-prod', title: 'Music Production', ar: 'إنتاج موسيقي', course: { title: 'Music Production Specialization', url: 'https://www.coursera.org/specializations/music-production', provider: 'Berklee / Coursera' } },
            { id: 'musictheory', title: 'Music Theory', ar: 'نظرية موسيقى', course: { title: 'Music Theory', url: 'https://www.musictheory.net/', provider: 'musictheory.net' } }
          ]
        }
      ]
    },
    /* ---------- Body & Health (incl. Crohn's) ---------- */
    {
      id: 'health', title: 'Body & Health', ar: 'الجسد والصحة', icon: '💪', color: '#22c55e', subtitle: 'Energy for everything',
      children: [
        { id: 'fitness', title: 'Fitness', ar: 'لياقة', subtitle: 'Move daily', tier: 'leaf', course: { title: 'Health & Medicine', url: 'https://www.khanacademy.org/science/health-and-medicine', provider: 'Khan Academy' } },
        { id: 'nutrition', title: 'Nutrition', ar: 'تغذية', subtitle: 'Fuel well', tier: 'leaf', course: { title: 'Food and Health', url: 'https://www.coursera.org/learn/food-and-health', provider: 'Stanford / Coursera' } },
        {
          id: 'crohns', title: "Crohn's Awareness", ar: 'التوعية بمرض كرون', subtitle: 'Understand IBD',
          guest: { name: "Crohn's & Colitis UK", role: 'Patient-education partner', url: 'https://crohnsandcolitis.org.uk/about-inflammatory-bowel-disease/crohns-disease' },
          children: [
            { id: 'nhs-crohns', title: 'NHS: Crohn’s Disease', ar: 'دليل NHS', course: { title: 'Crohn’s disease', url: 'https://www.nhs.uk/conditions/crohns-disease/', provider: 'NHS' } },
            { id: 'crohns-uk', title: "Crohn's & Colitis UK", ar: 'جمعية', course: { title: 'Crohn’s disease explained', url: 'https://crohnsandcolitis.org.uk/about-inflammatory-bowel-disease/crohns-disease', provider: "Crohn's & Colitis UK" } }
          ]
        }
      ]
    },
    /* ---------- Mind & Learning ---------- */
    {
      id: 'mind', title: 'Mind & Learning', ar: 'العقل والتعلّم', icon: '🧠', color: '#a855f7', subtitle: 'Train your brain',
      children: [
        {
          id: 'learning', title: 'Learning', ar: 'التعلّم', subtitle: 'Learn how to learn',
          children: [
            { id: 'lhtl', title: 'Learning How to Learn', ar: 'كيف تتعلّم', course: { title: 'Learning How to Learn', url: 'https://www.coursera.org/learn/learning-how-to-learn', provider: 'Coursera' } },
            { id: 'wellbeing', title: 'Science of Well-Being', ar: 'السعادة', course: { title: 'The Science of Well-Being', url: 'https://www.coursera.org/learn/the-science-of-well-being', provider: 'Yale / Coursera' } }
          ]
        },
        { id: 'memory', title: 'Memory', ar: 'الذاكرة', subtitle: 'Remember more', tier: 'leaf' },
        { id: 'focus', title: 'Focus', ar: 'التركيز', subtitle: 'Deep work', tier: 'leaf' }
      ]
    },
    /* ---------- People & Influence ---------- */
    {
      id: 'people', title: 'People & Influence', ar: 'الناس والتأثير', icon: '🤝', color: '#f59e0b', subtitle: 'Connect & lead',
      children: [
        {
          id: 'communication', title: 'Communication', ar: 'التواصل', subtitle: 'Be understood',
          children: [
            { id: 'negotiation', title: 'Negotiation', ar: 'التفاوض', course: { title: 'Successful Negotiation', url: 'https://www.coursera.org/learn/negotiation-skills', provider: 'Michigan / Coursera' } },
            { id: 'commskills', title: 'Communication Skills', ar: 'مهارات تواصل', course: { title: 'Improving Communication Skills', url: 'https://www.coursera.org/learn/communication-skills', provider: 'UPenn / Coursera' } },
            { id: 'edxlead', title: 'Adaptive Leadership', ar: 'قيادة', course: { title: 'Exercising Leadership', url: 'https://www.edx.org/course/exercising-leadership-foundational-principles', provider: 'Harvard / edX' } }
          ]
        },
        { id: 'ei', title: 'Emotional Intelligence', ar: 'الذكاء العاطفي', subtitle: 'Read the room', tier: 'leaf' }
      ]
    },
    /* ---------- Wealth & Finance ---------- */
    {
      id: 'finance', title: 'Wealth & Finance', ar: 'المال والتمويل', icon: '💰', color: '#84cc16', subtitle: 'Money that serves you',
      children: [
        {
          id: 'persfin', title: 'Personal Finance', ar: 'مالية شخصية', subtitle: 'Budget & save',
          children: [
            { id: 'khan-pf', title: 'Personal Finance', ar: 'مالية شخصية', course: { title: 'Personal Finance', url: 'https://www.khanacademy.org/college-careers-more/personal-finance', provider: 'Khan Academy' } },
            { id: 'finmarkets', title: 'Financial Markets', ar: 'أسواق مالية', course: { title: 'Financial Markets', url: 'https://www.coursera.org/learn/financial-markets-global', provider: 'Yale / Coursera' } }
          ]
        },
        { id: 'entrepreneur', title: 'Entrepreneurship', ar: 'ريادة أعمال', subtitle: 'Build & ship', tier: 'leaf', course: { title: 'Entrepreneurship Specialization', url: 'https://www.coursera.org/specializations/entrepreneurship', provider: 'Wharton / Coursera' } }
      ]
    },
    /* ---------- Meta & Mastery ---------- */
    {
      id: 'meta', title: 'Meta & Mastery', ar: 'ما وراء والإتقان', icon: '♾️', color: '#06b6d4', subtitle: 'The system of systems',
      children: [
        { id: 'habits', title: 'Habits', ar: 'العادات', subtitle: 'Small daily wins', tier: 'leaf' },
        { id: 'systems', title: 'Systems Thinking', ar: 'التفكير النظامي', subtitle: 'See the whole', tier: 'leaf' }
      ]
    },
    /* ---------- Jobs / Classes (RPG) ---------- */
    {
      id: 'jobs', title: 'Jobs / Classes', ar: 'المهن والفئات', icon: '⚔️', color: '#ef4444', subtitle: 'RPG classes — pick your path',
      children: [
        {
          id: 'webdev', title: 'Web Developer', ar: 'مطوّر ويب', subtitle: 'Class', guest: { name: 'freeCodeCamp', role: 'Guest trainer', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' },
          children: [
            { id: 'j-fcc-rwd', title: 'Responsive Web Design', ar: 'تصميم ويب', course: { title: 'Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', provider: 'freeCodeCamp' } },
            { id: 'j-fcc-js', title: 'JS Algorithms', ar: 'جافاسكريبت', course: { title: 'JavaScript Algorithms & Data Structures', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', provider: 'freeCodeCamp' } },
            { id: 'j-odin', title: 'The Odin Project', ar: 'مشروع Odin', course: { title: 'The Odin Project', url: 'https://www.theodinproject.com/', provider: 'The Odin Project' } }
          ]
        },
        {
          id: 'data', title: 'Data Analyst', ar: 'محلّل بيانات', subtitle: 'Class', guest: { name: 'Google / freeCodeCamp', role: 'Guest trainer', url: 'https://www.coursera.org/professional-certificates/google-data-analytics' },
          children: [
            { id: 'j-fcc-data', title: 'Data Analysis with Python', ar: 'تحليل بيانات', course: { title: 'Data Analysis with Python', url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/', provider: 'freeCodeCamp' } },
            { id: 'j-google-da', title: 'Google Data Analytics', ar: 'تحليل بيانات Google', course: { title: 'Google Data Analytics', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', provider: 'Google / Coursera' } },
            { id: 'j-ibm-ds', title: 'IBM Data Science', ar: 'علم البيانات IBM', course: { title: 'IBM Data Science', url: 'https://www.coursera.org/professional-certificates/ibm-data-science', provider: 'IBM / Coursera' } }
          ]
        },
        {
          id: 'artist', title: 'Digital Artist', ar: 'فنان رقمي', subtitle: 'Class', guest: { name: 'Ctrl+Paint', role: 'Guest trainer', url: 'https://ctrlpaint.com/' },
          children: [
            { id: 'j-ctrlpaint', title: 'Ctrl+Paint', ar: 'رسم رقمي', course: { title: 'Ctrl+Paint', url: 'https://ctrlpaint.com/', provider: 'Ctrl+Paint' } },
            { id: 'j-drawspace', title: 'Drawspace', ar: 'رسم', course: { title: 'Drawspace', url: 'https://www.drawspace.com/', provider: 'Drawspace' } },
            { id: 'j-kadenze', title: 'Kadenze', ar: 'فن رقمي', course: { title: 'Kadenze Art & Design', url: 'https://www.kadenze.com/', provider: 'Kadenze' } }
          ]
        }
      ]
    },
    /* ---------- Crown / Mastery apex ---------- */
    {
      id: 'crown', title: 'Mastery (التاج)', ar: 'الإتقان', icon: '👑', tier: 'crown', color: '#fbbf24',
      subtitle: 'The peak — grow every branch to wear the crown.',
      guest: { name: 'Level Up Community', role: 'Your peers & mentors' }
    }
  ]
}

/* ===================== Layout (organic radial tree) ===================== */
function assignColors(node: TNode, color: string) {
  node.color = node.color || color
  ;(node.children || []).forEach((c) => assignColors(c, node.color!))
}
function radialLayout(root: TNode) {
  assignColors(root, '#a855f7')
  const pos: Record<string, Pos> = {}
  const edges: { from: string; to: string }[] = []
  const nodes: TNode[] = []
  const STEP = 300
  const rec = (node: TNode, depth: number, angle: number, spread: number, parentId: string | null) => {
    const radius = depth * STEP
    const x = radius * Math.cos(angle)
    const y = -radius * Math.sin(angle)
    pos[node.id] = { x, y, depth }
    nodes.push(node)
    if (parentId) edges.push({ from: parentId, to: node.id })
    const kids = node.children || []
    if (kids.length) {
      const step = spread / kids.length
      let a = angle - spread / 2 + step / 2
      for (const k of kids) {
        rec(k, depth + 1, a, Math.min(step, 0.95), node.id)
        a += step
      }
    }
  }
  rec(root, 0, 0, 2.25, null)
  // bounding box + centering
  const xs = nodes.map((n) => pos[n.id].x)
  const ys = nodes.map((n) => pos[n.id].y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(...ys), maxY = Math.max(...ys)
  const margin = 340
  const W = Math.ceil(maxX - minX) + margin * 2
  const H = Math.ceil(maxY - minY) + margin * 2
  const offX = margin - minX
  const offY = margin - minY
  for (const n of nodes) {
    pos[n.id].x += offX
    pos[n.id].y += offY
  }
  return { pos, edges, nodes, W, H }
}

/* ===================== Daily "cron" feature ===================== */
const DAILY_QUESTS = [
  'Spend 20 minutes on one skill branch today.',
  'Open one free course and watch the first lesson.',
  'Teach someone something you learned this week.',
  'Do a 10-minute workout from the Body branch.',
  'Write down 3 things you are grateful for.',
  'Practice one new concept from any branch.',
  'Review your tree and pick the next node to grow.'
]
function useDaily() {
  const [streak, setStreak] = useState(0)
  const [quest, setQuest] = useState('')
  const [notifOn, setNotifOn] = useState(false)
  useEffect(() => {
    const today = new Date().toDateString()
    let data: any = null
    try { data = JSON.parse(localStorage.getItem('levelup_daily') || 'null') } catch { data = null }
    if (!data || data.date !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const newStreak = data && data.date === yesterday ? (data.streak || 0) + 1 : 1
      data = { date: today, streak: newStreak }
      try { localStorage.setItem('levelup_daily', JSON.stringify(data)) } catch { /* ignore */ }
    }
    setStreak(data.streak || 0)
    const idx = Math.floor(Date.now() / 86400000) % DAILY_QUESTS.length
    setQuest(DAILY_QUESTS[idx])
  }, [])
  const enableNotif = () => {
    if (typeof Notification === 'undefined') return
    Notification.requestPermission().then((p) => {
      if (p === 'granted') { setNotifOn(true); scheduleReminder() }
    })
  }
  return { streak, quest, notifOn, enableNotif }
}
function scheduleReminder() {
  const now = new Date()
  const target = new Date()
  target.setHours(20, 0, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)
  const ms = target.getTime() - now.getTime()
  setTimeout(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('Level Up 🌱', { body: 'Time for your daily quest!' })
    }
    scheduleReminder()
  }, ms)
}

/* ===================== Node card ===================== */
function NodeCard({ node, x, y, completed, onSelect }: {
  node: TNode; x: number; y: number; completed: boolean; onSelect: (n: TNode) => void
}) {
  const w = node.tier === 'intro' || node.tier === 'crown' ? 232 : 200
  const color = node.color || '#64748b'
  const isLeaf = !node.children || node.children.length === 0
  const big = node.tier === 'intro' || node.tier === 'crown'
  const isCrown = node.tier === 'crown'
  return (
    <motion.div
      onClick={() => onSelect(node)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      style={{
        position: 'absolute', left: x, top: y, width: w, transform: 'translate(-50%, -50%)',
        background: isCrown
          ? 'linear-gradient(135deg, rgba(251,191,36,0.18), rgba(251,191,36,0.06))'
          : 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(10px)',
        border: `1.5px solid ${isCrown ? '#fbbf24' : color}88`,
        borderRadius: 16, padding: big ? 16 : 12, cursor: 'pointer',
        boxShadow: isCrown ? '0 0 28px rgba(251,191,36,0.45)' : `0 6px 22px ${color}22`,
        color: '#e2e8f0', userSelect: 'none', zIndex: 2
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: big ? 28 : 22 }}>{node.icon || '•'}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: big ? 16 : 14, lineHeight: 1.15 }}>{node.title}</div>
          {node.ar && <div style={{ fontSize: 11, color: '#94a3b8' }}>{node.ar}</div>}
        </div>
        {completed && <span style={{ marginLeft: 'auto', fontSize: 16 }}>✅</span>}
      </div>
      {node.subtitle && (
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5, lineHeight: 1.3 }}>{node.subtitle}</div>
      )}
      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
        {node.course && (
          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: `${color}22`, color: color, fontWeight: 700, border: `1px solid ${color}55` }}>
            📚 {node.course.provider}
          </span>
        )}
        {node.guest && (
          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: 'rgba(251,191,36,0.14)', color: '#fbbf24', fontWeight: 700, border: '1px solid rgba(251,191,36,0.4)' }}>
            👤 {node.guest.name}
          </span>
        )}
        {isLeaf && !node.course && !node.guest && (
          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: 'rgba(148,163,184,0.15)', color: '#94a3b8', fontWeight: 700 }}>
            skill
          </span>
        )}
      </div>
    </motion.div>
  )
}

/* ===================== Detail modal ===================== */
function DetailModal({ node, completed, onToggle, onClose }: {
  node: TNode; completed: boolean; onToggle: (id: string) => void; onClose: () => void
}) {
  const color = node.color || '#64748b'
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.7)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={(e: any) => e.stopPropagation()}
        className="glass-strong"
        style={{ width: '100%', maxWidth: 460, borderRadius: 20, padding: 22, color: '#e2e8f0', maxHeight: '85vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 34 }}>{node.icon || '•'}</span>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>{node.title}</h2>
            {node.ar && <div style={{ fontSize: 13, color: '#94a3b8' }}>{node.ar}</div>}
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ marginLeft: 'auto', fontSize: 16, padding: '6px 10px' }}>✕</button>
        </div>
        {node.subtitle && <p style={{ color: '#cbd5e1', fontSize: 14, marginTop: 10 }}>{node.subtitle}</p>}

        {node.guest && (
          <div style={{ marginTop: 14, padding: 12, borderRadius: 14, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.35)' }}>
            <div style={{ fontSize: 12, color: '#fbbf24', fontWeight: 800, letterSpacing: 0.4 }}>👤 GUEST</div>
            <div style={{ fontWeight: 700 }}>{node.guest.name}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{node.guest.role}</div>
            {node.guest.url && (
              <a href={node.guest.url} target="_blank" rel="noreferrer" style={{ color: '#fbbf24', fontSize: 13, fontWeight: 600 }}>
                Visit guest ↗
              </a>
            )}
          </div>
        )}

        {node.course && (
          <a href={node.course.url} target="_blank" rel="noreferrer"
            style={{ display: 'block', marginTop: 14, padding: '14px 16px', borderRadius: 14, textDecoration: 'none', fontWeight: 800, color: '#0f172a', background: `linear-gradient(135deg, ${color}, ${color}bb)`, textAlign: 'center' }}>
            ▶ Open course · {node.course.provider}
          </a>
        )}

        {node.children && node.children.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 8 }}>
              Contains {node.children.length} node{node.children.length > 1 ? 's' : ''}:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {node.children.map((c) => (
                <div key={c.id} style={{ fontSize: 13, padding: '8px 12px', borderRadius: 10, background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.18)' }}>
                  {c.icon} {c.title} {c.course ? `· ${c.course.provider}` : ''}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={() => onToggle(node.id)}>
            {completed ? '✅ Completed' : 'Mark complete'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ===================== Main page ===================== */
export default function SkillTree() {
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree')
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [selected, setSelected] = useState<TNode | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('levelup_completed') || '[]')) } catch { return new Set() }
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null)
  const translateRef = useRef(translate)
  const scaleRef = useRef(scale)
  translateRef.current = translate
  scaleRef.current = scale

  const { pos, edges, nodes, W, H } = useMemo(() => radialLayout(TREE), [])

  const { streak, quest, notifOn, enableNotif } = useDaily()

  const zoomAt = (mx: number, my: number, factor: number) => {
    const s = scaleRef.current
    const ns = Math.min(4, Math.max(0.25, s * factor))
    const wx = (mx - translateRef.current.x) / s
    const wy = (my - translateRef.current.y) / s
    setTranslate({ x: mx - wx * ns, y: my - wy * ns })
    setScale(ns)
  }
  const zoomBy = (f: number) => {
    const el = containerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    zoomAt(r.width / 2, r.height / 2, f)
  }
  const fit = () => {
    const el = containerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const s = Math.min(r.width / W, r.height / H) * 0.92
    const ns = Math.max(0.25, Math.min(4, s))
    setScale(ns)
    setTranslate({ x: (r.width - W * ns) / 2, y: (r.height - H * ns) / 2 })
  }
  useEffect(() => {
    const id = requestAnimationFrame(fit)
    return () => cancelAnimationFrame(id)
  }, [])
  useEffect(() => { if (viewMode === 'tree') fit() }, [viewMode])

  /* mouse (Pointer Events — touch handled separately below) */
  const onPointerDown = (e: any) => {
    if (e.pointerType === 'touch') return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, tx: translateRef.current.x, ty: translateRef.current.y }
  }
  const onPointerMove = (e: any) => {
    if (e.pointerType === 'touch') return
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    const dy = e.clientY - drag.current.y
    setTranslate({ x: drag.current.tx + dx, y: drag.current.ty + dy })
  }
  const onPointerUp = (e: any) => {
    if (e.pointerType === 'touch') return
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
    drag.current = null
  }
  const onWheel = (e: any) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? 1.12 : 1 / 1.12)
  }

  /* TOUCH — native Touch Events (iOS Safari breaks pinch via Pointer Events) */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let lastSingle: { x: number; y: number; tx: number; ty: number } | null = null
    let lastDist = 0
    let lastTap = 0
    const dist = (a: any, b: any) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    const midp = (a: any, b: any) => ({ x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 })
    const onStart = (e: any) => {
      if (e.touches.length === 1) {
        const t = e.touches[0]
        lastSingle = { x: t.clientX, y: t.clientY, tx: translateRef.current.x, ty: translateRef.current.y }
      } else if (e.touches.length === 2) {
        lastDist = dist(e.touches[0], e.touches[1])
      }
    }
    const onMove = (e: any) => {
      e.preventDefault()
      const r = el.getBoundingClientRect()
      if (e.touches.length === 1 && lastSingle) {
        const t = e.touches[0]
        const dx = t.clientX - lastSingle.x
        const dy = t.clientY - lastSingle.y
        setTranslate({ x: lastSingle.tx + dx, y: lastSingle.ty + dy })
      } else if (e.touches.length === 2 && lastDist) {
        const d = dist(e.touches[0], e.touches[1])
        const m = midp(e.touches[0], e.touches[1])
        const factor = d / lastDist
        const s = scaleRef.current
        const ns = Math.min(4, Math.max(0.25, s * factor))
        const wx = (m.x - r.left - translateRef.current.x) / s
        const wy = (m.y - r.top - translateRef.current.y) / s
        setTranslate({ x: m.x - r.left - wx * ns, y: m.y - r.top - wy * ns })
        setScale(ns)
        lastDist = d
      }
    }
    const onEnd = (e: any) => {
      if (e.touches.length === 0) {
        if (lastSingle) {
          const now = Date.now()
          if (now - lastTap < 300) {
            const r2 = el.getBoundingClientRect()
            const s = scaleRef.current
            const ns = Math.min(4, Math.max(0.25, s * 1.8))
            const wx = (lastSingle.x - r2.left - translateRef.current.x) / s
            const wy = (lastSingle.y - r2.top - translateRef.current.y) / s
            setTranslate({ x: lastSingle.x - r2.left - wx * ns, y: lastSingle.y - r2.top - wy * ns })
            setScale(ns)
          }
          lastTap = now
        }
        lastSingle = null
        lastDist = 0
      }
    }
    el.addEventListener('touchstart', onStart, { passive: false })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd, { passive: false })
    el.addEventListener('touchcancel', onEnd, { passive: false })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
      el.removeEventListener('touchcancel', onEnd)
    }
  }, [viewMode])

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id); else n.add(id)
      try { localStorage.setItem('levelup_completed', JSON.stringify([...n])) } catch { /* ignore */ }
      return n
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      {/* Daily "cron" bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '10px 14px', borderRadius: 14, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.15)' }}>
        <span style={{ fontSize: 18 }}>🔥</span>
        <span style={{ fontWeight: 900, fontSize: 16 }}>{streak}</span>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>day streak</span>
        <span style={{ flex: 1, minWidth: 140, fontSize: 13, color: '#e2e8f0' }}>🎯 {quest}</span>
        {typeof Notification !== 'undefined' && (
          <button className="btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }} onClick={enableNotif}>
            {notifOn ? '🔔 On' : '🔔 Remind me'}
          </button>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, background: 'rgba(15,23,42,0.6)', padding: 4, borderRadius: 12, border: '1px solid rgba(148,163,184,0.15)' }}>
          <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 14px' }} onClick={() => setViewMode('tree')}>🌳 شجرة</button>
          <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 14px' }} onClick={() => setViewMode('grid')}>▦ شبكة</button>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn-secondary" style={{ fontSize: 18, padding: '8px 14px', minWidth: 46, minHeight: 42, touchAction: 'manipulation' }} onClick={() => zoomBy(1.2)}>➕</button>
          <button className="btn-secondary" style={{ fontSize: 18, padding: '8px 14px', minWidth: 46, minHeight: 42, touchAction: 'manipulation' }} onClick={() => zoomBy(1 / 1.2)}>➖</button>
          <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 14px', minHeight: 42, touchAction: 'manipulation' }} onClick={fit}>⤢ ملاءمة</button>
        </div>
        <span style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>
          📱 pinch to zoom · drag to pan · tap a node
        </span>
      </div>

      {/* Canvas */}
      {viewMode === 'tree' ? (
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onWheel={onWheel}
          style={{ position: 'relative', flex: 1, minHeight: 460, overflow: 'hidden', borderRadius: 18, background: 'radial-gradient(circle at 50% 35%, rgba(168,85,247,0.10), rgba(2,6,23,0.6) 70%)', border: '1px solid rgba(148,163,184,0.12)', touchAction: 'none', cursor: 'grab' }}
        >
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`, transformOrigin: '0 0' }}>
            <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, zIndex: 0, pointerEvents: 'none', overflow: 'visible' }}>
              {edges.map((e) => {
                const p = pos[e.from]; const c = pos[e.to]
                const dx = c.x - p.x; const dy = c.y - p.y
                const c1x = p.x + dx * 0.4; const c1y = p.y + dy * 0.08
                const c2x = p.x + dx * 0.6; const c2y = c.y - dy * 0.08
                const col = (nodes.find((n) => n.id === e.to)?.color) || '#64748b'
                return (
                  <path key={`${e.from}-${e.to}`} d={`M ${p.x} ${p.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${c.x} ${c.y}`}
                    stroke={col} strokeOpacity={0.45} strokeWidth={2.5} fill="none" />
                )
              })}
            </svg>
            {nodes.map((n) => (
              <NodeCard key={n.id} node={n} x={pos[n.id].x} y={pos[n.id].y} completed={completed.has(n.id)} onSelect={setSelected} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card-grid" style={{ overflowY: 'auto', flex: 1, paddingBottom: 20 }}>
          {nodes.filter((n) => n.id !== 'intro').map((n) => (
            <motion.div
              key={n.id}
              onClick={() => setSelected(n)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-strong"
              style={{ padding: 16, borderRadius: 16, border: `1.5px solid ${(n.color || '#64748b')}66`, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{n.icon || '•'}</span>
                <div>
                  <div style={{ fontWeight: 800, color: '#e2e8f0' }}>{n.title}</div>
                  {n.ar && <div style={{ fontSize: 12, color: '#94a3b8' }}>{n.ar}</div>}
                </div>
              </div>
              {n.subtitle && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>{n.subtitle}</div>}
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                {n.course && <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: `${(n.color || '#64748b')}22`, color: n.color || '#94a3b8', fontWeight: 700 }}>📚 {n.course.provider}</span>}
                {n.guest && <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: 'rgba(251,191,36,0.14)', color: '#fbbf24', fontWeight: 700 }}>👤 {n.guest.name}</span>}
                {completed.has(n.id) && <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: 'rgba(34,197,94,0.16)', color: '#4ade80', fontWeight: 700 }}>✅ done</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <DetailModal node={selected} completed={completed.has(selected.id)} onToggle={toggleComplete} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
