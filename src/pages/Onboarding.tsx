import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { Button, Logo, Loops, img } from '../components/ui'
import { Eyes, useLook } from '../components/Mascot'
import { getState, setState, useStore } from '../lib/store'

function nextAfterLogin() {
  const s = getState()
  if (!s.quizDone) return '/welcome'
  return '/home'
}

export function Splash() {
  const nav = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const look = useLook(ref, 14)
  const go = () => nav(getState().user ? nextAfterLogin() : '/login', { replace: true })
  useEffect(() => {
    const t = setTimeout(go, 2600)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Canvas>
      <div className="page splash" ref={ref} onClick={go}>
        <Loops />
        <div className="splash-brand">
          <Logo className="splash-logo" />
          <p className="splash-tag">Nền tảng hỗ trợ định hướng và trải nghiệm nghề nghiệp siêu kỳ thú</p>
        </div>
        <div className="splash-eyes">
          <Eyes size={380} look={look} />
        </div>
      </div>
    </Canvas>
  )
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Login() {
  const nav = useNavigate()
  const loc = useLocation() as { state?: { from?: string } }
  const user = useStore((s) => s.user)
  const [email, setEmail] = useState(user?.email ?? '')
  const [pw, setPw] = useState('')
  const [remember, setRemember] = useState(true)
  const [err, setErr] = useState<{ email?: string; pw?: string }>({})
  const [busy, setBusy] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof err = {}
    if (!EMAIL.test(email.trim())) next.email = 'Email chưa đúng định dạng, ví dụ: ten@truong.edu.vn'
    if (pw.length < 6) next.pw = 'Mật khẩu cần ít nhất 6 ký tự'
    setErr(next)
    if (Object.keys(next).length) return
    setBusy(true)
    setTimeout(() => {
      const name = email.split('@')[0].replace(/[._\d]+/g, ' ').trim() || 'bạn'
      setState({ user: { email: email.trim(), name: name.replace(/(^|\s)\S/g, (c) => c.toUpperCase()) } })
      nav(loc.state?.from ?? nextAfterLogin(), { replace: true })
    }, 650)
  }

  return (
    <Canvas>
      <div className="page login">
        <Loops variant={1} />
        <Logo className="login-logo" />
        <form className="login-card" onSubmit={submit} noValidate>
          <h1>Đăng nhập</h1>
          <p className="login-sub">Hãy điền đầy đủ thông tin phía dưới nha!</p>
          <label className="field">
            <span>Email</span>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Điền email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!err.email}
            />
            {err.email && <em className="field-err">{err.email}</em>}
          </label>
          <label className="field">
            <span>Mật khẩu</span>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Điền mật khẩu"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              aria-invalid={!!err.pw}
            />
            {err.pw && <em className="field-err">{err.pw}</em>}
          </label>
          <div className="login-row">
            <label className="checkbox">
              <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>Ghi nhớ tôi trong 30 ngày</span>
            </label>
            <button type="button" className="link" onClick={() => setErr({ pw: 'Tính năng khôi phục mật khẩu sẽ có trong bản tiếp theo.' })}>
              Quên mật khẩu
            </button>
          </div>
          <Button type="submit" className="login-btn" disabled={busy}>
            {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </Button>
          <p className="login-note">Bản thử nghiệm: dùng email bất kỳ và mật khẩu từ 6 ký tự.</p>
        </form>
      </div>
    </Canvas>
  )
}

// name, left, top, width, height (design px), rotation the item flies in with
const ICONS: [string, number, number, number, number, number][] = [
  ['w-camera', 648, 95, 116, 95, -40],
  ['w-compass', 918, 144, 120, 120, 30],
  ['w-mask', 1171, 94, 165, 76, 50],
  ['w-stetho', 1376, 173, 134, 160, -35],
  ['w-question', 506, 231, 64, 102, 45],
  ['w-brain', 241, 856, 153, 128, -50],
  ['w-key', 629, 787, 83, 84, 120],
  ['w-gear', 1250, 778, 86, 85, -120],
  ['w-puzzle', 1544, 844, 136, 128, 60],
  ['w-laptop', 892, 866, 164, 105, -25],
]

/**
 * The gate: two doors arrive closed in the middle, burst open with an overshoot,
 * then every item pops out of the gap and bounces into place (timed after the
 * team's Figma prototype). Leaving fades the scene into the quiz.
 */
export function Welcome() {
  const nav = useNavigate()
  const [leaving, setLeaving] = useState(false)
  const go = () => {
    setLeaving(true)
    setTimeout(() => nav('/quiz'), 520)
  }
  return (
    <Canvas>
      <div className={`page welcome ${leaving ? 'is-leaving' : ''}`}>
        <Loops variant={2} />
        <img className="door door-l" src={img('w-door-l')} alt="" style={{ left: 118, top: 281 }} />
        <img className="door door-r" src={img('w-door-r')} alt="" style={{ left: 1446, top: 286 }} />
        {ICONS.map(([n, x, y, w, h, r], i) => (
          <span
            key={n}
            className="pop"
            style={{
              left: x,
              top: y,
              width: w,
              height: h,
              ['--dx' as string]: `${960 - (x + w / 2)}px`,
              ['--dy' as string]: `${560 - (y + h / 2)}px`,
              ['--r' as string]: `${r}deg`,
              ['--d' as string]: `${1.02 + (i % 5) * 0.05 + Math.floor(i / 5) * 0.03}s`,
            }}
          >
            <img src={img(n)} alt="" style={{ animationDelay: `${2.2 + i * 0.23}s` }} />
          </span>
        ))}
        <div className="welcome-copy">
          <div className="welcome-inner">
            <p className="welcome-kicker">Úm ba la, vừng ơi mở ra!</p>
            <h1>Cánh cổng bước vào con đường định hướng nghề nghiệp diệu kì</h1>
            <Button onClick={go} disabled={leaving}>
              Được rồi đi thôi
            </Button>
          </div>
        </div>
      </div>
    </Canvas>
  )
}
