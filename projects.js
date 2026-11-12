// ─────────────────────────────────────────────────────────────
//  Danh sách dự án — sửa file này để thêm / bớt / cập nhật dự án.
//  Không cần build: commit & push là GitHub Pages tự cập nhật.
//
//  Các trường:
//    name      Tên dự án (bắt buộc)
//    url       Link chạy thử / trang chủ
//    repo      Link GitHub (bỏ trống nếu repo private)
//    tagline   Mô tả 1 câu
//    details   Các ý chính (mảng chuỗi)
//    tags      Công nghệ / từ khoá
//    status    "live" | "wip" | "archived"
//    year      Năm bắt đầu
//    cover     { glyph, from, to } — ảnh bìa vẽ bằng CSS (chữ lớn + gradient)
//              hoặc { image: "assets/anh.svg" } — ảnh phủ kín khung bìa
//              hoặc { image: "assets/anh.jpg", frame: true, from, to } — ảnh chụp màn hình
//              đặt trong khung cửa sổ trình duyệt nổi trên nền gradient
//    featured  true để hiện ở khu "Nổi bật" (thẻ lớn)
// ─────────────────────────────────────────────────────────────

window.PROJECTS = [
  {
    name: "Kanji.vn",
    url: "https://kanji.vn",
    tagline: "Học Kanji và từ vựng tiếng Nhật bằng tiếng Việt.",
    details: [
      "2.085 Kanji, 214 bộ thủ và từ vựng Minna no Nihongo",
      "Âm Hán Việt, mẹo nhớ tiếng Việt và câu ví dụ",
      "Flashcard ôn tập ngắt quãng cho JLPT N5–N1",
    ],
    tags: ["TypeScript", "Giáo dục", "Tiếng Nhật", "SRS"],
    status: "live",
    year: 2026,
    cover: { image: "assets/kanji.jpg", frame: true, from: "#0ea5e9", to: "#4f46e5" },
    featured: true,
  },
  {
    name: "Universe",
    url: "https://jedtr.github.io/universe/",
    repo: "https://github.com/JeDTr/universe",
    tagline: "Khám phá hệ Mặt Trời 3D — nhìn về Trái Đất từ quỹ đạo Sao Hỏa.",
    details: [
      "Mô phỏng quỹ đạo các thiên thể theo thời gian thực, tua nhanh 1–100 ngày/giây",
      "Các góc nhìn: quỹ đạo Sao Hỏa, tàu vũ trụ, quan sát",
      "Dự án vibe code với Three.js",
    ],
    tags: ["Three.js", "JavaScript", "WebGL", "Vibe code"],
    status: "live",
    year: 2026,
    cover: { image: "assets/universe.svg" },
    featured: true,
  },
  {
    name: "Giá Vàng Huế",
    url: "https://giavanghue.com/",
    tagline: "Theo dõi giá vàng real-time tại Huế, so sánh giữa các thương hiệu lớn.",
    details: [
      "Giá mua / bán từ Duy Mong, Rồng Vàng, SJC, PNJ",
      "So sánh để tìm nơi có giá tốt nhất, kèm biểu đồ biến động",
      "Dự án đã dừng cập nhật dữ liệu",
    ],
    tags: ["TypeScript", "Real-time", "Tài chính"],
    status: "archived",
    year: 2026,
    cover: { image: "assets/giavanghue.svg" },
    featured: true,
  },
];
