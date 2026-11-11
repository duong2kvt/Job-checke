// Screen graph for the Chộp Chếc prototype.
// Coordinates are in the 1920×1080 Figma frame space; the stills are cropped
// to 1920×1032 (the recording's letterbox removed), so y is shifted by Y0.

export const W = 1920
export const H = 1032
export const Y0 = 24

export type Hot = { r: [number, number, number, number]; to: string; label?: string }
export type Screen = {
  id: string
  title: string
  group: 'Onboarding' | 'Trắc nghiệm' | 'Trải nghiệm nghề' | 'Kết quả' | 'Dashboard'
  img?: string
  coded?: 'quiz' | 'thinking'
  hots: Hot[]
  /** wheel / swipe down goes here (a scrolled state of the same page) */
  down?: string
  up?: string
  auto?: { to: string; ms: number }
  any?: string // click anywhere
}

const trialNav = (prev: string, next: string): Hot[] => [
  { r: [1690, 925, 1745, 990], to: prev, label: 'Trước' },
  { r: [1770, 925, 1825, 990], to: next, label: 'Tiếp' },
  { r: [1758, 50, 1814, 104], to: 'roadmap', label: 'Đóng' },
]

const dashNav: Hot[] = [
  { r: [24, 400, 292, 442], to: 'dash-home', label: 'Tổng quan' },
  { r: [24, 458, 292, 500], to: 'dash-personality', label: 'Khám phá tính cách' },
  { r: [24, 516, 292, 558], to: 'dash-games', label: 'Game mô phỏng nghề' },
  { r: [24, 572, 292, 614], to: 'dash-centers', label: 'Cơ sở đào tạo' },
]

