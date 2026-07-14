import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import SkillTree from './pages/SkillTree'
import Quests from './pages/Quests'
import Achievements from './pages/Achievements'
import FocusMode from './pages/FocusMode'
import KnowledgeGraph from './pages/KnowledgeGraph'
import Roadmap from './pages/Roadmap'
import Ideas from './pages/Ideas'
import Courses from './pages/Courses'
import Rewards from './pages/Rewards'
import DevPaths from './pages/DevPaths'
import Community from './pages/Community'
import AIAdvice from './pages/AIAdvice'
import { ProgressProvider, useProgress } from './context/ProgressContext'
import './index.css'

type Tab = 'dashboard' | 'skills' | 'focus' | 'graph' | 'roadmap' | 'ideas' | 'courses' | 'devpaths' | 'rewards' | 'community' | 'quests' | 'achievements' | 'aiadvice'

const tabs: { id: Tab; label: string; icon: string; color: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈', color: '#a855f7' },
  { id: 'skills', label: 'Skill Tree', icon: '⬡', color: '#22d3ee' },
  { id: 'focus', label: 'Focus', icon: '◎', color: '#34d399' },
  { id: 'graph', label: 'Knowledge', icon: '⬢', color: '#3b82f6' },
  { id: 'roadmap', label: 'Roadmap', icon: '◇', color: '#f472b6' },
  { id: 'ideas', label: 'أفكار', icon: '✧', color: '#facc15' },
  { id: 'courses', label: 'كورسات', icon: '◆', color: '#fb923c' },
  { id: 'devpaths', label: 'مسارات', icon: '⬡', color: '#f87171' },
  { id: 'rewards', label: 'مكافآت', icon: '❖', color: '#c084fc' },
  { id: 'community', label: 'مجتمع', icon: '◉', color: '#06b6d4' },
  { id: 'quests', label: 'كويستس', icon: '⚔', color: '#e879f9' },
  { id: 'achievements', label: 'إنجازات', icon: '★', color: '#fbbf24' },
  { id: 'aiadvice', label: 'مستشار', icon: '✨', color: '#c084fc' },
]

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 }
}

function Header({ activeTab, onTab }: { activeTab: Tab; onTab: (t: Tab) => void }) {
  const progress = useProgress()
  const levelProgress = progress.xp % 100

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Logo */}
        <motion.div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)'
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          ◈
        </motion.div>
        <div>
          <motion.h1
            style={{
              fontSize: '18px',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #a855f7, #22d3ee, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px'
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Level Up
          </motion.h1>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
            Level up your life
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav-tabs">
        <AnimatePresence>
          {tabs.map((tab, i) => (
            <motion.button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              style={activeTab === tab.id ? {
                background: `linear-gradient(135deg, ${tab.color}, ${tab.color}88)`,
                boxShadow: `0 2px 12px ${tab.color}44`
              } : {}}
            >
              <span style={{ fontSize: 14 }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </nav>

      {/* User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Streak */}
        <motion.div
          className="streak-fire"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={`سلسلة الأيام: ${progress.streak} يوم`}
        >
          <span style={{ fontSize: 14 }}>🔥</span>
          <span>{progress.streak}</span>
        </motion.div>

        {/* Coins */}
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            background: 'rgba(250, 204, 21, 0.08)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(250, 204, 21, 0.2)',
            cursor: 'pointer'
          }}
          whileHover={{ scale: 1.05, background: 'rgba(250, 204, 21, 0.15)' }}
          whileTap={{ scale: 0.95 }}
        >
          <span style={{ fontSize: 14 }}>🪙</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>{progress.coins}</span>
        </motion.div>

        {/* Level Badge */}
        <motion.div
          className="level-badge"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="level-number">{progress.level}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>{progress.title}</span>
            <div className="xp-bar" style={{ width: '50px' }}>
              <motion.div
                className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  return (
    <ProgressProvider>
      <div style={{ minHeight: '100vh' }}>
        <Header activeTab={activeTab} onTab={setActiveTab} />

        {/* Main Content */}
        <main className="page-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'skills' && <SkillTree />}
              {activeTab === 'focus' && <FocusMode />}
              {activeTab === 'graph' && <KnowledgeGraph />}
              {activeTab === 'roadmap' && <Roadmap />}
              {activeTab === 'ideas' && <Ideas />}
              {activeTab === 'courses' && <Courses />}
              {activeTab === 'devpaths' && <DevPaths />}
              {activeTab === 'rewards' && <Rewards />}
              {activeTab === 'community' && <Community />}
              {activeTab === 'quests' && <Quests />}
              {activeTab === 'achievements' && <Achievements />}
              {activeTab === 'aiadvice' && <AIAdvice />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom safe area for mobile */}
        <div style={{ height: 'env(safe-area-inset-bottom, 20px)' }} />
      </div>
    </ProgressProvider>
  )
}

export default App
