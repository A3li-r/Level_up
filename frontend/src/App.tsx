import { useState, useEffect } from 'react'
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
import { PreferencesProvider, usePreferences, ACCENT_HEX } from './context/PreferencesContext'
import { AuthProvider, useAuth, type AuthUser } from './context/AuthContext'
import Login from './pages/Login'
import Settings from './pages/Settings'
import { translate } from './i18n'
import './index.css'

type Tab = 'dashboard' | 'skills' | 'focus' | 'graph' | 'roadmap' | 'ideas' | 'courses' | 'devpaths' | 'rewards' | 'community' | 'quests' | 'achievements' | 'aiadvice' | 'settings'

const TABS_META: { id: Tab; key: 'nav.dashboard' | 'nav.skills' | 'nav.focus' | 'nav.graph' | 'nav.roadmap' | 'nav.ideas' | 'nav.courses' | 'nav.devpaths' | 'nav.rewards' | 'nav.community' | 'nav.quests' | 'nav.achievements' | 'nav.aiadvice' | 'nav.settings'; icon: string; color: string }[] = [
  { id: 'dashboard', key: 'nav.dashboard', icon: '◈', color: '#a855f7' },
  { id: 'skills', key: 'nav.skills', icon: '⬡', color: '#22d3ee' },
  { id: 'focus', key: 'nav.focus', icon: '◎', color: '#34d399' },
  { id: 'graph', key: 'nav.graph', icon: '⬢', color: '#3b82f6' },
  { id: 'roadmap', key: 'nav.roadmap', icon: '◇', color: '#f472b6' },
  { id: 'ideas', key: 'nav.ideas', icon: '✧', color: '#facc15' },
  { id: 'courses', key: 'nav.courses', icon: '◆', color: '#fb923c' },
  { id: 'devpaths', key: 'nav.devpaths', icon: '⬡', color: '#f87171' },
  { id: 'rewards', key: 'nav.rewards', icon: '❖', color: '#c084fc' },
  { id: 'community', key: 'nav.community', icon: '◉', color: '#06b6d4' },
  { id: 'quests', key: 'nav.quests', icon: '⚔', color: '#e879f9' },
  { id: 'achievements', key: 'nav.achievements', icon: '★', color: '#fbbf24' },
  { id: 'aiadvice', key: 'nav.aiadvice', icon: '✨', color: '#c084fc' },
  { id: 'settings', key: 'nav.settings', icon: '⚙', color: '#94a3b8' },
]

// Tabs are rendered with language-aware labels inside the Header (needs prefs).
function useTabs(): { id: Tab; label: string; icon: string; color: string }[] {
  const { language } = usePreferences()
  return TABS_META.map((t) => ({ ...t, label: translate(language, t.key) }))
}

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
}

function Header({ activeTab, onTab, user, onLogout }: { activeTab: Tab; onTab: (t: Tab) => void; user: AuthUser | null; onLogout: () => void }) {
  const progress = useProgress()
  const tabs = useTabs()
  const levelProgress = progress.xp % 100
  const initial = (user?.displayName || user?.email || 'ض')?.charAt(0)?.toUpperCase() || 'ض'

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <motion.div
          style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--user-accent, #a855f7), #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            boxShadow: '0 4px 20px var(--user-accent-soft, rgba(168, 85, 247, 0.3))',
          }}
          whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}
        >
          ◈
        </motion.div>
        <div>
          <motion.h1
            style={{
              fontSize: '18px', fontWeight: 900,
              background: 'linear-gradient(135deg, #a855f7, #22d3ee, #34d399)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.5px',
            }}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          >
            Level Up
          </motion.h1>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>Level up your life</span>
        </div>
      </div>

      <nav className="nav-tabs">
        <AnimatePresence>
          {tabs.map((tab, i) => (
            <motion.button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTab(tab.id)}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              style={activeTab === tab.id
                ? { background: `linear-gradient(135deg, ${tab.color}, ${tab.color}88)`, boxShadow: `0 2px 12px ${tab.color}44` }
                : {}}
            >
              <span style={{ fontSize: 14 }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {user && (
          <motion.div
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          >
            {user.photoURL ? (
              <img src={user.photoURL} alt="" style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid rgba(168,85,247,0.5)' }} />
            ) : (
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff' }}>
                {initial}
              </div>
            )}
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.isAnonymous ? 'ضيف' : (user.displayName || user.email?.split('@')[0])}
            </span>
            <motion.button whileTap={{ scale: 0.95 }} onClick={onLogout} title="تسجيل الخروج"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171', borderRadius: 'var(--radius-full)', padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}>
              خروج
            </motion.button>
          </motion.div>
        )}

        <motion.div className="streak-fire" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title={`سلسلة الأيام: ${progress.streak} يوم`}>
          <span style={{ fontSize: 14 }}>🔥</span>
          <span>{progress.streak}</span>
        </motion.div>

        <motion.div
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px',
            background: 'rgba(250, 204, 21, 0.08)', borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(250, 204, 21, 0.2)', cursor: 'pointer',
          }}
          whileHover={{ scale: 1.05, background: 'rgba(250, 204, 21, 0.15)' }} whileTap={{ scale: 0.95 }}
        >
          <span style={{ fontSize: 14 }}>🪙</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>{progress.coins}</span>
        </motion.div>

        <motion.div className="level-badge" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <span className="level-number">{progress.level}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>{progress.title}</span>
            <div className="xp-bar" style={{ width: '50px' }}>
              <motion.div className="xp-bar-fill" initial={{ width: 0 }} animate={{ width: `${levelProgress}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

function Splash() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <motion.div
        animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
        style={{ width: 46, height: 46, borderRadius: '50%', border: '3px solid rgba(168,85,247,0.2)', borderTopColor: '#a855f7' }}
      />
      <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>جاري التحميل...</span>
    </div>
  )
}

// Applies the user's accent color + density to the global chrome.
// Reads prefs and writes CSS custom properties / a data attribute on <html>,
// so every page inherits the personalization without prop-drilling.
function PersonalizationLayer({ children }: { children: React.ReactNode }) {
  const { accent, density } = usePreferences()
  useEffect(() => {
    const hex = ACCENT_HEX[accent]
    const root = document.documentElement
    root.style.setProperty('--user-accent', hex)
    root.style.setProperty('--user-accent-soft', `${hex}40`)
    root.dataset.density = density
  }, [accent, density])
  return <>{children}</>
}

function AppShell() {
  const { user, loading, configured, logout } = useAuth()
  const prefs = usePreferences()
  // Respect the user's default-view preference on first mount.
  const [activeTab, setActiveTab] = useState<Tab>(prefs.defaultView)

  if (loading) return <Splash />

  // Login screen only appears once Firebase is actually configured (valid key present).
  if (configured && !user) return <Login />

  return (
    <PreferencesProvider userId={configured ? user?.uid : null} key={user?.uid}>
      <ProgressProvider userId={configured ? user?.uid : null} key={user?.uid}>
        <PersonalizationLayer>
          <div style={{ minHeight: '100vh' }}>
            <Header activeTab={activeTab} onTab={setActiveTab} user={configured ? user : null} onLogout={logout} />
            <main className="page-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={pageVariants}
                  initial="initial" animate="animate" exit="exit"
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
                  {activeTab === 'settings' && <Settings />}
                </motion.div>
              </AnimatePresence>
            </main>
            <div style={{ height: 'env(safe-area-inset-bottom, 20px)' }} />
          </div>
        </PersonalizationLayer>
      </ProgressProvider>
    </PreferencesProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
