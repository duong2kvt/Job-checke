// The Graphic Design work trial: six levels on one brief (a poster for a new
// nut-milk product). Dialogue for level 1, the colour task, the layout task and
// the final poster follows the Figma frames Work Trial 1 – 8.

export type Skill = 'sang-tao' | 'tham-my' | 'truc-quan' | 'bo-cuc'
export const SKILLS: Record<Skill, string> = {
  'sang-tao': 'Sáng Tạo',
  'tham-my': 'Có Mắt Thẩm Mỹ',
  'truc-quan': 'Tư Duy Trực Quan',
  'bo-cuc': 'Tư Duy Bố Cục',
}

export type Render =
  | { type: 'swatch'; bg: string }
  | { type: 'image'; src: string }
  | { type: 'headline'; font: 'display' | 'serif' }
  | { type: 'grid'; aligned: boolean }
  | { type: 'logo'; variant: 'simple' | 'busy' }
  | { type: 'tagline'; text: string }

export type Option = { id: 'A' | 'B'; render: Render; verdict: string; notes: string[] }

export type Task = {
  kind: 'task'
  id: string
  title: string
  /** what the options are compared against (the brown title colour) */
  reference?: 'brown'
  options: [Option, Option]
  correct: 'A' | 'B'
  skill: Skill
  sub: string
  hint: string
}

export type Step =
  | { kind: 'talk'; manager?: string[]; intern?: string[]; tags?: boolean; prop?: 'carton' }
  | Task
  | { kind: 'review'; task: string }
  | { kind: 'final'; intern: string[] }

export type Level = { n: number; name: string; steps: Step[] }

const BRIEF =
  'Tuyệt. Hôm nay em sẽ tham gia vào dự án thiết kế poster quảng cáo sản phẩm sữa hạt mới của Vinamilk với màu chủ đạo là màu nâu, nổi bật hình ảnh sản phẩm, thu hút khách hàng từ 12 - 25 tuổi.'

