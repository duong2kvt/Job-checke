import { LEVELS, SKILLS, TASKS, type Skill } from '../data/levels'
import type { State } from './store'

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 997, 7)

/** 0–100 for one task: a first-try right answer scores high, a corrected one lower. */
export function taskScore(id: string, picks: string[], correct: string) {
  const firstRight = picks[0] === correct
  const base = firstRight ? 84 : picks.includes(correct) ? 58 : 40
  return Math.min(98, base + (hash(id + picks.join('')) % 12))
}

export type Report = {
  done: number
  total: number
  skills: { key: Skill; label: string; value: number }[]
  subs: { label: string; value: number; level: number }[]
  weakLevels: number[]
}

export function buildReport(s: State): Report {
  const results = Object.values(s.levels).flatMap((l) => Object.entries(l.tasks))
  const bySkill: Record<Skill, number[]> = { 'sang-tao': [], 'tham-my': [], 'truc-quan': [], 'bo-cuc': [] }
  const subs: Report['subs'] = []
  for (const [id, r] of results) {
    const t = TASKS[id]
    if (!t) continue
    const v = taskScore(id, r.picks, t.correct)
    bySkill[t.skill].push(v)
    subs.push({ label: t.sub, value: v, level: t.level })
  }
  // A strong "artistic" quiz answer lifts creativity a little
  const artistic = s.answers[2] ?? 2
  const skills = (Object.keys(SKILLS) as Skill[]).map((key) => {
    const vals = bySkill[key]
    let value = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 50 + (hash(key) % 15)
    if (key === 'sang-tao') value += (artistic - 2) * 3
    return { key, label: SKILLS[key], value: Math.round(Math.max(30, Math.min(99, value))) }
  })
  subs.sort((a, b) => a.value - b.value)
  const done = LEVELS.filter((l) => s.levels[l.n]?.done).length
  const weakLevels = [...new Set(subs.map((x) => x.level))].slice(0, 3)
  return { done, total: LEVELS.length, skills, subs, weakLevels }
}

export function strengthText(r: Report) {
  const sorted = [...r.skills].sort((a, b) => b.value - a.value)
  const [top, second] = sorted
  const low = sorted[sorted.length - 1]
  return [
    `Phân tích biểu đồ cho thấy điểm mạnh của bạn rất phù hợp với ngành Thiết kế Đồ họa.`,
    `Nổi bật nhất là ${top.label.toLowerCase()} (${top.value}%) và ${second.label.toLowerCase()} (${second.value}%): bạn nhanh chóng nhận ra phương án nào giúp poster rõ ràng và thu hút hơn.`,
    `Dù ${low.label.toLowerCase()} còn khiêm tốn hơn (${low.value}%), đây vẫn là nền tảng tốt để bạn phát triển. Kết hợp các yếu tố này cho thấy bạn có tiềm năng nổi bật trong lĩnh vực thiết kế đồ họa.`,
  ]
}

export function improveText(r: Report) {
  const weak = r.subs.slice(0, 2)
  if (!weak.length) return ['Hoàn thành thêm các cấp độ để Chộp Chếc phân tích chính xác hơn nha.']
  if (weak[0].value >= 80)
    return [
      `Bạn làm rất tốt ở mọi kỹ năng! ${weak.map((w) => w.label).join(' và ')} là hai phần bạn có thể nâng lên mức xuất sắc.`,
      'Thử chơi lại các cấp độ gợi ý bên dưới và tự giải thích vì sao phương án kia chưa ổn. Đó là cách designer chuyên nghiệp luyện "con mắt" mỗi ngày.',
    ]
  return [
    `Hai kỹ năng nên luyện thêm là ${weak.map((w) => w.label.toLowerCase()).join(' và ')}.`,
    `Hãy chơi lại các cấp độ gợi ý bên dưới, đọc kỹ phần nhận xét của chị Quản lý và thử giải thích vì sao phương án kia chưa ổn. Đó là cách designer chuyên nghiệp luyện "con mắt" mỗi ngày.`,
  ]
}
