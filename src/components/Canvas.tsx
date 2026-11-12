import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

export const W = 1920
export const H = 1080

// The pastel ribbon ("Vector" in Figma) sits at x -97, y -56, 2347×1156 on the
// 1920×1080 frame. Its centre relative to the frame centre:
const BV = { w: 2347, h: 1156, cx: -97 + 2347 / 2 - W / 2, cy: -56 + 1156 / 2 - H / 2 }

/**
 * The designs are drawn on a 1920×1080 frame. Each page is laid out on that
 * frame and scaled to fit the window (letterboxed with the page's own ground),
 * so every screen keeps the proportions of the Figma file at any size.
 *
 * `bleed` draws the background ribbon outside the frame, on the whole window:
 * it lines up with the design at 16:9 and grows just enough to reach every
 * edge on wider or taller screens, so it is never cut off.
 */
export function Canvas({
  children,
  ground = '#FCFCFE',
  className = '',
  bleed = false,
  fade = false,
}: {
  children: ReactNode
  ground?: string
  className?: string
  bleed?: boolean
  fade?: boolean
}) {
  const box = useRef<HTMLDivElement>(null)
  const [vp, setVp] = useState({ w: W, h: H })
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => setVp({ w: el.clientWidth, h: el.clientHeight })
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const k = Math.min(vp.w / W, vp.h / H)
  // smallest scale ≥ k that still covers the window from every side
  const s = Math.max(
    k,
    vp.w / 2 / (BV.w / 2 - BV.cx),
    vp.w / 2 / (BV.w / 2 + BV.cx),
    vp.h / 2 / (BV.h / 2 - BV.cy),
    vp.h / 2 / (BV.h / 2 + BV.cy),
  )
  return (
    <div className="cv" ref={box} style={{ background: ground }}>
      {bleed && (
        <img
          className={`cv-bleed ${fade ? 'is-out' : ''}`}
          src={`${import.meta.env.BASE_URL}img/bg-vector.webp`}
          alt=""
          aria-hidden
          draggable={false}
          style={{
            left: vp.w / 2 + (BV.cx - BV.w / 2) * s,
            top: vp.h / 2 + (BV.cy - BV.h / 2) * s,
            width: BV.w * s,
            height: BV.h * s,
          }}
        />
      )}
      <div
        className={`cv-frame ${className}`}
        style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${k})`, background: bleed ? 'transparent' : ground }}
      >
        {children}
      </div>
    </div>
  )
}
