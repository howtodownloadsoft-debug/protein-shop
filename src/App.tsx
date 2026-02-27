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
    desc: 'Концентрат сывороточного белка 80% на порцию. Идеален после тренировки для быстрого восстановления мышц.',
    composition: 'Концентрат сывороточного белка, какао, ароматизатор, стевия. Белок: 80г/100г. Жиры: 4г. Углеводы: 6г.',
    reviews: [{ author: 'Алексей', text: 'Отличный протеин, размешивается хорошо 🔥', stars: 5 }, { author: 'Марина', text: 'Пью 3 месяца, результат заметен!', stars: 5 }],
    color: '#ff6a00',
  },
  {
    id: 2, name: 'Казеин', type: 'Казеиновый протеин', emoji: '🌙',
    sizes: [{ label: '1 кг', price: 3290 }, { label: '3 кг', price: 8490 }, { label: '5 кг', price: 13490 }],
    desc: 'Медленный протеин на ночь. Питает мышцы 6-8 часов, защищает от катаболизма.',
    composition: 'Мицеллярный казеин, ароматизатор, сукралоза. Белок: 78г/100г. Жиры: 2г. Углеводы: 4г.',
    reviews: [{ author: 'Иван', text: 'Лучший казеин что пробовал!', stars: 5 }, { author: 'Сергей', text: 'Мышцы не теряются даже в дефиците', stars: 5 }],
    color: '#7c3aed',
  },
  {
    id: 3, name: 'Яичный белок', type: 'Яичный протеин', emoji: '🥚',
    sizes: [{ label: '1 кг', price: 3490 }, { label: '3 кг', price: 8990 }, { label: '5 кг', price: 13990 }],
    desc: 'Протеин из яичного альбумина. Один из самых биодоступных белков. Подходит при непереносимости лактозы.',
    composition: 'Яичный альбумин, ароматизатор, стевия. Белок: 82г/100г. Жиры: 1г. Углеводы: 3г.',
    reviews: [{ author: 'Никита', text: 'Отличное качество, беру постоянно', stars: 5 }, { author: 'Ольга', text: 'Нет лактозы — то что надо!', stars: 5 }],
    color: '#d97706',
  },
  {
    id: 4, name: 'Креатин', type: 'Креатин моногидрат', emoji: '⚡',
    sizes: [{ label: '300 г', price: 990 }, { label: '500 г', price: 1490 }, { label: '1 кг', price: 2490 }],
    desc: 'Чистый креатин моногидрат. Увеличивает силу и выносливость в силовых и спринте.',
    composition: 'Креатин моногидрат 100%. Без добавок и красителей.',
    reviews: [{ author: 'Владимир', text: 'Силовые выросли за месяц заметно', stars: 5 }, { author: 'Артём', text: 'Чистый продукт, цена огонь', stars: 5 }],
    color: '#0ea5e9',
  },
  {
    id: 5, name: 'Гейнер', type: 'Белково-углеводный комплекс', emoji: '💪',
    sizes: [{ label: '1 кг', price: 2290 }, { label: '3 кг', price: 5990 }, { label: '5 кг', price: 9490 }],
    desc: 'Для быстрого набора мышечной массы. Высококалорийный коктейль с оптимальным соотношением БЖУ.',
    composition: 'Мальтодекстрин, концентрат сывороточного белка, овсяная мука. Белок: 25г/100г. Углеводы: 60г/100г.',
    reviews: [{ author: 'Максим', text: 'За 2 месяца набрал 4 кг!', stars: 5 }, { author: 'Павел', text: 'Хорошо размешивается, не приторный', stars: 4 }],
    color: '#16a34a',
  },
  {
    id: 6, name: 'Соевый протеин', type: 'Растительный протеин', emoji: '🌿',
    sizes: [{ label: '1 кг', price: 2790 }, { label: '3 кг', price: 6990 }, { label: '5 кг', price: 10990 }],
    desc: 'Растительный протеин из сои. Полноценный аминокислотный профиль, подходит для веганов.',
    composition: 'Изолят соевого белка, ароматизатор, стевия. Белок: 85г/100г. Жиры: 1г. Углеводы: 5г.',
    reviews: [{ author: 'Анна', text: 'Отличная альтернатива молочному!', stars: 5 }, { author: 'Кирилл', text: 'Беру для разнообразия, качество хорошее', stars: 4 }],
    color: '#65a30d',
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
      ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0))
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
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: ADMIN_ID, text }),
    })
    setLoading(false); setSent(true); setCart([])
  }

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', paddingBottom: 100 }}>

      {/* HERO — полная ширина без рамок */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        {/* Фон с градиентом */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a0500 0%, #2d0d00 40%, #1a0800 70%, #0d0d0d 100%)' }} />
        {/* Большое свечение слева */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,100,0,0.22)', filter: 'blur(80px)' }} />
        {/* Свечение справа */}
        <div style={{ position: 'absolute', bottom: -60, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,50,0,0.15)', filter: 'blur(60px)' }} />
        {/* Линия внизу hero */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,106,0,0.4), transparent)' }} />

        {/* Текст */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px' }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ color: '#ff6a00', fontSize: 10, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', margin: '0 0 8px' }}>
            ⚡ Официальный магазин
          </motion.p>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 42, fontWeight: 900, margin: '0 0 4px', lineHeight: 1, letterSpacing: -1, color: '#fff' }}>
            SPLINTEL
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            style={{ fontSize: 13, fontWeight: 600, margin: '0 0 20px', color: '#ff8c42', letterSpacing: 3, textTransform: 'uppercase' }}>
            Sport Nutrition
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ display: 'flex', gap: 8 }}>
            <span style={{ background: 'rgba(255,106,0,0.15)', border: '1px solid rgba(255,106,0,0.3)', color: '#ff9240', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>💪 Качество</span>
            <span style={{ background: 'rgba(255,106,0,0.15)', border: '1px solid rgba(255,106,0,0.3)', color: '#ff9240', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>🚀 Доставка РФ</span>
          </motion.div>
        </div>
      </div>

      {/* КАТАЛОГ */}
      <div style={{ padding: '20px 16px 0' }}>
        <p style={{ color: '#555', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 14px' }}>Каталог</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {products.map((p, i) => {
            const isOpen = selected === p.id
            const tab = getTab(p.id)
            const sizeIdx = getSize(p.id)
            const currentSize = p.sizes[sizeIdx]
            const cartItem = cart.find(c => c.productId === p.id && c.sizeIdx === sizeIdx)

            return (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  background: isOpen ? '#161616' : '#111',
                  marginBottom: 10,
                  boxShadow: isOpen ? `0 0 0 1px ${p.color}33, 0 8px 32px rgba(0,0,0,0.4)` : '0 2px 8px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s',
                }}>

                {/* Карточка */}
                <motion.div whileTap={{ scale: 0.99 }} onClick={() => setSelected(isOpen ? null : p.id)}
                  style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                  
                  {/* Иконка */}
                  <div style={{
                    width: 50, height: 50, borderRadius: 16, flexShrink: 0,
                    background: `${p.color}18`,
                    border: `1px solid ${p.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
                  }}>{p.emoji}</div>

                  {/* Название */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>{p.type}</div>
                  </div>

                  {/* Цена */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 17, color: p.color }}>{currentSize.price}₽</div>
                    <div style={{ color: '#444', fontSize: 11, marginTop: 2 }}>{currentSize.label}</div>
                  </div>

                  {/* Стрелка */}
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
                    style={{ color: '#444', fontSize: 12, marginLeft: 4 }}>▼</motion.div>
                </motion.div>

                {/* Раскрытая часть */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}>

                      <div style={{ padding: '0 18px 18px' }}>
                        {/* Разделитель */}
                        <div style={{ height: 1, background: `linear-gradient(90deg, ${p.color}40, transparent)`, marginBottom: 16 }} />

                        {/* Фасовки */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                          {p.sizes.map((s, idx) => (
                            <motion.button key={idx} whileTap={{ scale: 0.95 }}
                              onClick={() => setSizes(prev => ({ ...prev, [p.id]: idx }))}
                              style={{
                                flex: 1, padding: '10px 6px', borderRadius: 14, border: 'none', cursor: 'pointer',
                                background: sizeIdx === idx ? p.color : '#1e1e1e',
                                color: sizeIdx === idx ? '#fff' : '#555',
                                fontWeight: 700, fontSize: 12, lineHeight: 1.4, transition: 'all 0.2s'
                              }}>
                              {s.label}<br />
                              <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.85 }}>{s.price}₽</span>
                            </motion.button>
                          ))}
                        </div>

                        {/* Табы */}
                        <div style={{ display: 'flex', gap: 6, marginBottom: 14, background: '#1a1a1a', borderRadius: 14, padding: 4 }}>
                          {(['desc', 'composition', 'reviews'] as Tab[]).map(t => (
                            <button key={t}
                              onClick={() => setTabs(prev => ({ ...prev, [p.id]: t }))}
                              style={{
                                flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                fontSize: 11, fontWeight: 700,
                                background: tab === t ? '#2a2a2a' : 'transparent',
                                color: tab === t ? '#fff' : '#555',
                                transition: 'all 0.15s'
                              }}>
                              {t === 'desc' ? 'Описание' : t === 'composition' ? 'Состав' : 'Отзывы'}
                            </button>
                          ))}
                        </div>

                        {/* Контент таба */}
                        <AnimatePresence mode="wait">
                          <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                            style={{ marginBottom: 16, minHeight: 60 }}>
                            {tab === 'desc' && <p style={{ color: '#999', fontSize: 14, margin: 0, lineHeight: 1.7 }}>{p.desc}</p>}
                            {tab === 'composition' && <p style={{ color: '#999', fontSize: 14, margin: 0, lineHeight: 1.7 }}>{p.composition}</p>}
                            {tab === 'reviews' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {p.reviews.map((r, idx) => (
                                  <div key={idx} style={{ background: '#1e1e1e', borderRadius: 12, padding: '12px 14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                      <span style={{ fontWeight: 700, fontSize: 13 }}>{r.author}</span>
                                      <span style={{ fontSize: 11 }}>{'⭐'.repeat(r.stars)}</span>
                                    </div>
                                    <p style={{ color: '#888', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{r.text}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>

                        {/* Кнопки */}
                        <div style={{ display: 'flex', gap: 10 }}>
                          {cartItem ? (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e1e1e', borderRadius: 14, padding: '10px 16px' }}>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeQty(p.id, sizeIdx, -1)}
                                style={{ background: p.color, border: 'none', color: 'white', width: 30, height: 30, borderRadius: 9, fontSize: 18, cursor: 'pointer', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</motion.button>
                              <span style={{ fontWeight: 800, fontSize: 16 }}>{cartItem.qty}</span>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeQty(p.id, sizeIdx, 1)}
                                style={{ background: p.color, border: 'none', color: 'white', width: 30, height: 30, borderRadius: 9, fontSize: 18, cursor: 'pointer', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</motion.button>
                            </div>
                          ) : (
                            <motion.button whileTap={{ scale: 0.97 }} onClick={() => addToCart(p.id, sizeIdx)}
                              style={{ flex: 1, padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 15, background: p.color, color: '#fff' }}>
                              В корзину
                            </motion.button>
                          )}
                          <a href={MANAGER}
                            style={{ background: '#1e1e1e', color: '#888', width: 50, borderRadius: 14, textDecoration: 'none', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            💬
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* КНОПКА КОРЗИНЫ */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.button
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowCart(true); setSent(false); setForm({ name: '', city: '', username: '', payment: 'manager' }) }}
            style={{
              position: 'fixed', bottom: 20, left: 16, right: 16,
              background: 'linear-gradient(135deg, #ff6a00, #ff3d00)',
              color: 'white', border: 'none', padding: '17px 24px', borderRadius: 18,
              fontWeight: 900, fontSize: 16, cursor: 'pointer', zIndex: 50,
              boxShadow: '0 8px 30px rgba(255,80,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
            <span>🛒 Корзина · {cartCount} шт</span>
            <span>{cartTotal}₽</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* КОРЗИНА МОДАЛКА */}
      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}
            onClick={e => e.target === e.currentTarget && setShowCart(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              style={{ background: '#111', borderRadius: '28px 28px 0 0', padding: '8px 0 0', width: '100%', maxHeight: '92vh', overflowY: 'auto' }}>

              {/* Ручка */}
              <div style={{ width: 36, height: 4, background: '#333', borderRadius: 2, margin: '0 auto 20px' }} />

              <div style={{ padding: '0 20px 40px' }}>
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} style={{ fontSize: 64, marginBottom: 16 }}>✅</motion.div>
                    <h2 style={{ margin: '0 0 10px', fontSize: 22 }}>Заказ принят!</h2>
                    <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, margin: '0 0 28px' }}>Менеджер свяжется с тобой в Telegram</p>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowCart(false)}
                      style={{ background: 'linear-gradient(135deg, #ff6a00, #ff3d00)', color: 'white', border: 'none', padding: '15px 48px', borderRadius: 16, fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>
                      Закрыть
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 900 }}>Корзина</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                      {cart.map(item => {
                        const p = products.find(x => x.id === item.productId)!
                        const size = p.sizes[item.sizeIdx]
                        return (
                          <div key={`${item.productId}-${item.sizeIdx}`}
                            style={{ background: '#161616', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 24 }}>{p.emoji}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                              <div style={{ color: '#555', fontSize: 12 }}>{size.label}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeQty(item.productId, item.sizeIdx, -1)}
                                style={{ background: '#2a2a2a', border: 'none', color: '#aaa', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 900 }}>−</motion.button>
                              <span style={{ fontWeight: 800, fontSize: 14, minWidth: 14, textAlign: 'center' }}>{item.qty}</span>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeQty(item.productId, item.sizeIdx, 1)}
                                style={{ background: '#ff6a00', border: 'none', color: 'white', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 900 }}>+</motion.button>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: 14, color: '#ff6a00', minWidth: 64, textAlign: 'right' }}>{size.price * item.qty}₽</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Итого */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid #1e1e1e', marginBottom: 20 }}>
                      <span style={{ color: '#888', fontSize: 15 }}>Итого</span>
                      <span style={{ fontWeight: 900, fontSize: 20, color: '#ff6a00' }}>{cartTotal}₽</span>
                    </div>

                    {/* Поля формы */}
                    {(['name', 'city', 'username'] as const).map(field => (
                      <input key={field} value={form[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                        placeholder={field === 'name' ? 'Твоё имя' : field === 'city' ? 'Город доставки' : 'Username в Telegram (без @)'}
                        style={{ width: '100%', background: '#161616', border: 'none', borderRadius: 14, padding: '14px 16px', color: 'white', fontSize: 14, marginBottom: 10, boxSizing: 'border-box', outline: 'none' }} />
                    ))}

                    {/* Способ оплаты */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setForm(p => ({ ...p, payment: 'manager' }))}
                        style={{ flex: 1, padding: '13px 8px', borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1.5,
                          background: form.payment === 'manager' ? '#ff6a00' : '#161616', color: form.payment === 'manager' ? '#fff' : '#555' }}>
                        💳 Через менеджера<br /><span style={{ fontSize: 11 }}>{cartTotal}₽</span>
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setForm(p => ({ ...p, payment: 'stars' }))}
                        style={{ flex: 1, padding: '13px 8px', borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1.5,
                          background: form.payment === 'stars' ? '#7c3aed' : '#161616', color: form.payment === 'stars' ? '#fff' : '#555' }}>
                        ⭐ Telegram Stars<br /><span style={{ fontSize: 11 }}>{starsPrice(cartTotal)} Stars</span>
                      </motion.button>
                    </div>

                    <motion.button whileTap={{ scale: 0.98 }} onClick={sendOrder} disabled={loading}
                      style={{ width: '100%', background: loading ? '#222' : 'linear-gradient(135deg, #ff6a00, #ff3d00)', color: loading ? '#555' : 'white', border: 'none', padding: '17px', borderRadius: 16, fontWeight: 900, fontSize: 17, cursor: 'pointer', boxShadow: loading ? 'none' : '0 8px 24px rgba(255,80,0,0.3)' }}>
                      {loading ? 'Отправка...' : 'Оформить заказ →'}
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
