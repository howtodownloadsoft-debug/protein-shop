import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const MANAGER = 'https://t.me/Lockerrrr'
const BOT_TOKEN = '8649361387:AAHvBO4QPAgfXKuLGt-P_k_pcViyPyESsaY'
const ADMIN_ID = '7220667051'

const products = [
  {
    id: 1, name: 'КСБ 80', type: 'Сывороточный протеин', emoji: '🥛',
    sizes: [{ label: '1 кг', price: 2990 }, { label: '3 кг', price: 7490 }, { label: '5 кг', price: 11990 }],
    desc: 'КСБ 80 — концентрат сывороточного белка 80% на порцию. Идеален после тренировки для быстрого восстановления мышц.',
    composition: 'Концентрат сывороточного белка, какао, ароматизатор, стевия. Белок: 80г/100г. Жиры: 4г. Углеводы: 6г.',
    reviews: [{ author: 'Алексей', text: 'Отличный протеин, размешивается хорошо 🔥', stars: 5 }, { author: 'Марина', text: 'Пью 3 месяца, результат заметен!', stars: 5 }],
  },
  {
    id: 2, name: 'Казеин', type: 'Казеиновый протеин', emoji: '🌙',
    sizes: [{ label: '1 кг', price: 3290 }, { label: '3 кг', price: 8490 }, { label: '5 кг', price: 13490 }],
    desc: 'Медленный протеин на ночь. Питает мышцы 6-8 часов, защищает от катаболизма.',
    composition: 'Мицеллярный казеин, ароматизатор, сукралоза. Белок: 78г/100г. Жиры: 2г. Углеводы: 4г.',
    reviews: [{ author: 'Иван', text: 'Лучший казеин что пробовал!', stars: 5 }, { author: 'Сергей', text: 'Мышцы не теряются даже в дефиците', stars: 5 }],
  },
  {
    id: 3, name: 'Яичный белок', type: 'Яичный протеин', emoji: '🥚',
    sizes: [{ label: '1 кг', price: 3490 }, { label: '3 кг', price: 8990 }, { label: '5 кг', price: 13990 }],
    desc: 'Протеин из яичного альбумина. Один из самых биодоступных белков. Подходит при непереносимости лактозы.',
    composition: 'Яичный альбумин, ароматизатор, стевия. Белок: 82г/100г. Жиры: 1г. Углеводы: 3г.',
    reviews: [{ author: 'Никита', text: 'Отличное качество, беру постоянно', stars: 5 }, { author: 'Ольга', text: 'Нет лактозы — то что надо!', stars: 5 }],
  },
  {
    id: 4, name: 'Креатин', type: 'Креатин моногидрат', emoji: '⚡',
    sizes: [{ label: '300 г', price: 990 }, { label: '500 г', price: 1490 }, { label: '1 кг', price: 2490 }],
    desc: 'Чистый креатин моногидрат. Увеличивает силу и выносливость в силовых и спринте.',
    composition: 'Креатин моногидрат 100%. Без добавок и красителей.',
    reviews: [{ author: 'Владимир', text: 'Силовые выросли за месяц заметно', stars: 5 }, { author: 'Артём', text: 'Чистый продукт, цена огонь', stars: 5 }],
  },
  {
    id: 5, name: 'Гейнер', type: 'Белково-углеводный комплекс', emoji: '💪',
    sizes: [{ label: '1 кг', price: 2290 }, { label: '3 кг', price: 5990 }, { label: '5 кг', price: 9490 }],
    desc: 'Для быстрого набора мышечной массы. Высококалорийный коктейль с оптимальным соотношением БЖУ.',
    composition: 'Мальтодекстрин, концентрат сывороточного белка, овсяная мука. Белок: 25г/100г. Углеводы: 60г/100г.',
    reviews: [{ author: 'Максим', text: 'За 2 месяца набрал 4 кг!', stars: 5 }, { author: 'Павел', text: 'Хорошо размешивается, не приторный', stars: 4 }],
  },
  {
    id: 6, name: 'Соевый протеин', type: 'Растительный протеин', emoji: '🌿',
    sizes: [{ label: '1 кг', price: 2790 }, { label: '3 кг', price: 6990 }, { label: '5 кг', price: 10990 }],
    desc: 'Растительный протеин из сои. Полноценный аминокислотный профиль, подходит для веганов.',
    composition: 'Изолят соевого белка, ароматизатор, стевия. Белок: 85г/100г. Жиры: 1г. Углеводы: 5г.',
    reviews: [{ author: 'Анна', text: 'Отличная альтернатива молочному протеину!', stars: 5 }, { author: 'Кирилл', text: 'Беру для разнообразия, качество хорошее', stars: 4 }],
  },
]

