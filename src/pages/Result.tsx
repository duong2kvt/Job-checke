import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { BackLink, Button, Check, Logo, Loops, Modal, img, useToast } from '../components/ui'
import { BRANCHES, MAJORS, suggest, type Major } from '../data/majors'
import { profileFrom } from '../data/quiz'
import { resetJourney, setState, useStore } from '../lib/store'

function Art() {
  return (
    <>
      <img className="res-girl" src={img('girl')} alt="" />
      <img className="res-sparkle" src={img('sparkle')} alt="" />
      <img className="res-swirl" src={img('swirl')} alt="" />
    </>
  )
}

export function Result() {
  const nav = useNavigate()
  const answers = useStore((s) => s.answers)
  const p = profileFrom(answers)
  const { strengths, interests } = suggest(p.ranked)
  const [soon, setSoon] = useState<Major | null>(null)

  const open = (m: Major) => (m.available ? nav(`/major/${m.id}`) : setSoon(m))
  const chip = (m: Major, tone: 'pink' | 'blue') => (
    <button key={m.id} className={`chip chip-${tone}`} onClick={() => open(m)}>
      {m.name}
    </button>
  )

  return (
    <Canvas>
      <div className="page result">
        <Loops variant={2} />
        <Logo className="corner-logo" onClick={() => nav('/home')} />
        <div className="res-type">
          <strong>{p.type.code}</strong>
          <span>{p.type.name}</span>
        </div>
        <Art />
        <div className="res-panel">
          <h1>Những chuyên ngành phù hợp với bạn</h1>
          <h2 className="pink">Dựa trên thế mạnh</h2>
          <div className="chips">{strengths.map((m) => chip(m, 'pink'))}</div>
          <h2 className="blue">Dựa trên sự yêu thích</h2>
          <div className="chips">{interests.map((m) => chip(m, 'blue'))}</div>
          <p className="hint">Chọn 1 chuyên ngành để xem các nhánh và bắt đầu trải nghiệm.</p>
          <button
            className="text-link redo"
            onClick={() => {
              resetJourney()
              nav('/quiz')
            }}
          >
            Làm lại trắc nghiệm
          </button>
        </div>
        <Modal open={!!soon} onClose={() => setSoon(null)} className="soon">
          <h3>Ngành {soon?.name} sắp ra mắt!</h3>
          <p>Tụi mình đang dựng các trải nghiệm cho ngành này. Trong lúc chờ, bạn thử vào vai thực tập sinh Thiết kế đồ họa nha.</p>
          <Button variant="solid" onClick={() => nav('/major/thiet-ke')}>
            Thử ngành Thiết kế
          </Button>
        </Modal>
      </div>
    </Canvas>
  )
}

export function Branches() {
  const nav = useNavigate()
  const { id } = useParams()
  const major = MAJORS.find((m) => m.id === id) ?? MAJORS[0]
  const current = useStore((s) => s.branch)
  const [picked, setPicked] = useState<string | null>(current)
  const [toast, showToast] = useToast()
  const p = profileFrom(useStore((s) => s.answers))

  const start = () => {
    if (!picked) return
    setState({ major: major.id, branch: picked })
    nav('/journey')
  }

  return (
    <Canvas>
      <div className="page result">
        <Loops variant={2} />
        <Logo className="corner-logo" onClick={() => nav('/home')} />
        <div className="res-type">
          <strong>{p.type.code}</strong>
          <span>{p.type.name}</span>
        </div>
        <Art />
        <div className="res-panel branches">
          <h1>Ngành {major.name.toLowerCase()} có những nhánh này nè</h1>
          <div className="chips wrap">
            {BRANCHES.map((b) => (
              <button
                key={b.id}
                className="chip chip-branch"
                data-on={picked === b.id || undefined}
                data-soon={!b.available || undefined}
                onClick={() => (b.available ? setPicked(b.id) : showToast(`${b.name} sắp ra mắt, thử Thiết kế đồ họa trước nha!`))}
                aria-pressed={picked === b.id}
              >
                <span>{b.name}</span>
                <i className="tick">{picked === b.id && <Check size={14} />}</i>
              </button>
            ))}
          </div>
          <p className="hint">Chọn 1 trong số những lựa chọn sau đây để bắt đầu</p>
          <Button className="next" disabled={!picked} onClick={start}>
            Tiếp theo
          </Button>
        </div>
        <BackLink to="/result" />
        {toast}
      </div>
    </Canvas>
  )
}
