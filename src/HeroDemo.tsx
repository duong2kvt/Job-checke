import { useEffect } from 'react'
import { Stage, Window, type Act } from './kit'
import { asset, byId, W, H, Y0 } from './screens'
import { QuizView, Thinking } from './coded/Quiz'
import './hero.css'

// Stageshow hero: one student's path through Chộp Chếc in five beats —
// sign in, answer the quiz, pick "Thiết kế", solve a real design task,
// and land on the report with a voucher.

type Shot = 'login-filled' | 'welcome' | 'quiz' | 'thinking' | 'mbti' | 'branch-picked' | 'trial-3' | 'trial-4' | 'report'
type S = { shot: Shot; picked: number | null; voucher: boolean }

const SHOTS: Shot[] = ['login-filled', 'welcome', 'quiz', 'thinking', 'mbti', 'branch-picked', 'trial-3', 'trial-4', 'report']
const initial: S = { shot: 'login-filled', picked: null, voucher: false }
const POSTER: S = { shot: 'report', picked: 4, voucher: true }

// Click targets, in Figma frame coordinates (1920×1080)
const TARGETS: Record<string, { on: Shot; r: [number, number, number, number] }> = {
  login: { on: 'login-filled', r: [780, 714, 1140, 764] },
  start: { on: 'welcome', r: [776, 744, 1140, 812] },
  design: { on: 'mbti', r: [974, 804, 1162, 862] },
  next: { on: 'branch-picked', r: [1300, 796, 1534, 864] },
  optA: { on: 'trial-3', r: [330, 500, 604, 884] },
}

async function script(a: Act<S>) {
  await a.wait(700)
  // 1. Sign in
  await a.move('login')
  await a.click()
  await a.set({ shot: 'welcome' })
  await a.wait(800)
  await a.move('start')
  await a.click()
  await a.set({ shot: 'quiz', picked: null })
  await a.wait(900)
  // 2. Answer the quiz
  await a.move('opt-4')
  await a.click()
  await a.set({ picked: 4 })
  await a.wait(550)
  await a.set({ shot: 'thinking' })
  await a.wait(1500)
  // 3. INFJ-T: choose the design path
  await a.set({ shot: 'mbti' })
  await a.wait(900)
  await a.move('design')
  await a.click()
  await a.set({ shot: 'branch-picked' })
  await a.wait(700)
  await a.move('next')
  await a.click()
  // 4. A real task from the work trial
  await a.set({ shot: 'trial-3' })
  await a.wait(1000)
  await a.move('optA')
  await a.click()
  await a.set({ shot: 'trial-4' })
  await a.wait(1800)
  // 5. Payoff: the report, and a voucher for a course
  await a.set({ shot: 'report' })
  await a.wait(700)
  await a.set({ voucher: true })
  await a.move('rest')
  await a.wait(2800)
  // Sign out: the voucher is pocketed and the session restarts
  await a.set({ voucher: false })
  await a.move(a.layout === 'compact' ? { x: 250, y: 160 } : { x: 700, y: 330 })
  await a.wait(300)
  await a.set({ ...initial })
  await a.wait(300)
}

function Voucher() {
  return (
    <div className="hd-voucher">
      <div className="hd-voucher-tab">
        <span>DISCOUNT</span>
      </div>
      <div className="hd-voucher-body">
        <span>Giảm 10% cho khóa học đầu tiên</span>
        <strong>CHOPCHEC10</strong>
        <em>*Điều kiện áp dụng</em>
      </div>
    </div>
  )
}

// Compact: a tighter crop that pans to wherever the story is happening
const FOCUS: Record<Shot, [number, number]> = {
  'login-filled': [960, 680],
  welcome: [960, 720],
  quiz: [1100, 760],
  thinking: [960, 520],
  mbti: [1150, 760],
  'branch-picked': [1300, 760],
  'trial-3': [560, 720],
  'trial-4': [480, 560],
  report: [1300, 520],
}

function Canvas({ s, width, crop }: { s: S; width: number; crop?: { w: number; h: number; cy: number } }) {
  const k = width / W
  const vw = crop?.w ?? width
  const vh = crop?.h ?? H * k
  let tx = 0
  let ty = 0
  if (crop) {
    const [fx, fy] = FOCUS[s.shot]
    tx = Math.min(0, Math.max(vw - width, vw / 2 - fx * k))
    ty = Math.min(0, Math.max(vh - H * k, crop.cy - (fy - Y0) * k))
  }
  return (
    <div className="hd-viewport" data-crop={crop ? true : undefined} style={{ width: vw, height: vh }}>
      <div className="hd-canvas" style={{ width: W, height: H, transform: `translate(${tx}px, ${ty}px) scale(${k})` }}>
        {SHOTS.map((id) => (
          <div key={id} className="hd-shot" data-on={s.shot === id || undefined}>
            {id === 'quiz' ? (
              <QuizView index={0} picked={s.picked} />
            ) : id === 'thinking' ? (
              <Thinking />
            ) : (
              <img src={asset(byId[id].img!)} alt={byId[id].title} draggable={false} />
            )}
          </div>
        ))}
        {Object.entries(TARGETS)
          .filter(([, t]) => t.on === s.shot)
          .map(([name, { r }]) => (
          <div key={name} className="hd-target" data-target={name} data-cursor="pointer" style={{ left: r[0], top: r[1] - Y0, width: r[2] - r[0], height: r[3] - r[1] }} />
        ))}
      </div>
    </div>
  )
}

export function HeroDemo() {
  useEffect(() => {
    SHOTS.forEach((id) => {
      const img = byId[id]?.img
      if (img) new Image().src = asset(img)
    })
  }, [])
  return (
    <Stage
      width={1040}
      height={560}
      compact={{ below: 640, width: 358, height: 240 }}
      initial={initial}
      poster={POSTER}
      script={script}
      cursor={{ at: { wide: { x: 700, y: 330 }, compact: { x: 250, y: 160 } }, style: 'real', ripple: true }}
      className="hd"
    >
      {(s, _rect, layout) => {
        const compact = layout === 'compact'
        return (
          <>
            <div data-target="rest" className="hd-rest" />
            <Window url="chopchec.vn" className="hd-window">
              <Canvas s={s} width={compact ? 1000 : 1060} crop={compact ? { w: 400, h: 230, cy: 96 } : undefined} />
            </Window>
            <div className="hd-sat" data-on={s.voucher || undefined}>
              <Voucher />
            </div>
          </>
        )
      }}
    </Stage>
  )
}
