import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

export const img = (name: string) => `${import.meta.env.BASE_URL}img/${name}.webp`

export function Logo({ className = 'logo', onClick }: { className?: string; onClick?: () => void }) {
  return <img className={className} src={`${import.meta.env.BASE_URL}img/logo.svg`} alt="Chộp Chếc" onClick={onClick} draggable={false} />
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'solid' | 'ghost'; size?: 'md' | 'lg' }
export function Button({ variant = 'outline', size = 'md', className = '', ...rest }: BtnProps) {
  return <button {...rest} className={`btn btn-${variant} btn-${size} ${className}`} />
}

export function BackLink({ to, label = 'Trở về' }: { to?: string | number; label?: string }) {
  const nav = useNavigate()
  return (
    <button className="back" onClick={() => (typeof to === 'string' ? nav(to) : nav(typeof to === 'number' ? to : -1))}>
      <span className="back-ico" aria-hidden>
        <svg viewBox="0 0 20 20" width="20" height="20">
          <path d="M12 5l-5 5 5 5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {label}
    </button>
  )
}

/** Pastel loop strokes behind the onboarding screens */
export function Loops({ variant = 0 }: { variant?: number }) {
  const sets = [
    ['#FFE9A8', '#F9C6E4', '#C9D8FF'],
    ['#D8F3E4', '#CFE3FF', '#E6D9FF'],
    ['#F9C6E4', '#E6D9FF', '#CFEFFF'],
  ][variant % 3]
  return (
    <svg className="loops" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={`lp${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={sets[0]} />
          <stop offset=".5" stopColor={sets[1]} />
          <stop offset="1" stopColor={sets[2]} />
        </linearGradient>
      </defs>
      <path
        d="M-60 1030 C 120 800, 40 120, 330 40 C 580 -30, 640 440, 430 640 C 250 810, 700 1100, 1260 900 C 1580 780, 1780 620, 1990 400"
        fill="none"
        stroke={`url(#lp${variant})`}
        strokeWidth="24"
        strokeLinecap="round"
        opacity=".55"
      />
      <path d="M1990 660 C 1700 940, 1300 1080, 900 1050" fill="none" stroke={sets[1]} strokeWidth="18" strokeLinecap="round" opacity=".55" />
    </svg>
  )
}

/** Short-lived message at the bottom of the frame */
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null)
  const t = useRef<number>()
  const show = (m: string) => {
    setMsg(m)
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setMsg(null), 2600)
  }
  useEffect(() => () => window.clearTimeout(t.current), [])
  const node = msg ? (
    <div className="toast" role="status" key={msg}>
      {msg}
    </div>
  ) : null
  return [node, show] as const
}

export function Modal({ open, onClose, children, className = '' }: { open: boolean; onClose: () => void; children: ReactNode; className?: string }) {
  useEffect(() => {
    if (!open) return
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className={`modal ${className}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal>
        <button className="modal-x" onClick={onClose} aria-label="Đóng">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}

export function Check({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
