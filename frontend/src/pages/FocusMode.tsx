import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const presets = [
  { label: '25 دقيقة', value: 25, icon: '◎' },
  { label: '45 دقيقة', value: 45, icon: '◈' },
  { label: '60 دقيقة', value: 60, icon: '⬡' },
  { label: '90 دقيقة', value: 90, icon: '◆' },
]

export default function FocusMode() {
  const [duration, setDuration] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [sessionXP, setSessionXP] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            setCompleted(true)
            setSessionXP(duration * 2)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, isPaused, duration, timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100

  const startTimer = (mins: number) => {
    setDuration(mins)
    setTimeLeft(mins * 60)
    setIsRunning(false)
    setIsPaused(false)
    setCompleted(false)
    setSessionXP(0)
  }

  const toggleTimer = () => {
    if (isRunning) {
      setIsPaused(!isPaused)
    } else {
      setIsRunning(true)
      setIsPaused(false)
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(duration * 60)
    setCompleted(false)
    setSessionXP(0)
  }

  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ justifyContent: 'center' }}
        >
          <span style={{ color: '#34d399' }}>◎</span> وضع التركيز
        </motion.h2>
        <p className="section-subtitle" style={{ textAlign: 'center' }}>
          ركّز واحصل على XP مع كل جلسة ناجحة
        </p>
      </div>

      {/* Presets */}
      <motion.div 
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {presets.map(preset => (
          <motion.button
            key={preset.value}
            onClick={() => startTimer(preset.value)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: duration === preset.value ? 'var(--accent-green)' : 'var(--border)',
              background: duration === preset.value 
                ? 'linear-gradient(135deg, rgba(52, 211, 153, 0.15), rgba(52, 211, 153, 0.05))' 
                : 'rgba(255, 255, 255, 0.03)',
              color: duration === preset.value ? 'var(--accent-green)' : 'var(--text-secondary)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Tajawal, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>{preset.icon}</span>
            {preset.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Timer Circle */}
      <motion.div
        style={{ position: 'relative', width: 280, height: 280 }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <svg width="280" height="280" viewBox="0 0 280 280">
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke={completed ? 'var(--accent-green)' : 'url(#gradient)'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 140 140)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Timer Display */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}>
          <AnimatePresence mode="wait">
            {completed ? (
              <motion.div
                key="completed"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-green)' }}>
                  أحسنت! أنهيت الجلسة
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                  +{sessionXP} XP
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="timer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center' }}
              >
                <div className="focus-timer" style={{ fontSize: 56 }}>
                  {formatTime(timeLeft)}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {isRunning ? (isPaused ? 'متوقف' : 'جاري التركيز...') : 'جاهز للبدء'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        style={{ display: 'flex', gap: 12 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          className="btn-primary"
          onClick={toggleTimer}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{ minWidth: 120 }}
        >
          {isRunning ? (isPaused ? '▶ استئناف' : '⏸ إيقاف') : '▶ ابدأ'}
        </motion.button>
        <motion.button
          className="btn-secondary"
          onClick={resetTimer}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          ↺ إعادة
        </motion.button>
      </motion.div>

      {/* Session Stats */}
      <motion.div
        className="glass"
        style={{ 
          padding: 20, 
          width: '100%', 
          maxWidth: 400,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16,
          textAlign: 'center'
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent-green)' }}>
            {Math.floor(progress)}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>التقدم</div>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent-cyan)' }}>
            {Math.floor((duration * 60 - timeLeft) / 60)}m
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>الوقت المنقضي</div>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent-orange)' }}>
            {sessionXP || duration * 2}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>XP متوقع</div>
        </div>
      </motion.div>
    </div>
  )
}
