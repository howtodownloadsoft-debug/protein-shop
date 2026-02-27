import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import ksb80Img from './assets/ksb80.png'

const MANAGER = 'https://t.me/Lockerrrr'
const BOT_TOKEN = '8649361387:AAHvBO4QPAgfXKuLGt-P_k_pcViyPyESsaY'
const ADMIN_ID = '7220667051'

interface Product {
  id: number
  name: string
  type: string
  image?: string
  sizes: { label: string; price: number }[]
  desc: string
  composition: string
  reviews: { author: string; text: string; stars: number }[]
}

const products: Product[] = [
  {
    id: 1, name: 'КСБ 80', type: 'Сывороточный протеин',
    image: ksb80Img,
    sizes: [{ label: '1 кг', price: 2990 }, { label: '3 кг', price: 7490 }, { label: '5 кг', price: 11990 }],
    desc: 'Концентрат сывороточного белка 80% на порцию. Идеален после тренировки для быстрого восстановления мышц.',
    composition: 'Концентрат сывороточного белка, какао, ароматизатор, стевия. Белок: 80г/100г. Жиры: 4г. Углеводы: 6г.',
    reviews: [{ author: 'Алексей', text: 'Отличный протеин, размешивается хорошо 🔥', stars: 5 }, { author: 'Марина', text: 'Пью 3 месяца, результат заметен!', stars: 5 }],
  },
  {
    id: 2, name: 'Казеин', type: 'Казеиновый протеин',
    sizes: [{ label: '1 кг', price: 3290 }, { label: '3 кг', price: 8490 }, { label: '5 кг', price: 13490 }],
    desc: 'Медленный протеин на ночь. Питает мышцы 6-8 часов, защищает от катаболизма.',
    composition: 'Мицеллярный казеин, ароматизатор, сукралоза. Белок: 78г/100г. Жиры: 2г. Углеводы: 4г.',
    reviews: [{ author: 'Иван', text: 'Лучший казеин что пробовал!', stars: 5 }, { author: 'Сергей', text: 'Мышцы не теряются даже в дефиците', stars: 5 }],
  },
  {
    id: 3, name: 'Яичный белок', type: 'Яичный протеин',
    sizes: [{ label: '1 кг', price: 3490 }, { label: '3 кг', price: 8990 }, { label: '5 кг', price: 13990 }],
    desc: 'Протеин из яичного альбумина. Один из самых биодоступных белков. Подходит при непереносимости лактозы.',
    composition: 'Яичный альбумин, ароматизатор, стевия. Белок: 82г/100г. Жиры: 1г. Углеводы: 3г.',
    reviews: [{ author: 'Никита', text: 'Отличное качество, беру постоянно', stars: 5 }, { author: 'Ольга', text: 'Нет лактозы — то что надо!', stars: 5 }],
  },
  {
    id: 4, name: 'Креатин', type: 'Креатин моногидрат',
    sizes: [{ label: '300 г', price: 990 }, { label: '500 г', price: 1490 }, { label: '1 кг', price: 2490 }],
    desc: 'Чистый креатин моногидрат. Увеличивает силу и выносливость в силовых и спринте.',
    composition: 'Креатин моногидрат 100%. Без добавок и красителей.',
    reviews: [{ author: 'Владимир', text: 'Силовые выросли за месяц заметно', stars: 5 }, { author: 'Артём', text: 'Чистый продукт, цена огонь', stars: 5 }],
  },
  {
    id: 5, name: 'Гейнер', type: 'Белково-углеводный комплекс',
    sizes: [{ label: '1 кг', price: 2290 }, { label: '3 кг', price: 5990 }, { label: '5 кг', price: 9490 }],
    desc: 'Для быстрого набора мышечной массы. Высококалорийный коктейль с оптимальным соотношением БЖУ.',
    composition: 'Мальтодекстрин, концентрат сывороточного белка, овсяная мука. Белок: 25г/100г. Углеводы: 60г/100г.',
    reviews: [{ author: 'Максим', text: 'За 2 месяца набрал 4 кг!', stars: 5 }, { author: 'Павел', text: 'Хорошо размешивается, не приторный', stars: 4 }],
  },
  {
    id: 6, name: 'Соевый протеин', type: 'Растительный протеин',
    sizes: [{ label: '1 кг', price: 2790 }, { label: '3 кг', price: 6990 }, { label: '5 кг', price: 10990 }],
    desc: 'Растительный протеин из сои. Полноценный аминокислотный профиль, подходит для веганов.',
    composition: 'Изолят соевого белка, ароматизатор, стевия. Белок: 85г/100г. Жиры: 1г. Углеводы: 5г.',
    reviews: [{ author: 'Анна', text: 'Отличная альтернатива молочному!', stars: 5 }, { author: 'Кирилл', text: 'Беру для разнообразия, качество хорошее', stars: 4 }],
  },
]

