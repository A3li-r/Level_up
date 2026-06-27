import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const rewards = [
  { id: 1, title: 'استراحة قهوة', cost: 50, icon: '☕', description: 'خذ استراحة 15 دقيقة', color: '#fb923c' },
  { id: 2, title: 'فيلم ليلة الجمعة', cost: 100, icon: '🎬', description: 'شاهد فيلم بدون شعور بالذنب', color: '#a855f7' },
  { id: 3, title: 'لعبة جديدة', cost: 200, icon: '🎮', description: 'اشترِ لعبة جديدة', color: '#22d3ee' },
  { id: 4, title: 'كتاب تطوير ذات', cost: 150, icon: '📚', description: 'كتاب جديد يثري معرفتك', color: '#34d399' },
  { id: 5, title: 'رحلة استكشافية', cost: 500, icon: '🏔', description: 'رحلة للطبيعة في عطلة الأسبوع', color: '#f472b6' },
  { id: 6, title: 'دورة مدفوعة', cost: 300, icon: '🎓', description: 'احصل على كورس مدفوع تختاره', color: '#facc15' },
  { id: 7, title: 'أداة جديدة', cost: 400, icon: '🔧', description: 'اشترِ أداة أو برنامج تحتاجه', color: '#06b6d4' },
  { id: 8, title: 'تبرع خيري', cost: 100, icon: '💝', description: 'تبرع بقيمة المكافأة للجمعية الخيرية', color: '#f87171' },
  { id: 9, title: 'حفل مع الأصدقاء', cost: 250, icon: '🎉', description: 'اعمل حفلة مع أصحابك', color: '#e879f9' },
  { id: 10, title: 'سفر مغامرة', cost: 1000, icon: '✈', description: 'رحلة لمدينة جديدة', color: '#3b82f6' },
]

export default function Rewards() {
  const [userCoins] = useState(350)
  const [purchased, setPurchased] = useState<number[]>([])
  const [selectedReward, setSelectedReward] = useState<typeof rewards[0] | null>(null)

  const handlePurchase = (reward: typeof rewards[0]) => {
    if (userCoins >= reward.cost) {
      setPurchased(prev => [...prev, reward.id])
      setSelectedReward(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span style={{ color: '#c084fc' }}>❖</span> متجر المكافآت
          </motion.h2>
          <p className="section-subtitle">
            استبدل عملاتك بمكافآت حقيقية تحفزك
          </p>
        </div>
        
        <motion.div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '10px 20px',
            background: 'rgba(250, 204, 21, 0.1)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(250, 204, 21, 0.25)'
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span style={{ fontSize: 18 }}>🪙</span>
          <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--accent-yellow)' }}>{userCoins}</span>
        </motion.div>
      </div>

      {/* Rewards Grid */}
      <div className="card-grid-sm">
        {rewards.map((reward, i) => {
          const isPurchased = purchased.includes(reward.id)
          const canAfford = userCoins >= reward.cost

          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, scale: canAfford && !isPurchased ? 1.02 : 1 }}
              onClick={() => !isPurchased && setSelectedReward(reward)}
              style={{
                padding: 18,
                borderRadius: 14,
                background: isPurchased 
                  ? 'rgba(52, 211, 153, 0.08)' 
                  : 'rgba(17, 17, 40, 0.7)',
                border: `1px solid ${isPurchased ? 'rgba(52, 211, 153, 0.3)' : 'var(--border)'}`,
                cursor: isPurchased ? 'default' : 'pointer',
                opacity: isPurchased ? 0.7 : 1,
                transition: 'all 0.3s',
                textAlign: 'center'
              }}
            >
              {isPurchased && (
                <div style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--accent-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  color: 'white'
                }}>
                  ✓
                </div>
              )}

              <div style={{ fontSize: 32, marginBottom: 10 }}>{reward.icon}</div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{reward.title}</h4>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.4 }}>
                {reward.description}
              </p>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 4,
                fontSize: 14,
                fontWeight: 700,
                color: isPurchased ? 'var(--accent-green)' : canAfford ? 'var(--accent-yellow)' : 'var(--text-muted)'
              }}>
                <span>🪙</span>
                <span>{reward.cost}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReward(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 20
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="glass-strong"
              style={{ padding: 32, maxWidth: 400, width: '100%', textAlign: 'center' }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>{selectedReward.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>{selectedReward.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
                {selectedReward.description}
              </p>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 8,
                marginBottom: 24,
                padding: '12px 20px',
                background: 'rgba(250, 204, 21, 0.08)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(250, 204, 21, 0.2)'
              }}>
                <span style={{ fontSize: 18 }}>🪙</span>
                <span style={{ fontWeight: 900, fontSize: 20, color: 'var(--accent-yellow)' }}>{selectedReward.cost}</span>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  className="btn-primary" 
                  onClick={() => handlePurchase(selectedReward)}
                  style={{ flex: 1 }}
                  disabled={userCoins < selectedReward.cost}
                >
                  {userCoins >= selectedReward.cost ? 'شراء' : 'ما عندك عملات كافية'}
                </button>
                <button className="btn-secondary" onClick={() => setSelectedReward(null)}>
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
