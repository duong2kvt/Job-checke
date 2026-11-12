import { useNavigate } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { Button, Logo, img, useToast } from '../components/ui'
import { Mascot } from '../components/Mascot'
import { LEVELS } from '../data/levels'
import { profileFrom } from '../data/quiz'
import { buildReport } from '../lib/report'
import { logout, resetJourney, useStore } from '../lib/store'

function greeting() {
  const h = new Date().getHours()
  return h < 11 ? 'Buổi sáng vui vẻ' : h < 14 ? 'Buổi trưa vui vẻ' : h < 18 ? 'Buổi chiều vui vẻ' : 'Buổi tối vui vẻ'
}

function today() {
  const d = new Date()
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  return `${days[d.getDay()]}, ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`
}

export function Home() {
  const nav = useNavigate()
  const s = useStore((x) => x)
  const [toast, showToast] = useToast()
  const user = s.user!
  const p = s.quizDone ? profileFrom(s.answers) : null
  const r = buildReport(s)
  const top = [...r.skills].sort((a, b) => b.value - a.value)[0]
  const next = LEVELS.find((l) => !s.levels[l.n]?.done)

  const nav_ = [
    { label: 'Tổng Quan', on: true, go: () => {} },
    { label: 'Khám Phá Tính Cách', go: () => (s.quizDone ? nav('/result') : nav('/quiz')) },
    { label: 'Game Mô Phỏng Nghề', go: () => (s.quizDone ? nav('/journey') : nav('/quiz')) },
    { label: 'Cơ Sở Đào Tạo', go: () => showToast('Cơ sở đào tạo sẽ có trong bản cập nhật tới!') },
    { label: 'Phần Thưởng Của Bạn', go: () => (s.reward ? nav('/reward') : showToast('Hoàn thành lộ trình để nhận phần thưởng nha!')) },
  ]

  return (
    <Canvas>
      <div className="page home">
        <aside className="hm-side">
          <Logo className="hm-logo" />
          <div className="hm-user">
            <span className="hm-avatar">{user.name.charAt(0)}</span>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <nav>
            {nav_.map((n) => (
              <button key={n.label} data-on={n.on || undefined} onClick={n.go}>
                {n.label}
              </button>
            ))}
          </nav>
          <button
            className="hm-logout"
            onClick={() => {
              logout()
              nav('/login')
            }}
          >
            Đăng xuất
          </button>
        </aside>

        <main className="hm-main">
          <header>
            <h1>
              {greeting()}, {user.name} ơi!
            </h1>
            <p>{today()}</p>
          </header>

          <section className="hm-hero">
            <Mascot face="happy" size={180} />
            <div>
              <h2>{!s.quizDone ? 'Bắt đầu hành trình của bạn' : next ? `Tiếp tục cấp ${next.n}: ${next.name}` : 'Bạn đã hoàn thành lộ trình Thiết kế đồ họa!'}</h2>
              <p>
                {!s.quizDone
                  ? 'Làm 6 câu trắc nghiệm để Chộp Chếc gợi ý chuyên ngành phù hợp với bạn.'
                  : next
                    ? 'Vào vai thực tập sinh và hoàn thành task tiếp theo với chị Quản lý.'
                    : 'Xem báo cáo phân tích và nhận voucher khóa học đầu tiên.'}
              </p>
            </div>
            <Button variant="solid" size="lg" onClick={() => nav(!s.quizDone ? '/welcome' : next ? `/journey` : '/report')}>
              {!s.quizDone ? 'Làm trắc nghiệm' : next ? 'Vào lộ trình' : 'Xem báo cáo'}
            </Button>
          </section>

          <div className="hm-grid">
            <article className="hm-card">
              <h3>Tính cách</h3>
              {p ? (
                <>
                  <strong className="hm-big green">{p.type.code}</strong>
                  <p>{p.type.name}</p>
                  <button className="link" onClick={() => nav('/result')}>
                    Xem chuyên ngành phù hợp
                  </button>
                </>
              ) : (
                <p>Chưa làm trắc nghiệm.</p>
              )}
            </article>
            <article className="hm-card">
              <h3>Lộ trình Thiết kế đồ họa</h3>
              <strong className="hm-big">
                {r.done}
                <small>/{r.total}</small>
              </strong>
              <div className="hm-bar">
                <i style={{ width: `${(r.done / r.total) * 100}%` }} />
              </div>
              <button className="link" onClick={() => nav(s.quizDone ? '/journey' : '/quiz')}>
                Mở lộ trình
              </button>
            </article>
            <article className="hm-card">
              <h3>Kỹ năng nổi bật</h3>
              {r.done ? (
                <>
                  <strong className="hm-big pink">{top.value}%</strong>
                  <p>{top.label}</p>
                  <button className="link" onClick={() => nav('/report')}>
                    Xem báo cáo
                  </button>
                </>
              ) : (
                <p>Hoàn thành 1 cấp độ để xem phân tích kỹ năng.</p>
              )}
            </article>
            <article className="hm-card hm-voucher">
              <h3>Phần thưởng</h3>
              {s.reward ? (
                <>
                  <strong className="hm-big">{s.reward.code}</strong>
                  <p>Giảm 10% cho khóa học đầu tiên</p>
                </>
              ) : (
                <>
                  <img src={img('designer')} alt="" />
                  <p>Hoàn thành lộ trình để mở voucher.</p>
                </>
              )}
            </article>
          </div>

          <section className="hm-levels">
            <h3>Game mô phỏng nghề · Thiết kế đồ họa</h3>
            <div className="hm-level-row">
              {LEVELS.map((l) => {
                const done = !!s.levels[l.n]?.done
                const open = s.quizDone && (done || l.n === next?.n)
                return (
                  <button key={l.n} className={`hm-level ${done ? 'is-done' : open ? 'is-open' : ''}`} disabled={!open} onClick={() => nav(`/journey/${l.n}`)}>
                    <span className="hm-level-n">{l.n}</span>
                    <strong>{l.name}</strong>
                    <em>{done ? 'Đã hoàn thành · chơi lại' : open ? 'Sẵn sàng' : 'Chưa mở khóa'}</em>
                  </button>
                )
              })}
            </div>
          </section>

          <footer className="hm-foot">
            <button
              className="link"
              onClick={() => {
                resetJourney()
                nav('/welcome')
              }}
            >
              Làm lại từ đầu
            </button>
            <span>Bảng điều khiển đầy đủ (thống kê, so sánh tính cách, trung tâm đào tạo) đang được phát triển.</span>
          </footer>
        </main>
        {toast}
      </div>
    </Canvas>
  )
}
