import type { Tx } from '../lib/i18n'

// The Graphic Design work trial: six levels on one brief (a poster for a new
// nut-milk product). Dialogue for level 1, the colour task, the layout task and
// the final poster follows the Figma frames Work Trial 1 – 8.

const x = (vi: string, en: string): Tx => ({ vi, en })

export type Skill = 'sang-tao' | 'tham-my' | 'truc-quan' | 'bo-cuc'
export const SKILLS: Record<Skill, Tx> = {
  'sang-tao': x('Sáng Tạo', 'Creativity'),
  'tham-my': x('Có Mắt Thẩm Mỹ', 'Aesthetic Eye'),
  'truc-quan': x('Tư Duy Trực Quan', 'Visual Thinking'),
  'bo-cuc': x('Tư Duy Bố Cục', 'Layout Thinking'),
}

export type Render =
  | { type: 'swatch'; bg: string }
  | { type: 'image'; src: string }
  | { type: 'headline'; font: 'display' | 'serif' }
  | { type: 'grid'; aligned: boolean }
  | { type: 'logo'; variant: 'simple' | 'busy' }
  | { type: 'tagline'; text: Tx }

export type Option = { id: 'A' | 'B'; render: Render; verdict: Tx; notes: Tx[] }

export type Task = {
  kind: 'task'
  id: string
  title: Tx
  /** what the options are compared against (the brown title colour) */
  reference?: 'brown'
  options: [Option, Option]
  correct: 'A' | 'B'
  skill: Skill
  sub: Tx
  hint: Tx
}

export type Step =
  | { kind: 'talk'; manager?: Tx[]; intern?: Tx[]; tags?: boolean; prop?: 'carton' }
  | Task
  | { kind: 'review'; task: string }
  | { kind: 'final'; intern: Tx[] }

export type Level = { n: number; name: Tx; steps: Step[] }

const BRIEF = x(
  'Tuyệt. Hôm nay em sẽ tham gia vào dự án thiết kế poster quảng cáo sản phẩm sữa hạt mới của Vinamilk với màu chủ đạo là màu nâu, nổi bật hình ảnh sản phẩm, thu hút khách hàng từ 12 - 25 tuổi.',
  "Great. Today you'll join the project designing an ad poster for Vinamilk's new nut milk: brown as the main colour, the product front and centre, and appealing to customers aged 12 – 25.",
)

