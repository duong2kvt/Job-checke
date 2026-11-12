import { useSyncExternalStore } from 'react'

// All user progress lives in the browser (localStorage), versioned so a future
// schema change can migrate or reset cleanly.

export type TaskResult = { picks: string[]; correct: boolean }
export type LevelProgress = { done: boolean; tasks: Record<string, TaskResult>; finishedAt?: number }

export type State = {
  user: { email: string; name: string } | null
  answers: (number | null)[]
  quizDone: boolean
  major: string | null
  branch: string | null
  levels: Record<number, LevelProgress>
  reward: { code: string; claimedAt: number } | null
}

const KEY = 'chopchec:v1'

export const initialState: State = {
  user: null,
  answers: Array(6).fill(null),
  quizDone: false,
  major: null,
  branch: null,
  levels: {},
  reward: null,
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initialState
    return { ...initialState, ...JSON.parse(raw) }
  } catch {
    return initialState
  }
}

let state: State = load()
const listeners = new Set<() => void>()

export function getState() {
  return state
}

export function setState(patch: Partial<State> | ((s: State) => Partial<State>)) {
  const next = typeof patch === 'function' ? patch(state) : patch
  state = { ...state, ...next }
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* private mode: keep in memory */
  }
  listeners.forEach((l) => l())
}

export function resetJourney() {
  setState((s) => ({ ...initialState, user: s.user }))
}

export function logout() {
  setState({ ...initialState })
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => select(state),
  )
}
