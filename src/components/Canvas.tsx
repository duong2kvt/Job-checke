import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

export const W = 1920
export const H = 1080

/**
 * The designs are drawn on a 1920×1080 frame. Each page is laid out on that
 * frame and scaled to fit the window (letterboxed with the page's own ground),
 * so every screen keeps the proportions of the Figma file at any size.
 */
export function Canvas({ children, ground = '#FCFCFE', className = '' }: { children: ReactNode; ground?: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [k, setK] = useState(1)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => setK(Math.min(el.clientWidth / W, el.clientHeight / H))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div className="cv" ref={box} style={{ background: ground }}>
      <div className={`cv-frame ${className}`} style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${k})`, background: ground }}>
        {children}
      </div>
    </div>
  )
}
