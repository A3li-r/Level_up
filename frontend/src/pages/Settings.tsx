import { motion } from 'framer-motion'
import {
  usePreferences,
  ACCENT_HEX,
  ACCENT_LABELS,
  type AccentColor,
  type Density,
  type DefaultView,
  type Difficulty,
} from '../context/PreferencesContext'
import { PATH_SUMMARY } from './SkillTree'
import { translate, type StringKey } from '../i18n'

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <motion.section
      className="glass"
      style={{ padding: 22, borderRadius: 'var(--radius-lg)', marginBottom: 18 }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>{title}</h2>
      {hint && <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 16 }}>{hint}</p>}
      {children}
    </motion.section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '10px 0' }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{children}</div>
    </div>
  )
}

const ACCENTS: AccentColor[] = ['purple', 'blue', 'cyan', 'green', 'yellow', 'pink']
const VIEWS: { id: DefaultView; ar: string; en: string }[] = [
  { id: 'dashboard', ar: 'Dashboard', en: 'Dashboard' },
  { id: 'skills', ar: 'شجرة المهارات', en: 'Skill Tree' },
  { id: 'roadmap', ar: 'خارطة الطريق', en: 'Roadmap' },
  { id: 'graph', ar: 'الشبكة المعرفية', en: 'Knowledge Graph' },
]
const DIFFS: { id: Difficulty; ar: string; en: string }[] = [
  { id: 'all', ar: 'الكل', en: 'All' },
  { id: 'beginner', ar: 'مبتدئ', en: 'Beginner' },
  { id: 'intermediate', ar: 'متوسط', en: 'Intermediate' },
  { id: 'advanced', ar: 'متقدم', en: 'Advanced' },
]

