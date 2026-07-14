import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

// Persistent player progress: streak, XP/level, coins, completed quests, daily challenge.
// Stored in localStorage so progress survives reloads (no backend required).

export interface ProgressState {
  coins: number
  xp: number
  level: number
  title: string
  streak: number
  lastVisit: string | null // YYYY-MM-DD
  completedQuests: string[]
  dailyChallengeDate: string | null // YYYY-MM-DD the daily challenge was claimed
}

const STORAGE_KEY = 'levelup_progress_v1'

const TITLES: { min: number; title: string }[] = [
  { min: 0, title: 'مبتدئ' },
  { min: 100, title: 'متعلم' },
  { min: 300, title: 'متمرس' },
  { min: 600, title: 'ماهر' },
  { min: 1000, title: 'خبير' },
  { min: 1500, title: 'محترف' },
  { min: 2500, title: 'أسطورة' },
]

const DAILY_XP = 50
const DAILY_COINS = 10

function levelForXp(xp: number): { level: number; title: string } {
  const level = Math.floor(xp / 100) + 1
  let title = TITLES[0].title
  for (const t of TITLES) if (xp >= t.min) title = t.title
  return { level, title }
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00')
  const db = new Date(b + 'T00:00:00')
  return Math.round((db.getTime() - da.getTime()) / 86400000)
}

function defaultState(): ProgressState {
  const { level, title } = levelForXp(0)
  return { coins: 0, xp: 0, level, title, streak: 0, lastVisit: null, completedQuests: [], dailyChallengeDate: null }
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      const { level, title } = levelForXp(p.xp ?? 0)
      return {
        coins: p.coins ?? 0,
        xp: p.xp ?? 0,
        level,
        title,
        streak: p.streak ?? 0,
        lastVisit: p.lastVisit ?? null,
        completedQuests: p.completedQuests ?? [],
        dailyChallengeDate: p.dailyChallengeDate ?? null,
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
  return defaultState()
}

interface ProgressContextValue extends ProgressState {
  awardQuest: (questId: string, xp: number) => boolean
  addXp: (n: number) => void
  addCoins: (n: number) => void
  recordVisit: () => void
  claimDailyChallenge: () => boolean
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => load())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage may be unavailable */
    }
  }, [state])

  const recordVisit = () => {
    const today = todayStr()
    setState((s) => {
      if (s.lastVisit === today) return s
      let streak = s.streak
      if (s.lastVisit) {
        const diff = daysBetween(s.lastVisit, today)
        if (diff === 1) streak = s.streak + 1
        else if (diff > 1) streak = 1
      } else {
        streak = 1
      }
      return { ...s, streak, lastVisit: today }
    })
  }

  const awardQuest = (questId: string, xp: number): boolean => {
    if (state.completedQuests.includes(questId)) return false
    setState((s) => {
      const newXp = s.xp + xp
      const { level, title } = levelForXp(newXp)
      return {
        ...s,
        xp: newXp,
        level,
        title,
        coins: s.coins + Math.round(xp / 10),
        completedQuests: [...s.completedQuests, questId],
      }
    })
    return true
  }

  const addXp = (n: number) => {
    setState((s) => {
      const newXp = s.xp + n
      const { level, title } = levelForXp(newXp)
      return { ...s, xp: newXp, level, title }
    })
  }

  const addCoins = (n: number) => {
    setState((s) => ({ ...s, coins: Math.max(0, s.coins + n) }))
  }

  const claimDailyChallenge = (): boolean => {
    const today = todayStr()
    if (state.dailyChallengeDate === today) return false
    setState((s) => {
      const newXp = s.xp + DAILY_XP
      const { level, title } = levelForXp(newXp)
      return { ...s, xp: newXp, level, title, coins: s.coins + DAILY_COINS, dailyChallengeDate: today }
    })
    return true
  }

  const resetProgress = () => setState(defaultState())

  const value: ProgressContextValue = {
    ...state,
    awardQuest,
    addXp,
    addCoins,
    recordVisit,
    claimDailyChallenge,
    resetProgress,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider')
  return ctx
}
