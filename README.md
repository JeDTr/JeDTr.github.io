# JeDTr.github.io

Trang GitHub Pages cá nhân, lưu thông tin các dự án: [Kanji.vn](https://kanji.vn), [Universe](https://jedtr.github.io/universe/), …

HTML/CSS/JS thuần — không cần build.

## Thêm / sửa dự án

Chỉ cần sửa [`projects.js`](projects.js): thêm một object vào mảng `PROJECTS` (các trường được mô tả ở đầu file), rồi commit & push.

- `featured: true` → hiện thẻ lớn ở đầu trang
- `status`: `live` | `wip` | `archived` (dùng cho bộ lọc)
- `cover.image` → dùng ảnh chụp màn hình (đặt trong `assets/`) thay cho ảnh bìa vẽ bằng CSS

## Chạy thử ở máy

```bash
python3 -m http.server 4173
```

Mở http://localhost:4173

## Deploy

Repo tên **`JeDTr.github.io`** (user site) → trang có địa chỉ https://jedtr.github.io.
Các project site như `/universe` vẫn hoạt động bình thường bên dưới.

Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
