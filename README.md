# Chộp Chếc

Web app định hướng và trải nghiệm nghề nghiệp (Designathon 2025 · Team 15): làm trắc nghiệm, nhận gợi ý chuyên ngành, rồi vào vai thực tập sinh Thiết kế đồ họa và hoàn thành 6 cấp độ với chị Quản lý.

Thiết kế gốc: [Figma](https://www.figma.com/design/HZe4KO7SOwk8R4crJ5GWdI/-Designathon-2025--Team-15--Copy-?node-id=13-8)

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173/Job-checke/
npm run build    # xuất ra dist/
```

Deploy: workflow `.github/workflows/deploy.yml` build và đưa lên GitHub Pages mỗi lần push vào `main` (lần đầu bật **Settings → Pages → Source: GitHub Actions**). Trang sẽ ở `https://<user>.github.io/Job-checke/`.

## Luồng đã có

| Màn | Đường dẫn | Có gì |
|---|---|---|
| Màn chào | `#/` | Logo, mascot nhìn theo con trỏ, tự chuyển sau 2,6 giây |
| Đăng nhập | `#/login` | Kiểm tra email/mật khẩu, ghi nhớ đăng nhập (bản thử: email bất kỳ, mật khẩu ≥ 6 ký tự) |
| Cánh cổng | `#/welcome` | Icon bay lơ lửng, cửa mở khi bấm "Được rồi đi thôi" |
| Trắc nghiệm | `#/quiz` | 6 câu (RIASEC), thang 5 mức, sticker đổi theo câu, phím 1–5 |
| Phân tích | `#/analyzing` | Mascot suy nghĩ, tự chuyển |
| Kết quả | `#/result` | Nhãn tính cách, ngành theo thế mạnh / sở thích (ngành chưa có nội dung báo "sắp ra mắt") |
| Chọn nhánh | `#/major/thiet-ke` | 5 nhánh, nhánh Thiết kế đồ họa chơi được |
| Lộ trình | `#/journey` | 6 cấp độ mở khóa lần lượt, nút Phân tích kết quả |
| Trải nghiệm nghề | `#/journey/1` … `/6` | Hội thoại, task A/B, nhận xét của chị Quản lý, sản phẩm cuối, trợ lý Chộp (bấm mascot góc trái), phím ← → A B |
| Báo cáo | `#/report` | Vòng điểm mạnh / cần cải thiện tính từ câu trả lời, gợi ý chơi lại |
| Phần thưởng | `#/reward` | Voucher CHOPCHEC10, bấm để sao chép |
| Trang chủ | `#/home` | Tóm tắt tính cách, tiến độ, kỹ năng nổi bật, voucher, danh sách cấp độ |

Dữ liệu (tài khoản, câu trả lời, tiến độ, voucher) lưu trong `localStorage` của trình duyệt, khóa `chopchec:v1`. "Đăng xuất" xoá toàn bộ.

## Cấu trúc

```
src/
  App.tsx              routes (HashRouter) + chặn khi chưa đăng nhập / chưa làm quiz
  components/          Canvas (khung 1920×1080 tự co giãn), Mascot, Assistant, Visuals (poster/lưới/logo vẽ bằng code), ui
  pages/               Onboarding, Quiz, Result, Roadmap, Trial, Report, Home
  data/                quiz.ts, majors.ts, levels.ts (nội dung 6 cấp độ)
  lib/                 store.ts (state + localStorage), report.ts (tính điểm)
public/img/            minh họa (cắt từ video prototype), logo.svg
```

Thêm cấp độ hoặc sửa hội thoại: chỉnh `src/data/levels.ts`. Thêm ngành: `src/data/majors.ts`.

## Ghi chú

- Minh họa (văn phòng, nhân vật, cô gái, icon, poster) được cắt từ video prototype vì không tải được ảnh export từ Figma. Nên thay bằng file export gốc (PNG/SVG @2x) khi có, giữ nguyên tên trong `public/img/`.
- Font tiêu đề: **iCiel Panton Black** (như Figma). Đặt file font vào `public/fonts/` với một trong các tên `iCielPanton-Black.woff2` (khuyên dùng), `iCielPanton-Black.otf` hoặc `iCielPanton-Black.ttf`. Khi chưa có file, trang dùng bản Panton cài trên máy người xem, nếu không có thì dùng Montserrat Black. iCiel Panton là font thương mại: cần giấy phép webfont trước khi đưa lên mạng.
- Nhãn tính cách (INFJ-T…) là nhãn minh họa theo nhóm sở thích mạnh nhất, không phải bài test MBTI đầy đủ.
- Chưa làm: dashboard đầy đủ (thống kê, so sánh tính cách), trang cơ sở đào tạo, các ngành ngoài Thiết kế.
