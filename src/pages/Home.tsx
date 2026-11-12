import { useNavigate } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { Button, LangSwitch, Logo, img, useToast } from '../components/ui'
import { Mascot } from '../components/Mascot'
import { LEVELS } from '../data/levels'
import { profileFrom } from '../data/quiz'
import { buildReport } from '../lib/report'
import { logout, resetJourney, useStore } from '../lib/store'
import { useLang, type Lang } from '../lib/i18n'

function greeting(lang: Lang) {
  const h = new Date().getHours()
  if (lang === 'en') return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  return h < 11 ? 'Buổi sáng vui vẻ' : h < 14 ? 'Buổi trưa vui vẻ' : h < 18 ? 'Buổi chiều vui vẻ' : 'Buổi tối vui vẻ'
}

function today(lang: Lang) {
  const d = new Date()
  if (lang === 'en') return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  return `${days[d.getDay()]}, ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`
}

export function Home() {
  const nav = useNavigate()
  const s = useStore((x) => x)
  const [toast, showToast] = useToast()
  const { t, lang } = useLang()
  const user = s.user!
  const p = s.quizDone ? profileFrom(s.answers) : null
  const r = buildReport(s)
  const top = [...r.skills].sort((a, b) => b.value - a.value)[0]
  const next = LEVELS.find((l) => !s.levels[l.n]?.done)

  const nav_ = [
    { label: t('Tổng Quan', 'Overview'), on: true, go: () => {} },
    { label: t('Khám Phá Tính Cách', 'Discover Your Personality'), go: () => (s.quizDone ? nav('/result') : nav('/quiz')) },
    { label: t('Game Mô Phỏng Nghề', 'Career Simulation Game'), go: () => (s.quizDone ? nav('/journey') : nav('/quiz')) },
    { label: t('Cơ Sở Đào Tạo', 'Training Schools'), go: () => showToast(t('Cơ sở đào tạo sẽ có trong bản cập nhật tới!', 'Training schools are coming in the next update!')) },
    {
      label: t('Phần Thưởng Của Bạn', 'Your Rewards'),
      go: () => (s.reward ? nav('/reward') : showToast(t('Hoàn thành lộ trình để nhận phần thưởng nha!', 'Finish the roadmap to unlock your reward!'))),
    },
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
          <LangSwitch className="hm-seg" />
          <button
            className="hm-logout"
            onClick={() => {
              logout()
              nav('/login')
            }}
          >
            {t('Đăng xuất', 'Log out')}
          </button>
        </aside>

        <main className="hm-main">
          <header>
            <h1>
              {greeting(lang)}, {user.name}{lang === 'en' ? '!' : ' ơi!'}
            </h1>
            <p>{today(lang)}</p>
          </header>

          <section className="hm-hero">
            <Mascot face="happy" size={180} />
            <div>
              <h2>{!s.quizDone
                  ? t('Bắt đầu hành trình của bạn', 'Start your journey')
                  : next
                    ? t(`Tiếp tục cấp ${next.n}: ${next.name.vi}`, `Continue level ${next.n}: ${next.name.en}`)
                    : t('Bạn đã hoàn thành lộ trình Thiết kế đồ họa!', "You've completed the Graphic Design roadmap!")}</h2>
              <p>
                {!s.quizDone
                  ? t('Làm 6 câu trắc nghiệm để Chộp Chếc gợi ý chuyên ngành phù hợp với bạn.', 'Answer 6 quick questions and Chộp Chếc will suggest majors that suit you.')
                  : next
                    ? t('Vào vai thực tập sinh và hoàn thành task tiếp theo với chị Quản lý.', 'Step into the intern role and tackle the next task with your manager.')
                    : t('Xem báo cáo phân tích và nhận voucher khóa học đầu tiên.', 'See your analysis report and grab a voucher for your first course.')}
              </p>
            </div>
            <Button variant="solid" size="lg" onClick={() => nav(!s.quizDone ? '/welcome' : next ? `/journey` : '/report')}>
              {!s.quizDone ? t('Làm trắc nghiệm', 'Take the quiz') : next ? t('Vào lộ trình', 'Open roadmap') : t('Xem báo cáo', 'View report')}
            </Button>
          </section>

          <div className="hm-grid">
            <article className="hm-card">
              <h3>{t('Tính cách', 'Personality')}</h3>
              {p ? (
                <>
                  <strong className="hm-big green">{p.type.code}</strong>
                  <p>{t(p.type.name)}</p>
                  <button className="link" onClick={() => nav('/result')}>
                    {t('Xem chuyên ngành phù hợp', 'See matching majors')}
                  </button>
                </>
              ) : (
                <p>{t('Chưa làm trắc nghiệm.', "You haven't taken the quiz yet.")}</p>
              )}
            </article>
            <article className="hm-card">
              <h3>{t('Lộ trình Thiết kế đồ họa', 'Graphic Design roadmap')}</h3>
              <strong className="hm-big">
                {r.done}
                <small>/{r.total}</small>
              </strong>
              <div className="hm-bar">
                <i style={{ width: `${(r.done / r.total) * 100}%` }} />
              </div>
              <button className="link" onClick={() => nav(s.quizDone ? '/journey' : '/quiz')}>
                {t('Mở lộ trình', 'Open roadmap')}
              </button>
            </article>
            <article className="hm-card">
              <h3>{t('Kỹ năng nổi bật', 'Top skill')}</h3>
              {r.done ? (
                <>
                  <strong className="hm-big pink">{top.value}%</strong>
                  <p>{t(top.label)}</p>
                  <button className="link" onClick={() => nav('/report')}>
                    {t('Xem báo cáo', 'View report')}
                  </button>
                </>
              ) : (
                <p>{t('Hoàn thành 1 cấp độ để xem phân tích kỹ năng.', 'Finish 1 level to see your skill analysis.')}</p>
              )}
            </article>
            <article className="hm-card hm-voucher">
              <h3>{t('Phần thưởng', 'Reward')}</h3>
              {s.reward ? (
                <>
                  <strong className="hm-big">{s.reward.code}</strong>
                  <p>{t('Giảm 10% cho khóa học đầu tiên', '10% off your first course')}</p>
                </>
              ) : (
                <>
                  <img src={img('designer')} alt="" />
                  <p>{t('Hoàn thành lộ trình để mở voucher.', 'Finish the roadmap to unlock your voucher.')}</p>
                </>
              )}
            </article>
          </div>

          <section className="hm-levels">
            <h3>{t('Game mô phỏng nghề · Thiết kế đồ họa', 'Career simulation game · Graphic Design')}</h3>
            <div className="hm-level-row">
              {LEVELS.map((l) => {
                const done = !!s.levels[l.n]?.done
                const open = s.quizDone && (done || l.n === next?.n)
                return (
                  <button key={l.n} className={`hm-level ${done ? 'is-done' : open ? 'is-open' : ''}`} disabled={!open} onClick={() => nav(`/journey/${l.n}`)}>
                    <span className="hm-level-n">{l.n}</span>
                    <strong>{t(l.name)}</strong>
                    <em>{done ? t('Đã hoàn thành · chơi lại', 'Completed · replay') : open ? t('Sẵn sàng', 'Ready') : t('Chưa mở khóa', 'Locked')}</em>
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
              {t('Làm lại từ đầu', 'Start over')}
            </button>
            <span>{t('Bảng điều khiển đầy đủ (thống kê, so sánh tính cách, trung tâm đào tạo) đang được phát triển.', 'The full dashboard (stats, personality comparison, training centres) is in the works.')}</span>
          </footer>
        </main>
        {toast}
      </div>
    </Canvas>
  )
}
