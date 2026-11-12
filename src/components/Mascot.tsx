import { useEffect, useId, useRef, useState, type MouseEvent, type RefObject } from 'react'
import type { Face } from '../data/quiz'
import { useLang } from '../lib/i18n'

const INK = '#3502BF'
const IRIS = '#58C8EE'
const IRIS_ANGRY = '#6C97F7'
const CHEEK = '#F06BB8'
const VEIN = '#F04A2F'
const ANGRY_MS = 1700

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

/**
 * Poke the mascot and it gets cross for a moment, then calms down.
 * Clicking again while angry restarts the timer.
 */
function useTantrum() {
  const [angry, setAngry] = useState(false)
  const [n, setN] = useState(0)
  const t = useRef<number>()
  useEffect(() => () => window.clearTimeout(t.current), [])
  const poke = (e: MouseEvent) => {
    e.stopPropagation()
    setAngry(true)
    setN((x) => x + 1)
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setAngry(false), ANGRY_MS)
  }
  return { angry, poke, n }
}

/** The red "anger vein" that pops above the face */
function Vein({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g className="vein" transform={`translate(${x} ${y}) scale(${s})`}>
      <g fill="none" stroke={VEIN} strokeWidth="7" strokeLinecap="round">
        <path d="M-6 -22 C -4 -10, -10 -6, -22 -6" />
        <path d="M6 -22 C 4 -10, 10 -6, 22 -6" />
        <path d="M-6 22 C -4 10, -10 6, -22 6" />
        <path d="M6 22 C 4 10, 10 6, 22 6" />
      </g>
    </g>
  )
}

/** One angry eye: white ball, iris pushed down, upper lid cutting across it */
function AngryEye({ cx, cy, r, side, look, id }: { cx: number; cy: number; r: number; side: 1 | -1; look: { x: number; y: number }; id: string }) {
  // lid slopes down towards the nose: side 1 = left eye, -1 = right eye
  const outer = { x: cx - side * r * 0.82, y: cy - r * 0.32 }
  const inner = { x: cx + side * r * 0.78, y: cy + r * 0.12 }
  const ir = r * 0.52
  return (
    <g>
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={INK} strokeWidth={r * 0.1} />
      <g clipPath={`url(#${id})`}>
        <circle cx={cx + look.x * 0.4} cy={cy + r * 0.18} r={ir} fill={IRIS_ANGRY} stroke={INK} strokeWidth={r * 0.09} />
        {/* the lid hides the top of the iris */}
        <path d={`M${cx - r * 1.2} ${cy - r * 1.2} H${cx + r * 1.2} V${side === 1 ? inner.y : outer.y} L${side === 1 ? inner.x : outer.x} ${side === 1 ? inner.y : outer.y} L${side === 1 ? outer.x : inner.x} ${side === 1 ? outer.y : inner.y} H${cx - r * 1.2} Z`} fill="#fff" />
      </g>
      <path d={`M${outer.x} ${outer.y} L${inner.x} ${inner.y}`} stroke={INK} strokeWidth={r * 0.1} strokeLinecap="round" />
    </g>
  )
}

