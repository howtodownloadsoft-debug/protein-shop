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
    composition: 'Концентрат сывороточного белка, какао, ароматизатор, подсластитель стевия. Белок: 80г/100г. Жиры: 4г. Углеводы: 6г.',
    reviews: [
      { author: 'Алексей', text: 'Отличный протеин, размешивается хорошо 🔥', stars: 5 },
      { author: 'Марина', text: 'Пью 3 месяца, результат заметен!', stars: 5 },
    ],
  },
  {
    id: 2, name: 'Казеин', type: 'Казеиновый протеин', emoji: '🌙',
    sizes: [{ label: '1 кг', price: 3290 }, { label: '3 кг', price: 8490 }, { label: '5 кг', price: 13490 }],
    desc: 'Медленный протеин на ночь. Питает мышцы 6-8 часов, защищает от катаболизма.',
    composition: 'Мицеллярный казеин, ароматизатор, сукралоза. Белок: 78г/100г. Жиры: 2г. Углеводы: 4г.',
    reviews: [
      { author: 'Иван', text: 'Лучший казеин что пробовал!', stars: 5 },
      { author: 'Сергей', text: 'Мышцы не теряются даже в дефиците', stars: 5 },
    ],
  },
  {
    id: 3, name: 'Яичный белок', type: 'Яичный протеин', emoji: '🥚',
    sizes: [{ label: '1 кг', price: 3490 }, { label: '3 кг', price: 8990 }, { label: '5 кг', price: 13990 }],
    desc: 'Протеин из яичного альбумина. Один из самых биодоступных белков. Подходит при непереносимости лактозы.',
    composition: 'Яичный альбумин, ароматизатор, стевия. Белок: 82г/100г. Жиры: 1г. Углеводы: 3г.',
    reviews: [
      { author: 'Никита', text: 'Отличное качество, беру постоянно', stars: 5 },
      { author: 'Ольга', text: 'Нет лактозы — то что надо!', stars: 5 },
    ],
  },
  {
    id: 4, name: 'Креатин', type: 'Креатин моногидрат', emoji: '⚡',
    sizes: [{ label: '300 г', price: 990 }, { label: '500 г', price: 1490 }, { label: '1 кг', price: 2490 }],
    desc: 'Чистый креатин моногидрат. Увеличивает силу и выносливость в силовых упражнениях и спринте.',
    composition: 'Креатин моногидрат 100%. Без добавок и красителей.',
    reviews: [
      { author: 'Владимир', text: 'Силовые выросли за месяц заметно', stars: 5 },
      { author: 'Артём', text: 'Чистый продукт, цена огонь', stars: 5 },
    ],
  },
  {
    id: 5, name: 'Гейнер', type: 'Белково-углеводный комплекс', emoji: '💪',
    sizes: [{ label: '1 кг', price: 2290 }, { label: '3 кг', price: 5990 }, { label: '5 кг', price: 9490 }],
    desc: 'Для быстрого набора мышечной массы. Высококалорийный коктейль с оптимальным соотношением БЖУ.',
    composition: 'Мальтодекстрин, концентрат сывороточного белка, овсяная мука. Белок: 25г/100г. Углеводы: 60г/100г.',
    reviews: [
      { author: 'Максим', text: 'За 2 месяца набрал 4 кг!', stars: 5 },
      { author: 'Павел', text: 'Хорошо размешивается, не приторный', stars: 4 },
    ],
  },
  {
    id: 6,
    name: 'Соевый протеин',
    type: 'Растительный протеин',
    emoji: '🌿',
    sizes: [
      { label: '1 кг', price: 2790 },
      { label: '3 кг', price: 6990 },
      { label: '5 кг', price: 10990 },
    ],
    desc: 'Растительный протеин из сои. Полноценный аминокислотный профиль, подходит для веганов и людей с непереносимостью лактозы.',
    composition: 'Изолят соевого белка, ароматизатор, подсластитель стевия. Белок: 85г/100г. Жиры: 1г. Углеводы: 5г.',
    reviews: [
      { author: 'Анна', text: 'Отличная альтернатива молочному протеину, вкус приятный!', stars: 5 },
      { author: 'Кирилл', text: 'Беру для разнообразия, качество хорошее', stars: 4 },
    ],
  },
]

type Tab = 'desc' | 'composition' | 'reviews'

