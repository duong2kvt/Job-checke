import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { BackLink, Button, Check, Logo, Modal, img, useToast } from '../components/ui'
import { BRANCHES, MAJORS, suggest, type Major } from '../data/majors'
import { profileFrom } from '../data/quiz'
import { resetJourney, setState, useStore } from '../lib/store'
import { useLang } from '../lib/i18n'

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
  const { t } = useLang()

  const open = (m: Major) => (m.available ? nav(`/major/${m.id}`) : setSoon(m))
  const chip = (m: Major, tone: 'pink' | 'blue') => (
    <button key={m.id} className={`chip chip-${tone}`} onClick={() => open(m)}>
      {t(m.name)}
    </button>
  )

  return (
    <Canvas bleed>
      <div className="page result">
        <Logo className="corner-logo" onClick={() => nav('/home')} />
        <div className="res-type">
          <strong>{p.type.code}</strong>
          <span>{t(p.type.name)}</span>
        </div>
        <Art />
        <div className="res-panel">
          <h1>{t('Những chuyên ngành phù hợp với bạn', 'Majors that suit you')}</h1>
          <h2 className="pink">{t('Dựa trên thế mạnh', 'Based on your strengths')}</h2>
          <div className="chips">{strengths.map((m) => chip(m, 'pink'))}</div>
          <h2 className="blue">{t('Dựa trên sự yêu thích', 'Based on what you love')}</h2>
          <div className="chips">{interests.map((m) => chip(m, 'blue'))}</div>
          <p className="hint">{t('Chọn 1 chuyên ngành để xem các nhánh và bắt đầu trải nghiệm.', 'Pick a major to see its specialisations and start exploring.')}</p>
          <button
            className="text-link redo"
            onClick={() => {
              resetJourney()
              nav('/quiz')
            }}
          >
            {t('Làm lại trắc nghiệm', 'Retake the quiz')}
          </button>
        </div>
        <Modal open={!!soon} onClose={() => setSoon(null)} className="soon">
          <h3>{soon && t(`Ngành ${soon.name.vi} sắp ra mắt!`, `${soon.name.en} is coming soon!`)}</h3>
          <p>{t('Tụi mình đang dựng các trải nghiệm cho ngành này. Trong lúc chờ, bạn thử vào vai thực tập sinh Thiết kế đồ họa nha.', "We're still building the experiences for this major. In the meantime, why not try being a Graphic Design intern?")}</p>
          <Button variant="solid" onClick={() => nav('/major/thiet-ke')}>
            {t('Thử ngành Thiết kế', 'Try Design')}
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
  const { t } = useLang()

  const start = () => {
    if (!picked) return
    setState({ major: major.id, branch: picked })
    nav('/journey')
  }

  return (
    <Canvas bleed>
      <div className="page result">
        <Logo className="corner-logo" onClick={() => nav('/home')} />
        <div className="res-type">
          <strong>{p.type.code}</strong>
          <span>{t(p.type.name)}</span>
        </div>
        <Art />
        <div className="res-panel branches">
          <h1>{t(`Ngành ${major.name.vi.toLowerCase()} có những nhánh này nè`, `Here are the paths in ${major.name.en}`)}</h1>
          <div className="chips wrap">
            {BRANCHES.map((b) => (
              <button
                key={b.id}
                className="chip chip-branch"
                data-on={picked === b.id || undefined}
                data-soon={!b.available || undefined}
                onClick={() => (b.available ? setPicked(b.id) : showToast(t(`${b.name.vi} sắp ra mắt, thử Thiết kế đồ họa trước nha!`, `${b.name.en} is coming soon, try Graphic Design first!`)))}
                aria-pressed={picked === b.id}
              >
                <span>{t(b.name)}</span>
                <i className="tick">{picked === b.id && <Check size={14} />}</i>
              </button>
            ))}
          </div>
          <p className="hint">{t('Chọn 1 trong số những lựa chọn sau đây để bắt đầu', 'Choose one of the options below to get started')}</p>
          <Button className="next" disabled={!picked} onClick={start}>
            {t('Tiếp theo', 'Next')}
          </Button>
        </div>
        <BackLink to="/result" />
        {toast}
      </div>
    </Canvas>
  )
}