/** The Chộp Chếc face: two round eyes, brows and a mouth that change with the mood. Click it to make it cross. */
export function Mascot({ face = 'happy', look = { x: 0, y: 0 }, size = 300, className = '' }: { face?: Face; look?: { x: number; y: number }; size?: number; className?: string }) {
  const { angry, poke, n } = useTantrum()
  const { t } = useLang()
  const uid = useId().replace(/:/g, '')
  const eye = (cx: number, flip: 1 | -1) => (
    <g key={cx}>
      <circle cx={cx} cy={0} r={58} fill="#fff" stroke={INK} strokeWidth={6} />
      <circle cx={cx + look.x} cy={look.y} r={30} fill={IRIS} stroke={INK} strokeWidth={5} className="pupil" />
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
    <svg
      className={`mascot is-pokable ${angry ? 'is-angry' : ''} ${className}`}
      width={size}
      height={(size * 280) / 300}
      viewBox="-150 -150 300 280"
      onClick={poke}
      role="img"
      aria-label={angry ? t('Chộp đang dỗi', 'Chộp is sulking') : 'Chộp'}
      key={angry ? `a${n}` : 'calm'}
    >
      {angry ? (
        <g className="mood-swap">
          <ellipse cx={-84} cy={50} rx={36} ry={28} fill={CHEEK} />
          <ellipse cx={84} cy={50} rx={36} ry={28} fill={CHEEK} />
          <AngryEye cx={-78} cy={0} r={58} side={1} look={look} id={`${uid}l`} />
          <AngryEye cx={78} cy={0} r={58} side={-1} look={look} id={`${uid}r`} />
          <path d="M-128 -98 L-32 -46" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <path d="M128 -98 L32 -46" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <path d="M-22 76 Q0 52 22 76" fill="none" stroke="#5B21D6" strokeWidth="6" strokeLinecap="round" />
          <Vein x={122} y={-118} />
        </g>
      ) : (
        <g className="mood-swap">
          {face === 'happy' && (
            <>
              <ellipse cx={-80} cy={46} rx={34} ry={22} fill={CHEEK} opacity=".9" />
              <ellipse cx={80} cy={46} rx={34} ry={22} fill={CHEEK} opacity=".9" />
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
        </g>
      )}
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
      <circle cx="27" cy="35" r="4.5" fill={IRIS} stroke={INK} strokeWidth="2" />
      <circle cx="47" cy="35" r="4.5" fill={IRIS} stroke={INK} strokeWidth="2" />
      <path d="M33 47 q3 3 6 0" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/** Big standalone eyes (splash, roadmap corner, reward). Click them to make the mascot cross. */
export function Eyes({ size = 260, look = { x: 0, y: 0 } }: { size?: number; look?: { x: number; y: number } }) {
  const { angry, poke, n } = useTantrum()
  const { t } = useLang()
  const uid = useId().replace(/:/g, '')
  return (
    <svg
      width={size}
      height={size * 0.62}
      viewBox="0 0 260 160"
      className={`eyes is-pokable ${angry ? 'is-angry' : ''}`}
      onClick={poke}
      role="img"
      aria-label={angry ? t('Chộp đang dỗi', 'Chộp is sulking') : 'Chộp'}
      key={angry ? `a${n}` : 'calm'}
      overflow="visible"
    >
      {angry ? (
        <g className="mood-swap">
          <ellipse cx="54" cy="116" rx="30" ry="22" fill={CHEEK} />
          <ellipse cx="210" cy="122" rx="30" ry="22" fill={CHEEK} />
          <AngryEye cx={74} cy={80} r={50} side={1} look={look} id={`${uid}l`} />
          <AngryEye cx={190} cy={86} r={50} side={-1} look={look} id={`${uid}r`} />
          <path d="M22 20 L104 56" stroke={INK} strokeWidth="8" strokeLinecap="round" />
          <path d="M244 26 L160 60" stroke={INK} strokeWidth="8" strokeLinecap="round" />
          <path d="M116 150 Q132 132 148 150" fill="none" stroke="#5B21D6" strokeWidth="6" strokeLinecap="round" />
          <Vein x={250} y={0} s={0.9} />
        </g>
      ) : (
        <g className="mood-swap">
          <path d="M40 18 q28 -18 56 0" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
          <path d="M150 12 q34 -16 66 6" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="54" cy="112" rx="30" ry="20" fill={CHEEK} />
          <ellipse cx="210" cy="118" rx="30" ry="20" fill={CHEEK} />
          <g className="blink">
            <circle cx="74" cy="80" r="50" fill="#fff" stroke={INK} strokeWidth="6" />
            <circle cx="190" cy="86" r="50" fill="#fff" stroke={INK} strokeWidth="6" />
            <circle cx={74 + look.x} cy={80 + look.y} r="24" fill={IRIS} stroke={INK} strokeWidth="5" className="pupil" />
            <circle cx={190 + look.x} cy={86 + look.y} r="24" fill={IRIS} stroke={INK} strokeWidth="5" className="pupil" />
          </g>
          <path d="M118 140 q14 16 28 0" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        </g>
      )}
    </svg>
  )
}

/*
 * The "thinking" face from Figma (AI Analyse, node 2052:1643): wide eyes glancing
 * towards each other, one brow raised, a pursed "ɛ" mouth and a filled speech
 * bubble with three dots. Drawn in the frame's own coordinates (351 × 380).
 */
const T_INK = '#3B14C3'
const T_IRIS = '#6C93F7'

function ThinkingFeatures({ look, angry, uid }: { look: { x: number; y: number }; angry: boolean; uid: string }) {
  if (angry)
    return (
      <g className="mood-swap">
        <ellipse cx={70} cy={300} rx={34} ry={26} fill={CHEEK} />
        <ellipse cx={282} cy={308} rx={34} ry={26} fill={CHEEK} />
        <AngryEye cx={91.7} cy={231.8} r={64} side={1} look={look} id={`${uid}l`} />
        <AngryEye cx={260.4} cy={243.2} r={64} side={-1} look={look} id={`${uid}r`} />
        <path d="M30 140 L136 196" stroke={INK} strokeWidth="10" strokeLinecap="round" />
        <path d="M322 152 L216 204" stroke={INK} strokeWidth="10" strokeLinecap="round" />
        <path d="M150 344 Q176 318 202 344" fill="none" stroke="#5B21D6" strokeWidth="7" strokeLinecap="round" />
        <Vein x={322} y={92} s={1.1} />
      </g>
    )
  return (
    <g className="mood-swap">
      <g className="blink">
        <circle cx={91.7} cy={231.8} r={65} fill="#fff" stroke={T_INK} strokeWidth="5.5" />
        <circle cx={260.4} cy={243.2} r={65} fill="#fff" stroke={T_INK} strokeWidth="5.5" />
        <circle cx={126.8 + look.x * 0.6} cy={243.2 + look.y * 0.6} r={31} fill={T_IRIS} stroke={T_INK} strokeWidth="5" className="pupil" />
        <circle cx={225.3 + look.x * 0.6} cy={248 + look.y * 0.6} r={31} fill={T_IRIS} stroke={T_INK} strokeWidth="5" className="pupil" />
      </g>
      {/* brows: left curls down to the inside, right arches up */}
      <path d="M76 126 C 104 120, 132 128, 148 152" fill="none" stroke={T_INK} strokeWidth="7" strokeLinecap="round" />
      <path d="M194 136 C 216 122, 238 124, 254 144" fill="none" stroke={T_INK} strokeWidth="7" strokeLinecap="round" />
      {/* pursed mouth */}
      <path d="M170 320 C 156 320, 156 340, 166 341 C 154 342, 154 364, 170 364" fill="none" stroke={T_INK} strokeWidth="5" strokeLinecap="round" />
    </g>
  )
}

export function ThinkingFace({ look = { x: 0, y: 0 }, bubble = true }: { look?: { x: number; y: number }; bubble?: boolean }) {
  const { angry, poke, n } = useTantrum()
  const { t } = useLang()
  const uid = useId().replace(/:/g, '')
  return (
    <svg
      className={`thinking-face is-pokable ${angry ? 'is-angry' : ''}`}
      width="352"
      height="420"
      viewBox="0 -40 352 420"
      overflow="visible"
      onClick={poke}
      role="img"
      aria-label={angry ? t('Chộp đang dỗi', 'Chộp is sulking') : t('Chộp đang suy nghĩ', 'Chộp is thinking')}
      key={angry ? `a${n}` : 'calm'}
    >
      {bubble && !angry && (
        <g className="think-cloud">
          <g transform="rotate(10 280 56)">
            <ellipse cx="280" cy="56" rx="108" ry="64" fill={T_INK} />
            <path d="M326 106 L356 134 L350 98 Z" fill={T_INK} />
          </g>
          <circle className="tdot" cx="240" cy="42" r="9.5" fill="#fff" />
          <circle className="tdot" cx="276" cy="54" r="9.5" fill="#fff" />
          <circle className="tdot" cx="312" cy="65" r="9.5" fill="#fff" />
        </g>
      )}
      <ThinkingFeatures look={look} angry={angry} uid={uid} />
    </svg>
  )
}

/** The round help button used in the work trial (Figma "Icon Button", node 401:1155) */
export function FaceBadge({ look = { x: 0, y: 0 } }: { look?: { x: number; y: number } }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg width="76" height="60" viewBox="20 118 316 250" aria-hidden>
      <ThinkingFeatures look={look} angry={false} uid={uid} />
    </svg>
  )
}

/*
 * The roadmap face (Figma "Group 910100925", node 329:2893, 200 × 190): two
 * ringed eyes, a sound-wave arc above each and a small round mouth, traced in
 * the node's own coordinates. Pupils follow the pointer, the eyes blink, and a
 * click makes it cross like every other Chộp face.
 */
const RF_INK = '#3C17BF'
const RF_IRIS = '#6991F7'
export function RoadmapFace({ width = 200, look = { x: 0, y: 0 } }: { width?: number; look?: { x: number; y: number } }) {
  const { angry, poke, n } = useTantrum()
  const { t } = useLang()
  const uid = useId().replace(/:/g, '')
  const px = look.x * 0.9
  const py = look.y * 0.9
  return (
    <svg
      width={width}
      height={(width * 190) / 202}
      viewBox="0 0 202 190"
      className={`roadmap-face is-pokable ${angry ? 'is-angry' : ''}`}
      onClick={poke}
      role="img"
      aria-label={angry ? t('Chộp đang dỗi', 'Chộp is sulking') : 'Chộp'}
      key={angry ? `a${n}` : 'calm'}
      overflow="visible"
    >
      {angry ? (
        <g className="mood-swap">
          <AngryEye cx={58} cy={65} r={42} side={1} look={look} id={`${uid}l`} />
          <AngryEye cx={138} cy={131} r={42} side={-1} look={look} id={`${uid}r`} />
          <circle cx="58" cy="65" r="41.5" fill="none" stroke={RF_INK} strokeWidth="8.5" />
          <circle cx="138" cy="131" r="41.5" fill="none" stroke={RF_INK} strokeWidth="8.5" />
          {/* the arcs flatten into furious brows */}
          <path d="M22 12 L94 34" stroke={RF_INK} strokeWidth="8.5" strokeLinecap="round" />
          <path d="M194 80 L132 96" stroke={RF_INK} strokeWidth="8.5" strokeLinecap="round" />
          <ellipse cx="63" cy="140" rx="12" ry="7" fill="none" stroke={RF_INK} strokeWidth="5" />
          <Vein x={186} y={30} s={0.65} />
        </g>
      ) : (
        <g className="mood-swap">
          <path d="M76 8 Q 100 15 107 38" fill="none" stroke={RF_INK} strokeWidth="8.5" />
          <path d="M161 75 Q 188 79 200 103" fill="none" stroke={RF_INK} strokeWidth="8.5" />
          <circle cx="63" cy="137" r="13.5" fill="none" stroke={RF_INK} strokeWidth="8.5" />
          <g className="blink">
            <circle cx="58" cy="65" r="41.5" fill="#fff" stroke={RF_INK} strokeWidth="8.5" />
            <circle cx="138" cy="131" r="41.5" fill="#fff" stroke={RF_INK} strokeWidth="8.5" />
            <circle cx={59 + px} cy={64 + py} r="17.5" fill={RF_IRIS} stroke={RF_INK} strokeWidth="6" className="pupil" />
            <circle cx={137 + px} cy={132 + py} r="17.5" fill={RF_IRIS} stroke={RF_INK} strokeWidth="6" className="pupil" />
          </g>
        </g>
      )}
    </svg>
  )
}
