import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Canvas } from '../components/Canvas'
import { Button, LangSwitch, Logo, img } from '../components/ui'
import { Eyes, useLook } from '../components/Mascot'
import { getState, setState, useStore } from '../lib/store'
import { useLang } from '../lib/i18n'

function nextAfterLogin() {
  const s = getState()
  if (!s.quizDone) return '/welcome'
  return '/home'
}

export function Splash() {
  const nav = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  useLook(ref, 14)
  const { t } = useLang()
  const go = () => nav(getState().user ? nextAfterLogin() : '/login', { replace: true })
  useEffect(() => {
    const t = setTimeout(go, 2600)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Canvas bleed>
      <div className="page splash" ref={ref} onClick={go}>
        <div className="splash-brand">
          <Logo className="splash-logo" />
          <p className="splash-tag">{t('Nền tảng hỗ trợ định hướng và trải nghiệm nghề nghiệp siêu kỳ thú', 'A super fun platform to help you find your path and try out careers')}</p>
        </div>
        <div className="splash-eyes">
          <Eyes size={380} />
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
  const { t, lang } = useLang()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof err = {}
    if (!EMAIL.test(email.trim())) next.email = t('Email chưa đúng định dạng, ví dụ: ten@truong.edu.vn', "That email doesn't look right, e.g. name@school.edu")
    if (pw.length < 6) next.pw = t('Mật khẩu cần ít nhất 6 ký tự', 'Your password needs at least 6 characters')
    setErr(next)
    if (Object.keys(next).length) return
    setBusy(true)
    setTimeout(() => {
      const name = email.split('@')[0].replace(/[._\d]+/g, ' ').trim() || (lang === 'en' ? 'friend' : 'bạn')
      setState({ user: { email: email.trim(), name: name.replace(/(^|\s)\S/g, (c) => c.toUpperCase()) } })
      nav(loc.state?.from ?? nextAfterLogin(), { replace: true })
    }, 650)
  }

  return (
    <Canvas bleed>
      <div className="page login">
        <Logo className="login-logo" />
        <LangSwitch className="login-seg" />
        <form className="login-card" onSubmit={submit} noValidate>
          <h1>{t('Đăng nhập', 'Log in')}</h1>
          <p className="login-sub">{t('Hãy điền đầy đủ thông tin phía dưới nha!', 'Fill in your details below to get started!')}</p>
          <label className="field">
            <span>Email</span>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t('Điền email', 'Enter your email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!err.email}
            />
            {err.email && <em className="field-err">{err.email}</em>}
          </label>
          <label className="field">
            <span>{t('Mật khẩu', 'Password')}</span>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder={t('Điền mật khẩu', 'Enter your password')}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              aria-invalid={!!err.pw}
            />
            {err.pw && <em className="field-err">{err.pw}</em>}
          </label>
          <div className="login-row">
            <label className="checkbox">
              <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>{t('Ghi nhớ tôi trong 30 ngày', 'Remember me for 30 days')}</span>
            </label>
            <button type="button" className="link" onClick={() => setErr({ pw: t('Tính năng khôi phục mật khẩu sẽ có trong bản tiếp theo.', 'Password recovery is coming in the next version.') })}>
              {t('Quên mật khẩu', 'Forgot password')}
            </button>
          </div>
          <Button type="submit" className="login-btn" disabled={busy}>
            {busy ? t('Đang đăng nhập…', 'Logging in…') : t('Đăng nhập', 'Log in')}
          </Button>
          <p className="login-note">{t('Bản thử nghiệm: dùng email bất kỳ và mật khẩu từ 6 ký tự.', 'Demo version: use any email and a password of 6+ characters.')}</p>
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
  const { t } = useLang()
  const go = () => {
    setLeaving(true)
    setTimeout(() => nav('/quiz'), 520)
  }
  return (
    <Canvas bleed fade={leaving}>
      <div className={`page welcome ${leaving ? 'is-leaving' : ''}`}>
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
            <p className="welcome-kicker">{t('Úm ba la, vừng ơi mở ra!', 'Abracadabra, open sesame!')}</p>
            <h1>{t('Cánh cổng bước vào con đường định hướng nghề nghiệp diệu kì', 'The gateway to your magical career journey')}</h1>
            <Button onClick={go} disabled={leaving}>
              {t('Được rồi đi thôi', "Alright, let's go!")}
            </Button>
          </div>
        </div>
      </div>
    </Canvas>
  )
}
