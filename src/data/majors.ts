import type { Tx } from '../lib/i18n'
import type { Area } from './quiz'

export type Major = { id: string; name: Tx; areas: Area[]; available: boolean }

export const MAJORS: Major[] = [
  { id: 'thiet-ke', name: { vi: 'Thiết kế', en: 'Design' }, areas: ['A', 'R'], available: true },
  { id: 'kien-truc', name: { vi: 'Kiến trúc', en: 'Architecture' }, areas: ['A', 'R', 'I'], available: false },
  { id: 'sang-tao-noi-dung', name: { vi: 'Sáng tạo nội dung', en: 'Content Creation' }, areas: ['A', 'S', 'E'], available: false },
  { id: 'ki-thuat', name: { vi: 'Kĩ thuật', en: 'Engineering' }, areas: ['R', 'I'], available: false },
  { id: 'tai-chinh', name: { vi: 'Tài chính', en: 'Finance' }, areas: ['C', 'E', 'I'], available: false },
  { id: 'cong-nghe-thong-tin', name: { vi: 'Công nghệ thông tin', en: 'Information Technology' }, areas: ['I', 'C'], available: false },
  { id: 'giao-duc', name: { vi: 'Giáo dục', en: 'Education' }, areas: ['S'], available: false },
  { id: 'marketing', name: { vi: 'Marketing', en: 'Marketing' }, areas: ['E', 'A', 'S'], available: false },
]

export const BRANCHES: { id: string; name: Tx; available: boolean }[] = [
  { id: 'do-hoa', name: { vi: 'Thiết kế đồ họa', en: 'Graphic Design' }, available: true },
  { id: 'ui-ux', name: { vi: 'Thiết kế UI/UX', en: 'UI/UX Design' }, available: false },
  { id: '3d', name: { vi: 'Thiết kế 3D', en: '3D Design' }, available: false },
  { id: 'game', name: { vi: 'Thiết kế Game', en: 'Game Design' }, available: false },
  { id: 'chuyen-dong', name: { vi: 'Đồ họa chuyển động', en: 'Motion Graphics' }, available: false },
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
