import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { BackLink, Check, Logo, Loops } from '../components/ui'
import { Mascot, useLook } from '../components/Mascot'
import { QUESTIONS, SCALE } from '../data/quiz'
import { setState, useStore } from '../lib/store'

export function QuizPage() {
  const nav = useNavigate()
  const answers = useStore((s) => s.answers)
  const first = answers.findIndex((a) => a === null)
  const [index, setIndex] = useState(first === -1 ? 0 : first)
  const [leaving, setLeaving] = useState(false)
  const card = useRef<HTMLDivElement>(null)
  const look = useLook(card)
  const q = QUESTIONS[index]
  const picked = answers[index]

  const pick = (v: number) => {
    if (leaving) return
    setState((s) => ({ answers: s.answers.map((a, i) => (i === index ? v : a)) }))
    setLeaving(true)
    setTimeout(() => {
      setLeaving(false)
      if (index === QUESTIONS.length - 1) nav('/analyzing')
      else setIndex(index + 1)
    }, 560)
  }

  // Keyboard: 1–5 answers, ← goes back
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const n = Number(e.key)
      if (n >= 1 && n <= 5) pick(n - 1)
      if (e.key === 'ArrowLeft' && index > 0) setIndex(index - 1)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  })

  return (
    <Canvas>
      <div className="page quiz">
        <Loops variant={index} />
        <Logo className="corner-logo" onClick={() => nav('/home')} />
        <div className="quiz-progress" aria-label={`Câu ${index + 1} trên 6`}>
          {QUESTIONS.map((_, i) => (
            <i key={i} data-on={i <= index || undefined} />
          ))}
        </div>
        <div key={`s${index}`} className="sticker" style={{ background: q.color }}>
          {q.sticker}
        </div>
        <div className="quiz-card" ref={card}>
          <div className="quiz-face">
            <Mascot face={q.face} look={look} size={300} />
          </div>
          <div key={`q${index}`} className="quiz-q">
            <span className="quiz-tag">{index + 1}/6</span>
            <p>{q.text}</p>
          </div>
        </div>
        <div className="scale" role="radiogroup" aria-label="Mức độ đồng ý">
          <span className="scale-end">Phản đối</span>
          <div className="scale-dots">
            {SCALE.map((s, i) => (
              <button
                key={i}
                role="radio"
                aria-checked={picked === i}
                aria-label={s.label}
                title={s.label}
                className="dot"
                data-on={picked === i || undefined}
                style={{ width: s.size, height: s.size, ['--c' as string]: s.color }}
                onClick={() => pick(i)}
              >
                {picked === i && <Check size={s.size * 0.55} />}
              </button>
            ))}
          </div>
          <span className="scale-end">Đồng ý</span>
        </div>
        {index > 0 ? (
          <button className="back" onClick={() => setIndex(index - 1)}>
            <span className="back-ico" aria-hidden>
              <svg viewBox="0 0 20 20" width="20" height="20">
                <path d="M12 5l-5 5 5 5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Trở về
          </button>
        ) : (
          <BackLink to="/welcome" />
        )}
      </div>
    </Canvas>
  )
}

export function Analyzing() {
  const nav = useNavigate()
  const answers = useStore((s) => s.answers)
  useEffect(() => {
    if (answers.some((a) => a === null)) {
      nav('/quiz', { replace: true })
      return
    }
    const t = setTimeout(() => {
      setState({ quizDone: true })
      nav('/result', { replace: true })
    }, 3000)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Canvas>
      <div className="page quiz">
        <Loops variant={1} />
        <Logo className="corner-logo" />
        <div className="quiz-card">
          <svg className="think-bubble" viewBox="0 0 270 214" aria-hidden>
            <ellipse cx="146" cy="76" rx="118" ry="66" fill="#fff" stroke="#3502BF" strokeWidth="6" />
            <circle cx="62" cy="160" r="15" fill="#fff" stroke="#3502BF" strokeWidth="5" />
            <circle cx="34" cy="196" r="8" fill="#fff" stroke="#3502BF" strokeWidth="5" />
            <circle className="tdot" cx="110" cy="76" r="11" fill="#3502BF" />
            <circle className="tdot" cx="146" cy="76" r="11" fill="#3502BF" />
            <circle className="tdot" cx="182" cy="76" r="11" fill="#3502BF" />
          </svg>
          <div className="think-face">
            <Mascot face="think" size={210} />
          </div>
          <div className="quiz-q">
            <p>Tụi mình đang trong quá trình xử lý thông tin, bạn ngồi đợi xíu xíu nữa hoi nha... ('-')/</p>
          </div>
        </div>
      </div>
    </Canvas>
  )
}
