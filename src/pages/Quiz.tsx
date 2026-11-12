import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { BackLink, Check, Logo } from '../components/ui'
import { Mascot, ThinkingFace, useLook } from '../components/Mascot'
import { QUESTIONS, SCALE } from '../data/quiz'
import { setState, useStore } from '../lib/store'
import { useLang } from '../lib/i18n'

export function QuizPage() {
  const nav = useNavigate()
  const answers = useStore((s) => s.answers)
  const first = answers.findIndex((a) => a === null)
  const [index, setIndex] = useState(first === -1 ? 0 : first)
  const [leaving, setLeaving] = useState(false)
  const card = useRef<HTMLDivElement>(null)
  useLook(card)
  const { t } = useLang()
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
    <Canvas bleed>
      <div className="page quiz">
        <Logo className="corner-logo" onClick={() => nav('/home')} />
        <div className="quiz-progress" aria-label={t(`Câu ${index + 1} trên 6`, `Question ${index + 1} of 6`)}>
          {QUESTIONS.map((_, i) => (
            <i key={i} data-on={i <= index || undefined} />
          ))}
        </div>
        <div key={`s${index}`} className="sticker" style={{ background: q.color }}>
          {t(q.sticker)}
        </div>
        <div className="quiz-card" ref={card}>
          <div className="quiz-face">
            <Mascot face={q.face} size={300} />
          </div>
          <div key={`q${index}`} className="quiz-q">
            <span className="quiz-tag">{index + 1}/6</span>
            <p>{t(q.text)}</p>
          </div>
        </div>
        <div className="scale" role="radiogroup" aria-label={t('Mức độ đồng ý', 'How much do you agree?')}>
          <span className="scale-end">{t('Phản đối', 'Disagree')}</span>
          <div className="scale-dots">
            {SCALE.map((s, i) => (
              <button
                key={i}
                role="radio"
                aria-checked={picked === i}
                aria-label={t(s.label)}
                title={t(s.label)}
                className="dot"
                data-on={picked === i || undefined}
                style={{ width: s.size, height: s.size, ['--c' as string]: s.color }}
                onClick={() => pick(i)}
              >
                {picked === i && <Check size={s.size * 0.55} />}
              </button>
            ))}
          </div>
          <span className="scale-end">{t('Đồng ý', 'Agree')}</span>
        </div>
        {index > 0 ? (
          <button className="back" onClick={() => setIndex(index - 1)}>
            <span className="back-ico" aria-hidden>
              <svg viewBox="0 0 20 20" width="20" height="20">
                <path d="M12 5l-5 5 5 5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {t('Trở về', 'Back')}
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
  const card = useRef<HTMLDivElement>(null)
  useLook(card, 10)
  const answers = useStore((s) => s.answers)
  const { t } = useLang()
  useEffect(() => {
    if (answers.some((a) => a === null)) {
      nav('/quiz', { replace: true })
      return
    }
    const id = setTimeout(() => {
      setState({ quizDone: true })
      nav('/result', { replace: true })
    }, 3000)
    return () => clearTimeout(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Canvas bleed>
      <div className="page quiz">
        <Logo className="corner-logo" />
        <div className="quiz-card analyze-card" ref={card}>
          <div className="analyze-face">
            <ThinkingFace />
          </div>
          <div className="quiz-q">
            <p>{t('Chúng tôi đang trong quá trình xử lý thông tin, bạn chờ xíu xíu hoi nha...', "We're crunching your answers, hang tight just a teeny bit...")}</p>
          </div>
        </div>
      </div>
    </Canvas>
  )
}