const raw: Screen[] = [
  { id: 'splash', title: 'Màn chào', group: 'Onboarding', img: 'splash', hots: [], any: 'login', auto: { to: 'login', ms: 2600 } },
  {
    id: 'login', title: 'Đăng nhập', group: 'Onboarding', img: 'login',
    hots: [
      { r: [780, 496, 1140, 546], to: 'login-filled', label: 'Email' },
      { r: [780, 594, 1140, 644], to: 'login-filled', label: 'Mật khẩu' },
      { r: [780, 714, 1140, 764], to: 'login-filled', label: 'Đăng nhập' },
    ],
  },
  { id: 'login-filled', title: 'Đăng nhập (đã điền)', group: 'Onboarding', img: 'login-filled', hots: [{ r: [780, 714, 1140, 764], to: 'welcome', label: 'Đăng nhập' }] },
  { id: 'welcome', title: 'Cánh cổng định hướng', group: 'Onboarding', img: 'welcome', hots: [{ r: [776, 744, 1140, 812], to: 'quiz', label: 'Được rồi đi thôi' }] },

  { id: 'quiz', title: 'Trắc nghiệm 6 câu', group: 'Trắc nghiệm', coded: 'quiz', hots: [] },
  { id: 'thinking', title: 'AI đang phân tích', group: 'Trắc nghiệm', coded: 'thinking', hots: [], auto: { to: 'mbti', ms: 2800 }, any: 'mbti' },
  {
    id: 'mbti', title: 'Kết quả INFJ-T', group: 'Trắc nghiệm', img: 'mbti',
    hots: [
      { r: [972, 600, 1156, 654], to: 'branch', label: 'Kĩ thuật' },
      { r: [1192, 600, 1382, 654], to: 'branch', label: 'Tài chính' },
      { r: [974, 804, 1162, 862], to: 'branch', label: 'Thiết kế' },
      { r: [1190, 804, 1382, 862], to: 'branch', label: 'Kiến trúc' },
      { r: [1408, 804, 1602, 862], to: 'branch', label: 'Sáng tạo nội dung' },
    ],
  },
  {
    id: 'branch', title: 'Chọn nhánh thiết kế', group: 'Trắc nghiệm', img: 'branch',
    hots: [
      { r: [972, 508, 1196, 562], to: 'branch-picked', label: 'Thiết kế đồ họa' },
      { r: [1226, 508, 1446, 562], to: 'branch-picked', label: 'Thiết kế UI/UX' },
      { r: [1476, 508, 1672, 562], to: 'branch-picked', label: 'Thiết kế 3D' },
      { r: [972, 592, 1190, 648], to: 'branch-picked', label: 'Thiết kế Game' },
      { r: [1220, 592, 1486, 648], to: 'branch-picked', label: 'Đồ họa chuyển động' },
    ],
  },
  { id: 'branch-picked', title: 'Chọn nhánh (đã chọn)', group: 'Trắc nghiệm', img: 'branch-picked', hots: [{ r: [1300, 796, 1534, 864], to: 'roadmap', label: 'Tiếp theo' }] },

  {
    id: 'roadmap', title: 'Lộ trình Thiết kế đồ họa', group: 'Trải nghiệm nghề', img: 'roadmap',
    hots: [
      { r: [366, 696, 466, 792], to: 'trial-1', label: 'Cấp 1 · Thiết kế kiểu chữ' },
      { r: [60, 906, 170, 944], to: 'branch-picked', label: 'Trở về' },
    ],
  },
  { id: 'trial-1', title: 'Gặp chị quản lý', group: 'Trải nghiệm nghề', img: 'trial-1', hots: trialNav('roadmap', 'trial-2'), any: 'trial-2' },
  { id: 'trial-2', title: 'Brief dự án poster', group: 'Trải nghiệm nghề', img: 'trial-2', hots: trialNav('trial-1', 'trial-3'), any: 'trial-3' },
  {
    id: 'trial-3', title: 'Task: chọn màu nền', group: 'Trải nghiệm nghề', img: 'trial-3',
    hots: [
      { r: [330, 500, 604, 884], to: 'trial-4', label: 'Phương án A' },
      { r: [690, 500, 964, 884], to: 'trial-4', label: 'Phương án B' },
      ...trialNav('trial-2', 'trial-4').slice(0, 1),
      { r: [1758, 50, 1814, 104], to: 'roadmap', label: 'Đóng' },
    ],
  },
  { id: 'trial-4', title: 'Nhận xét A / B', group: 'Trải nghiệm nghề', img: 'trial-4', hots: trialNav('trial-3', 'trial-5'), any: 'trial-5' },
  { id: 'trial-5', title: 'Sản phẩm cuối cùng', group: 'Trải nghiệm nghề', img: 'trial-5', hots: trialNav('trial-4', 'trial-6'), any: 'trial-6' },
  { id: 'trial-6', title: 'Lời khen', group: 'Trải nghiệm nghề', img: 'trial-6', hots: trialNav('trial-5', 'roadmap-done'), any: 'roadmap-done' },
  {
    id: 'roadmap-done', title: 'Hoàn thành lộ trình', group: 'Trải nghiệm nghề', img: 'roadmap-done',
    hots: [
      { r: [1506, 228, 1720, 278], to: 'report', label: 'Phân tích kết quả' },
      { r: [366, 696, 466, 792], to: 'trial-1', label: 'Chơi lại cấp 1' },
    ],
  },

  { id: 'report', title: 'Báo cáo phân tích', group: 'Kết quả', img: 'report', down: 'report-2', hots: [{ r: [1366, 230, 1584, 280], to: 'congrats', label: 'Nhận phần thưởng' }] },
  {
    id: 'report-2', title: 'Báo cáo (cuộn)', group: 'Kết quả', img: 'report-2', up: 'report',
    hots: [
      { r: [840, 892, 1154, 944], to: 'centers', label: 'Cơ sở đào tạo' },
      { r: [60, 898, 170, 942], to: 'roadmap-done', label: 'Trở về' },
    ],
  },
  {
    id: 'congrats', title: 'Chúc mừng + voucher', group: 'Kết quả', img: 'congrats',
    hots: [
      { r: [816, 786, 1100, 844], to: 'centers', label: 'Sử dụng ngay' },
      { r: [880, 862, 1040, 906], to: 'dash-home', label: 'Lưu và quay về' },
    ],
  },
  { id: 'centers', title: 'Trung tâm phù hợp', group: 'Kết quả', img: 'centers', down: 'centers-2', hots: [] },
  { id: 'centers-2', title: 'Trung tâm (cuộn)', group: 'Kết quả', img: 'centers-2', up: 'centers', hots: [{ r: [816, 952, 1100, 1004], to: 'dash-home', label: 'Trở về trang chủ' }] },

  { id: 'dash-home', title: 'Tổng quan', group: 'Dashboard', img: 'dash-home', down: 'dash-home-2', hots: [] },
  { id: 'dash-home-2', title: 'Tổng quan (cuộn)', group: 'Dashboard', img: 'dash-home-2', up: 'dash-home', hots: [] },
  {
    id: 'dash-personality', title: 'Khám phá tính cách', group: 'Dashboard', img: 'dash-personality', down: 'dash-path',
    hots: [
      { r: [1440, 230, 1614, 274], to: 'dash-compare', label: 'So sánh tính cách' },
      { r: [1676, 230, 1894, 274], to: 'quiz', label: 'Kiểm tra tính cách' },
    ],
  },
  { id: 'dash-path', title: 'Con đường sự nghiệp', group: 'Dashboard', img: 'dash-path', up: 'dash-personality', down: 'dash-careers', hots: [{ r: [1440, 230, 1614, 274], to: 'dash-compare', label: 'So sánh tính cách' }] },
  { id: 'dash-careers', title: 'Ngành nghề phù hợp', group: 'Dashboard', img: 'dash-careers', up: 'dash-path', hots: [{ r: [1440, 230, 1614, 274], to: 'dash-compare', label: 'So sánh tính cách' }] },
  { id: 'dash-compare', title: 'So sánh tính cách', group: 'Dashboard', img: 'dash-compare', hots: [{ r: [1712, 230, 1894, 274], to: 'dash-personality', label: 'Hủy so sánh' }] },
  { id: 'dash-games', title: 'Game mô phỏng nghề', group: 'Dashboard', img: 'dash-games', hots: [{ r: [334, 318, 712, 832], to: 'dash-game-roadmap', label: 'Thiết kế đồ họa' }] },
  {
    id: 'dash-game-roadmap', title: 'Game: Thiết kế đồ họa', group: 'Dashboard', img: 'dash-game-roadmap', down: 'dash-game-about',
    hots: [
      { r: [1656, 306, 1878, 358], to: 'dash-report', label: 'Phân tích kết quả' },
      { r: [530, 784, 620, 872], to: 'trial-1', label: 'Chơi cấp 1' },
    ],
  },
  { id: 'dash-game-about', title: 'Thiết kế đồ họa là gì?', group: 'Dashboard', img: 'dash-game-about', up: 'dash-game-roadmap', hots: [] },
  { id: 'dash-report', title: 'Báo cáo game', group: 'Dashboard', img: 'dash-report', down: 'dash-report-2', hots: [{ r: [1452, 234, 1680, 280], to: 'dash-popup', label: 'Nhận phần thưởng' }] },
  {
    id: 'dash-report-2', title: 'Báo cáo game (cuộn)', group: 'Dashboard', img: 'dash-report-2', up: 'dash-report',
    hots: [
      { r: [1456, 234, 1674, 280], to: 'dash-popup', label: 'Nhận phần thưởng' },
      { r: [956, 1006, 1264, 1048], to: 'dash-centers', label: 'Cơ sở đào tạo' },
    ],
  },
  {
    id: 'dash-popup', title: 'Voucher CHOPCHEC2025', group: 'Dashboard', img: 'dash-popup',
    hots: [
      { r: [1176, 710, 1384, 760], to: 'dash-centers', label: 'Sử dụng ngay' },
      { r: [1006, 716, 1172, 754], to: 'dash-report', label: 'Lưu phần thưởng' },
      { r: [1336, 318, 1384, 364], to: 'dash-report', label: 'Đóng' },
    ],
  },
  { id: 'dash-centers', title: 'Trung tâm đào tạo', group: 'Dashboard', img: 'dash-centers', down: 'dash-centers-2', hots: [] },
  { id: 'dash-centers-2', title: 'Trung tâm (cuộn)', group: 'Dashboard', img: 'dash-centers-2', up: 'dash-centers', hots: [] },
]

export const SCREENS: Screen[] = raw.map((s) => (s.id.startsWith('dash-') ? { ...s, hots: [...s.hots, ...dashNav] } : s))
export const byId = Object.fromEntries(SCREENS.map((s) => [s.id, s])) as Record<string, Screen>
export const asset = (name: string) => `${import.meta.env.BASE_URL}screens/${name}.webp`
