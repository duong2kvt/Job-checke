import type { Tx } from '../lib/i18n'

// Six statements, one per Holland (RIASEC) interest area, answered on a
// five-step agree scale. Copy follows the Figma frames Quiz-1 … Quiz-6.

export type Area = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
export type Face = 'happy' | 'focus' | 'wow' | 'think'

export const QUESTIONS: { area: Area; text: Tx; sticker: Tx; color: string; face: Face }[] = [
  {
    area: 'R',
    text: { vi: 'Bạn có thích thao tác thực tế, làm việc bằng tay hoặc sửa chữa đồ vật hông?', en: 'Do you enjoy hands-on work, making things or fixing stuff?' },
    sticker: { vi: 'Trả lời bình tĩnh nghen!', en: 'Take your time, no rush!' },
    color: '#F376BC',
    face: 'happy',
  },
  {
    area: 'I',
    text: { vi: 'Bạn thích phân tích thông tin, giải quyết vấn đề phức tạp hoặc nghiên cứu khoa học hông?', en: 'Do you like digging into information, cracking tricky problems or doing science research?' },
    sticker: { vi: 'Gòi nữa nè, tiếp nè!', en: 'Here comes the next one!' },
    color: '#F8E42A',
    face: 'focus',
  },
  {
    area: 'A',
    text: { vi: 'Bạn có thích sáng tạo, thiết kế, vẽ, viết hoặc biểu diễn nghệ thuật hông?', en: 'Do you love creating things, like designing, drawing, writing or performing?' },
    sticker: { vi: 'Thêm xíu xíu nữa iii', en: 'Just a teeny bit more~' },
    color: '#8FD3F5',
    face: 'wow',
  },
  {
    area: 'S',
    text: { vi: 'Bạn có thích giúp đỡ người khác học tập hoặc giải quyết vấn đề cá nhân hông?', en: 'Do you like helping others learn or work through personal problems?' },
    sticker: { vi: 'Nửa chặng rồi nè!', en: 'Halfway there!' },
    color: '#C9EA6B',
    face: 'happy',
  },
  {
    area: 'E',
    text: { vi: 'Bạn cảm thấy hứng thú khi quản lý, ra quyết định và chịu trách nhiệm cho kết quả hông?', en: 'Does it excite you to lead, make the calls and own the results?' },
    sticker: { vi: 'Sắp xong òi, cố lênnn', en: 'Almost done, keep goinggg' },
    color: '#F8E42A',
    face: 'focus',
  },
  {
    area: 'C',
    text: { vi: 'Bạn có cảm thấy thoải mái khi làm việc theo quy trình rõ ràng, chuẩn mực, chi tiết hông?', en: 'Do you feel at ease working with clear, detailed and well-defined processes?' },
    sticker: { vi: 'Xong ùi :33', en: 'All done :33' },
    color: '#8FD3F5',
    face: 'wow',
  },
]

export const SCALE: { size: number; color: string; label: Tx }[] = [
  { size: 48, color: '#F376BC', label: { vi: 'Rất phản đối', en: 'Strongly disagree' } },
  { size: 40, color: '#F376BC', label: { vi: 'Phản đối', en: 'Disagree' } },
  { size: 32, color: '#9C97A6', label: { vi: 'Trung lập', en: 'Neutral' } },
  { size: 40, color: '#09B86B', label: { vi: 'Đồng ý', en: 'Agree' } },
  { size: 48, color: '#09B86B', label: { vi: 'Rất đồng ý', en: 'Strongly agree' } },
]

// A representative personality label per dominant area (shown on the result
// screen). Six statements can't measure MBTI; this is a friendly label only.
export const TYPE_BY_AREA: Record<Area, { code: string; name: Tx }> = {
  A: { code: 'INFJ-T', name: { vi: 'Người cố vấn sáng tạo', en: 'The Creative Advocate' } },
  I: { code: 'INTP-A', name: { vi: 'Nhà tư duy logic', en: 'The Logician' } },
  S: { code: 'ENFJ-A', name: { vi: 'Người truyền cảm hứng', en: 'The Inspirer' } },
  E: { code: 'ENTJ-A', name: { vi: 'Nhà lãnh đạo', en: 'The Commander' } },
  C: { code: 'ISTJ-A', name: { vi: 'Người tận tâm', en: 'The Dedicated One' } },
  R: { code: 'ISTP-A', name: { vi: 'Người thực hành', en: 'The Hands-on Maker' } },
}

export type Profile = {
  scores: Record<Area, number>
  ranked: Area[]
  type: { code: string; name: Tx }
}

export function profileFrom(answers: (number | null)[]): Profile {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 } as Record<Area, number>
  QUESTIONS.forEach((q, i) => {
    scores[q.area] = answers[i] ?? 2
  })
  // Ties keep the questionnaire's order, nudged towards A so the design track shows up for neutral answers
  const order: Area[] = ['A', 'I', 'S', 'E', 'C', 'R']
  const ranked = [...order].sort((a, b) => scores[b] - scores[a])
  return { scores, ranked, type: TYPE_BY_AREA[ranked[0]] }
}
