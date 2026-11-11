import { useEffect, useState } from 'react'
import { HeroDemo } from './HeroDemo'
import { Prototype } from './Prototype'
import { SCREENS, asset } from './screens'

const FIGMA_DESIGN = 'https://www.figma.com/design/HZe4KO7SOwk8R4crJ5GWdI/-Designathon-2025--Team-15--Copy-?node-id=13-8'
const FIGMA_PROTO =
  'https://www.figma.com/proto/HZe4KO7SOwk8R4crJ5GWdI/Designathon-2025-Team-15-Copy?node-id=13-8&p=f&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=401%3A414'

function useRoute() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const on = () => setHash(location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash
}

const STEPS = [
  { n: '01', t: 'Trắc nghiệm tính cách', d: '6 câu hỏi cùng mascot Chộp, AI phân tích ra nhóm tính cách (vd. INFJ-T).' },
  { n: '02', t: 'Chọn chuyên ngành', d: 'Gợi ý ngành theo thế mạnh và sở thích, chọn nhánh như Thiết kế đồ họa.' },
  { n: '03', t: 'Trải nghiệm nghề', d: 'Vào vai thực tập sinh, làm task thật với chị quản lý: chọn màu, làm poster.' },
  { n: '04', t: 'Báo cáo & cơ hội', d: 'Biểu đồ điểm mạnh/cần cải thiện, voucher và các trung tâm đào tạo phù hợp.' },
]

function Landing() {
  const groups = [...new Set(SCREENS.map((s) => s.group))]
  return (
    <div className="lp">
      <header className="lp-nav">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Chộp Chếc" />
        <nav>
          <a href={FIGMA_DESIGN} target="_blank" rel="noreferrer">
            Figma
          </a>
          <a className="lp-btn" href="#prototype">
            Mở prototype
          </a>
        </nav>
      </header>

      <section className="lp-hero">
        <p className="lp-kicker">Designathon 2025 · Team 15</p>
        <h1>
          Nền tảng định hướng &amp; trải nghiệm
          <br />
          nghề nghiệp <span>siêu kỳ thú</span>
        </h1>
        <p className="lp-sub">Làm trắc nghiệm, chọn ngành, rồi vào vai thực tập sinh để thử một ngày làm nghề, trước khi chọn trường.</p>
        <div className="lp-cta">
          <a className="lp-btn lp-btn-lg" href="#prototype">
            Trải nghiệm prototype →
          </a>
          <a className="lp-link" href={FIGMA_PROTO} target="_blank" rel="noreferrer">
            Xem bản Figma gốc
          </a>
        </div>
      </section>

      <section className="lp-demo">
        <HeroDemo />
      </section>

      <section className="lp-steps">
        {STEPS.map((s) => (
          <div key={s.n} className="lp-step">
            <span>{s.n}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </div>
        ))}
      </section>

      <section className="lp-flow">
        <h2>Tất cả màn hình</h2>
        <p className="lp-sub">Bấm vào màn bất kỳ để mở prototype từ đó. Trong prototype: bấm vào nút như app thật, cuộn để xem phần dưới trang, phím ← → để lùi/tiến, H để hiện vùng bấm.</p>
        {groups.map((g) => (
          <div key={g} className="lp-group">
            <h4>{g}</h4>
            <div className="lp-grid">
              {SCREENS.filter((s) => s.group === g).map((s) => (
                <a key={s.id} href={`#screen-${s.id}`} className="lp-thumb">
                  {s.img ? <img src={asset(s.img)} alt="" loading="lazy" /> : <span className="lp-coded">Màn code tương tác</span>}
                  <span>{s.title}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="lp-foot">Chộp Chếc · Prototype web dựng từ thiết kế Figma của Team 15 · Designathon 2025</footer>
    </div>
  )
}

export function App() {
  const hash = useRoute()
  return hash === '#prototype' || hash.startsWith('#screen-') ? <Prototype /> : <Landing />
}
