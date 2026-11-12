import type { Render } from '../data/levels'
import { useId } from 'react'
import { img } from './ui'
import { useLang, type Tx } from '../lib/i18n'

const TITLE: [Tx, Tx] = [
  { vi: 'Sữa hạt ngon mê ly', en: 'Nut milk so yummy' },
  { vi: 'Năng lượng mỗi ngày!', en: 'Energy every day!' },
]
const TAG: Tx = { vi: 'Dinh dưỡng từ thiên nhiên', en: 'Nourishment from nature' }

const BROWN = '#724721'

/** A small poster for the nut-milk brief, drawn in code so tasks can vary one property at a time */
export function MiniPoster({
  bg = '#FEFFF1',
  ink = BROWN,
  font = 'display',
  tagline = TAG,
  product = true,
  w = 348,
  h = 483,
}: {
  bg?: string
  ink?: string
  font?: 'display' | 'serif'
  tagline?: Tx
  product?: boolean
  w?: number
  h?: number
}) {
  const { t } = useLang()
  return (
    <div className="mp" style={{ width: w, height: h, background: bg, ['--ink' as string]: ink }}>
      <div className={`mp-title mp-${font}`}>
        <span>{t(TITLE[0])}</span>
        <span>{t(TITLE[1])}</span>
      </div>
      <span className="mp-chip">{t(tagline)}</span>
      {product && <img className="mp-product" src={img('carton')} alt="" />}
      {product && (
        <>
          <i className="mp-nut n1" />
          <i className="mp-nut n2" />
          <i className="mp-nut n3" />
          <i className="mp-nut n4" />
        </>
      )}
    </div>
  )
}

function Grid({ aligned }: { aligned: boolean }) {
  const blocks = aligned
    ? [
        [24, 24, 300, 70, '#724721'],
        [24, 112, 300, 210, '#E9D3AD'],
        [24, 340, 92, 116, '#F1E4CC'],
        [128, 340, 92, 116, '#F1E4CC'],
        [232, 340, 92, 116, '#F1E4CC'],
      ]
    : [
        [40, 30, 250, 64, '#724721'],
        [14, 118, 270, 190, '#E9D3AD'],
        [60, 330, 80, 98, '#F1E4CC'],
        [160, 352, 104, 110, '#F1E4CC'],
        [258, 310, 76, 80, '#F1E4CC'],
      ]
  return (
    <div className="grid-card">
      {aligned &&
        [24, 116, 128, 220, 232, 324].map((x) => <i key={x} className="grid-guide" style={{ left: x }} />)}
      {blocks.map(([x, y, w, h, c], i) => (
        <i key={i} className="grid-block" style={{ left: x as number, top: y as number, width: w as number, height: h as number, background: c as string }} />
      ))}
    </div>
  )
}

const NUT = '#CC8A3B'
const BEAN = '#4A2518'
// One almond, pointing up, drawn around (0, 0): 64 wide, 108 tall
const ALMOND = 'M0 -54 C 20 -42, 33 -8, 31 18 C 29 40, 15 54, 0 54 C -15 54, -29 40, -31 18 C -33 -8, -20 -42, 0 -54 Z'

