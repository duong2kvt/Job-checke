import type { Render } from '../data/levels'
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

function Logo({ variant }: { variant: 'simple' | 'busy' }) {
  const { t } = useLang()
  if (variant === 'simple')
    return (
      <div className="logo-card">
        <svg viewBox="0 0 200 200" width="220" height="220" aria-hidden>
          <circle cx="100" cy="86" r="62" fill="#724721" />
          <path d="M100 44 C 128 60, 132 104, 100 128 C 68 104, 72 60, 100 44 Z" fill="#F1DDBA" />
          <path d="M100 58 L100 120" stroke="#724721" strokeWidth="5" strokeLinecap="round" />
          <text x="100" y="182" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="26" fill="#724721">
            {t('SỮA HẠT', 'NUT MILK')}
          </text>
        </svg>
      </div>
    )
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
