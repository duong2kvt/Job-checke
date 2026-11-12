import { useEffect, useRef, useState } from 'react'
import { MascotBadge } from './Mascot'

type Msg = { from: 'me' | 'bot'; text: string }

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Cho mình hỏi sau này đi làm mình có được các trải nghiệm tương tự như trên đây không?',
    a: 'Bạn chắc chắn sẽ có những trải nghiệm tương tự khi đi làm, nhưng thực tế sẽ phong phú và thử thách hơn; những gì bạn thấy ở đây chỉ là "bản nháp", còn khi đi làm thật bạn sẽ cộng tác với đồng nghiệp, xử lý tình huống và trưởng thành qua từng thử thách để xây dựng sự nghiệp của mình.',
  },
  {
    q: 'Vậy bạn có biện pháp ôn tập nào bổ sung hong?',
    a: 'Có nè! Sau mỗi cấp độ, bạn thử tự giải thích lại vì sao phương án đúng tốt hơn. Mỗi tuần sưu tầm vài poster mình thích rồi soi kiểu chữ, màu sắc và bố cục của chúng. Trong báo cáo kết quả, Chộp Chếc cũng gợi ý các cấp độ nên chơi lại đó.',
  },
  {
    q: 'Thiết kế đồ họa là gì vậy?',
    a: 'Thiết kế đồ họa là lĩnh vực kết hợp giữa nghệ thuật và công nghệ, truyền tải thông điệp qua hình ảnh, màu sắc và bố cục. Người làm thiết kế đồ họa tạo ra logo, ấn phẩm quảng cáo, giao diện website hay bộ nhận diện thương hiệu.',
  },
]

/** The mascot helper: a small scripted chat that answers common questions and gives task hints */
export function Assistant({ open, onClose, hint }: { open: boolean; onClose: () => void; hint?: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: 'Hí lô, mình là Chộp! Bạn cần hỏi gì cứ chọn bên dưới nha.' }])
  const [typing, setTyping] = useState(false)
  const list = useRef<HTMLDivElement>(null)

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  const ask = (q: string, a: string) => {
    if (typing) return
    setMsgs((m) => [...m, { from: 'me', text: q }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'bot', text: a }])
    }, 900 + Math.min(1400, a.length * 8))
  }

  if (!open) return null
  const asks = [
    ...(hint ? [{ q: 'Gợi ý giúp mình task này với?', a: hint }] : []),
    ...FAQ.filter((f) => !msgs.some((m) => m.text === f.q)),
  ]
  return (
    <aside className="assistant" aria-label="Trợ lý Chộp">
      <header>
        <MascotBadge size={40} />
        <strong>Chộp – trợ lý của bạn</strong>
        <button onClick={onClose} aria-label="Đóng trợ lý">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
      </header>
      <div className="as-list" ref={list}>
        {msgs.map((m, i) => (
          <p key={i} className={`as-msg ${m.from}`}>
            {m.text}
          </p>
        ))}
        {typing && (
          <p className="as-msg bot typing" aria-label="Chộp đang trả lời">
            <i />
            <i />
            <i />
          </p>
        )}
      </div>
      <div className="as-asks">
        {asks.slice(0, 3).map((f) => (
          <button key={f.q} onClick={() => ask(f.q, f.a)} disabled={typing}>
            {f.q}
          </button>
        ))}
      </div>
    </aside>
  )
}
