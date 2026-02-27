import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import ksb80Img from './assets/ksb80.png'
import caseinImg from './assets/casein.png'
import eggproteinImg from './assets/eggprotein.png'
import creatineImg from './assets/creatine.png'
import gainerImg from './assets/gainer.png'
import soyproteinImg from './assets/soyprotein.png'

const MANAGER = 'https://t.me/Lockerrrr'
const BOT_TOKEN = '8649361387:AAHvBO4QPAgfXKuLGt-P_k_pcViyPyESsaY'
const ADMIN_ID = '7220667051'

const BLUE = '#6aaeff'
const BLUE_DIM = 'rgba(106,174,255,0.13)'
const BLUE_BORDER = 'rgba(106,174,255,0.28)'
const AMBER = '#f5a623'

if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.expand()
  window.Telegram.WebApp.setHeaderColor('#07080f')
  window.Telegram.WebApp.setBackgroundColor('#07080f')
}

interface Product {
  id: number; name: string; type: string; subtitle: string; image?: string
  sizes: { label: string; price: number }[]
  desc: string
  ingredients: string
  macros: { protein: number; fat: number; carbs: number }
  reviews: { author: string; text: string; stars: number }[]
}

const products: Product[] = [
  {
    id: 1, name: 'КСБ 80', type: 'Сывороточный', subtitle: 'Быстрый рост и восстановление', image: ksb80Img,
    sizes: [{ label: '1 кг', price: 2990 }, { label: '3 кг', price: 7490 }, { label: '5 кг', price: 11990 }],
    desc: 'Концентрат сывороточного белка 80% на порцию. Идеален после тренировки для быстрого восстановления мышц.',
    ingredients: 'Концентрат сывороточного белка, какао, ароматизатор, стевия.',
    macros: { protein: 80, fat: 4, carbs: 6 },
    reviews: [{ author: 'Алексей', text: 'Отличный протеин, размешивается хорошо 🔥', stars: 5 }, { author: 'Марина', text: 'Пью 3 месяца, результат заметен!', stars: 5 }],
  },
  {
    id: 2, name: 'Казеин', type: 'Казеиновый', subtitle: 'Питание мышц на ночь до 8 часов', image: caseinImg,
    sizes: [{ label: '1 кг', price: 3290 }, { label: '3 кг', price: 8490 }, { label: '5 кг', price: 13490 }],
    desc: 'Медленный протеин на ночь. Питает мышцы 6-8 часов, защищает от катаболизма.',
    ingredients: 'Мицеллярный казеин, ароматизатор, сукралоза.',
    macros: { protein: 78, fat: 2, carbs: 4 },
    reviews: [{ author: 'Иван', text: 'Лучший казеин что пробовал!', stars: 5 }, { author: 'Сергей', text: 'Мышцы не теряются даже в дефиците', stars: 5 }],
  },
  {
    id: 3, name: 'Яичный белок', type: 'Яичный', subtitle: '100% усвояемость, без лактозы', image: eggproteinImg,
    sizes: [{ label: '1 кг', price: 3490 }, { label: '3 кг', price: 8990 }, { label: '5 кг', price: 13990 }],
    desc: 'Протеин из яичного альбумина. Один из самых биодоступных белков. Подходит при непереносимости лактозы.',
    ingredients: 'Яичный альбумин, ароматизатор, стевия.',
    macros: { protein: 82, fat: 1, carbs: 3 },
    reviews: [{ author: 'Никита', text: 'Отличное качество, беру постоянно', stars: 5 }, { author: 'Ольга', text: 'Нет лактозы — то что надо!', stars: 5 }],
  },
  {
    id: 4, name: 'Креатин', type: 'Моногидрат', subtitle: 'Взрывная сила и выносливость', image: creatineImg,
    sizes: [{ label: '300 г', price: 990 }, { label: '500 г', price: 1490 }, { label: '1 кг', price: 2490 }],
    desc: 'Чистый креатин моногидрат. Увеличивает силу и выносливость в силовых и спринте.',
    ingredients: 'Креатин моногидрат 100%. Без добавок и красителей.',
    macros: { protein: 0, fat: 0, carbs: 0 },
    reviews: [{ author: 'Владимир', text: 'Силовые выросли за месяц заметно', stars: 5 }, { author: 'Артём', text: 'Чистый продукт, цена огонь', stars: 5 }],
  },
  {
    id: 5, name: 'Гейнер', type: 'Белок + углеводы', subtitle: 'Мощный заряд калорий и белка', image: gainerImg,
    sizes: [{ label: '1 кг', price: 2290 }, { label: '3 кг', price: 5990 }, { label: '5 кг', price: 9490 }],
    desc: 'Для быстрого набора мышечной массы. Высококалорийный коктейль с оптимальным соотношением БЖУ.',
    ingredients: 'Мальтодекстрин, концентрат сывороточного белка, овсяная мука.',
    macros: { protein: 25, fat: 3, carbs: 60 },
    reviews: [{ author: 'Максим', text: 'За 2 месяца набрал 4 кг!', stars: 5 }, { author: 'Павел', text: 'Хорошо размешивается, не приторный', stars: 4 }],
  },
  {
    id: 6, name: 'Соевый', type: 'Растительный', subtitle: 'Идеально для веганов и в пост', image: soyproteinImg,
    sizes: [{ label: '1 кг', price: 2790 }, { label: '3 кг', price: 6990 }, { label: '5 кг', price: 10990 }],
    desc: 'Растительный протеин из сои. Полноценный аминокислотный профиль, подходит для веганов.',
    ingredients: 'Изолят соевого белка, ароматизатор, стевия.',
    macros: { protein: 85, fat: 1, carbs: 5 },
    reviews: [{ author: 'Анна', text: 'Отличная альтернатива молочному!', stars: 5 }, { author: 'Кирилл', text: 'Беру для разнообразия, качество хорошее', stars: 4 }],
  },
]

