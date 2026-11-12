import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { BackLink, Button, Logo, img, useToast } from '../components/ui'
import { LEVELS } from '../data/levels'
import { BRANCHES } from '../data/majors'
import { useStore } from '../lib/store'
import { useLang } from '../lib/i18n'

// Node centres on the 1920×1080 frame (from the Figma roadmap)
const NODES: [number, number][] = [
  [416, 753],
  [648, 770],
  [862, 764],
  [1084, 720],
  [1236, 613],
  [1344, 427],
]

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
          <h1>{lang === 'en' ? `${titleCase(branchName)} Work Trial` : `Trải Nghiệm Chuyên Ngành ${titleCase(branchName)}`}</h1>
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
          <path d={pathThrough(NODES)} fill="none" stroke="#3502BF" strokeOpacity=".2" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          <path
            d={pathThrough(NODES.slice(0, Math.min(current, 6)))}
            fill="none"
            stroke="#3502BF"
            strokeWidth="3"
            strokeDasharray="2 9"
            strokeLinecap="round"
          />
        </svg>

        {LEVELS.map((l, i) => {
          const [x, y] = NODES[i]
          const state = levels[l.n]?.done ? 'done' : l.n === current ? 'current' : 'locked'
          return (
            <button key={l.n} className={`rm-node is-${state}`} style={{ left: x, top: y }} onClick={() => open(l.n)} aria-label={t(`Cấp ${l.n}: ${l.name.vi}`, `Level ${l.n}: ${l.name.en}`)}>
              {state === 'current' && (
                <svg className="rm-spark" viewBox="0 0 40 60" aria-hidden>
                  <path d="M24 2 L10 26 L22 26 L12 58 L32 22 L20 22 Z" fill="none" stroke="#F376BC" strokeWidth="3" strokeLinejoin="round" />
                </svg>
              )}
              <span className="rm-num">{l.n}</span>
              <span className="rm-label">{t(l.name)}</span>
            </button>
          )
        })}

        <img className="rm-book" src={img('book')} alt="" />
        <img className="rm-eyes" src={`${import.meta.env.BASE_URL}img/mascot-wow.png`} width="150" alt={t('Chộp đang ngạc nhiên', 'Chộp is surprised')} draggable={false} />
        <BackLink to="/major/thiet-ke" />
        {toast}
      </div>
    </Canvas>
  )
}
