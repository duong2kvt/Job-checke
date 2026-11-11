# Chộp Chếc · Prototype web

Prototype web cho **Chộp Chếc** – nền tảng hỗ trợ định hướng và trải nghiệm nghề nghiệp (Designathon 2025 · Team 15).

- Thiết kế gốc: [Figma design](https://www.figma.com/design/HZe4KO7SOwk8R4crJ5GWdI/-Designathon-2025--Team-15--Copy-?node-id=13-8) · [Figma prototype](https://www.figma.com/proto/HZe4KO7SOwk8R4crJ5GWdI/Designathon-2025-Team-15-Copy?node-id=13-8&starting-point-node-id=401%3A414)
- Bản live (sau khi bật GitHub Pages): `https://duong2kvt.github.io/Job-checke/`

## Có gì bên trong

| Trang | Nội dung |
|---|---|
| `/` | Landing + **demo hero tự chạy** (dựng bằng kit [Stageshow](https://github.com/benjitaylor/skills)): con trỏ đi qua 5 nhịp – đăng nhập → trả lời quiz → chọn ngành Thiết kế → làm task chọn màu → báo cáo + voucher. Có bản compact riêng cho điện thoại (khung crop tự lia theo hành động). |
| `#prototype` | **Prototype bấm được** 36 màn: Onboarding, Trắc nghiệm, Trải nghiệm nghề, Kết quả, Dashboard. |
| `#screen-<id>` | Mở thẳng một màn, vd. `#screen-dash-home`. |

Trong prototype:

- Bấm vào nút như app thật; bấm chỗ trống sẽ nháy các vùng bấm (giống Figma).
- Cuộn chuột trên các trang dài (báo cáo, tổng quan, trung tâm…) để xem phần dưới.
- Phím: `←` quay lại, `→` màn kế, `↑/↓` cuộn trang, `H` bật/tắt vùng bấm, `R` chạy lại từ đầu.
- Nút tên màn ở giữa thanh trên mở lưới tất cả màn hình.

Màn **Trắc nghiệm 6 câu** và **AI đang phân tích** được code lại hoàn toàn (mascot SVG, mắt nhìn theo con trỏ, chớp mắt, sticker đổi màu từng câu, thang 5 mức). Các màn còn lại dùng ảnh 1920×1032 trích từ video prototype, kèm vùng bấm.

## Chạy local

```bash
npm install
npm run dev        # http://localhost:5173/Job-checke/
npm run build      # xuất ra dist/
```

## Deploy

Workflow `.github/workflows/deploy.yml` tự build và deploy lên GitHub Pages mỗi lần push vào `main`.
Lần đầu: vào **Settings → Pages → Source: GitHub Actions**.

## Cấu trúc

```
src/
  App.tsx            landing + routing (hash)
  HeroDemo.tsx       demo Stageshow (Stage, Window, Act script)
  Prototype.tsx      trình phát prototype: scale-to-fit, chuyển cảnh, vùng bấm, cuộn, phím tắt
  screens.ts         đồ thị màn hình + toạ độ vùng bấm (hệ toạ độ frame Figma 1920×1080)
  coded/Quiz.tsx     quiz + màn "thinking" code lại
  kit/               kit Stageshow (MIT, benjitaylor/skills)
public/screens/      ảnh màn hình (.webp)
```