/** Option A of the logo task: two hand-drawn almonds over a condensed, bold wordmark */
function AlmondLogo() {
  const { lang } = useLang()
  const id = useId().replace(/:/g, '')
  const [big, small] = lang === 'en' ? ['ALMOND', 'MILK'] : ['SỮA HẠT', 'HẠNH NHÂN']
  const groove = (d: string) => <path d={d} fill="none" stroke={BEAN} strokeWidth="2.6" strokeLinecap="round" />
  return (
    <div className="logo-card">
      <svg viewBox="0 0 200 224" width="262" height="293" aria-hidden>
        <defs>
          <filter id={`rough${id}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="2.2" />
          </filter>
        </defs>
        <g filter={`url(#rough${id})`}>
          {/* back almond, lying to the right */}
          <g transform="translate(124 74) rotate(60) scale(0.94)">
            <path d={ALMOND} fill={NUT} />
            {groove('M-14 -30 C -20 -6, -20 18, -12 38')}
            {groove('M2 -40 C -4 -12, -4 16, 2 44')}
            {groove('M16 -28 C 20 -4, 20 18, 14 36')}
            <path d="M-24 22 C -20 38, -10 46, 2 48" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </g>
          {/* front almond, upright, with a white rim that separates it from the back one */}
          <g transform="translate(80 68)">
            <path d={ALMOND} fill={NUT} stroke="#fff" strokeWidth="5" paintOrder="stroke" />
            {groove('M-12 -36 C -21 -10, -21 18, -14 40')}
            {groove('M2 -46 C -3 -16, -3 16, 2 46')}
            {groove('M15 -34 C 21 -10, 21 16, 15 38')}
            <path d="M-24 20 C -21 36, -12 46, -2 49" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
          </g>
        </g>
        <g>
          <text x="100" y="170" textAnchor="middle" fontFamily="'iCiel Panton', Montserrat, sans-serif" fontWeight="900" fontSize="46" fill={BEAN} textLength="134" lengthAdjust="spacingAndGlyphs">
            {big}
          </text>
          <text x="100" y="216" textAnchor="middle" fontFamily="'iCiel Panton', Montserrat, sans-serif" fontWeight="900" fontSize="30" fill={BEAN} textLength={lang === 'en' ? 62 : 104} lengthAdjust="spacingAndGlyphs">
            {small}
          </text>
        </g>
      </svg>
    </div>
  )
}

function Logo({ variant }: { variant: 'simple' | 'busy' }) {
  const { t } = useLang()
  if (variant === 'simple') return <AlmondLogo />
  return (
    <div className="logo-card">
      <svg viewBox="0 0 200 200" width="220" height="220" aria-hidden>
        <defs>
          <linearGradient id="bz" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F8E42A" />
            <stop offset=".5" stopColor="#F376BC" />
            <stop offset="1" stopColor="#3502BF" />
          </linearGradient>
        </defs>
        {Array.from({ length: 16 }).map((_, i) => (
          <path key={i} d="M100 8 L108 30 L92 30 Z" fill="#09B86B" transform={`rotate(${i * 22.5} 100 100)`} />
        ))}
        <circle cx="100" cy="100" r="70" fill="url(#bz)" stroke="#724721" strokeWidth="4" />
        <circle cx="100" cy="100" r="56" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="3 4" />
        <text x="100" y="92" textAnchor="middle" fontFamily="Playfair Display, serif" fontStyle="italic" fontSize="20" fill="#fff">
          Premium
        </text>
        <text x="100" y="112" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fill="#fff">
          ORGANIC • NATURAL • SINCE 2025
        </text>
        <text x="100" y="126" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="7" fill="#fff">
          {t('100% hạt tuyển chọn – nguyên chất', '100% hand-picked nuts – pure')}
        </text>
        <path d="M30 150 L170 150 L160 172 L40 172 Z" fill="#724721" />
        <text x="100" y="166" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fill="#F8E42A">
          {t('★ SỮA HẠT DINH DƯỠNG CAO CẤP ★', '★ PREMIUM NUTRITIOUS NUT MILK ★')}
        </text>
      </svg>
    </div>
  )
}

/** The picture for one option, at task size (348×483) */
export function OptionVisual({ r, reference }: { r: Render; reference?: 'brown' }) {
  switch (r.type) {
    case 'swatch':
      return (
        <div className="swatch-wrap">
          <i className="swatch" style={{ background: r.bg }} />
          {reference && <span className="swatch-sample" style={{ color: BROWN, background: r.bg }}>Aa</span>}
        </div>
      )
    case 'image':
      return <img className="opt-img" src={img(r.src)} alt="" draggable={false} />
    case 'headline':
      return <MiniPoster font={r.font} />
    case 'grid':
      return <Grid aligned={r.aligned} />
    case 'logo':
      return <Logo variant={r.variant} />
    case 'tagline':
      return <MiniPoster tagline={r.text} />
  }
}

/** The picture for one option in the manager's review (the colour task shows the title on each background) */
export function ReviewVisual({ r }: { r: Render }) {
  const { t } = useLang()
  if (r.type === 'swatch')
    return (
      <div className="review-header" style={{ background: r.bg }}>
        <div className="mp-title mp-display" style={{ ['--ink' as string]: BROWN }}>
          <span>{t(TITLE[0])}</span>
          <span>{t(TITLE[1])}</span>
        </div>
        <span className="mp-chip">{t(TAG)}</span>
      </div>
    )
  return (
    <div className="review-scale">
      <OptionVisual r={r} />
    </div>
  )
}
