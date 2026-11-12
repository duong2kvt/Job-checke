import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { BackLink, Button, Logo, img, useToast } from '../components/ui'
import { Eyes, useLook } from '../components/Mascot'
import { LEVELS } from '../data/levels'
import { buildReport, improveText, strengthText } from '../lib/report'
import { getState, setState, useStore } from '../lib/store'

const RING_COLORS = ['#4FC0F1', '#09B86B', '#F376BC', '#3502BF']

function Ring({ value, label, color, delay = 0 }: { value: number; label: string; color: string; delay?: number }) {
  const r = 82
  const c = 2 * Math.PI * r
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setShown(value), 120 + delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return (
    <figure className="ring">
      <svg viewBox="0 0 200 200" width="200" height="200" aria-hidden>
        <circle cx="100" cy="100" r={r} fill="none" stroke={color} strokeOpacity=".14" strokeWidth="16" />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
          transform="rotate(-90 100 100)"
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.3,.7,.2,1)' }}
        />
      </svg>
      <span className="ring-val" style={{ color }}>
        {value}%
      </span>
      <figcaption>{label}</figcaption>
    </figure>
  )
}

export function ReportPage() {
  const nav = useNavigate()
  const s = useStore((x) => x)
  const r = buildReport(s)
  const [toast, showToast] = useToast()
  const improve = r.subs.slice(0, 4)
  while (improve.length < 4) improve.push({ label: 'Chưa có dữ liệu', value: 0, level: 0 })
  const replay = r.weakLevels.length ? r.weakLevels : [1, 2, 3]

  return (
    <Canvas>
      <div className="page report">
        <Logo className="corner-logo" onClick={() => nav('/home')} />
        <div className="rp-scroll">
          <header className="rp-head">
            <h1>Thiết Kế Đồ Họa - Báo Cáo Phân Tích Kết Quả</h1>
            <Button onClick={() => nav('/reward')}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                <path d="M4 10h16v10H4zM2 6h20v4H2zM12 6v14M12 6c-2-4-6-3-6-1s4 1 6 1c2 0 6 1 6-1s-4-3-6 1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              Nhận Phần Thưởng
            </Button>
          </header>
          {r.done < r.total && (
            <p className="rp-partial">
              Báo cáo dựa trên {r.done}/{r.total} cấp độ đã hoàn thành. Chơi tiếp để kết quả chính xác hơn nha!{' '}
              <button className="link" onClick={() => nav('/journey')}>
                Tiếp tục lộ trình
              </button>
            </p>
          )}
          <section className="rp-card">
            <h2>Điểm Mạnh Nổi Bật</h2>
            <div className="rings">
              {r.skills.map((k, i) => (
                <Ring key={k.key} value={k.value} label={k.label} color={RING_COLORS[i]} delay={i * 120} />
              ))}
            </div>
            <div className="rp-note">
              <svg className="squiggle" viewBox="0 0 40 10" width="40" height="10" aria-hidden>
                <path d="M1 5 q5 -6 10 0 t10 0 t10 0 t10 0" fill="none" stroke="#09B86B" strokeWidth="2" />
              </svg>
              {strengthText(r).map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>

            <h2>Điểm Cần Cải Thiện</h2>
            <div className="rings">
              {improve.map((k, i) => (
                <Ring key={k.label + i} value={k.value} label={k.label} color={RING_COLORS[i]} delay={i * 120} />
              ))}
            </div>
            <div className="rp-note">
              {improveText(r).map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>

            <h2>Gợi Ý Cải Thiện</h2>
            <h3 className="pink">Trải Nghiệm Lại Các Cấp Độ Game</h3>
            <div className="replay">
              {replay.map((n) => (
                <button key={n} className="replay-card" onClick={() => nav(`/journey/${n}`)}>
                  <span className="replay-art">
                    <img src={img('designer')} alt="" />
                  </span>
                  <span className="replay-body">
                    <span className="replay-chip">Nhóm Ngành Thiết Kế</span>
                    <strong>{LEVELS[n - 1].name}</strong>
                    <span className="replay-meta">
                      <span>Thiết Kế Đồ Họa</span>
                      <span>Cấp Độ {n}</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
          <div className="rp-foot">
            <Button onClick={() => showToast('Danh sách cơ sở đào tạo sẽ có trong bản cập nhật tới!')}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              Cơ Sở Đào Tạo Ngành Thiết Kế
            </Button>
          </div>
        </div>
        <BackLink to="/journey" />
        {toast}
      </div>
    </Canvas>
  )
}

const CODE = 'CHOPCHEC10'

export function Reward() {
  const nav = useNavigate()
  const [toast, showToast] = useToast()
  const ref = useRef<HTMLDivElement>(null)
  const look = useLook(ref, 12)
  useEffect(() => {
    if (!getState().reward) setState({ reward: { code: CODE, claimedAt: Date.now() } })
  }, [])
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CODE)
      showToast(`Đã sao chép mã ${CODE}`)
    } catch {
      showToast(`Mã của bạn: ${CODE}`)
    }
  }
  return (
    <Canvas>
      <div className="page reward">
        <svg className="confetti" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden>
          {[
            ['M80 180 q120 -160 260 -20 t260 10', '#F9C6E4'],
            ['M380 60 q60 120 180 40 t200 60', '#CFE3FF'],
            ['M860 120 q140 -100 240 40 t240 -20', '#FFE9A8'],
            ['M1300 80 q80 160 220 60 t260 80', '#D8F3E4'],
            ['M1500 260 q120 -60 200 60 t160 40', '#E6D9FF'],
            ['M140 360 q160 80 260 -40', '#D8F3E4'],
            ['M1120 300 q60 -80 180 -20', '#F9C6E4'],
          ].map(([d, c], i) => (
            <path key={i} d={d} fill="none" stroke={c} strokeWidth="34" strokeLinecap="round" opacity=".75" />
          ))}
        </svg>
        <Logo className="corner-logo" onClick={() => nav('/home')} />
        <div className="rw-head" ref={ref}>
          <span className="rw-say s1">Quà nè</span>
          <span className="rw-say s2">Quà nà</span>
          <Eyes size={230} look={look} />
          <h1>Chúc mừng bạn đã hoàn thành lộ trình học nhaaa!!!</h1>
        </div>
        <button className="voucher" onClick={copy} title="Bấm để sao chép mã">
          <span className="voucher-tab">DISCOUNT</span>
          <span className="voucher-body">
            <span>Giảm 10% cho khóa học đầu tiên</span>
            <strong>{CODE}</strong>
            <em>*Điều kiện áp dụng · bấm để sao chép</em>
          </span>
        </button>
        <div className="rw-actions">
          <Button onClick={() => showToast('Danh sách trung tâm áp dụng mã sẽ có trong bản cập nhật tới!')}>Sử Dụng Ngay</Button>
          <button className="text-link" onClick={() => nav('/home')}>
            Lưu và quay về
          </button>
        </div>
        {toast}
      </div>
    </Canvas>
  )
}