type Tab = 'desc' | 'composition' | 'reviews'
interface CartItem { productId: number; sizeIdx: number; qty: number }
interface OrderForm { name: string; city: string; username: string; payment: 'manager' | 'stars' }

export default function App() {
  const [selected, setSelected] = useState<number | null>(null)
  const [tabs, setTabs] = useState<Record<number, Tab>>({})
  const [sizes, setSizes] = useState<Record<number, number>>({})
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [form, setForm] = useState<OrderForm>({ name: '', city: '', username: '', payment: 'manager' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const getTab = (id: number): Tab => tabs[id] || 'desc'
  const getSize = (id: number) => sizes[id] ?? 0
  const starsPrice = (price: number) => Math.ceil((price / 2) * 1.15)

  const cartTotal = cart.reduce((sum, item) => {
    const p = products.find(x => x.id === item.productId)!
    return sum + p.sizes[item.sizeIdx].price * item.qty
  }, 0)

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const addToCart = (productId: number, sizeIdx: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId && i.sizeIdx === sizeIdx)
      if (existing) return prev.map(i => i.productId === productId && i.sizeIdx === sizeIdx ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { productId, sizeIdx, qty: 1 }]
    })
  }

  const changeQty = (productId: number, sizeIdx: number, delta: number) => {
    setCart(prev => prev.map(i => i.productId === productId && i.sizeIdx === sizeIdx
      ? { ...i, qty: Math.max(0, i.qty + delta) }
      : i).filter(i => i.qty > 0))
  }

  const sendOrder = async () => {
    if (!form.name || !form.city || !form.username) { alert('Заполни все поля!'); return }
    setLoading(true)
    const items = cart.map(item => {
      const p = products.find(x => x.id === item.productId)!
      const price = form.payment === 'stars' ? `${starsPrice(p.sizes[item.sizeIdx].price)} ⭐` : `${p.sizes[item.sizeIdx].price}₽`
      return `• ${p.name} ${p.sizes[item.sizeIdx].label} x${item.qty} — ${price}`
    }).join('\n')
    const total = form.payment === 'stars' ? `${starsPrice(cartTotal)} ⭐ Stars` : `${cartTotal}₽`
    const text = `🛒 НОВЫЙ ЗАКАЗ!\n👤 Имя: ${form.name}\n📱 Telegram: @${form.username}\n🏙 Город: ${form.city}\n\n📦 Товары:\n${items}\n\n💰 Итого: ${total}\n💳 Оплата: ${form.payment === 'stars' ? 'Telegram Stars' : 'Через менеджера'}\n📬 Статус: Ожидает подтверждения`
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: ADMIN_ID, text }),
    })
    setLoading(false)
    setSent(true)
    setCart([])
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', fontFamily: '-apple-system, sans-serif', paddingBottom: 80 }}>

                        {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '52px 24px 40px', textAlign: 'center', minHeight: 200 }}>
        
        {/* Основной фон */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #1a0800 0%, #0a0a0a 100%)' }} />
        
        {/* Размытые пятна света */}
        <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,80,0,0.2)', filter: 'blur(60px)', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: -20, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,140,0,0.15)', filter: 'blur(50px)', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 300, height: 100, background: 'rgba(255,60,0,0.1)', filter: 'blur(40px)', zIndex: 1 }} />

        {/* Контент */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ color: '#ff6a00', fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', margin: '0 0 12px' }}
          >⚡ Официальный магазин</motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 36, fontWeight: 900, margin: '0 0 6px', lineHeight: 1.1,
              color: '#ffffff',
              letterSpacing: 1,
            }}
          >SPLINTEL</motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            style={{
              fontSize: 14, fontWeight: 700, margin: '0 0 20px',
              background: 'linear-gradient(90deg, #ff6a00, #ffb347)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: 3, textTransform: 'uppercase'
            }}
          >SPORT NUTRITION</motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}
          >
            {['💪 Качество', '🚀 Доставка по РФ', '⭐ Проверено'].map((tag, i) => (
              <span key={i} style={{
                background: 'rgba(255,106,0,0.1)',
                border: '1px solid rgba(255,106,0,0.25)',
                color: '#ff9240', padding: '5px 14px',
                borderRadius: 20, fontSize: 12, fontWeight: 600
              }}>{tag}</span>
            ))}
          </motion.div>
        </div>
      </div>




      {/* Products */}
      <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {products.map((p, i) => {
          const isOpen = selected === p.id
          const tab = getTab(p.id)
          const sizeIdx = getSize(p.id)
          const currentSize = p.sizes[sizeIdx]
          const cartItem = cart.find(c => c.productId === p.id && c.sizeIdx === sizeIdx)

          return (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 100 }}
              style={{ background: 'linear-gradient(135deg, #161616, #1a1a1a)', borderRadius: 20, overflow: 'hidden', border: isOpen ? '1px solid #ff6a00' : '1px solid #2a2a2a', boxShadow: isOpen ? '0 0 20px rgba(255,106,0,0.15)' : 'none' }}>

              {/* Header */}
              <motion.div whileTap={{ scale: 0.98 }} onClick={() => setSelected(isOpen ? null : p.id)}
                style={{ padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <motion.div whileHover={{ scale: 1.1 }}
                    style={{ width: 54, height: 54, borderRadius: 16, background: 'linear-gradient(135deg, #1f1000, #2d1500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, border: '1px solid #3a2000', flexShrink: 0 }}>
                    {p.emoji}
                  </motion.div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>{p.name}</div>
                    <div style={{ color: '#666', fontSize: 12, marginTop: 3 }}>{p.type}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 900, fontSize: 18, background: 'linear-gradient(90deg, #ff6a00, #ffb347)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{currentSize.price}₽</div>
                  <div style={{ color: '#555', fontSize: 11, marginTop: 2 }}>{currentSize.label}</div>
                </div>
              </motion.div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                    style={{ borderTop: '1px solid #222' }}>

                    {/* Size selector */}
                    <div style={{ padding: '14px 16px 0', display: 'flex', gap: 8 }}>
                      {p.sizes.map((s, idx) => (
                        <motion.button key={idx} whileTap={{ scale: 0.95 }}
                          onClick={() => setSizes(prev => ({ ...prev, [p.id]: idx }))}
                          style={{ flex: 1, padding: '10px 4px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, lineHeight: 1.4,
                            background: sizeIdx === idx ? 'linear-gradient(135deg, #ff6a00, #ff8c00)' : '#222',
                            color: sizeIdx === idx ? 'white' : '#777', transition: 'all 0.2s' }}>
                          {s.label}<br /><span style={{ fontSize: 11, fontWeight: 500 }}>{s.price}₽</span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', padding: '12px 16px 0', gap: 6 }}>
                      {(['desc', 'composition', 'reviews'] as Tab[]).map(t => (
                        <motion.button key={t} whileTap={{ scale: 0.95 }}
                          onClick={() => setTabs(prev => ({ ...prev, [p.id]: t }))}
                          style={{ flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                            background: tab === t ? 'rgba(255,106,0,0.15)' : '#1a1a1a',
                            color: tab === t ? '#ff6a00' : '#555', transition: 'all 0.2s' }}>
                          {t === 'desc' ? '📋 Описание' : t === 'composition' ? '🧪 Состав' : '⭐ Отзывы'}
                        </motion.button>
                      ))}
                    </div>

                    <div style={{ padding: '12px 16px' }}>
                      <AnimatePresence mode="wait">
                        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                          {tab === 'desc' && <p style={{ color: '#bbb', fontSize: 14, margin: 0, lineHeight: 1.7 }}>{p.desc}</p>}
                          {tab === 'composition' && <p style={{ color: '#bbb', fontSize: 14, margin: 0, lineHeight: 1.7 }}>{p.composition}</p>}
                          {tab === 'reviews' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {p.reviews.map((r, idx) => (
                                <div key={idx} style={{ background: '#1e1e1e', borderRadius: 12, padding: '12px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                    <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{r.author}</span>
                                    <span style={{ fontSize: 12 }}>{'⭐'.repeat(r.stars)}</span>
                                  </div>
                                  <p style={{ color: '#999', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{r.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Add to cart */}
                    <div style={{ padding: '0 16px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
                      {cartItem ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, background: '#1e1e1e', borderRadius: 13, padding: '10px 16px', justifyContent: 'space-between' }}>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeQty(p.id, sizeIdx, -1)}
                            style={{ background: '#ff6a00', border: 'none', color: 'white', width: 32, height: 32, borderRadius: 10, fontSize: 18, cursor: 'pointer', fontWeight: 900 }}>−</motion.button>
                          <span style={{ fontWeight: 800, fontSize: 16 }}>{cartItem.qty}</span>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeQty(p.id, sizeIdx, 1)}
                            style={{ background: '#ff6a00', border: 'none', color: 'white', width: 32, height: 32, borderRadius: 10, fontSize: 18, cursor: 'pointer', fontWeight: 900 }}>+</motion.button>
                        </div>
                      ) : (
                        <motion.button whileTap={{ scale: 0.97 }} onClick={() => addToCart(p.id, sizeIdx)}
                          style={{ flex: 1, background: 'linear-gradient(135deg, #ff6a00, #ff8c00)', color: 'white', border: 'none', padding: '14px', borderRadius: 13, fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
                          🛒 В корзину
                        </motion.button>
                      )}
                      <a href={MANAGER}
                        style={{ background: '#229ED9', color: 'white', padding: '14px 16px', borderRadius: 13, textDecoration: 'none', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
                        💬
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Floating cart button */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowCart(true); setSent(false); setForm({ name: '', city: '', username: '', payment: 'manager' }) }}
            style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #ff6a00, #ff8c00)', color: 'white', border: 'none', padding: '16px 32px', borderRadius: 20, fontWeight: 900, fontSize: 16, cursor: 'pointer', zIndex: 50, boxShadow: '0 8px 32px rgba(255,106,0,0.4)', whiteSpace: 'nowrap' }}>
            🛒 Корзина · {cartCount} · {cartTotal}₽
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}
            onClick={e => e.target === e.currentTarget && setShowCart(false)}>
            <motion.div initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }} transition={{ type: 'spring', damping: 28 }}
              style={{ background: '#111', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #222' }}>

              {sent ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} style={{ fontSize: 64, marginBottom: 16 }}>✅</motion.div>
                  <h2 style={{ margin: '0 0 10px', fontSize: 22 }}>Заказ оформлен!</h2>
                  <p style={{ color: '#888', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>Менеджер свяжется с тобой в Telegram в ближайшее время</p>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowCart(false)}
                    style={{ background: 'linear-gradient(135deg, #ff6a00, #ff8c00)', color: 'white', border: 'none', padding: '14px 40px', borderRadius: 14, fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>
                    Закрыть
                  </motion.button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>🛒 Корзина</h2>
                    <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', color: '#666', fontSize: 24, cursor: 'pointer' }}>✕</button>
                  </div>

                  {/* Cart items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    {cart.map(item => {
                      const p = products.find(x => x.id === item.productId)!
                      const size = p.sizes[item.sizeIdx]
                      return (
                        <div key={`${item.productId}-${item.sizeIdx}`} style={{ background: '#1a1a1a', borderRadius: 14, padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #252525' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 24 }}>{p.emoji}</span>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                              <div style={{ color: '#666', fontSize: 12 }}>{size.label} · {size.price}₽/шт</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeQty(item.productId, item.sizeIdx, -1)}
                                style={{ background: '#2a2a2a', border: 'none', color: 'white', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', fontWeight: 900, fontSize: 16 }}>−</motion.button>
                              <span style={{ fontWeight: 800, fontSize: 15, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeQty(item.productId, item.sizeIdx, 1)}
                                style={{ background: '#ff6a00', border: 'none', color: 'white', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', fontWeight: 900, fontSize: 16 }}>+</motion.button>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: 14, color: '#ff8c00', minWidth: 60, textAlign: 'right' }}>{size.price * item.qty}₽</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Total */}
                  <div style={{ background: '#1a1a1a', borderRadius: 14, padding: '14px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', border: '1px solid #2a2a2a' }}>
                    <span style={{ color: '#aaa', fontSize: 15 }}>Итого:</span>
                    <span style={{ fontWeight: 900, fontSize: 18, background: 'linear-gradient(90deg, #ff6a00, #ffb347)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{cartTotal}₽</span>
                  </div>

                  {/* Form */}
                  {(['name', 'city', 'username'] as const).map(field => (
                    <input key={field} value={form[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                      placeholder={field === 'name' ? '👤 Твоё имя' : field === 'city' ? '🏙 Город доставки' : '📱 Username в Telegram (без @)'}
                      style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: '13px 14px', color: 'white', fontSize: 14, marginBottom: 10, boxSizing: 'border-box', outline: 'none' }} />
                  ))}

                  {/* Payment */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setForm(p => ({ ...p, payment: 'manager' }))}
                      style={{ flex: 1, padding: '12px 6px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, lineHeight: 1.5,
                        background: form.payment === 'manager' ? 'linear-gradient(135deg, #ff6a00, #ff8c00)' : '#1a1a1a',
                        color: form.payment === 'manager' ? 'white' : '#666' }}>
                      💳 Через менеджера<br /><span style={{ fontSize: 11, fontWeight: 500 }}>{cartTotal}₽</span>
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setForm(p => ({ ...p, payment: 'stars' }))}
                      style={{ flex: 1, padding: '12px 6px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, lineHeight: 1.5,
                        background: form.payment === 'stars' ? 'linear-gradient(135deg, #7b2ff7, #b066ff)' : '#1a1a1a',
                        color: form.payment === 'stars' ? 'white' : '#666' }}>
                      ⭐ Telegram Stars<br /><span style={{ fontSize: 11, fontWeight: 500 }}>{starsPrice(cartTotal)} Stars</span>
                    </motion.button>
                  </div>

                  <motion.button whileTap={{ scale: 0.98 }} onClick={sendOrder} disabled={loading}
                    style={{ width: '100%', background: loading ? '#333' : 'linear-gradient(135deg, #ff6a00, #ff4500)', color: 'white', border: 'none', padding: '16px', borderRadius: 14, fontWeight: 900, fontSize: 17, cursor: 'pointer', boxShadow: loading ? 'none' : '0 8px 24px rgba(255,106,0,0.3)' }}>
                    {loading ? '⏳ Отправка...' : '🔥 Оформить заказ'}
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
