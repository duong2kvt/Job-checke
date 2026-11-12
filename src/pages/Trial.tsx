import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { img } from '../components/ui'
import { MascotBadge } from '../components/Mascot'
import { OptionVisual, ReviewVisual } from '../components/Visuals'
import { Assistant } from '../components/Assistant'
import { LEVELS, TASKS, type Step, type Task } from '../data/levels'
import { setState, useStore } from '../lib/store'

function Bubble({ who, lines, delay = 0 }: { who: 'manager' | 'intern'; lines: string[]; delay?: number }) {
  return (
    <div className={`bubble bubble-${who}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="bubble-body">
        {lines.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
      <svg className="bubble-tail" width="78" height="52" viewBox="0 0 78 52" aria-hidden>
        <path d={who === 'manager' ? 'M14 0 H58 C40 14 22 34 2 50 C12 32 16 16 14 0 Z' : 'M64 0 H20 C38 14 56 34 76 50 C66 32 62 16 64 0 Z'} fill="#fff" />
      </svg>
    </div>
  )
}

function Badge({ ok }: { ok: boolean }) {
  return (
    <span className={`verdict-badge ${ok ? 'ok' : 'no'}`} aria-label={ok ? 'Phương án đúng' : 'Phương án chưa phù hợp'}>
      <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden>
        {ok ? (
          <path d="M6 12.5l4 4 8-9" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M7 7l10 10M17 7L7 17" stroke="#C0392B" strokeWidth="3.2" strokeLinecap="round" />
        )}
      </svg>
    </span>
  )
}

export function Trial() {
  const nav = useNavigate()
  const { level: lv } = useParams()
  const n = Number(lv)
  const level = LEVELS.find((l) => l.n === n)
  const progress = useStore((s) => s.levels)
  const unlocked = LEVELS.find((l) => !progress[l.n]?.done)?.n ?? 7
  const [i, setI] = useState(0)
  const [picks, setPicks] = useState<Record<string, string>>({})
  const [helper, setHelper] = useState(false)
  const [confirmExit, setConfirmExit] = useState(false)

  const steps = level?.steps ?? []
  const step: Step | undefined = steps[i]
  const task: Task | undefined = step?.kind === 'task' ? step : step?.kind === 'review' ? TASKS[step.task] : undefined
  const canNext = step?.kind !== 'task' || !!picks[step.id]

  const finish = () => {
    setState((s) => ({
      levels: {
        ...s.levels,
        [n]: {
          done: true,
          finishedAt: Date.now(),
          tasks: Object.fromEntries(Object.entries(picks).map(([id, p]) => [id, { picks: [p], correct: p === TASKS[id].correct }])),
        },
      },
    }))
    nav('/journey', { state: { finished: n } })
  }
  const next = () => {
    if (!canNext) return
    if (i === steps.length - 1) finish()
    else setI(i + 1)
  }
  const prev = () => {
    if (i === 0) return
    // Going back over a review returns to its task, which keeps the answer
    setI(i - 1)
  }
  const choose = (t: Task, id: 'A' | 'B') => {
    if (picks[t.id]) return
    setPicks((p) => ({ ...p, [t.id]: id }))
    setTimeout(() => setI((x) => x + 1), 900)
  }

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (helper) return
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') prev()
      else if (step?.kind === 'task' && (e.key === 'a' || e.key === 'b')) choose(step, e.key.toUpperCase() as 'A' | 'B')
      else if (e.key === 'Escape') setConfirmExit(true)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  })

  const dim = useMemo(() => (step?.kind === 'task' || step?.kind === 'final' ? 0.2 : step?.kind === 'review' ? 0.12 : 0), [step])

  if (!level) return <Navigate to="/journey" replace />
  if (n > unlocked) return <Navigate to="/journey" replace />

  return (
    <Canvas ground="#1b1640">
      <div className="page trial">
        <img className="office" src={img('office')} alt="" draggable={false} />
        <div className="office-dim" style={{ opacity: dim }} />

        <div className="trial-stage" key={i}>
          {step?.kind === 'talk' && (
            <>
              {step.prop === 'carton' && (
                <div className="prop-card">
                  <img src={img('carton')} alt="Hộp sữa hạt" />
                </div>
              )}
              {step.manager && <Bubble who="manager" lines={step.manager} />}
              {step.intern && <Bubble who="intern" lines={step.intern} delay={step.manager ? 650 : 0} />}
              {step.tags && (
                <>
                  <span className="name-tag tag-manager">Chị Quản lý thiết kế đồ họa</span>
                  <span className="name-tag tag-intern">Kiên - Thực tập sinh</span>
                </>
              )}
            </>
          )}

          {step?.kind === 'task' && (
            <>
              <div className="task-head">
                <p>{step.title}</p>
                {step.reference === 'brown' && <i className="ref-brown" title="Màu chữ tiêu đề" />}
              </div>
              <div className="task-panel">
                {step.options.map((o) => {
                  const chosen = picks[step.id]
                  const state = !chosen ? '' : o.id === chosen ? (o.id === step.correct ? 'is-right' : 'is-wrong') : 'is-faded'
                  return (
                    <button key={o.id} className={`task-opt ${state}`} onClick={() => choose(step, o.id)} disabled={!!chosen} aria-label={`Chọn phương án ${o.id}`}>
                      <span className="task-visual">
                        <OptionVisual r={o.render} reference={step.reference} />
                      </span>
                      <span className="task-letter">{o.id}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {step?.kind === 'review' && task && (
            <>
              <div className={`review-banner ${picks[task.id] === task.correct ? 'ok' : 'no'}`}>
                {picks[task.id] === task.correct ? 'Chính xác! Chị Quản lý nhận xét nè:' : `Bạn chọn ${picks[task.id] ?? '—'}. Cùng xem vì sao ${task.correct} phù hợp hơn nha:`}
              </div>
              {task.options.map((o, k) => (
                <div key={o.id} className={`review-col col-${k}`}>
                  <Badge ok={o.id === task.correct} />
                  <ReviewVisual r={o.render} />
                  <span className="review-label">Hình {o.id}</span>
                  <div className={`review-note note-${k}`}>
                    <b>
                      Hình {o.id}: {o.verdict}
                    </b>
                    <ul>
                      {o.notes.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </>
          )}

          {step?.kind === 'final' && (
            <>
              <div className="final-card">
                <h2>Sản phẩm cuối cùng</h2>
                <img src={img('poster-final')} alt="Poster sữa hạt hoàn chỉnh" />
              </div>
              <div className="bubble bubble-intern bubble-final">
                <div className="bubble-body">
                  {step.intern.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
                <svg className="bubble-tail" width="78" height="52" viewBox="0 0 78 52" aria-hidden>
                  <path d="M64 0 H20 C38 14 56 34 76 50 C66 32 62 16 64 0 Z" fill="#fff" />
                </svg>
              </div>
            </>
          )}
        </div>

        <button className="help-btn" onClick={() => setHelper((h) => !h)} aria-label="Hỏi trợ lý Chộp" aria-expanded={helper}>
          <span className="help-shadow" />
          <span className="help-face">
            <MascotBadge size={72} />
          </span>
        </button>
        <button className="close-btn" onClick={() => setConfirmExit(true)} aria-label="Thoát cấp độ">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
        <div className="level-chip">
          Cấp {level.n} · {level.name}
        </div>
        <div className="arrows">
          <button onClick={prev} disabled={i === 0} aria-label="Quay lại">
            <svg viewBox="0 0 60 60" width="60" height="60">
              <path d="M36 16L22 30l14 14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={next} disabled={!canNext} aria-label={i === steps.length - 1 ? 'Hoàn thành cấp độ' : 'Tiếp tục'} className={canNext ? 'pulse' : ''}>
            <svg viewBox="0 0 60 60" width="60" height="60">
              <path d="M24 16l14 14-14 14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="trial-bar">
          <i style={{ width: `${((i + 1) / steps.length) * 100}%` }} />
        </div>

        <Assistant open={helper} onClose={() => setHelper(false)} hint={step?.kind === 'task' ? step.hint : undefined} />

        {confirmExit && (
          <div className="modal-scrim" onClick={() => setConfirmExit(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal>
              <h3>Rời khỏi cấp độ này?</h3>
              <p>Tiến độ của cấp {level.n} sẽ chưa được lưu. Bạn có thể chơi lại bất cứ lúc nào từ lộ trình.</p>
              <div className="modal-actions">
                <button className="btn btn-outline btn-md" onClick={() => setConfirmExit(false)}>
                  Ở lại
                </button>
                <button className="btn btn-solid btn-md" onClick={() => nav('/journey')}>
                  Về lộ trình
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Canvas>
  )
}
