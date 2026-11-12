import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { BackLink, Button, Logo, img, useToast } from '../components/ui'
import { RoadmapFace, useLook } from '../components/Mascot'
import { LEVELS } from '../data/levels'
import { BRANCHES } from '../data/majors'
import { useStore } from '../lib/store'
import { useLang } from '../lib/i18n'

// Checkpoint circles on the 1920×1080 frame (top-left of each 70×70 circle, Figma "Quiz" 247:34431)
const NODES: [number, number][] = [
  [430, 704],
  [675, 723],
  [884, 723],
  [1076, 696],
  [1239, 595],
  [1342, 411],
]
const R = 35 // circle radius
// Label offsets from Figma: [shift of the label centre, top below the circle]; 5 and 6 sit right of the dashed line
const LABELS: [number, number][] = [
  [0, 86],
  [0, 90],
  [4, 81],
  [3, 82],
  [24, 90],
  [58, 92],
]
const CENTRES: [number, number][] = NODES.map(([x, y]) => [x + R, y + R])

function pathThrough(pts: [number, number][]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const mx = (x0 + x1) / 2
    d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`
  }
  return d
}

export function Roadmap() {
  const nav = useNavigate()
  const loc = useLocation() as { state?: { finished?: number } }
  const levels = useStore((s) => s.levels)
  const branch = useStore((s) => s.branch) ?? 'do-hoa'
  const [toast, showToast] = useToast()
  const eyesRef = useRef<HTMLDivElement>(null)
  const look = useLook(eyesRef, 10)
  const doneCount = LEVELS.filter((l) => levels[l.n]?.done).length
  const current = LEVELS.find((l) => !levels[l.n]?.done)?.n ?? 7
  const [menu, setMenu] = useState(false)
  const { t, lang } = useLang()

  useEffect(() => {
    const f = loc.state?.finished
    if (f) showToast(
        f === LEVELS.length
          ? t('Bạn đã hoàn thành cả 6 cấp độ! Xem báo cáo phân tích nha.', 'You finished all 6 levels! Check out your analysis report.')
          : t(`Hoàn thành cấp ${f}! Cấp ${f + 1} đã mở khóa.`, `Level ${f} complete! Level ${f + 1} is unlocked.`),
      )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const open = (n: number) => {
    if (n <= current) nav(`/journey/${n}`)
    else showToast(t(`Hoàn thành cấp ${n - 1} để mở khóa cấp này nha!`, `Finish level ${n - 1} to unlock this one!`))
  }
  const branchName = t(BRANCHES.find((b) => b.id === branch)?.name ?? BRANCHES[0].name)
  const titleCase = (s: string) => s.replace(/(^|\s)\S/g, (c) => c.toUpperCase())

  return (
    <Canvas>
      <div className="page roadmap">
        <Logo className="corner-logo" onClick={() => nav('/home')} />
        <div className="rm-card">
          <div className="rm-select">
            <button className="rm-drop" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
              {titleCase(branchName)}
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden>
                <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {menu && (
              <div className="rm-menu">
                {BRANCHES.map((b) => (
                  <button
                    key={b.id}
                    data-on={b.id === branch || undefined}
                    onClick={() => {
                      setMenu(false)
                      if (!b.available) showToast(t(`${b.name.vi} sắp ra mắt!`, `${b.name.en} is coming soon!`))
                    }}
                  >
                    {titleCase(t(b.name))}
                    {!b.available && <em>{t('Sắp ra mắt', 'Coming soon')}</em>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <h1>{lang === 'en' ? `You're trying out ${titleCase(branchName)}` : `Bạn đang học thử ngành ${titleCase(branchName)}`}</h1>
          <Button className="rm-report" disabled={!doneCount} onClick={() => nav('/report')} title={doneCount ? '' : t('Hoàn thành ít nhất 1 cấp độ để xem phân tích', 'Finish at least 1 level to see your analysis')}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
              <rect x="3" y="4" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M8 21h8M12 17v4M7 13l3-3 3 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('Phân Tích Kết Quả', 'Results Analysis')}
          </Button>
          <p className="rm-progress">
            {t('Hoàn thành', 'Completed')} <b>{doneCount}</b>/{LEVELS.length} {t('cấp độ', 'levels')}
          </p>
        </div>

        <svg className="rm-path" viewBox="0 0 1920 1080" aria-hidden>
          <path d={pathThrough(CENTRES)} fill="none" stroke="#2A2A2A" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>

        {LEVELS.map((l, i) => {
          const [x, y] = NODES[i]
          const state = levels[l.n]?.done ? 'done' : l.n === current ? 'current' : 'locked'
          return (
            <button
              key={l.n}
              className={`rm-node is-${state}`}
              style={{ left: x, top: y }}
              onClick={() => open(l.n)}
              aria-label={t(`Cấp ${l.n}: ${l.name.vi}`, `Level ${l.n}: ${l.name.en}`)}
              aria-disabled={state === 'locked'}
            >
              <span className="rm-back" />
              <span className="rm-num">{l.n}</span>
              <span className="rm-label" style={{ left: R + LABELS[i][0], top: LABELS[i][1] }}>
                {t(l.name)}
              </span>
            </button>
          )
        })}

        {current <= LEVELS.length && (
          <img
            className="rm-bolt"
            src={img('rm-bolt')}
            alt=""
            style={{ left: CENTRES[current - 1][0] + 26, top: CENTRES[current - 1][1] - 203 }}
            draggable={false}
          />
        )}
        <div className="rm-face" ref={eyesRef}>
          <RoadmapFace width={202} look={look} />
        </div>
        <BackLink to="/major/thiet-ke" />
        {toast}
      </div>
    </Canvas>
  )
}
