// Six statements, one per Holland (RIASEC) interest area, answered on a
// five-step agree scale. Copy follows the Figma frames Quiz-1 … Quiz-6.

export type Area = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
export type Face = 'happy' | 'focus' | 'wow' | 'think'

export const QUESTIONS: { area: Area; text: string; sticker: string; color: string; face: Face }[] = [
  { area: 'R', text: 'Bạn có thích thao tác thực tế, làm việc bằng tay hoặc sửa chữa đồ vật hông?', sticker: 'Trả lời bình tĩnh nghen!', color: '#F376BC', face: 'happy' },
  { area: 'I', text: 'Bạn thích phân tích thông tin, giải quyết vấn đề phức tạp hoặc nghiên cứu khoa học hông?', sticker: 'Gòi nữa nè, tiếp nè!', color: '#F8E42A', face: 'focus' },
  { area: 'A', text: 'Bạn có thích sáng tạo, thiết kế, vẽ, viết hoặc biểu diễn nghệ thuật hông?', sticker: 'Thêm xíu xíu nữa iii', color: '#8FD3F5', face: 'wow' },
  { area: 'S', text: 'Bạn có thích giúp đỡ người khác học tập hoặc giải quyết vấn đề cá nhân hông?', sticker: 'Nửa chặng rồi nè!', color: '#C9EA6B', face: 'happy' },
  { area: 'E', text: 'Bạn cảm thấy hứng thú khi quản lý, ra quyết định và chịu trách nhiệm cho kết quả hông?', sticker: 'Sắp xong òi, cố lênnn', color: '#F8E42A', face: 'focus' },
  { area: 'C', text: 'Bạn có cảm thấy thoải mái khi làm việc theo quy trình rõ ràng, chuẩn mực, chi tiết hông?', sticker: 'Xong ùi :33', color: '#8FD3F5', face: 'wow' },
]

export const SCALE = [
  { size: 48, color: '#F376BC', label: 'Rất phản đối' },
  { size: 40, color: '#F376BC', label: 'Phản đối' },
  { size: 32, color: '#9C97A6', label: 'Trung lập' },
  { size: 40, color: '#09B86B', label: 'Đồng ý' },
  { size: 48, color: '#09B86B', label: 'Rất đồng ý' },
]

// A representative personality label per dominant area (shown on the result
// screen). Six statements can't measure MBTI; this is a friendly label only.
export const TYPE_BY_AREA: Record<Area, { code: string; name: string }> = {
  A: { code: 'INFJ-T', name: 'Người cố vấn sáng tạo' },
  I: { code: 'INTP-A', name: 'Nhà tư duy logic' },
  S: { code: 'ENFJ-A', name: 'Người truyền cảm hứng' },
  E: { code: 'ENTJ-A', name: 'Nhà lãnh đạo' },
  C: { code: 'ISTJ-A', name: 'Người tận tâm' },
  R: { code: 'ISTP-A', name: 'Người thực hành' },
}

export type Profile = {
  scores: Record<Area, number>
  ranked: Area[]
  type: { code: string; name: string }
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
