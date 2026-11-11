import { useEffect, useRef, useState } from 'react'
import './quiz.css'

// The six-question personality quiz and the "thinking" screen, rebuilt in
// code from the Figma frames (Quiz-0 … Quiz-6, AI Analyse) on a 1920×1032 canvas.

export const QUESTIONS = [
  { text: 'Bạn có thích thao tác thực tế, làm việc bằng tay hoặc sửa chữa đồ vật hông?', sticker: 'Trả lời bình tĩnh nghen!', color: '#F28AC9', face: 'happy' },
  { text: 'Bạn thích phân tích thông tin, giải quyết vấn đề phức tạp hoặc nghiên cứu khoa học hông?', sticker: 'Gòi nữa nè, tiếp nè!', color: '#F7E74A', face: 'focus' },
  { text: 'Bạn có thích sáng tạo, thiết kế, vẽ, viết hoặc biểu diễn nghệ thuật hông?', sticker: 'Thêm xíu xíu nữa iii', color: '#8CCBF2', face: 'wow' },
  { text: 'Bạn có thích giúp đỡ người khác học tập hoặc giải quyết vấn đề cá nhân hông?', sticker: 'Gòi nữa nè, tiếp nè!', color: '#C9EA6B', face: 'happy' },
  { text: 'Bạn cảm thấy hứng thú khi quản lý, ra quyết định hoặc dẫn dắt một nhóm hông?', sticker: 'Sắp xong rồi đó nha', color: '#F6A98B', face: 'focus' },
  { text: 'Bạn có cảm thấy thoải mái khi làm việc theo quy trình rõ ràng, chuẩn mực, chi tiết hông?', sticker: 'Xong ùi :33', color: '#79D5F2', face: 'wow' },
] as const

type Face = 'happy' | 'focus' | 'wow' | 'think'
const SCALE = [
  { c: '#EE7FC0', label: 'Rất phản đối' },
  { c: '#EE7FC0', label: 'Phản đối' },
  { c: '#86C9A6', label: 'Trung lập' },
  { c: '#21BF73', label: 'Đồng ý' },
  { c: '#21BF73', label: 'Rất đồng ý' },
]

export function Loops() {
  return (
    <svg className="cc-loops" viewBox="0 0 1920 1032" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="cc-l1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE9A8" />
          <stop offset=".45" stopColor="#F9C6E4" />
          <stop offset="1" stopColor="#C9D8FF" />
        </linearGradient>
        <linearGradient id="cc-l2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D8F3E4" />
          <stop offset="1" stopColor="#D9D2FF" />
        </linearGradient>
      </defs>
      <path d="M-40 980 C 120 760, 40 120, 330 40 C 560 -20, 620 420, 420 610 C 240 780, 700 1060, 1240 860 C 1560 740, 1760 600, 1980 380" fill="none" stroke="url(#cc-l1)" strokeWidth="22" strokeLinecap="round" opacity=".55" />
      <path d="M1980 620 C 1700 900, 1300 1040, 900 1010" fill="none" stroke="url(#cc-l2)" strokeWidth="18" strokeLinecap="round" opacity=".6" />
    </svg>
  )
}

export function Logo({ className = 'cc-logo' }: { className?: string }) {
  return <img className={className} src={`${import.meta.env.BASE_URL}logo.png`} alt="Chộp Chếc" />
}

function useLook(ref: React.RefObject<HTMLElement>) {
  const [look, setLook] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const on = (e: PointerEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height * 0.38)
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / 400)
      setLook({ x: (dx / d) * 12 * k, y: (dy / d) * 12 * k })
    }
    window.addEventListener('pointermove', on)
    return () => window.removeEventListener('pointermove', on)
  }, [ref])
  return look
}

