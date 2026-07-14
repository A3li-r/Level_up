import { useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text-primary)',
  fontSize: 15,
  outline: 'none',
  marginBottom: 12,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

function mapError(e: unknown): string {
  const code = String((e as any)?.code || (e as any)?.message || '')
  if (code.includes('auth-not-configured')) return 'خدمة الدخول غير مهيأة بعد — أبلغ المطور.'
  if (code.includes('popup-closed')) return 'تم إغلاق نافذة التسجيل.'
  if (code.includes('popup-blocked')) return 'تم حظر النافذة المنبثقة — اسمح بها من إعدادات المتصفح.'
  if (code.includes('invalid-credential') || code.includes('wrong-password')) return 'البريد أو كلمة المرور غير صحيحة.'
  if (code.includes('user-not-found')) return 'لا يوجد حساب بهذا البريد.'
  if (code.includes('email-already-in-use')) return 'هذا البريد مسجل مسبقاً.'
  if (code.includes('weak-password')) return 'كلمة المرور ضعيفة (6 أحرف على الأقل).'
  if (code.includes('network')) return 'تعذر الاتصال — تحقق من الإنترنت.'
  return 'حدث خطأ، حاول مرة أخرى.'
}

export default function Login() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, continueAsGuest } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<null | 'google' | 'email' | 'guest'>(null)

  const handleGoogle = async () => {
    setError(null); setBusy('google')
    try { await loginWithGoogle() }
    catch (e) { setError(mapError(e)) }
    finally { setBusy(null) }
  }

  const handleEmail = async () => {
    setError(null); setBusy('email')
    try {
      if (mode === 'login') await loginWithEmail(email.trim(), password)
      else await registerWithEmail(email.trim(), password, username.trim() || email.split('@')[0])
    } catch (e) { setError(mapError(e)) }
    finally { setBusy(null) }
  }

  const handleGuest = async () => {
    setError(null); setBusy('guest')
    try { await continueAsGuest() }
    catch (e) { setError(mapError(e)) }
    finally { setBusy(null) }
  }

  const primaryLabel = busy === 'email'
    ? '...جاري التحميل'
    : mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', zIndex: 1 }}>
      <style>{`.lu-input:focus{border-color:#a855f7 !important;box-shadow:0 0 0 3px rgba(168,85,247,0.25);} .lu-btn:active{transform:scale(0.99);}`}</style>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ width: '100%', maxWidth: 420, background: 'rgba(17,17,40,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 'clamp(22px, 5vw, 36px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 22 }}>
          <motion.div initial={{ scale: 0.8, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#a855f7,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 4px 20px rgba(168,85,247,0.4)' }}>
            ◈
          </motion.div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, background: 'linear-gradient(135deg,#a855f7,#22d3ee,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Level Up</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>ارفع مستواك في الحياة</p>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 800, textAlign: 'center', margin: '0 0 18px' }}>{mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h2>

        <motion.button whileTap={{ scale: 0.98 }} onClick={handleGoogle} disabled={busy !== null}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.14)', background: '#ffffff', color: '#1f1f1f', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: busy ? 0.7 : 1 }}>
          <GoogleIcon /> المتابعة مع Google
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0', color: 'var(--text-muted)', fontSize: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} /> أو <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <input className="lu-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" dir="ltr"
          style={inputStyle} inputMode="email" autoComplete="email" />

        {mode === 'register' && (
          <input className="lu-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="اسم المستخدم" dir="auto"
            style={inputStyle} autoComplete="username" />
        )}

        <div style={{ position: 'relative' }}>
          <input className="lu-input" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" dir="ltr"
            style={{ ...inputStyle, paddingLeft: 44 }} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          <button type="button" onClick={() => setShowPassword((s) => !s)}
            style={{ position: 'absolute', left: 8, top: 8, height: 36, width: 36, border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}
            aria-label={showPassword ? 'إخفاء' : 'إظهار'}>
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', color: '#fca5a5', padding: '10px 12px', borderRadius: 10, fontSize: 13, marginBottom: 12 }}>
            {error}
          </motion.div>
        )}

        <motion.button className="lu-btn" whileTap={{ scale: 0.99 }} onClick={handleEmail} disabled={busy !== null}
          style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#a855f7,#3b82f6)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', opacity: busy ? 0.7 : 1, boxShadow: '0 4px 16px rgba(168,85,247,0.35)' }}>
          {primaryLabel}
        </motion.button>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginTop: 14, marginBottom: 4 }}>
          {mode === 'login' ? 'ليس لديك حساب؟ ' : 'عندك حساب؟ '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
            style={{ background: 'none', border: 'none', color: '#a855f7', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            {mode === 'login' ? 'أنشئ حساب' : 'تسجيل الدخول'}
          </button>
        </p>

        <button onClick={handleGuest} disabled={busy !== null}
          style={{ width: '100%', marginTop: 4, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
          المتابعة كضيف
        </button>
      </motion.div>
    </div>
  )
}
