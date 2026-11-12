import { useEffect, useState, type RefObject } from 'react'
import type { Face } from '../data/quiz'

const INK = '#3502BF'

/** Pupils follow the pointer, within a few pixels */
export function useLook(ref: RefObject<HTMLElement>, reach = 12) {
  const [look, setLook] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const on = (e: PointerEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height * 0.4)
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / 300)
      setLook({ x: (dx / d) * reach * k, y: (dy / d) * reach * k })
    }
    window.addEventListener('pointermove', on)
    return () => window.removeEventListener('pointermove', on)
  }, [ref, reach])
  return look
}

/** The Chộp Chếc face: two round eyes, brows and a mouth that change with the mood */
export function Mascot({ face = 'happy', look = { x: 0, y: 0 }, size = 300, className = '' }: { face?: Face; look?: { x: number; y: number }; size?: number; className?: string }) {
  const eye = (cx: number, flip: 1 | -1) => (
    <g key={cx}>
      <circle cx={cx} cy={0} r={58} fill="#fff" stroke={INK} strokeWidth={6} />
      <circle cx={cx + look.x} cy={look.y} r={30} fill="#58C8EE" stroke={INK} strokeWidth={5} className="pupil" />
      {face === 'focus' && <path d={`M${cx - 44 * flip} -96 L${cx + 30 * flip} -66`} stroke={INK} strokeWidth="6" strokeLinecap="round" />}
      {face !== 'focus' && (
        <path
          d={`M${cx - 30} ${face === 'wow' ? -104 : -92} Q ${cx} ${face === 'wow' ? -126 : -112} ${cx + 30} ${face === 'wow' ? -104 : -92}`}
          fill="none"
          stroke={INK}
          strokeWidth="6"
          strokeLinecap="round"
        />
      )}
    </g>
  )
  return (
    <svg className={`mascot ${className}`} width={size} height={(size * 280) / 300} viewBox="-150 -150 300 280" aria-hidden>
      {face === 'happy' && (
        <>
          <ellipse cx={-80} cy={46} rx={34} ry={22} fill="#F06BB8" opacity=".9" />
          <ellipse cx={80} cy={46} rx={34} ry={22} fill="#F06BB8" opacity=".9" />
        </>
      )}
      <g className="blink">
        {eye(-78, 1)}
        {eye(78, -1)}
      </g>
      {face === 'happy' && <path d="M-16 52 q16 22 32 0" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />}
      {face === 'focus' && <path d="M-14 48 l14 14 l16 -14" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />}
      {face === 'wow' && <circle cx={0} cy={66} r={16} fill="#fff" stroke={INK} strokeWidth="6" />}
      {face === 'think' && <path d="M-6 52 q14 6 0 14 q14 6 0 14" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />}
    </svg>
  )
}

/** Small mascot used as an avatar / help button (purple disc) */
export function MascotBadge({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" aria-hidden>
      <defs>
        <radialGradient id="mb" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#B79BFF" />
          <stop offset="1" stopColor="#7A4DF0" />
        </radialGradient>
      </defs>
      <circle cx="36" cy="36" r="34" fill="url(#mb)" />
      <circle cx="26" cy="34" r="9" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <circle cx="46" cy="34" r="9" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <circle cx="27" cy="35" r="4.5" fill="#58C8EE" stroke={INK} strokeWidth="2" />
      <circle cx="47" cy="35" r="4.5" fill="#58C8EE" stroke={INK} strokeWidth="2" />
      <path d="M33 47 q3 3 6 0" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/** Big standalone eyes (splash, roadmap corner, reward) */
export function Eyes({ size = 260, look = { x: 0, y: 0 } }: { size?: number; look?: { x: number; y: number } }) {
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 260 160" aria-hidden className="eyes">
      <path d="M40 18 q28 -18 56 0" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M150 12 q34 -16 66 6" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="54" cy="112" rx="30" ry="20" fill="#F06BB8" />
      <ellipse cx="210" cy="118" rx="30" ry="20" fill="#F06BB8" />
      <g className="blink">
        <circle cx="74" cy="80" r="50" fill="#fff" stroke={INK} strokeWidth="6" />
        <circle cx="190" cy="86" r="50" fill="#fff" stroke={INK} strokeWidth="6" />
        <circle cx={74 + look.x} cy={80 + look.y} r="24" fill="#58C8EE" stroke={INK} strokeWidth="5" className="pupil" />
        <circle cx={190 + look.x} cy={86 + look.y} r="24" fill="#58C8EE" stroke={INK} strokeWidth="5" className="pupil" />
      </g>
      <path d="M118 140 q14 16 28 0" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}