export default function Settings() {
  const prefs = usePreferences()
  const t = (k: StringKey) => translate(prefs.language, k)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '8px 4px 40px' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, background: 'linear-gradient(135deg, #a855f7, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('nav.settings')}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          {prefs.language === 'en'
            ? 'Personalize Level Up to match your goals and needs.'
            : 'خصّص تجربة Level Up لتناسب أهدافك واحتياجاتك.'}
        </p>
      </motion.div>

      {/* ── Appearance ── */}
      <Section title={prefs.language === 'en' ? 'Appearance' : 'المظهر'}>
        <Row label={prefs.language === 'en' ? 'Accent color' : 'لون التمييز'}>
          <div style={{ display: 'flex', gap: 8 }}>
            {ACCENTS.map((a) => {
              const active = prefs.accent === a
              return (
                <motion.button
                  key={a}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => prefs.setPref('accent', a)}
                  title={prefs.language === 'en' ? ACCENT_LABELS[a].en : ACCENT_LABELS[a].ar}
                  style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: ACCENT_HEX[a],
                    border: active ? '3px solid #fff' : '2px solid rgba(255,255,255,0.15)',
                    boxShadow: active ? `0 0 14px ${ACCENT_HEX[a]}` : 'none',
                    cursor: 'pointer',
                  }}
                />
              )
            })}
          </div>
        </Row>

        <Row label={prefs.language === 'en' ? 'Layout density' : 'كثافة التخطيط'}>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['comfortable', 'compact'] as Density[]).map((d) => {
              const active = prefs.density === d
              const label = d === 'compact' ? (prefs.language === 'en' ? 'Compact' : 'مضغوط') : (prefs.language === 'en' ? 'Comfortable' : 'مريح')
              return (
                <button
                  key={d}
                  onClick={() => prefs.setPref('density', d)}
                  className={active ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: 13, padding: '8px 16px' }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </Row>

        <Row label={prefs.language === 'en' ? 'Animations' : 'الحركات'}>
          <Toggle on={prefs.animations} onChange={(v) => prefs.setPref('animations', v)} />
        </Row>
      </Section>

      {/* ── Language & default view ── */}
      <Section title={prefs.language === 'en' ? 'Language & Start' : 'اللغة والبداية'}>
        <Row label={prefs.language === 'en' ? 'Interface language' : 'لغة الواجهة'}>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['ar', 'en'] as const).map((l) => {
              const active = prefs.language === l
              return (
                <button
                  key={l}
                  onClick={() => prefs.setPref('language', l)}
                  className={active ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: 13, padding: '8px 18px' }}
                >
                  {l === 'ar' ? 'العربية' : 'English'}
                </button>
              )
            })}
          </div>
        </Row>

        <Row label={prefs.language === 'en' ? 'Default view' : 'الشاشة الافتراضية'}>
          <select
            value={prefs.defaultView}
            onChange={(e) => prefs.setPref('defaultView', e.target.value as DefaultView)}
            style={selectStyle}
          >
            {VIEWS.map((v) => (
              <option key={v.id} value={v.id}>{prefs.language === 'en' ? v.en : v.ar}</option>
            ))}
          </select>
        </Row>
      </Section>

      {/* ── Learning focus ── */}
      <Section
        title={prefs.language === 'en' ? 'Learning Focus' : 'التركيز في التعلّم'}
        hint={prefs.language === 'en'
          ? 'Filter the skill tree and recommendations to what matters to you.'
          : 'صفِ شجرة المهارات والتوصيات بما يهمّك.'}
      >
        <Row label={prefs.language === 'en' ? 'Difficulty level' : 'مستوى الصعوبة'}>
          <select
            value={prefs.difficulty}
            onChange={(e) => prefs.setPref('difficulty', e.target.value as Difficulty)}
            style={selectStyle}
          >
            {DIFFS.map((d) => (
              <option key={d.id} value={d.id}>{prefs.language === 'en' ? d.en : d.ar}</option>
            ))}
          </select>
        </Row>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
            {prefs.language === 'en' ? 'Highlighted paths' : 'المسارات المميَّزة'}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
            {prefs.language === 'en'
              ? 'Leave all unselected to show every path. Selecting some highlights them across the app.'
              : 'اترك الكل غير محدد لإظهار كل المسارات. تحديد بعضها يميّزها عبر التطبيق.'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PATH_SUMMARY.map((p) => {
              const active = prefs.visibleBranches.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => prefs.toggleBranch(p.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '8px 14px', borderRadius: 'var(--radius-full)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    background: active ? `${p.color}22` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${active ? p.color : 'var(--border-hover)'}`,
                    color: active ? p.color : 'var(--text-secondary)',
                    boxShadow: active ? `0 0 12px ${p.color}33` : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>{p.icon}</span>
                  <span>{prefs.language === 'en' ? p.nameEn : p.name}</span>
                  {active && <span style={{ fontSize: 12 }}>✓</span>}
                </button>
              )
            })}
          </div>
        </div>

        <Row label={prefs.language === 'en' ? 'Daily reminders' : 'تذكيرات يومية'}>
          <Toggle on={prefs.dailyReminders} onChange={(v) => prefs.setPref('dailyReminders', v)} />
        </Row>
      </Section>

      {/* ── Reset ── */}
      <Section title={prefs.language === 'en' ? 'Reset' : 'إعادة ضبط'}>
        <button onClick={prefs.resetPrefs} className="btn-secondary" style={{ fontSize: 13, padding: '10px 18px', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}>
          {prefs.language === 'en' ? 'Restore default settings' : 'استعادة الإعدادات الافتراضية'}
        </button>
      </Section>
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 46, height: 26, borderRadius: 999, padding: 3, cursor: 'pointer',
        background: on ? 'linear-gradient(135deg, #a855f7, #3b82f6)' : 'rgba(255,255,255,0.1)',
        border: '1px solid var(--border-hover)',
        transition: 'background 0.25s',
        display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start',
      }}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff' }}
      />
    </button>
  )
}

const selectStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border-hover)',
  color: 'var(--text-primary)',
  borderRadius: 'var(--radius-md)',
  padding: '8px 12px',
  fontSize: 14,
  fontFamily: 'Tajawal, sans-serif',
  cursor: 'pointer',
  minWidth: 160,
}
