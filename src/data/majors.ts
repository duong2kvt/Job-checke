import type { Area } from './quiz'

export type Major = { id: string; name: string; areas: Area[]; available: boolean }

export const MAJORS: Major[] = [
  { id: 'thiet-ke', name: 'Thiết kế', areas: ['A', 'R'], available: true },
  { id: 'kien-truc', name: 'Kiến trúc', areas: ['A', 'R', 'I'], available: false },
  { id: 'sang-tao-noi-dung', name: 'Sáng tạo nội dung', areas: ['A', 'S', 'E'], available: false },
  { id: 'ki-thuat', name: 'Kĩ thuật', areas: ['R', 'I'], available: false },
  { id: 'tai-chinh', name: 'Tài chính', areas: ['C', 'E', 'I'], available: false },
  { id: 'cong-nghe-thong-tin', name: 'Công nghệ thông tin', areas: ['I', 'C'], available: false },
  { id: 'giao-duc', name: 'Giáo dục', areas: ['S'], available: false },
  { id: 'marketing', name: 'Marketing', areas: ['E', 'A', 'S'], available: false },
]

export const BRANCHES = [
  { id: 'do-hoa', name: 'Thiết kế đồ họa', available: true },
  { id: 'ui-ux', name: 'Thiết kế UI/UX', available: false },
  { id: '3d', name: 'Thiết kế 3D', available: false },
  { id: 'game', name: 'Thiết kế Game', available: false },
  { id: 'chuyen-dong', name: 'Đồ họa chuyển động', available: false },
]

/** Majors that fit the person's strongest areas, and the ones that fit what they enjoy. */
export function suggest(ranked: Area[]) {
  const fit = (m: Major, areas: Area[]) => m.areas.reduce((s, a) => s + (areas.includes(a) ? 3 - areas.indexOf(a) : 0), 0)
  const byStrength = [...MAJORS].sort((a, b) => fit(b, ranked.slice(0, 2)) - fit(a, ranked.slice(0, 2)))
  const strengths = byStrength.filter((m) => m.areas.some((a) => a === ranked[0] || a === ranked[1])).slice(0, 2)
  const interests = [...MAJORS]
    .filter((m) => !strengths.includes(m))
    .sort((a, b) => fit(b, ranked.slice(0, 3)) - fit(a, ranked.slice(0, 3)))
    .slice(0, 3)
  // The playable design track is always offered
  const design = MAJORS[0]
  if (!strengths.includes(design) && !interests.includes(design)) interests[interests.length - 1] = design
  return { strengths, interests }
}
