import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

// Per-user preferences (roadmap item #1).
//
// Stored client-side in localStorage so personalization works today without the
// backend deployed. The shape mirrors what we'll eventually persist via the
// Express/Prisma API: a single flat `UserPrefs` document keyed by userId.
// To migrate later, swap `load`/`save` for API calls and keep the same context API.

export type AccentColor = 'purple' | 'blue' | 'cyan' | 'green' | 'yellow' | 'pink'
export type Density = 'comfortable' | 'compact'
export type DefaultView = 'dashboard' | 'skills' | 'roadmap' | 'graph'
export type Language = 'ar' | 'en'
export type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced'

export interface UserPrefs {
  accent: AccentColor
  density: Density
  defaultView: DefaultView
  language: Language
  difficulty: Difficulty
  // Which top-level skill-tree paths the user wants highlighted/shown.
  // Empty array = show all (no filtering).
  visibleBranches: string[]
  // UI chrome toggles.
  animations: boolean
  dailyReminders: boolean
}

const STORAGE_PREFIX = 'levelup_prefs_v1'

// Maps our semantic accent names to the actual hex used by the design system.
export const ACCENT_HEX: Record<AccentColor, string> = {
  purple: '#a855f7',
  blue: '#3b82f6',
  cyan: '#22d3ee',
  green: '#34d399',
  yellow: '#facc15',
  pink: '#f472b6',
}

// Arabic + English labels for the accent picker.
export const ACCENT_LABELS: Record<AccentColor, { ar: string; en: string }> = {
  purple: { ar: 'بنفسجي', en: 'Purple' },
  blue: { ar: 'أزرق', en: 'Blue' },
  cyan: { ar: 'سماوي', en: 'Cyan' },
  green: { ar: 'أخضر', en: 'Green' },
  yellow: { ar: 'أصفر', en: 'Yellow' },
  pink: { ar: 'وردي', en: 'Pink' },
}

function storageKey(userId?: string | null): string {
  return userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX
}

function defaultPrefs(): UserPrefs {
  return {
    accent: 'purple',
    density: 'comfortable',
    defaultView: 'dashboard',
    language: 'ar',
    difficulty: 'all',
    visibleBranches: [],
    animations: true,
    dailyReminders: true,
  }
}

function load(userId?: string | null): UserPrefs {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (raw) {
      const p = JSON.parse(raw)
      // Merge over defaults so newly added fields always have a value.
      return { ...defaultPrefs(), ...p }
    }
  } catch {
    /* corrupt storage — fall back to defaults */
  }
  return defaultPrefs()
}

interface PreferencesContextValue extends UserPrefs {
  setPref: <K extends keyof UserPrefs>(key: K, value: UserPrefs[K]) => void
  toggleBranch: (branchId: string) => void
  resetPrefs: () => void
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function PreferencesProvider({ children, userId }: { children: ReactNode; userId?: string | null }) {
  const [prefs, setPrefs] = useState<UserPrefs>(() => load(userId))

  // Persist on change.
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(prefs))
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [prefs, userId])

  const setPref = <K extends keyof UserPrefs>(key: K, value: UserPrefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }))
  }

  const toggleBranch = (branchId: string) => {
    setPrefs((p) => {
      const has = p.visibleBranches.includes(branchId)
      return {
        ...p,
        visibleBranches: has
          ? p.visibleBranches.filter((b) => b !== branchId)
          : [...p.visibleBranches, branchId],
      }
    })
  }

  const resetPrefs = () => setPrefs(defaultPrefs())

  const value: PreferencesContextValue = {
    ...prefs,
    setPref,
    toggleBranch,
    resetPrefs,
  }

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used within a PreferencesProvider')
  return ctx
}
