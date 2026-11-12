import { useEffect, useRef, useState } from 'react'
import { FaceBadge } from './Mascot'
import { useLang, type Tx } from '../lib/i18n'

type Msg = { from: 'me' | 'bot'; text: Tx }

const FAQ: { q: Tx; a: Tx }[] = [
  {
    q: {
      vi: 'Cho mình hỏi sau này đi làm mình có được các trải nghiệm tương tự như trên đây không?',
      en: 'When I start working for real, will I get experiences like the ones here?',
    },
    a: {
      vi: 'Bạn chắc chắn sẽ có những trải nghiệm tương tự khi đi làm, nhưng thực tế sẽ phong phú và thử thách hơn; những gì bạn thấy ở đây chỉ là "bản nháp", còn khi đi làm thật bạn sẽ cộng tác với đồng nghiệp, xử lý tình huống và trưởng thành qua từng thử thách để xây dựng sự nghiệp của mình.',
      en: 'You definitely will, but the real thing is richer and more challenging. What you see here is just a "rough draft": on the job you\'ll team up with colleagues, handle real situations and grow with every challenge as you build your career.',
    },
  },
  {
    q: { vi: 'Vậy bạn có biện pháp ôn tập nào bổ sung hong?', en: 'Got any extra ways for me to practise?' },
    a: {
      vi: 'Có nè! Sau mỗi cấp độ, bạn thử tự giải thích lại vì sao phương án đúng tốt hơn. Mỗi tuần sưu tầm vài poster mình thích rồi soi kiểu chữ, màu sắc và bố cục của chúng. Trong báo cáo kết quả, Chộp Chếc cũng gợi ý các cấp độ nên chơi lại đó.',
      en: 'Sure do! After each level, try explaining to yourself why the right option works better. Every week, collect a few posters you like and study their type, colours and layout. Your results report also suggests which levels to replay.',
    },
  },
  {
    q: { vi: 'Thiết kế đồ họa là gì vậy?', en: 'So what is graphic design anyway?' },
    a: {
      vi: 'Thiết kế đồ họa là lĩnh vực kết hợp giữa nghệ thuật và công nghệ, truyền tải thông điệp qua hình ảnh, màu sắc và bố cục. Người làm thiết kế đồ họa tạo ra logo, ấn phẩm quảng cáo, giao diện website hay bộ nhận diện thương hiệu.',
      en: 'Graphic design blends art and technology to get a message across through images, colour and layout. Graphic designers create logos, ads, website interfaces and brand identities.',
    },
  },
]

/** The mascot helper: a small scripted chat that answers common questions and gives task hints */
export function Assistant({ open, onClose, hint }: { open: boolean; onClose: () => void; hint?: Tx }) {
  const { t } = useLang()
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'bot', text: { vi: 'Hí lô, mình là Chộp! Bạn cần hỏi gì cứ chọn bên dưới nha.', en: "Hiya, I'm Chộp! Pick a question below and ask away." } },
  ])
  const [typing, setTyping] = useState(false)
  const list = useRef<HTMLDivElement>(null)

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  const ask = (q: Tx, a: Tx) => {
    if (typing) return
    setMsgs((m) => [...m, { from: 'me', text: q }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'bot', text: a }])
    }, 900 + Math.min(1400, a.vi.length * 8))
  }

  if (!open) return null
  const asks = [
    ...(hint ? [{ q: { vi: 'Gợi ý giúp mình task này với?', en: 'Can you give me a hint for this task?' }, a: hint }] : []),
    ...FAQ.filter((f) => !msgs.some((m) => m.text.vi === f.q.vi)),
  ]
  return (
    <aside className="assistant" aria-label={t('Trợ lý Chộp', 'Chộp the helper')}>
      <header>
        <span className="as-face">
          <FaceBadge />
        </span>
        <strong>{t('Chộp – trợ lý của bạn', 'Chộp – your helper')}</strong>
        <button onClick={onClose} aria-label={t('Đóng trợ lý', 'Close helper')}>
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
      </header>
      <div className="as-list" ref={list}>
        {msgs.map((m, i) => (
          <p key={i} className={`as-msg ${m.from}`}>
            {t(m.text)}
          </p>
        ))}
        {typing && (
          <p className="as-msg bot typing" aria-label={t('Chộp đang trả lời', 'Chộp is typing')}>
            <i />
            <i />
            <i />
          </p>
        )}
      </div>
      <div className="as-asks">
        {asks.slice(0, 3).map((f) => (
          <button key={f.q.vi} onClick={() => ask(f.q, f.a)} disabled={typing}>
            {t(f.q)}
          </button>
        ))}
      </div>
    </aside>
  )
}