interface OrderForm {
  name: string
  city: string
  username: string
  payment: 'manager' | 'stars'
}

export default function App() {
  const [selected, setSelected] = useState<number | null>(null)
  const [tabs, setTabs] = useState<Record<number, Tab>>({})
  const [sizes, setSizes] = useState<Record<number, number>>({})
  const [orderProduct, setOrderProduct] = useState<typeof products[0] | null>(null)
  const [form, setForm] = useState<OrderForm>({ name: '', city: '', username: '', payment: 'manager' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const getTab = (id: number): Tab => tabs[id] || 'desc'
  const getSize = (id: number) => sizes[id] ?? 0

  const starsPrice = (price: number) => Math.ceil((price / 2) * 1.15)

  const sendOrder = async () => {
    if (!orderProduct) return
    if (!form.name || !form.city || !form.username) {
      alert('Заполни все поля!')
      return
    }
    setLoading(true)
    const sizeIdx = getSize(orderProduct.id)
    const size = orderProduct.sizes[sizeIdx]
    const price = form.payment === 'stars' ? `${starsPrice(size.price)} ⭐ Stars` : `${size.price}₽`
    const text = `🛒 НОВЫЙ ЗАКАЗ!\n👤 Имя: ${form.name}\n📱 Telegram: @${form.username}\n🏙 Город: ${form.city}\n📦 Товар: ${orderProduct.name} — ${size.label}\n💰 Сумма: ${price}\n💳 Оплата: ${form.payment === 'stars' ? 'Telegram Stars' : 'Через менеджера'}\n📬 Статус: Ожидает подтверждения`
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: ADMIN_ID, text }),
    })
    setLoading(false)
    setSent(true)
  }

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: '-apple-system, sans-serif', padding: '0 0 60px' }}>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, #0d0d1a, #1a1a3e)', padding: '44px 20px 32px', textAlign: 'center', borderBottom: '1px solid #222' }}
      >
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ fontSize: 52 }}>⚡</motion.div>
        <h1 style={{ fontSize: 30, fontWeight: 900, margin: '8px 0 6px', letterSpacing: 1 }}>SPLINTEL SHOP</h1>
        <p style={{ color: '#888', fontSize: 13, margin: 0 }}>Спортивное питание · Быстрая доставка</p>
      </motion.div>

      {/* Products */}
      <div style={{ padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {products.map((p, i) => {
          const isOpen = selected === p.id
          const tab = getTab(p.id)
          const sizeIdx = getSize(p.id)
          const currentSize = p.sizes[sizeIdx]

          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: '#161616', borderRadius: 18, overflow: 'hidden', border: isOpen ? '1px solid #4f8ef7' : '1px solid #252525' }}>

              <div onClick={() => setSelected(isOpen ? null : p.id)}
                style={{ padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                    {p.emoji}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
                    <div style={{ color: '#666', fontSize: 12, marginTop: 2 }}>{p.type}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#4f8ef7', fontSize: 18 }}>{currentSize.price}₽</div>
                  <div style={{ color: '#555', fontSize: 11 }}>{currentSize.label}</div>
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ borderTop: '1px solid #222' }}>

                    {/* Size selector */}
                    <div style={{ padding: '14px 16px 0', display: 'flex', gap: 8 }}>
                      {p.sizes.map((s, idx) => (
                        <button key={idx} onClick={() => setSizes(prev => ({ ...prev, [p.id]: idx }))}
                          style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                            background: sizeIdx === idx ? '#4f8ef7' : '#222', color: sizeIdx === idx ? 'white' : '#888' }}>
                          {s.label}<br /><span style={{ fontSize: 11, fontWeight: 400 }}>{s.price}₽</span>
                        </button>
                      ))}
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', padding: '14px 16px 0', gap: 6 }}>
                      {(['desc', 'composition', 'reviews'] as Tab[]).map(t => (
                        <button key={t} onClick={() => setTabs(prev => ({ ...prev, [p.id]: t }))}
                          style={{ flex: 1, padding: '7px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                            background: tab === t ? '#1e3a5f' : '#1e1e1e', color: tab === t ? '#4f8ef7' : '#666' }}>
                          {t === 'desc' ? '📋 Описание' : t === 'composition' ? '🧪 Состав' : '⭐ Отзывы'}
                        </button>
                      ))}
                    </div>

                    <div style={{ padding: '14px 16px' }}>
                      {tab === 'desc' && <p style={{ color: '#bbb', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{p.desc}</p>}
                      {tab === 'composition' && <p style={{ color: '#bbb', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{p.composition}</p>}
                      {tab === 'reviews' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {p.reviews.map((r, idx) => (
                            <div key={idx} style={{ background: '#1e1e1e', borderRadius: 12, padding: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontWeight: 700, fontSize: 13 }}>{r.author}</span>
                                <span>{'⭐'.repeat(r.stars)}</span>
                              </div>
                              <p style={{ color: '#aaa', fontSize: 13, margin: 0 }}>{r.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <a href={MANAGER} style={{ display: 'block', background: '#229ED9', color: 'white', textAlign: 'center',
                        padding: '13px', borderRadius: 13, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
                        💬 Написать менеджеру
                      </a>
                      <button onClick={() => { setOrderProduct(p); setSent(false); setForm({ name: '', city: '', username: '', payment: 'manager' }) }}
                        style={{ background: '#1e1e1e', color: 'white', border: '1px solid #333', padding: '13px',
                          borderRadius: 13, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                        🛒 Оформить заказ
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {orderProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}
            onClick={(e) => e.target === e.currentTarget && setOrderProduct(null)}>
            <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} transition={{ type: 'spring', damping: 25 }}
              style={{ background: '#161616', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', width: '100%', border: '1px solid #252525' }}>

              {sent ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
                  <h2 style={{ margin: '0 0 8px' }}>Заказ оформлен!</h2>
                  <p style={{ color: '#888', fontSize: 14, margin: '0 0 20px' }}>Менеджер свяжется с тобой в Telegram в ближайшее время</p>
                  <button onClick={() => setOrderProduct(null)}
                    style={{ background: '#4f8ef7', color: 'white', border: 'none', padding: '13px 32px', borderRadius: 13, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                    Закрыть
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ margin: 0, fontSize: 20 }}>🛒 Оформление заказа</h2>
                    <button onClick={() => setOrderProduct(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 22, cursor: 'pointer' }}>✕</button>
                  </div>

                  <div style={{ background: '#1e1e1e', borderRadius: 12, padding: '12px 14px', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#aaa', fontSize: 14 }}>{orderProduct.emoji} {orderProduct.name} — {orderProduct.sizes[getSize(orderProduct.id)].label}</span>
                    <span style={{ color: '#4f8ef7', fontWeight: 700 }}>{orderProduct.sizes[getSize(orderProduct.id)].price}₽</span>
                  </div>

                  {(['name', 'city', 'username'] as const).map(field => (
                    <input key={field} value={form[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                      placeholder={field === 'name' ? '👤 Твоё имя' : field === 'city' ? '🏙 Город доставки' : '📱 Твой username в Telegram'}
                      style={{ width: '100%', background: '#1e1e1e', border: '1px solid #333', borderRadius: 12, padding: '13px 14px',
                        color: 'white', fontSize: 14, marginBottom: 10, boxSizing: 'border-box', outline: 'none' }} />
                  ))}

                  {/* Payment selector */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <button onClick={() => setForm(p => ({ ...p, payment: 'manager' }))}
                      style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                        background: form.payment === 'manager' ? '#4f8ef7' : '#1e1e1e', color: form.payment === 'manager' ? 'white' : '#888' }}>
                      💳 Через менеджера<br />
                      <span style={{ fontSize: 11, fontWeight: 400 }}>{orderProduct.sizes[getSize(orderProduct.id)].price}₽</span>
                    </button>
                    <button onClick={() => setForm(p => ({ ...p, payment: 'stars' }))}
                      style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                        background: form.payment === 'stars' ? '#6c3de0' : '#1e1e1e', color: form.payment === 'stars' ? 'white' : '#888' }}>
                      ⭐ Telegram Stars<br />
                      <span style={{ fontSize: 11, fontWeight: 400 }}>{starsPrice(orderProduct.sizes[getSize(orderProduct.id)].price)} Stars</span>
                    </button>
                  </div>

                  <button onClick={sendOrder} disabled={loading}
                    style={{ width: '100%', background: loading ? '#333' : 'linear-gradient(135deg, #4f8ef7, #6c3de0)',
                      color: 'white', border: 'none', padding: '15px', borderRadius: 13, fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>
                    {loading ? 'Отправка...' : '✅ Подтвердить заказ'}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