export const LEVELS: Level[] = [
  {
    n: 1,
    name: 'Thiết Kế Kiểu Chữ',
    steps: [
      {
        kind: 'talk',
        tags: true,
        manager: ['Chào Kiên, chị là quản lý Thiết kế đồ họa tại Công ty Hub. Chị được thông tin hôm nay là ngày đầu đi làm của em. Chị muốn giới thiệu về công việc và dự án mà em sẽ tham gia.'],
        intern: ['Dạ, em rất vui được gặp chị. Mong chị giúp đỡ em trong công việc.'],
      },
      { kind: 'talk', prop: 'carton', manager: [BRIEF], intern: ['Vâng, em sẽ bắt tay làm ngay ạ.'] },
      {
        kind: 'talk',
        manager: ['Việc đầu tiên là chọn kiểu chữ cho tiêu đề. Kiểu chữ là "giọng nói" của poster, mà khách hàng của mình còn rất trẻ đó nha.'],
        intern: ['Dạ, để em thử ạ!'],
      },
      {
        kind: 'task',
        id: 'type',
        title: 'Task 1: Chọn kiểu chữ cho tiêu đề poster',
        options: [
          { id: 'A', render: { type: 'headline', font: 'display' }, verdict: 'Chữ dày, bo tròn', notes: ['Nét chữ dày, tròn trịa → trẻ trung, năng động.', 'Đọc rõ cả khi nhìn từ xa → hợp nhóm khách 12 - 25 tuổi.'] },
          { id: 'B', render: { type: 'headline', font: 'serif' }, verdict: 'Chữ mảnh, kiểu cách', notes: ['Nét mảnh, nghiêng → sang trọng nhưng hơi "già".', 'Khó đọc khi poster in nhỏ hoặc nhìn từ xa.'] },
        ],
        correct: 'A',
        skill: 'truc-quan',
        sub: 'Kiểu Chữ',
        hint: 'Thử tưởng tượng poster dán ở cổng trường: chữ nào em đọc được ngay khi đi ngang qua?',
      },
      { kind: 'review', task: 'type' },
      { kind: 'talk', manager: ['Kiểu chữ là thứ người xem "nghe" thấy đầu tiên, trước cả khi đọc nội dung. Em làm tốt lắm!'], intern: ['Dạ em cảm ơn chị ạ!'] },
    ],
  },
  {
    n: 2,
    name: 'Màu Sắc',
    steps: [
      { kind: 'talk', manager: ['Tiếp theo mình chọn màu nền nè. Chữ tiêu đề màu nâu, em xem nền nào giúp chữ nổi bật nhất nhé.'], intern: ['Dạ, em xem liền ạ.'] },
      {
        kind: 'task',
        id: 'color',
        title: 'Task 1: Chọn ra nền màu phù hợp với chữ màu nâu dưới đây',
        reference: 'brown',
        options: [
          { id: 'A', render: { type: 'swatch', bg: '#F1DDBA' }, verdict: 'Độ tương phản cao', notes: ['Chữ nâu nổi bật trên nền sáng → dễ đọc, thu hút mắt người xem ngay lập tức.'] },
          { id: 'B', render: { type: 'swatch', bg: '#320415' }, verdict: 'Độ tương phản thấp', notes: ['Chữ nâu trên nền nâu đậm → bị chìm, khó đọc, đặc biệt từ xa.'] },
        ],
        correct: 'A',
        skill: 'tham-my',
        sub: 'Phối Màu',
        hint: 'Chữ dễ đọc khi màu chữ và màu nền chênh nhau nhiều về độ sáng.',
      },
      { kind: 'review', task: 'color' },
      { kind: 'talk', manager: ['Đúng rồi, độ tương phản là chìa khóa để chữ "sống" trên nền.'], intern: ['Dạ, em ghi nhớ rồi ạ!'] },
    ],
  },
  {
    n: 3,
    name: 'Hệ Thống Lưới',
    steps: [
      { kind: 'talk', manager: ['Trước khi sắp xếp, designer thường dựng lưới để các thành phần thẳng hàng. Em thử nhìn hai phương án này nha.'], intern: ['Dạ chị!'] },
      {
        kind: 'task',
        id: 'grid',
        title: 'Task 1: Phương án nào đang dùng lưới hợp lý?',
        options: [
          { id: 'A', render: { type: 'grid', aligned: true }, verdict: 'Bám theo lưới 3 cột', notes: ['Các khối thẳng hàng theo cột → gọn gàng, mắt đọc theo một nhịp.', 'Khoảng cách đều → bố cục chuyên nghiệp.'] },
          { id: 'B', render: { type: 'grid', aligned: false }, verdict: 'Đặt tự do', notes: ['Các khối lệch nhau, khoảng cách lộn xộn → nhìn rối.', 'Người xem khó biết nên đọc từ đâu.'] },
        ],
        correct: 'A',
        skill: 'bo-cuc',
        sub: 'Hệ Thống Lưới',
        hint: 'Nhìn các mép trái của từng khối: phương án nào chúng nằm trên cùng một đường?',
      },
      { kind: 'review', task: 'grid' },
      { kind: 'talk', manager: ['Có lưới rồi thì bước sắp xếp bố cục sẽ nhẹ hơn nhiều đó.'], intern: ['Dạ, em hiểu rồi ạ.'] },
    ],
  },
  {
    n: 4,
    name: 'Thiết Kế Bố Cục',
    steps: [
      { kind: 'talk', manager: ['Giờ mình đặt hình sản phẩm vào poster nè. Nhớ yêu cầu: nổi bật hình ảnh sản phẩm.'], intern: ['Dạ, em làm hai phương án để chị xem ạ.'] },
      {
        kind: 'task',
        id: 'layout',
        title: 'Task 1: Bạn chọn bố cục nào dưới đây?',
        options: [
          { id: 'A', render: { type: 'image', src: 'poster-a' }, verdict: 'Hình A', notes: ['Hình ảnh sản phẩm to, rõ ràng → thu hút ngay từ cái nhìn đầu tiên.', 'Bố cục tập trung → người xem nhanh chóng nhận biết đây là poster quảng cáo sữa hạt Vinamilk.'] },
          { id: 'B', render: { type: 'image', src: 'poster-b' }, verdict: 'Hình B', notes: ['Hình sản phẩm quá nhỏ → không nổi bật, dễ bị chìm so với các hạt xung quanh.', 'Poster thiếu điểm nhấn → nhìn loãng, không tập trung.'] },
        ],
        correct: 'A',
        skill: 'bo-cuc',
        sub: 'Phân Cấp Thị Giác',
        hint: 'Brief yêu cầu nổi bật sản phẩm. Ở phương án nào hộp sữa là thứ em thấy đầu tiên?',
      },
      { kind: 'review', task: 'layout' },
      { kind: 'talk', manager: ['Chuẩn luôn! Sản phẩm là nhân vật chính, các hạt chỉ là diễn viên phụ thôi.'], intern: ['Hihi, dạ em hiểu rồi ạ!'] },
    ],
  },
  {
    n: 5,
    name: 'Thiết Kế Logo',
    steps: [
      { kind: 'talk', manager: ['Góc poster cần một logo nhỏ cho dòng sữa hạt. Logo sẽ được in ở nhiều kích thước khác nhau đó.'], intern: ['Dạ, em có hai phương án ạ.'] },
      {
        kind: 'task',
        id: 'logo',
        title: 'Task 1: Chọn logo phù hợp để đặt ở góc poster',
        options: [
          { id: 'A', render: { type: 'logo', variant: 'simple' }, verdict: 'Logo tối giản', notes: ['Hình khối đơn giản, ít màu → nhận ra ngay cả khi in rất nhỏ.', 'Dễ dùng lại trên bao bì, mạng xã hội.'] },
          { id: 'B', render: { type: 'logo', variant: 'busy' }, verdict: 'Logo nhiều chi tiết', notes: ['Quá nhiều chi tiết, chữ nhỏ → nhòe khi thu nhỏ.', 'Khó in ấn và khó nhớ.'] },
        ],
        correct: 'A',
        skill: 'sang-tao',
        sub: 'Nhận Diện Thương Hiệu',
        hint: 'Thử nheo mắt nhìn hai logo: cái nào vẫn còn nhận ra được?',
      },
      { kind: 'review', task: 'logo' },
      { kind: 'talk', manager: ['Logo càng đơn giản thì càng dễ nhớ. Sắp xong rồi đó Kiên!'], intern: ['Dạ, em cố gắng ạ!'] },
    ],
  },
  {
    n: 6,
    name: 'Thiết Kế Poster',
    steps: [
      { kind: 'talk', manager: ['Bước cuối: chọn dòng thông điệp phụ dưới tiêu đề, rồi ghép tất cả thành poster hoàn chỉnh nhé.'], intern: ['Dạ, em làm liền ạ!'] },
      {
        kind: 'task',
        id: 'tagline',
        title: 'Task 1: Chọn dòng thông điệp phụ cho poster',
        options: [
          { id: 'A', render: { type: 'tagline', text: 'Dinh dưỡng từ thiên nhiên' }, verdict: 'Ngắn gọn, đúng sản phẩm', notes: ['4 chữ, nói đúng điểm mạnh của sữa hạt.', 'Đọc lướt vẫn hiểu → hợp poster.'] },
          { id: 'B', render: { type: 'tagline', text: 'Sản phẩm số 1!!! Mua ngay hôm nay để nhận ưu đãi cực sốc' }, verdict: 'Dài và phô trương', notes: ['Quá dài, nhiều dấu chấm than → nhìn rối.', 'Lời hứa "số 1" khó chứng minh, dễ mất lòng tin.'] },
        ],
        correct: 'A',
        skill: 'sang-tao',
        sub: 'Viết Thông Điệp',
        hint: 'Một dòng phụ tốt có thể đọc xong trong một nhịp thở.',
      },
      { kind: 'review', task: 'tagline' },
      { kind: 'final', intern: ['Yayyy!!!', 'Mình đã làm xong được 1 Poster về sản phẩm Sữa rồi!!!', 'Cùng khoe với chị Quản lý thôi.'] },
      { kind: 'talk', manager: ['Wow!!!', 'Bài thiết kế này thật sự rất tốt, đạt được kì vọng của chị.'], intern: ['Dạ em cảm ơn chị.', 'Em sẽ cố gắng làm tốt hơn nữa!'] },
    ],
  },
]

export const TASKS: Record<string, Task & { level: number }> = Object.fromEntries(
  LEVELS.flatMap((l) => l.steps.filter((s): s is Task => s.kind === 'task').map((t) => [t.id, { ...t, level: l.n }])),
)