export const LEVELS: Level[] = [
  {
    n: 1,
    name: x('Thiết Kế Kiểu Chữ', 'Typography'),
    steps: [
      {
        kind: 'talk',
        tags: true,
        manager: [
          x(
            'Chào Kiên, chị là quản lý Thiết kế đồ họa tại Công ty Hub. Chị được thông tin hôm nay là ngày đầu đi làm của em. Chị muốn giới thiệu về công việc và dự án mà em sẽ tham gia.',
            "Hi Kiên, I'm the Graphic Design Manager here at Hub. I hear today is your first day, so let me walk you through the work and the project you'll be joining.",
          ),
        ],
        intern: [x('Dạ, em rất vui được gặp chị. Mong chị giúp đỡ em trong công việc.', "Nice to meet you! I'm looking forward to learning from you.")],
      },
      { kind: 'talk', prop: 'carton', manager: [BRIEF], intern: [x('Vâng, em sẽ bắt tay làm ngay ạ.', "Got it, I'll get started right away.")] },
      {
        kind: 'talk',
        manager: [
          x(
            'Việc đầu tiên là chọn kiểu chữ cho tiêu đề. Kiểu chữ là "giọng nói" của poster, mà khách hàng của mình còn rất trẻ đó nha.',
            'First up: pick a typeface for the headline. Type is the "voice" of a poster, and remember, our audience is really young.',
          ),
        ],
        intern: [x('Dạ, để em thử ạ!', 'Okay, let me give it a try!')],
      },
      {
        kind: 'task',
        id: 'type',
        title: x('Task 1: Chọn kiểu chữ cho tiêu đề poster', 'Task 1: Choose a typeface for the poster headline'),
        options: [
          {
            id: 'A',
            render: { type: 'headline', font: 'display' },
            verdict: x('Chữ dày, bo tròn', 'Bold, rounded type'),
            notes: [
              x('Nét chữ dày, tròn trịa → trẻ trung, năng động.', 'Thick, rounded strokes → youthful and energetic.'),
              x('Đọc rõ cả khi nhìn từ xa → hợp nhóm khách 12 - 25 tuổi.', 'Easy to read even from afar → a great fit for 12 – 25 year olds.'),
            ],
          },
          {
            id: 'B',
            render: { type: 'headline', font: 'serif' },
            verdict: x('Chữ mảnh, kiểu cách', 'Thin, fancy type'),
            notes: [
              x('Nét mảnh, nghiêng → sang trọng nhưng hơi "già".', 'Thin, slanted strokes → elegant but a bit "grown-up".'),
              x('Khó đọc khi poster in nhỏ hoặc nhìn từ xa.', 'Hard to read when printed small or seen from a distance.'),
            ],
          },
        ],
        correct: 'A',
        skill: 'truc-quan',
        sub: x('Kiểu Chữ', 'Typography'),
        hint: x(
          'Thử tưởng tượng poster dán ở cổng trường: chữ nào em đọc được ngay khi đi ngang qua?',
          'Picture the poster on a school gate: which headline can you read while just walking past?',
        ),
      },
      { kind: 'review', task: 'type' },
      {
        kind: 'talk',
        manager: [x('Kiểu chữ là thứ người xem "nghe" thấy đầu tiên, trước cả khi đọc nội dung. Em làm tốt lắm!', 'Type is what people "hear" first, even before they read a word. Nicely done!')],
        intern: [x('Dạ em cảm ơn chị ạ!', 'Thank you so much!')],
      },
    ],
  },
  {
    n: 2,
    name: x('Màu Sắc', 'Colour'),
    steps: [
      {
        kind: 'talk',
        manager: [x('Tiếp theo mình chọn màu nền nè. Chữ tiêu đề màu nâu, em xem nền nào giúp chữ nổi bật nhất nhé.', "Next, let's pick a background. The headline is brown, so see which background makes it pop the most.")],
        intern: [x('Dạ, em xem liền ạ.', "On it, I'll take a look.")],
      },
      {
        kind: 'task',
        id: 'color',
        title: x('Task 1: Chọn ra nền màu phù hợp với chữ màu nâu dưới đây', 'Task 1: Pick the background that works best with the brown text below'),
        reference: 'brown',
        options: [
          {
            id: 'A',
            render: { type: 'swatch', bg: '#F1DDBA' },
            verdict: x('Độ tương phản cao', 'High contrast'),
            notes: [x('Chữ nâu nổi bật trên nền sáng → dễ đọc, thu hút mắt người xem ngay lập tức.', 'Brown text stands out on a light background → easy to read and instantly eye-catching.')],
          },
          {
            id: 'B',
            render: { type: 'swatch', bg: '#320415' },
            verdict: x('Độ tương phản thấp', 'Low contrast'),
            notes: [x('Chữ nâu trên nền nâu đậm → bị chìm, khó đọc, đặc biệt từ xa.', 'Brown text on dark brown → it sinks in and is hard to read, especially from afar.')],
          },
        ],
        correct: 'A',
        skill: 'tham-my',
        sub: x('Phối Màu', 'Colour Pairing'),
        hint: x('Chữ dễ đọc khi màu chữ và màu nền chênh nhau nhiều về độ sáng.', 'Text is easiest to read when it is much lighter or darker than its background.'),
      },
      { kind: 'review', task: 'color' },
      {
        kind: 'talk',
        manager: [x('Đúng rồi, độ tương phản là chìa khóa để chữ "sống" trên nền.', 'Exactly. Contrast is what makes text come alive on a background.')],
        intern: [x('Dạ, em ghi nhớ rồi ạ!', "Noted, I'll remember that!")],
      },
    ],
  },
  {
    n: 3,
    name: x('Hệ Thống Lưới', 'Grid System'),
    steps: [
      {
        kind: 'talk',
        manager: [
          x(
            'Trước khi sắp xếp, designer thường dựng lưới để các thành phần thẳng hàng. Em thử nhìn hai phương án này nha.',
            'Before arranging anything, designers usually set up a grid so everything lines up. Take a look at these two options.',
          ),
        ],
        intern: [x('Dạ chị!', 'Sure thing!')],
      },
      {
        kind: 'task',
        id: 'grid',
        title: x('Task 1: Phương án nào đang dùng lưới hợp lý?', 'Task 1: Which option uses a proper grid?'),
        options: [
          {
            id: 'A',
            render: { type: 'grid', aligned: true },
            verdict: x('Bám theo lưới 3 cột', 'Follows a 3-column grid'),
            notes: [
              x('Các khối thẳng hàng theo cột → gọn gàng, mắt đọc theo một nhịp.', 'Blocks line up in columns → tidy, and the eye moves at a steady rhythm.'),
              x('Khoảng cách đều → bố cục chuyên nghiệp.', 'Even spacing → a professional-looking layout.'),
            ],
          },
          {
            id: 'B',
            render: { type: 'grid', aligned: false },
            verdict: x('Đặt tự do', 'Placed freely'),
            notes: [
              x('Các khối lệch nhau, khoảng cách lộn xộn → nhìn rối.', 'Blocks are misaligned with messy gaps → it looks cluttered.'),
              x('Người xem khó biết nên đọc từ đâu.', "Viewers can't tell where to start reading."),
            ],
          },
        ],
        correct: 'A',
        skill: 'bo-cuc',
        sub: x('Hệ Thống Lưới', 'Grid System'),
        hint: x('Nhìn các mép trái của từng khối: phương án nào chúng nằm trên cùng một đường?', 'Look at the left edge of each block: in which option do they sit on the same line?'),
      },
      { kind: 'review', task: 'grid' },
      {
        kind: 'talk',
        manager: [x('Có lưới rồi thì bước sắp xếp bố cục sẽ nhẹ hơn nhiều đó.', 'With a grid in place, laying things out gets so much easier.')],
        intern: [x('Dạ, em hiểu rồi ạ.', 'Got it, that makes sense.')],
      },
    ],
  },
  {
    n: 4,
    name: x('Thiết Kế Bố Cục', 'Layout Design'),
    steps: [
      {
        kind: 'talk',
        manager: [x('Giờ mình đặt hình sản phẩm vào poster nè. Nhớ yêu cầu: nổi bật hình ảnh sản phẩm.', "Now let's place the product on the poster. Remember the brief: the product has to stand out.")],
        intern: [x('Dạ, em làm hai phương án để chị xem ạ.', "I've made two versions for you to look at.")],
      },
      {
        kind: 'task',
        id: 'layout',
        title: x('Task 1: Bạn chọn bố cục nào dưới đây?', 'Task 1: Which layout would you choose?'),
        options: [
          {
            id: 'A',
            render: { type: 'image', src: 'poster-a' },
            verdict: x('Hình A', 'Image A'),
            notes: [
              x('Hình ảnh sản phẩm to, rõ ràng → thu hút ngay từ cái nhìn đầu tiên.', 'Big, clear product shot → it grabs attention at first glance.'),
              x('Bố cục tập trung → người xem nhanh chóng nhận biết đây là poster quảng cáo sữa hạt Vinamilk.', "Focused layout → viewers instantly see it's an ad for Vinamilk nut milk."),
            ],
          },
          {
            id: 'B',
            render: { type: 'image', src: 'poster-b' },
            verdict: x('Hình B', 'Image B'),
            notes: [
              x('Hình sản phẩm quá nhỏ → không nổi bật, dễ bị chìm so với các hạt xung quanh.', 'The product is too small → it gets lost among the nuts around it.'),
              x('Poster thiếu điểm nhấn → nhìn loãng, không tập trung.', 'No clear focal point → the poster feels scattered.'),
            ],
          },
        ],
        correct: 'A',
        skill: 'bo-cuc',
        sub: x('Phân Cấp Thị Giác', 'Visual Hierarchy'),
        hint: x('Brief yêu cầu nổi bật sản phẩm. Ở phương án nào hộp sữa là thứ em thấy đầu tiên?', 'The brief asks for the product to stand out. In which option is the carton the first thing you notice?'),
      },
      { kind: 'review', task: 'layout' },
      {
        kind: 'talk',
        manager: [x('Chuẩn luôn! Sản phẩm là nhân vật chính, các hạt chỉ là diễn viên phụ thôi.', 'Spot on! The product is the star; the nuts are just the supporting cast.')],
        intern: [x('Hihi, dạ em hiểu rồi ạ!', 'Hehe, got it!')],
      },
    ],
  },
  {
    n: 5,
    name: x('Thiết Kế Logo', 'Logo Design'),
    steps: [
      {
        kind: 'talk',
        manager: [x('Góc poster cần một logo nhỏ cho dòng sữa hạt. Logo sẽ được in ở nhiều kích thước khác nhau đó.', 'The poster needs a small logo for the nut-milk line in the corner. Keep in mind it will be printed at lots of different sizes.')],
        intern: [x('Dạ, em có hai phương án ạ.', 'I have two options.')],
      },
      {
        kind: 'task',
        id: 'logo',
        title: x('Task 1: Chọn logo phù hợp để đặt ở góc poster', 'Task 1: Pick the right logo for the corner of the poster'),
        options: [
          {
            id: 'A',
            render: { type: 'logo', variant: 'simple' },
            verdict: x('Logo tối giản', 'Minimal logo'),
            notes: [
              x('Hình khối đơn giản, ít màu → nhận ra ngay cả khi in rất nhỏ.', 'Simple shapes, few colours → recognisable even when printed tiny.'),
              x('Dễ dùng lại trên bao bì, mạng xã hội.', 'Easy to reuse on packaging and social media.'),
            ],
          },
          {
            id: 'B',
            render: { type: 'logo', variant: 'busy' },
            verdict: x('Logo nhiều chi tiết', 'Detailed logo'),
            notes: [
              x('Quá nhiều chi tiết, chữ nhỏ → nhòe khi thu nhỏ.', 'Too much detail and tiny text → turns to mush when scaled down.'),
              x('Khó in ấn và khó nhớ.', 'Hard to print and hard to remember.'),
            ],
          },
        ],
        correct: 'A',
        skill: 'sang-tao',
        sub: x('Nhận Diện Thương Hiệu', 'Brand Identity'),
        hint: x('Thử nheo mắt nhìn hai logo: cái nào vẫn còn nhận ra được?', 'Squint at both logos: which one can you still recognise?'),
      },
      { kind: 'review', task: 'logo' },
      {
        kind: 'talk',
        manager: [x('Logo càng đơn giản thì càng dễ nhớ. Sắp xong rồi đó Kiên!', "The simpler the logo, the easier it is to remember. You're almost there, Kiên!")],
        intern: [x('Dạ, em cố gắng ạ!', "I'll keep it up!")],
      },
    ],
  },
  {
    n: 6,
    name: x('Thiết Kế Poster', 'Poster Design'),
    steps: [
      {
        kind: 'talk',
        manager: [x('Bước cuối: chọn dòng thông điệp phụ dưới tiêu đề, rồi ghép tất cả thành poster hoàn chỉnh nhé.', "Last step: choose the tagline under the headline, then put everything together into the finished poster.")],
        intern: [x('Dạ, em làm liền ạ!', 'On it!')],
      },
      {
        kind: 'task',
        id: 'tagline',
        title: x('Task 1: Chọn dòng thông điệp phụ cho poster', 'Task 1: Choose the tagline for the poster'),
        options: [
          {
            id: 'A',
            render: { type: 'tagline', text: x('Dinh dưỡng từ thiên nhiên', 'Nourishment from nature') },
            verdict: x('Ngắn gọn, đúng sản phẩm', 'Short and on-point'),
            notes: [
              x('4 chữ, nói đúng điểm mạnh của sữa hạt.', 'A few words that nail what makes nut milk great.'),
              x('Đọc lướt vẫn hiểu → hợp poster.', 'You get it at a glance → perfect for a poster.'),
            ],
          },
          {
            id: 'B',
            render: { type: 'tagline', text: x('Sản phẩm số 1!!! Mua ngay hôm nay để nhận ưu đãi cực sốc', 'The No.1 product!!! Buy today for a crazy deal') },
            verdict: x('Dài và phô trương', 'Long and over the top'),
            notes: [
              x('Quá dài, nhiều dấu chấm than → nhìn rối.', 'Too long, too many exclamation marks → it looks cluttered.'),
              x('Lời hứa "số 1" khó chứng minh, dễ mất lòng tin.', 'A "No.1" claim is hard to back up and can cost trust.'),
            ],
          },
        ],
        correct: 'A',
        skill: 'sang-tao',
        sub: x('Viết Thông Điệp', 'Copywriting'),
        hint: x('Một dòng phụ tốt có thể đọc xong trong một nhịp thở.', 'A good tagline can be read in a single breath.'),
      },
      { kind: 'review', task: 'tagline' },
      {
        kind: 'final',
        intern: [
          x('Yayyy!!!', 'Yayyy!!!'),
          x('Mình đã làm xong được 1 Poster về sản phẩm Sữa rồi!!!', "I've finished a whole poster for the milk product!!!"),
          x('Cùng khoe với chị Quản lý thôi.', "Let's go show it to the manager."),
        ],
      },
      {
        kind: 'talk',
        manager: [x('Wow!!!', 'Wow!!!'), x('Bài thiết kế này thật sự rất tốt, đạt được kì vọng của chị.', 'This design is really great. It totally meets my expectations.')],
        intern: [x('Dạ em cảm ơn chị.', 'Thank you so much!'), x('Em sẽ cố gắng làm tốt hơn nữa!', "I'll keep working to do even better!")],
      },
    ],
  },
]

export const TASKS: Record<string, Task & { level: number }> = Object.fromEntries(
  LEVELS.flatMap((l) => l.steps.filter((s): s is Task => s.kind === 'task').map((t) => [t.id, { ...t, level: l.n }])),
)
