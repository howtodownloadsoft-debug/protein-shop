import type { VercelRequest, VercelResponse } from '@vercel/node'

const BOT_TOKEN = '8649361387:AAHvBO4QPAgfXKuLGt-P_k_pcViyPyESsaY'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { chat_id, title, description, amount, payload } = req.body

  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      description,
      payload,
      currency: 'XTR',
      prices: [{ label: title, amount }],
    }),
  })

  const data = await response.json()
  if (data.ok) {
    res.status(200).json({ url: data.result })
  } else {
    res.status(500).json({ error: data.description })
  }
}
