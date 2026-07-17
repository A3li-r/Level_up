import type { Language } from './context/PreferencesContext'

// Minimal i18n layer (roadmap #7 groundwork, used by Settings now).
// Only nav labels + a handful of core UI strings are translated so far.
// Add more keys here as additional pages get localized. The `useT` hook in
// App reads the user's language pref and returns the right string table.
//
// Keep keys stable — they are referenced by id from components.

export type StringKey =
  | 'nav.dashboard'
  | 'nav.skills'
  | 'nav.focus'
  | 'nav.graph'
  | 'nav.roadmap'
  | 'nav.ideas'
  | 'nav.courses'
  | 'nav.devpaths'
  | 'nav.rewards'
  | 'nav.community'
  | 'nav.quests'
  | 'nav.achievements'
  | 'nav.aiadvice'
  | 'nav.settings'
  | 'app.tagline'

const AR: Record<StringKey, string> = {
  'nav.dashboard': 'Dashboard',
  'nav.skills': 'Skill Tree',
  'nav.focus': 'Focus',
  'nav.graph': 'Knowledge',
  'nav.roadmap': 'Roadmap',
  'nav.ideas': 'أفكار',
  'nav.courses': 'كورسات',
  'nav.devpaths': 'مسارات',
  'nav.rewards': 'مكافآت',
  'nav.community': 'مجتمع',
  'nav.quests': 'كويستس',
  'nav.achievements': 'إنجازات',
  'nav.aiadvice': 'مستشار',
  'nav.settings': 'الإعدادات',
  'app.tagline': 'Level up your life',
}

const EN: Record<StringKey, string> = {
  'nav.dashboard': 'Dashboard',
  'nav.skills': 'Skill Tree',
  'nav.focus': 'Focus',
  'nav.graph': 'Knowledge',
  'nav.roadmap': 'Roadmap',
  'nav.ideas': 'Ideas',
  'nav.courses': 'Courses',
  'nav.devpaths': 'Paths',
  'nav.rewards': 'Rewards',
  'nav.community': 'Community',
  'nav.quests': 'Quests',
  'nav.achievements': 'Achievements',
  'nav.aiadvice': 'Advisor',
  'nav.settings': 'Settings',
  'app.tagline': 'Level up your life',
}

export function translate(lang: Language, key: StringKey): string {
  return lang === 'en' ? EN[key] : AR[key]
}
