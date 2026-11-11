import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SCREENS, byId, asset, W, H, Y0, type Screen } from './screens'
import { Quiz, Thinking } from './coded/Quiz'
import './prototype.css'

function useFit(ref: React.RefObject<HTMLElement>) {
  const [scale, setScale] = useState(0.5)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setScale(Math.min(r.width / W, r.height / H))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return scale
}

export function ScreenView({ screen, go, hint }: { screen: Screen; go?: (id: string) => void; hint?: boolean }) {
  return (
    <div className="pt-screen">
      {screen.img && <img src={asset(screen.img)} alt={screen.title} draggable={false} />}
      {screen.coded === 'quiz' && <Quiz onDone={() => go?.('thinking')} onExit={() => go?.('welcome')} />}
      {screen.coded === 'thinking' && <Thinking />}
      {go &&
        screen.hots.map((h, i) => (
          <button
            key={i}
            className="pt-hot"
            data-hint={hint || undefined}
            title={h.label}
            aria-label={h.label}
            style={{ left: h.r[0], top: h.r[1] - Y0, width: h.r[2] - h.r[0], height: h.r[3] - h.r[1] }}
            onClick={(e) => {
              e.stopPropagation()
              go(h.to)
            }}
          />
        ))}
    </div>
  )
}

const startId = () => {
  const m = location.hash.match(/^#screen-([\w-]+)$/)
  return m && byId[m[1]] ? m[1] : 'splash'
}

export function Prototype() {
  const [cur, setCur] = useState(startId)
  const [prev, setPrev] = useState<string | null>(null)
  const [hint, setHint] = useState(false)
  const [flash, setFlash] = useState(0)
  const [menu, setMenu] = useState(false)
  const trail = useRef<string[]>([])
  const box = useRef<HTMLDivElement>(null)
  const scale = useFit(box)
  const screen = byId[cur]

  const go = useCallback(
    (id: string, back = false) => {
      if (!byId[id] || id === cur) return
      if (!back) trail.current.push(cur)
      setPrev(cur)
      setCur(id)
      window.history.replaceState(null, '', `#screen-${id}`)
    },
    [cur],
  )
  const goBack = useCallback(() => {
    const id = trail.current.pop()
    if (id) go(id, true)
  }, [go])

  useEffect(() => {
    const on = () => {
      const id = startId()
      if (id !== cur) go(id)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [cur, go])

  useEffect(() => {
    if (!prev) return
    const t = setTimeout(() => setPrev(null), 420)
    return () => clearTimeout(t)
  }, [prev, cur])

  useEffect(() => {
    if (!screen.auto) return
    const t = setTimeout(() => go(screen.auto!.to), screen.auto.ms)
    return () => clearTimeout(t)
  }, [screen, go])

  // Scroll between a page and its scrolled state
  const wheelLock = useRef(0)
  const onWheel = (e: React.WheelEvent) => {
    const now = performance.now()
    if (now - wheelLock.current < 700 || Math.abs(e.deltaY) < 8) return
    const to = e.deltaY > 0 ? screen.down : screen.up
    if (to) {
      wheelLock.current = now
      go(to)
    }
  }

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const i = SCREENS.findIndex((s) => s.id === cur)
      if (e.key === 'ArrowRight') go(SCREENS[Math.min(SCREENS.length - 1, i + 1)].id)
      else if (e.key === 'ArrowLeft') goBack()
      else if (e.key === 'ArrowDown' && screen.down) go(screen.down)
      else if (e.key === 'ArrowUp' && screen.up) go(screen.up)
      else if (e.key.toLowerCase() === 'h') setHint((h) => !h)
      else if (e.key.toLowerCase() === 'r') {
        trail.current = []
        go('splash')
      } else if (e.key === 'Escape') setMenu(false)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [cur, go, goBack, screen])

  const missClick = () => {
    if (screen.any) return go(screen.any)
    setFlash((f) => f + 1)
  }
  const flashing = useFlash(flash)
  const groups = [...new Set(SCREENS.map((s) => s.group))]
  const idx = SCREENS.findIndex((s) => s.id === cur)

  return (
    <div className="pt">
      <header className="pt-bar">
        <a className="pt-brand" href="#">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" />
          <span>Prototype</span>
        </a>
        <button className="pt-title" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
          <span className="pt-group">{screen.group}</span>
          <strong>{screen.title}</strong>
          <span className="pt-count">
            {idx + 1}/{SCREENS.length}
          </span>
          <span className="pt-caret">▾</span>
        </button>
        <div className="pt-actions">
          <button onClick={goBack} disabled={!trail.current.length} title="Quay lại (←)">
            ← Quay lại
          </button>
          <button onClick={() => setHint((h) => !h)} data-on={hint || undefined} title="Hiện vùng bấm (H)">
            Vùng bấm
          </button>
          <button
            onClick={() => {
              trail.current = []
              go('splash')
            }}
            title="Chạy lại (R)"
          >
            ↺ Từ đầu
          </button>
        </div>
      </header>

      {menu && (
        <nav className="pt-menu" onClick={() => setMenu(false)}>
          {groups.map((g) => (
            <section key={g}>
              <h4>{g}</h4>
              {SCREENS.filter((s) => s.group === g).map((s) => (
                <button key={s.id} data-on={s.id === cur || undefined} onClick={() => go(s.id)}>
                  {s.img ? <img src={asset(s.img)} alt="" loading="lazy" /> : <span className="pt-coded">code</span>}
                  <span>{s.title}</span>
                </button>
              ))}
            </section>
          ))}
        </nav>
      )}

      <div className="pt-stage" ref={box} onWheel={onWheel}>
        <div className="pt-canvas" style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }} onClick={missClick}>
          {prev && byId[prev]?.img && (
            <div className="pt-layer is-out" key={`p-${prev}`}>
              <ScreenView screen={byId[prev]} />
            </div>
          )}
          <div className="pt-layer is-in" key={`c-${cur}`}>
            <ScreenView screen={screen} go={go} hint={hint || flashing} />
          </div>
        </div>
        {(screen.down || screen.up) && (
          <div className="pt-scrollhint">{screen.down ? 'Cuộn xuống ↓' : 'Cuộn lên ↑'}</div>
        )}
      </div>
    </div>
  )
}

function useFlash(n: number) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!n) return
    setOn(true)
    const t = setTimeout(() => setOn(false), 700)
    return () => clearTimeout(t)
  }, [n])
  return on
}