export function Mascot({ face, look = { x: 0, y: 0 }, small = false }: { face: Face; look?: { x: number; y: number }; small?: boolean }) {
  const eye = (cx: number, flip: 1 | -1) => (
    <g key={cx}>
      <circle cx={cx} cy={0} r={small ? 38 : 58} fill="#fff" stroke="#3616E3" strokeWidth={small ? 5 : 6} />
      <circle cx={cx + look.x * (small ? 0.6 : 1)} cy={look.y * (small ? 0.6 : 1)} r={small ? 20 : 30} fill="#58C8EE" stroke="#3616E3" strokeWidth={small ? 4 : 5} className="cc-pupil" />
      {face === 'focus' && <path d={`M${cx - 44 * flip} -96 L${cx + 30 * flip} -66`} stroke="#3616E3" strokeWidth="6" strokeLinecap="round" />}
      {(face === 'happy' || face === 'wow' || face === 'think') && (
        <path d={`M${cx - 30} ${face === 'wow' ? -104 : -92} Q ${cx} ${face === 'wow' ? -126 : -112} ${cx + 30} ${face === 'wow' ? -104 : -92}`} fill="none" stroke="#3616E3" strokeWidth="6" strokeLinecap="round" />
      )}
    </g>
  )
  return (
    <svg className={`cc-mascot ${small ? 'is-small' : ''}`} viewBox="-150 -150 300 280" aria-hidden>
      {face === 'happy' && (
        <>
          <ellipse cx={-80} cy={46} rx={34} ry={22} fill="#F06BB8" opacity=".9" />
          <ellipse cx={80} cy={46} rx={34} ry={22} fill="#F06BB8" opacity=".9" />
        </>
      )}
      <g className="cc-blink">
        {eye(-78, 1)}
        {eye(78, -1)}
      </g>
      {face === 'happy' && <path d="M-16 52 q16 22 32 0" fill="none" stroke="#3616E3" strokeWidth="6" strokeLinecap="round" />}
      {face === 'focus' && <path d="M-14 48 l14 14 l16 -14" fill="none" stroke="#3616E3" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />}
      {face === 'wow' && <circle cx={0} cy={66} r={16} fill="#fff" stroke="#3616E3" strokeWidth="6" />}
      {face === 'think' && <path d="M-6 52 q14 6 0 14 q14 6 0 14" fill="none" stroke="#3616E3" strokeWidth="5" strokeLinecap="round" />}
    </svg>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <path d="M6 12.5l4 4 8-9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function QuizView({ index, picked, onPick, onBack }: { index: number; picked: number | null; onPick?: (v: number) => void; onBack?: () => void }) {
  const q = QUESTIONS[index]
  const cardRef = useRef<HTMLDivElement>(null)
  const look = useLook(cardRef)
  return (
    <div className="cc-screen cc-quiz">
      <Loops />
      <Logo />
      <div key={`s${index}`} className="cc-sticker" style={{ background: q.color }}>
        {q.sticker}
      </div>
      <div className="cc-card" ref={cardRef}>
        <div className="cc-face">
          <Mascot face={q.face} look={look} />
        </div>
        <div key={`q${index}`} className="cc-question">
          <span className="cc-tag">{index + 1}/6</span>
          <span>{q.text}</span>
        </div>
      </div>
      <div className="cc-scale">
        <span className="cc-scale-end">Phản đối</span>
        {SCALE.map((s, i) => (
          <button
            key={i}
            data-target={`opt-${i}`}
            data-cursor="pointer"
            aria-label={s.label}
            className="cc-dot"
            data-on={picked === i || undefined}
            style={{ ['--c' as string]: s.c }}
            onClick={() => onPick?.(i)}
          >
            {picked === i && <Check />}
          </button>
        ))}
        <span className="cc-scale-end">Đồng ý</span>
      </div>
      {index > 0 && (
        <button className="cc-back" onClick={onBack}>
          <span className="cc-back-ico">‹</span> Trở Về
        </button>
      )}
    </div>
  )
}

export function Quiz({ onDone, onExit }: { onDone: () => void; onExit: () => void }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(6).fill(null))
  const lock = useRef(false)
  const pick = (v: number) => {
    if (lock.current) return
    lock.current = true
    setAnswers((a) => a.map((x, i) => (i === index ? v : x)))
    setTimeout(() => {
      lock.current = false
      if (index === QUESTIONS.length - 1) onDone()
      else setIndex(index + 1)
    }, 520)
  }
  return <QuizView index={index} picked={answers[index]} onPick={pick} onBack={() => (index === 0 ? onExit() : setIndex(index - 1))} />
}

export function Thinking() {
  return (
    <div className="cc-screen cc-quiz">
      <Loops />
      <Logo />
      <div className="cc-card">
        <div className="cc-think">
          <svg className="cc-bubble" viewBox="0 0 270 214" aria-hidden>
            <ellipse cx="146" cy="76" rx="118" ry="66" fill="#fff" stroke="#3616E3" strokeWidth="6" />
            <circle cx="62" cy="160" r="15" fill="#fff" stroke="#3616E3" strokeWidth="5" />
            <circle cx="34" cy="196" r="8" fill="#fff" stroke="#3616E3" strokeWidth="5" />
            <circle className="dot" cx="110" cy="76" r="11" fill="#3616E3" />
            <circle className="dot" cx="146" cy="76" r="11" fill="#3616E3" />
            <circle className="dot" cx="182" cy="76" r="11" fill="#3616E3" />
          </svg>
          <div className="cc-think-face">
            <Mascot face="think" small />
          </div>
        </div>
        <div className="cc-question">
          <span>Tụi mình đang trong quá trình xử lý thông tin, bạn ngồi đợi xíu xíu nữa hoi nha... ('-')/</span>
        </div>
      </div>
    </div>
  )
}