const MacroRow = ({ label, value, unit = 'г' }: { label: string; value: number; unit?: string }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 12px', borderRadius: 10,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)',
  }}>
    <span style={{ color: '#8aa0c0', fontSize: 13, fontWeight: 500 }}>{label}</span>
    <span style={{ color: '#f0f4ff', fontSize: 14, fontWeight: 700 }}>{value} {unit}<span style={{ color: '#506080', fontSize: 11, fontWeight: 400 }}> / 100г</span></span>
  </div>
)

const ProductImage = ({ image }: { image?: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
    style={{
      width: 58, height: 58, borderRadius: 16, flexShrink: 0,
      background: 'linear-gradient(135deg, #0f1420, #151c2e)',
      border: `1px solid ${BLUE_BORDER}`,
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 20px rgba(106,174,255,0.08)`,
    }}>
    {image ? (
      <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <svg width="28" height="34" viewBox="0 0 32 38" fill="none">
        <rect x="6" y="6" width="20" height="28" rx="4" fill="#0f1420"/>
        <rect x="6" y="6" width="20" height="28" rx="4" stroke={BLUE_BORDER} strokeWidth="1.5"/>
        <rect x="4" y="4" width="24" height="6" rx="3" fill="#151c2e" stroke={BLUE_BORDER} strokeWidth="1"/>
        <rect x="4" y="28" width="24" height="6" rx="3" fill="#151c2e" stroke={BLUE_BORDER} strokeWidth="1"/>
        <text x="16" y="22" textAnchor="middle" fill={BLUE} fontSize="5" fontWeight="bold" fontFamily="sans-serif">SPL</text>
      </svg>
    )}
  </motion.div>
)

type Tab = 'desc' | 'composition' | 'reviews'
interface CartItem { productId: number; sizeIdx: number; qty: number }
interface OrderForm { name: string; city: string; username: string; payment: 'manager' | 'stars' }

const springConfig = { type: 'spring' as const, stiffness: 400, damping: 28 }

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
      const ex = prev.find(i => i.productId === productId && i.sizeIdx === sizeIdx)
      if (ex) return prev.map(i => i.productId === productId && i.sizeIdx === sizeIdx ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { productId, sizeIdx, qty: 1 }]
    })
  }

  const changeQty = (productId: number, sizeIdx: number, delta: number) => {
    setCart(prev => prev.map(i =>
      i.productId === productId && i.sizeIdx === sizeIdx ? { ...i, qty: Math.max(0, i.qty + delta) } : i
    ).filter(i => i.qty > 0))
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

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14, padding: '14px 16px', color: '#fff', fontSize: 15,
    marginBottom: 10, boxSizing: 'border-box', outline: 'none',
    transition: 'border 0.2s',
  }

  return (
    <div style={{
      background: '#07080f',
      minHeight: '100vh', width: '100%', color: '#fff',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      paddingBottom: 120, overflowX: 'hidden',
    }}>

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%', padding: '24px 20px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(7,8,15,0.8)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
        <div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 22, fontWeight: 900, letterSpacing: 3, color: '#fff' }}>
            SPLINTEL
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 10, color: BLUE, fontWeight: 500, letterSpacing: 3, marginTop: 2 }}>
            SPORT NUTRITION
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          style={{ display: 'flex', gap: 6 }}>
          {['Качество', 'Доставка РФ'].map((t, i) => (
            <span key={i} style={{
              background: 'rgba(245,166,35,0.08)',
              border: `1px solid rgba(245,166,35,0.35)`,
              color: '#f5c76a',
              padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600,
            }}>{t}</span>
          ))}
        </motion.div>
      </motion.div>

      {/* ── HERO LINE ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${BLUE}, transparent)`,
          transformOrigin: 'left',
        }}
      />

      {/* ── КАТАЛОГ ── */}
      <div style={{ padding: '28px 16px 0' }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: '#7a90b8', fontSize: 10, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', margin: '0 0 16px' }}>
          Каталог
        </motion.p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {products.map((p, i) => {
            const isOpen = selected === p.id
            const tab = getTab(p.id)
            const sizeIdx = getSize(p.id)
            const currentSize = p.sizes[sizeIdx]
            const cartItem = cart.find(c => c.productId === p.id && c.sizeIdx === sizeIdx)

            return (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 200, damping: 20 }}
                style={{
                  background: isOpen
                    ? 'linear-gradient(135deg, #131525, #0f1120)'
                    : 'linear-gradient(135deg, #10111e, #0d0e1a)',
                  borderRadius: 20, overflow: 'hidden',
                  border: isOpen ? `1px solid ${BLUE_BORDER}` : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: isOpen
                    ? `0 0 40px rgba(106,174,255,0.08), inset 0 1px 0 rgba(106,174,255,0.06)`
                    : '0 2px 16px rgba(0,0,0,0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>

                {/* Шапка карточки */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelected(isOpen ? null : p.id)}
                  style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <ProductImage image={p.image} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 700, fontSize: 15, color: '#f0f4ff',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: 0.3,
                    }}>{p.name}</div>
                    <div style={{
                      color: '#9ab0cc', fontSize: 11, marginTop: 3, fontWeight: 400,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      fontStyle: 'italic',
                    }}>{p.subtitle}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 4 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: AMBER }}>{currentSize.price}₽</div>
                    <div style={{ color: '#506080', fontSize: 11, marginTop: 2 }}>{currentSize.label}</div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ marginLeft: 4, flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 5L7 9L11 5" stroke={isOpen ? BLUE : '#506080'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Раскрытая часть */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 16px 18px', borderTop: '1px solid rgba(106,174,255,0.07)' }}>

                        {/* Фасовки */}
                        <div style={{ display: 'flex', gap: 8, marginTop: 16, marginBottom: 16 }}>
                          {p.sizes.map((s, idx) => (
                            <motion.button key={idx}
                              whileTap={{ scale: 0.94 }}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setSizes(prev => ({ ...prev, [p.id]: idx }))}
                              style={{
                                flex: 1, padding: '10px 4px', borderRadius: 12, border: 'none', cursor: 'pointer',
                                background: sizeIdx === idx
                                  ? `linear-gradient(135deg, ${BLUE}, #3b7de8)`
                                  : 'rgba(255,255,255,0.05)',
                                color: sizeIdx === idx ? '#fff' : '#7a90b8',
                                fontWeight: 700, fontSize: 12, lineHeight: 1.5,
                                transition: 'all 0.2s',
                                boxShadow: sizeIdx === idx ? `0 4px 16px rgba(106,174,255,0.3)` : 'none',
                              }}>
                              {s.label}<br />
                              <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.85 }}>{s.price}₽</span>
                            </motion.button>
                          ))}
                        </div>

                        {/* Табы */}
                        <div style={{
                          display: 'flex',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: 12, padding: 3, marginBottom: 16,
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                          {(['desc', 'composition', 'reviews'] as Tab[]).map(t => (
                            <motion.button key={t}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setTabs(prev => ({ ...prev, [p.id]: t }))}
                              style={{
                                flex: 1, padding: '9px 4px', borderRadius: 9, border: 'none', cursor: 'pointer',
                                fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                                background: tab === t ? 'rgba(255,255,255,0.10)' : 'transparent',
                                color: tab === t ? '#fff' : '#506080',
                                transition: 'all 0.2s',
                                boxShadow: tab === t ? `0 1px 4px rgba(0,0,0,0.3)` : 'none',
                              }}>
                              {t === 'desc' ? 'Описание' : t === 'composition' ? 'Состав' : 'Отзывы'}
                            </motion.button>
                          ))}
                        </div>

                        {/* Контент */}
                        <AnimatePresence mode="wait">
                          <motion.div key={tab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18 }}
                            style={{ minHeight: 64, marginBottom: 18 }}>

                            {tab === 'desc' && (
                              <p style={{ color: '#8aa0c0', fontSize: 14, margin: 0, lineHeight: 1.75 }}>{p.desc}</p>
                            )}

                            {tab === 'composition' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <p style={{ color: '#8aa0c0', fontSize: 13, margin: '0 0 10px', lineHeight: 1.6 }}>
                                  {p.ingredients}
                                </p>
                                {p.macros.protein > 0 ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <MacroRow label="Белки" value={p.macros.protein} />
                                    <MacroRow label="Жиры" value={p.macros.fat} />
                                    <MacroRow label="Углеводы" value={p.macros.carbs} />
                                  </div>
                                ) : (
                                  <div style={{
                                    padding: '10px 14px', borderRadius: 10,
                                    background: 'rgba(106,174,255,0.06)',
                                    border: `1px solid ${BLUE_BORDER}`,
                                    color: BLUE, fontSize: 13, fontWeight: 600,
                                  }}>
                                    100% чистый продукт — без углеводов и жиров
                                  </div>
                                )}
                              </div>
                            )}

                            {tab === 'reviews' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {p.reviews.map((r, idx) => (
                                  <motion.div key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.08 }}
                                    style={{
                                      background: 'rgba(255,255,255,0.02)', borderRadius: 12,
                                      padding: '12px 14px', border: '1px solid rgba(255,255,255,0.04)',
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                      <span style={{ fontWeight: 700, fontSize: 13, color: '#c8d8f0' }}>{r.author}</span>
                                      <span style={{ fontSize: 11, color: AMBER, letterSpacing: 1 }}>{'★'.repeat(r.stars)}</span>
                                    </div>
                                    <p style={{ color: '#7a90b8', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{r.text}</p>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>

                        {/* Кнопки */}
                        <div style={{ display: 'flex', gap: 10 }}>
                          <AnimatePresence mode="wait">
                            {cartItem ? (
                              <motion.div key="qty"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={springConfig}
                                style={{
                                  flex: 1, display: 'flex', alignItems: 'center',
                                  justifyContent: 'space-between',
                                  background: BLUE_DIM, borderRadius: 14,
                                  padding: '10px 18px', border: `1px solid ${BLUE_BORDER}`,
                                }}>
                                <motion.button whileTap={{ scale: 0.85 }} onClick={() => changeQty(p.id, sizeIdx, -1)}
                                  style={{
                                    background: 'rgba(106,174,255,0.2)', border: 'none', color: BLUE,
                                    width: 32, height: 32, borderRadius: 10, fontSize: 18, cursor: 'pointer', fontWeight: 900,
                                  }}>−</motion.button>
                                <motion.span
                                  key={cartItem.qty}
                                  initial={{ scale: 1.3, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>
                                  {cartItem.qty}
                                </motion.span>
                                <motion.button whileTap={{ scale: 0.85 }} onClick={() => changeQty(p.id, sizeIdx, 1)}
                                  style={{
                                    background: BLUE, border: 'none', color: '#fff',
                                    width: 32, height: 32, borderRadius: 10, fontSize: 18, cursor: 'pointer', fontWeight: 900,
                                  }}>+</motion.button>
                              </motion.div>
                            ) : (
                              <motion.button key="add"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileTap={{ scale: 0.96 }}
                                whileHover={{ scale: 1.01 }}
                                transition={springConfig}
                                onClick={() => addToCart(p.id, sizeIdx)}
                                style={{
                                  flex: 1, padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
                                  background: `linear-gradient(135deg, ${BLUE}, #3b7de8)`,
                                  color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: 0.5,
                                  boxShadow: `0 6px 24px rgba(106,174,255,0.28)`,
                                }}>
                                В корзину
                              </motion.button>
                            )}
                          </AnimatePresence>
                          <motion.a whileTap={{ scale: 0.92 }} href={MANAGER}
                            style={{
                              width: 52, borderRadius: 14,
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              textDecoration: 'none', fontSize: 20,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>💬</motion.a>
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

      {/* ── КНОПКА КОРЗИНЫ ── */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={springConfig}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowCart(true); setSent(false); setForm({ name: '', city: '', username: '', payment: 'manager' }) }}
            style={{
              position: 'fixed', bottom: 20, left: 16, right: 16,
              background: `linear-gradient(135deg, ${BLUE}, #3b7de8)`,
              color: '#fff', border: 'none', padding: '18px 24px', borderRadius: 18,
              fontWeight: 700, fontSize: 15, cursor: 'pointer', zIndex: 50,
              boxShadow: `0 8px 40px rgba(106,174,255,0.35)`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: 0.3,
            }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <motion.span
                key={cartCount}
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springConfig}
                style={{
                  background: 'rgba(255,255,255,0.2)', borderRadius: 8,
                  padding: '2px 8px', fontSize: 13, fontWeight: 800,
                }}>{cartCount}</motion.span>
              товара в корзине
            </span>
            <motion.span
              key={cartTotal}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontWeight: 800, fontSize: 16 }}>
              {cartTotal}₽
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── МОДАЛКА КОРЗИНЫ ── */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              zIndex: 100, display: 'flex', alignItems: 'flex-end',
              backdropFilter: 'blur(6px)',
            }}
            onClick={e => e.target === e.currentTarget && setShowCart(false)}>
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              style={{
                background: 'linear-gradient(180deg, #0d0f1a 0%, #07080f 100%)',
                borderRadius: '28px 28px 0 0', width: '100%', maxHeight: '92vh', overflowY: 'auto',
                border: `1px solid ${BLUE_BORDER}`, borderBottom: 'none',
              }}>

              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8 }}>
                <div style={{ width: 36, height: 4, background: 'rgba(106,174,255,0.2)', borderRadius: 2 }} />
              </div>

              <div style={{ padding: '8px 20px 52px' }}>
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', padding: '52px 0' }}>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                      style={{ fontSize: 64, marginBottom: 20 }}>✅</motion.div>
                    <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, color: '#f0f4ff' }}>Заказ принят</h2>
                    <p style={{ color: '#7a90b8', fontSize: 14, lineHeight: 1.7, margin: '0 0 32px' }}>Менеджер свяжется с тобой в Telegram в ближайшее время</p>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowCart(false)}
                      style={{
                        background: `linear-gradient(135deg, ${BLUE}, #3b7de8)`,
                        color: '#fff', border: 'none', padding: '15px 48px',
                        borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                        boxShadow: `0 4px 20px rgba(106,174,255,0.3)`,
                      }}>
                      Закрыть
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 800, color: '#f0f4ff', letterSpacing: 0.3 }}>Корзина</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                      {cart.map((item, idx) => {
                        const p = products.find(x => x.id === item.productId)!
                        const size = p.sizes[item.sizeIdx]
                        return (
                          <motion.div key={`${item.productId}-${item.sizeIdx}`}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            style={{
                              background: 'rgba(255,255,255,0.02)', borderRadius: 16,
                              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
                              border: '1px solid rgba(255,255,255,0.04)',
                            }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: 14, color: '#d0dcf0' }}>{p.name}</div>
                              <div style={{ color: '#506080', fontSize: 12, marginTop: 2 }}>{size.label}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <motion.button whileTap={{ scale: 0.85 }} onClick={() => changeQty(item.productId, item.sizeIdx, -1)}
                                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#8aa0c0', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 900 }}>−</motion.button>
                              <span style={{ fontWeight: 800, fontSize: 14, minWidth: 16, textAlign: 'center', color: '#fff' }}>{item.qty}</span>
                              <motion.button whileTap={{ scale: 0.85 }} onClick={() => changeQty(item.productId, item.sizeIdx, 1)}
                                style={{ background: BLUE, border: 'none', color: '#fff', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 900 }}>+</motion.button>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: 14, color: AMBER, minWidth: 64, textAlign: 'right' }}>{size.price * item.qty}₽</span>
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Итого */}
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '16px 0', borderTop: `1px solid rgba(106,174,255,0.08)`, marginBottom: 20,
                      }}>
                      <span style={{ color: '#7a90b8', fontSize: 14, fontWeight: 500 }}>Итого</span>
                      <motion.span
                        key={cartTotal}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontWeight: 900, fontSize: 24, color: AMBER }}>
                        {cartTotal}₽
                      </motion.span>
                    </motion.div>

                    {/* Форма */}
                    {[
                      { key: 'name', placeholder: 'Твоё имя' },
                      { key: 'city', placeholder: 'Город доставки' },
                      { key: 'username', placeholder: 'Username в Telegram (без @)' },
                    ].map(({ key, placeholder }, idx) => (
                      <motion.input
                        key={key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.06 }}
                        value={form[key as keyof OrderForm] as string}
                        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        style={{ ...inputStyle, marginBottom: key === 'username' ? 16 : 10 }}
                      />
                    ))}

                    {/* Оплата */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                      {[
                        { key: 'manager', label: '💳 Менеджер', sub: `${cartTotal}₽`, active: form.payment === 'manager', color: BLUE, bg: BLUE_DIM, border: BLUE_BORDER },
                        { key: 'stars', label: '⭐ Stars', sub: `${starsPrice(cartTotal)} ⭐`, active: form.payment === 'stars', color: '#a78bfa', bg: 'rgba(124,58,237,0.12)', border: 'rgba(167,139,250,0.3)' },
                      ].map(opt => (
                        <motion.button key={opt.key}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setForm(prev => ({ ...prev, payment: opt.key as 'manager' | 'stars' }))}
                          style={{
                            flex: 1, padding: '13px 8px', borderRadius: 14, cursor: 'pointer',
                            border: opt.active ? `1.5px solid ${opt.border}` : '1px solid rgba(255,255,255,0.05)',
                            fontWeight: 700, fontSize: 13, lineHeight: 1.6,
                            background: opt.active ? opt.bg : 'rgba(255,255,255,0.02)',
                            color: opt.active ? opt.color : '#7a90b8',
                            transition: 'all 0.2s',
                          }}>
                          {opt.label}<br /><span style={{ fontSize: 11, fontWeight: 500 }}>{opt.sub}</span>
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={sendOrder}
                      disabled={loading}
                      style={{
                        width: '100%',
                        background: loading ? 'rgba(255,255,255,0.04)' : `linear-gradient(135deg, ${BLUE}, #3b7de8)`,
                        color: loading ? '#506080' : '#fff',
                        border: 'none', padding: '18px', borderRadius: 16,
                        fontWeight: 700, fontSize: 16, cursor: loading ? 'default' : 'pointer',
                        letterSpacing: 0.4,
                        boxShadow: loading ? 'none' : `0 8px 32px rgba(106,174,255,0.32)`,
                        transition: 'all 0.3s',
                      }}>
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
