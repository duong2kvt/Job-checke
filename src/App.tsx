import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useStore } from './lib/store'
import { Splash, Login, Welcome } from './pages/Onboarding'
import { QuizPage, Analyzing } from './pages/Quiz'
import { Result, Branches } from './pages/Result'
import { Roadmap } from './pages/Roadmap'
import { Trial } from './pages/Trial'
import { ReportPage, Reward } from './pages/Report'
import { Home } from './pages/Home'

function RequireUser({ children }: { children: ReactNode }) {
  const user = useStore((s) => s.user)
  const loc = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return <>{children}</>
}

function RequireQuiz({ children }: { children: ReactNode }) {
  const done = useStore((s) => s.quizDone)
  if (!done) return <Navigate to="/quiz" replace />
  return <>{children}</>
}

const guard = (el: ReactNode, quiz = false) => <RequireUser>{quiz ? <RequireQuiz>{el}</RequireQuiz> : el}</RequireUser>

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={guard(<Welcome />)} />
        <Route path="/quiz" element={guard(<QuizPage />)} />
        <Route path="/analyzing" element={guard(<Analyzing />)} />
        <Route path="/result" element={guard(<Result />, true)} />
        <Route path="/major/:id" element={guard(<Branches />, true)} />
        <Route path="/journey" element={guard(<Roadmap />, true)} />
        <Route path="/journey/:level" element={guard(<Trial />, true)} />
        <Route path="/report" element={guard(<ReportPage />, true)} />
        <Route path="/reward" element={guard(<Reward />, true)} />
        <Route path="/home" element={guard(<Home />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