const ProductImage = ({ image }: { image?: string }) => (
  <div style={{
    width: 56, height: 56, borderRadius: 14, flexShrink: 0,
    background: '#1a1a1a',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    {image ? (
      <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <svg width="32" height="38" viewBox="0 0 32 38" fill="none">
        <rect x="6" y="6" width="20" height="28" rx="4" fill="#222"/>
        <rect x="6" y="6" width="20" height="28" rx="4" stroke="rgba(255,106,0,0.5)" strokeWidth="1"/>
        <rect x="4" y="4" width="24" height="6" rx="3" fill="#2a2a2a" stroke="rgba(255,106,0,0.4)" strokeWidth="1"/>
        <rect x="4" y="28" width="24" height="6" rx="3" fill="#2a2a2a" stroke="rgba(255,106,0,0.4)" strokeWidth="1"/>
        <rect x="8" y="13" width="16" height="14" rx="2" fill="rgba(255,106,0,0.12)"/>
        <text x="16" y="22" textAnchor="middle" fill="#ff6a00" fontSize="5" fontWeight="bold" fontFamily="sans-serif">SPL</text>
      </svg>
    )}
  </div>
)

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
    width: '100%', background: '#222', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14, padding: '14px 16px', color: '#fff', fontSize: 15,
    marginBottom: 10, boxSizing: 'border-box', outline: 'none',
  }

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', width: '100%', color: '#fff', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', paddingBottom: 110, overflowX: 'hidden' }}>

      {/* ── HEADER ── */}
      <div style={{ width: '100%', padding: '20px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 1, color: '#fff' }}>SPLINTEL</div>
          <div style={{ fontSize: 11, color: '#ff6a00', fontWeight: 600, letterSpacing: 2, marginTop: 1 }}>SPORT NUTRITION</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Качество', 'Доставка РФ'].map((t, i) => (
            <span key={i} style={{ background: 'rgba(255,106,0,0.1)', border: '1px solid rgba(255,106,0,0.2)', color: '#ff8c42', padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── КАТАЛОГ ── */}
      <div style={{ padding: '20px 16px 0' }}>
        <p style={{ color: '#444', fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', margin: '0 0 12px' }}>Каталог товаров</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {products.map((p, i) => {
            const isOpen = selected === p.id
            const tab = getTab(p.id)
            const sizeIdx = getSize(p.id)
            const currentSize = p.sizes[sizeIdx]
            const cartItem = cart.find(c => c.productId === p.id && c.sizeIdx === sizeIdx)

            return (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: '#1a1a1a',
                  borderRadius: 18,
                  overflow: 'hidden',
                  border: isOpen ? '1px solid rgba(255,106,0,0.35)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: isOpen ? '0 0 24px rgba(255,106,0,0.12)' : 'none',
                  transition: 'border 0.25s, box-shadow 0.25s',
                }}>

                {/* Шапка карточки */}
                <motion.div whileTap={{ scale: 0.985 }} onClick={() => setSelected(isOpen ? null : p.id)}
                  style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <ProductImage image={p.image} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ color: '#666', fontSize: 12, marginTop: 3 }}>{p.type}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 17, color: '#ff6a00' }}>{currentSize.price}₽</div>
                    <div style={{ color: '#555', fontSize: 11, marginTop: 2 }}>{currentSize.label}</div>
                  </div>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
                    style={{ color: '#555', fontSize: 10, marginLeft: 4, flexShrink: 0 }}>▼</motion.span>
                </motion.div>

                {/* Раскрытая часть */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

                        {/* Фасовки */}
                        <div style={{ display: 'flex', gap: 8, marginTop: 14, marginBottom: 14 }}>
                          {p.sizes.map((s, idx) => (
                            <motion.button key={idx} whileTap={{ scale: 0.95 }}
                              onClick={() => setSizes(prev => ({ ...prev, [p.id]: idx }))}
                              style={{
                                flex: 1, padding: '10px 4px', borderRadius: 12, border: 'none', cursor: 'pointer',
                                background: sizeIdx === idx ? '#ff6a00' : '#2c2c2c',
                                color: sizeIdx === idx ? '#000' : '#fff',
                                fontWeight: 700, fontSize: 12, lineHeight: 1.5,
                                transition: 'all 0.2s',
                              }}>
                              {s.label}<br />
                              <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>{s.price}₽</span>
                            </motion.button>
                          ))}
                        </div>

                        {/* Табы */}
                        <div style={{ display: 'flex', background: '#111', borderRadius: 12, padding: 3, marginBottom: 14 }}>
                          {(['desc', 'composition', 'reviews'] as Tab[]).map(t => (
                            <button key={t} onClick={() => setTabs(prev => ({ ...prev, [p.id]: t }))}
                              style={{
                                flex: 1, padding: '8px 4px', borderRadius: 9, border: 'none', cursor: 'pointer',
                                fontSize: 11, fontWeight: 700,
                                background: tab === t ? '#2a2a2a' : 'transparent',
                                color: tab === t ? '#fff' : '#555',
                                transition: 'all 0.15s',
                              }}>
                              {t === 'desc' ? 'Описание' : t === 'composition' ? 'Состав' : 'Отзывы'}
                            </button>
                          ))}
                        </div>

                        {/* Контент */}
                        <AnimatePresence mode="wait">
                          <motion.div key={tab}
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            style={{ minHeight: 64, marginBottom: 16 }}>
                            {tab === 'desc' && <p style={{ color: '#aaa', fontSize: 14, margin: 0, lineHeight: 1.7 }}>{p.desc}</p>}
                            {tab === 'composition' && <p style={{ color: '#aaa', fontSize: 14, margin: 0, lineHeight: 1.7 }}>{p.composition}</p>}
                            {tab === 'reviews' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {p.reviews.map((r, idx) => (
                                  <div key={idx} style={{ background: '#111', borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                      <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{r.author}</span>
                                      <span style={{ fontSize: 11, color: '#ff6a00' }}>{'★'.repeat(r.stars)}</span>
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
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111', borderRadius: 14, padding: '10px 18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeQty(p.id, sizeIdx, -1)}
                                style={{ background: '#ff6a00', border: 'none', color: '#000', width: 32, height: 32, borderRadius: 10, fontSize: 18, cursor: 'pointer', fontWeight: 900 }}>−</motion.button>
                              <span style={{ fontWeight: 800, fontSize: 16 }}>{cartItem.qty}</span>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeQty(p.id, sizeIdx, 1)}
                                style={{ background: '#ff6a00', border: 'none', color: '#000', width: 32, height: 32, borderRadius: 10, fontSize: 18, cursor: 'pointer', fontWeight: 900 }}>+</motion.button>
                            </div>
                          ) : (
                            <motion.button whileTap={{ scale: 0.97 }} onClick={() => addToCart(p.id, sizeIdx)}
                              style={{
                                flex: 1, padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
                                background: '#ff6a00', color: '#000',
                                fontWeight: 800, fontSize: 15,
                                boxShadow: '0 4px 20px rgba(255,106,0,0.35)',
                              }}>
                              В корзину
                            </motion.button>
                          )}
                          <a href={MANAGER}
                            style={{
                              width: 52, borderRadius: 14, background: '#222', border: '1px solid rgba(255,255,255,0.06)',
                              textDecoration: 'none', fontSize: 20,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>💬</a>
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
            initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowCart(true); setSent(false); setForm({ name: '', city: '', username: '', payment: 'manager' }) }}
            style={{
              position: 'fixed', bottom: 20, left: 16, right: 16,
              background: '#ff6a00', color: '#000',
              border: 'none', padding: '17px 24px', borderRadius: 16,
              fontWeight: 900, fontSize: 16, cursor: 'pointer', zIndex: 50,
              boxShadow: '0 8px 32px rgba(255,106,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
            <span>🛒 Корзина · {cartCount} шт</span>
            <span>{cartTotal}₽</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── МОДАЛКА КОРЗИНЫ ── */}
      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}
            onClick={e => e.target === e.currentTarget && setShowCart(false)}>
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{ background: '#111', borderRadius: '24px 24px 0 0', width: '100%', maxHeight: '92vh', overflowY: 'auto' }}>

              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 6 }}>
                <div style={{ width: 36, height: 4, background: '#2a2a2a', borderRadius: 2 }} />
              </div>

              <div style={{ padding: '8px 20px 48px' }}>
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                      style={{ fontSize: 64, marginBottom: 18 }}>✅</motion.div>
                    <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 900 }}>Заказ принят!</h2>
                    <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7, margin: '0 0 28px' }}>Менеджер свяжется с тобой в Telegram в ближайшее время</p>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowCart(false)}
                      style={{ background: '#ff6a00', color: '#000', border: 'none', padding: '15px 48px', borderRadius: 14, fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,106,0,0.35)' }}>
                      Закрыть
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <h2 style={{ margin: '0 0 18px', fontSize: 20, fontWeight: 900 }}>Корзина</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                      {cart.map(item => {
                        const p = products.find(x => x.id === item.productId)!
                        const size = p.sizes[item.sizeIdx]
                        return (
                          <div key={`${item.productId}-${item.sizeIdx}`}
                            style={{ background: '#1a1a1a', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                              <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>{size.label}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeQty(item.productId, item.sizeIdx, -1)}
                                style={{ background: '#2c2c2c', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 900 }}>−</motion.button>
                              <span style={{ fontWeight: 800, fontSize: 14, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeQty(item.productId, item.sizeIdx, 1)}
                                style={{ background: '#ff6a00', border: 'none', color: '#000', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 900 }}>+</motion.button>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: 14, color: '#ff6a00', minWidth: 64, textAlign: 'right' }}>{size.price * item.qty}₽</span>
                          </div>
                        )
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: 18 }}>
                      <span style={{ color: '#888', fontSize: 15 }}>Итого</span>
                      <span style={{ fontWeight: 900, fontSize: 22, color: '#ff6a00' }}>{cartTotal}₽</span>
                    </div>

                    <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Твоё имя" style={inputStyle} />
                    <input value={form.city} onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Город доставки" style={inputStyle} />
                    <input value={form.username} onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Username в Telegram (без @)" style={{ ...inputStyle, marginBottom: 16 }} />

                    <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setForm(prev => ({ ...prev, payment: 'manager' }))}
                        style={{
                          flex: 1, padding: '13px 8px', borderRadius: 14,
                          border: form.payment === 'manager' ? '1.5px solid #ff6a00' : '1px solid rgba(255,255,255,0.07)',
                          cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1.6,
                          background: form.payment === 'manager' ? 'rgba(255,106,0,0.12)' : '#1a1a1a',
                          color: form.payment === 'manager' ? '#ff6a00' : '#555',
                        }}>
                        💳 Через менеджера<br /><span style={{ fontSize: 11 }}>{cartTotal}₽</span>
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setForm(prev => ({ ...prev, payment: 'stars' }))}
                        style={{
                          flex: 1, padding: '13px 8px', borderRadius: 14,
                          border: form.payment === 'stars' ? '1.5px solid #a78bfa' : '1px solid rgba(255,255,255,0.07)',
                          cursor: 'pointer', fontWeight: 700, fontSize: 12, lineHeight: 1.6,
                          background: form.payment === 'stars' ? 'rgba(124,58,237,0.15)' : '#1a1a1a',
                          color: form.payment === 'stars' ? '#a78bfa' : '#555',
                        }}>
                        ⭐ Telegram Stars<br /><span style={{ fontSize: 11 }}>{starsPrice(cartTotal)} Stars</span>
                      </motion.button>
                    </div>

                    <motion.button whileTap={{ scale: 0.98 }} onClick={sendOrder} disabled={loading}
                      style={{
                        width: '100%', background: loading ? '#222' : '#ff6a00',
                        color: loading ? '#555' : '#000', border: 'none', padding: '17px',
                        borderRadius: 14, fontWeight: 900, fontSize: 17, cursor: 'pointer',
                        boxShadow: loading ? 'none' : '0 6px 24px rgba(255,106,0,0.4)',
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
