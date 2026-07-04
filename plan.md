# Kế hoạch triển khai — HeliPhone Aurora (Next.js + Express)

## 1. Kiến trúc tổng thể

```
helicorp-landing/                  (1 repo GitHub duy nhất - monorepo)
├── apps/
│   ├── web/                       → Next.js (frontend, App Router, TS, Tailwind)
│   │   ├── app/
│   │   ├── lib/services/          → gọi sang Express API
│   │   └── next.config.js         → rewrite .html cho trang sản phẩm
│   └── api/                       → Express (backend, TS)
│       ├── src/
│       │   ├── routes/
│       │   ├── models/
│       │   └── server.ts
│       └── .env
├── README.md
└── .gitignore
```

- **Next.js (apps/web)** → deploy Vercel. Chỉ gọi dữ liệu qua service layer, không tự xử lý logic nghiệp vụ.
- **Express (apps/api)** → deploy Render hoặc Railway (free tier). Chứa toàn bộ logic sản phẩm, giỏ hàng, đơn hàng.
- **Database**: MongoDB Atlas (free tier) — dễ setup, không cần cài local, Mongoose thao tác nhanh.
- **Kết nối Next → Express**: qua `lib/services/*.ts`, dùng biến môi trường `NEXT_PUBLIC_API_URL` (client) / `API_URL` (server-side fetch trong Server Component).

### Vì sao URL sản phẩm có đuôi `.html`

Next.js App Router không đặt tên thư mục chứa dấu chấm, nên ta dùng **rewrite** trong `next.config.js`:

```js
// next.config.js
module.exports = {
  async rewrites() {
    return [{ source: "/san-pham/:slug.html", destination: "/san-pham/:slug" }];
  },
};
```

Route thật: `app/san-pham/[slug]/page.tsx` (SSG qua `generateStaticParams`).
Mọi `<Link>` trong code phải trỏ ra `/san-pham/${slug}.html` để URL hiển thị đúng và nhất quán cho SEO (sitemap, canonical, OG url).

---

## 2. Chiến lược nhánh Git (6 nhánh — tối giản, đủ khoa học)

| Nhánh                       | Base      | Nội dung                                                           |
| --------------------------- | --------- | ------------------------------------------------------------------ |
| `main`                      | —         | Code ổn định, sẵn sàng deploy                                      |
| `develop`                   | `main`    | Nhánh tổng hợp trong lúc phát triển                                |
| `feature/backend-api`       | `develop` | Express + DB + API sản phẩm/giỏ hàng/đơn hàng                      |
| `feature/product-pages-seo` | `develop` | Trang danh sách + chi tiết sản phẩm, rewrite `.html`, metadata SEO |
| `feature/cart-checkout`     | `develop` | Giỏ hàng, checkout, đặt hàng (frontend + gọi API)                  |
| `feature/landing-ui`        | `develop` | Header, dropdown danh mục, hero, feature section, form đăng ký     |
| `feature/performance-seo`   | `develop` | Tối ưu ảnh, PageSpeed, sitemap, robots.txt                         |
| `feature/enhancements`      | `develop` | Điểm cộng: dark mode, i18n VI/EN, scroll animation, chatbot        |

Quy trình chung cho mọi nhánh:

```bash
git checkout develop
git pull
git checkout -b <ten-nhanh>
# ... code theo prompt của từng task, commit sau mỗi task ...
git checkout develop
git merge <ten-nhanh>
git push
```

Khi toàn bộ ổn định:

```bash
git checkout main
git merge develop
git push
```

---

## 3. Danh sách Task theo từng nhánh

Mỗi task = 1 commit. Prompt bên dưới dùng để đưa thẳng vào Claude Code / Cursor.

---

### 🔧 NHÁNH `feature/backend-api`

**Task 1.1 — Khởi tạo Express server**
Prompt:

```
Tạo project Express + TypeScript trong thư mục apps/api. Cấu hình
kết nối MongoDB Atlas qua Mongoose (dùng biến môi trường MONGO_URI),
cấu hình CORS cho phép domain Next.js gọi vào, thêm middleware
express.json(), dotenv, và route health-check GET /api/health.
```

Commit:

```bash
git add apps/api
git commit -m "chore(api): khởi tạo Express server với TypeScript và kết nối MongoDB"
```

**Task 1.2 — Model & API sản phẩm**
Prompt:

```
Tạo Mongoose schema Product (name, slug, price, description, images,
specs, colors, storageOptions, category) trong apps/api/src/models.
Tạo route GET /api/products (danh sách, hỗ trợ filter theo category)
và GET /api/products/:slug (chi tiết 1 sản phẩm).
```

Commit:

```bash
git add apps/api
git commit -m "feat(api): thêm model Product và endpoint danh sách/chi tiết sản phẩm"
```

**Task 1.3 — API giỏ hàng**
Prompt:

```
Tạo Mongoose schema Cart (sessionId, items: [{productId, name, price,
color, storage, quantity}]). Tạo các route: GET /api/cart/:sessionId,
POST /api/cart/:sessionId/items (thêm sản phẩm), PUT
/api/cart/:sessionId/items/:itemId (sửa số lượng), DELETE
/api/cart/:sessionId/items/:itemId (xóa sản phẩm khỏi giỏ).
```

Commit:

```bash
git add apps/api
git commit -m "feat(api): thêm endpoint quản lý giỏ hàng theo sessionId"
```

**Task 1.4 — API đặt hàng (checkout)**
Prompt:

```
Tạo Mongoose schema Order (sessionId, customerName, phone, address,
items, totalPrice, status, createdAt). Tạo route POST /api/orders
nhận dữ liệu checkout, validate input (dùng zod), lưu đơn hàng, xóa
giỏ hàng tương ứng sau khi đặt thành công, trả về orderId.
```

Commit:

```bash
git add apps/api
git commit -m "feat(api): thêm endpoint tạo đơn hàng và validate dữ liệu checkout"
```

**Task 1.5 — Seed dữ liệu mẫu**
Prompt:

```
Tạo script apps/api/src/seed.ts để chèn 3 sản phẩm mẫu: HeliPhone
Aurora, Aurora Pro, Aurora Pro Max — mỗi sản phẩm có đủ specs, ảnh
placeholder, 4 màu, 3 mức dung lượng. Thêm script "seed" vào
package.json để chạy bằng ts-node.
```

Commit:

```bash
git add apps/api
git commit -m "chore(api): thêm script seed dữ liệu sản phẩm mẫu"
```

---

### 🔧 NHÁNH `feature/product-pages-seo`

**Task 2.1 — Service layer gọi Express từ Next**
Prompt:

```
Trong apps/web/lib/services, tạo productService.ts với hàm
getProducts() và getProductBySlug(slug) gọi tới API Express qua
biến môi trường API_URL (server-side fetch, revalidate 60s). Xử lý
lỗi trả về null nếu fetch fail thay vì throw crash trang.
```

Commit:

```bash
git add apps/web
git commit -m "feat(web): thêm service layer gọi Express API cho dữ liệu sản phẩm"
```

**Task 2.2 — Trang danh sách sản phẩm**
Prompt:

```
Tạo trang app/san-pham/page.tsx hiển thị grid sản phẩm lấy từ
productService.getProducts(). Mỗi card có ảnh, tên, giá, nút "Xem
chi tiết" trỏ tới /san-pham/{slug}.html theo đúng style đã thiết kế
Figma (rounded, soft shadow).
```

Commit:

```bash
git add apps/web
git commit -m "feat(web): thêm trang danh sách sản phẩm"
```

**Task 2.3 — Trang chi tiết sản phẩm + rewrite .html**
Prompt:

```
Tạo route động app/san-pham/[slug]/page.tsx dùng generateStaticParams
để SSG toàn bộ slug sản phẩm. Thêm rewrite trong next.config.js để
URL /san-pham/:slug.html trỏ vào route trên. Trang hiển thị đầy đủ
ảnh, mô tả, thông số kỹ thuật, chọn màu/dung lượng, nút thêm vào giỏ.
```

Commit:

```bash
git add apps/web
git commit -m "feat(web): thêm trang chi tiết sản phẩm với URL dạng .html cho SEO"
```

**Task 2.4 — Metadata SEO động cho từng sản phẩm**
Prompt:

```
Trong app/san-pham/[slug]/page.tsx, thêm hàm generateMetadata trả về
title, description, openGraph (title, description, images, url dạng
.html) dựa theo dữ liệu sản phẩm. Đảm bảo title theo mẫu
"{Tên sản phẩm} | HeliPhone Aurora".
```

Commit:

```bash
git add apps/web
git commit -m "feat(seo): thêm metadata động Title/Description/OG cho từng sản phẩm"
```

**Task 2.5 — Sitemap & robots.txt**
Prompt:

```
Tạo app/sitemap.ts liệt kê toàn bộ URL sản phẩm dạng /san-pham/{slug}.html
và các trang tĩnh chính. Tạo app/robots.ts cho phép crawl toàn bộ trang,
trỏ tới sitemap.
```

Commit:

```bash
git add apps/web
git commit -m "feat(seo): thêm sitemap.xml và robots.txt"
```

---

### 🔧 NHÁNH `feature/cart-checkout`

**Task 3.1 — Cart store đồng bộ với Express**
Prompt:

```
Tạo Zustand store apps/web/lib/store/cartStore.ts, quản lý sessionId
(lưu trong cookie qua js-cookie, tạo mới nếu chưa có). Store gọi
cartService (mới) để lấy/thêm/sửa/xóa item, luôn đồng bộ với API
Express thay vì chỉ lưu local.
```

Commit:

```bash
git add apps/web
git commit -m "feat(cart): thêm cart store đồng bộ dữ liệu với Express API"
```

**Task 3.2 — Giao diện giỏ hàng (cart drawer)**
Prompt:

```
Tạo component CartDrawer.tsx: panel trượt từ phải, hiển thị danh sách
sản phẩm trong giỏ (ảnh, tên, màu, dung lượng, số lượng có nút +/-),
tổng tiền, nút "Tiến hành đặt hàng" dẫn tới trang /checkout. Theo đúng
style rounded/soft đã chốt ở Figma.
```

Commit:

```bash
git add apps/web
git commit -m "feat(cart): thêm giao diện giỏ hàng dạng drawer"
```

**Task 3.3 — Trang checkout**
Prompt:

```
Tạo trang app/checkout/page.tsx: form nhập họ tên, số điện thoại, địa
chỉ (validate bằng react-hook-form + zod), hiển thị tóm tắt đơn hàng
bên cạnh. Khi submit, gọi orderService.createOrder gửi sang Express
POST /api/orders.
```

Commit:

```bash
git add apps/web
git commit -m "feat(checkout): thêm trang checkout với validate và gọi API tạo đơn hàng"
```

**Task 3.4 — Trang xác nhận đơn hàng**
Prompt:

```
Tạo trang app/checkout/thanh-cong/page.tsx hiển thị mã đơn hàng, lời
cảm ơn, tóm tắt sản phẩm đã mua. Sau khi tạo đơn thành công, tự động
xóa giỏ hàng khỏi cartStore và redirect người dùng tới trang này.
```

Commit:

```bash
git add apps/web
git commit -m "feat(checkout): thêm trang xác nhận đặt hàng thành công"
```

---

### 🔧 NHÁNH `feature/landing-ui`

**Task 4.1 — Header + dropdown danh mục + toggle**
Prompt:

```
Implement Header theo thiết kế Figma [đính kèm link/ảnh]: logo, nav,
dropdown mega-menu danh mục sản phẩm, icon wishlist/cart (có badge số
lượng lấy từ cartStore), toggle dark/light, toggle ngôn ngữ VI/EN.
Responsive: gộp vào hamburger menu trên mobile.
```

Commit:

```bash
git add apps/web
git commit -m "feat(ui): thêm header với dropdown danh mục và toggle theme/ngôn ngữ"
```

**Task 4.2 — Hero + Feature section**
Prompt:

```
Implement Hero Section và Feature Highlights section theo thiết kế
Figma [link/ảnh], dùng Ultra Violet #7B4DFF làm accent, hỗ trợ
dark/light mode qua CSS variables đã cấu hình trong tailwind.config.
```

Commit:

```bash
git add apps/web
git commit -m "feat(ui): thêm hero section và feature highlights"
```

**Task 4.3 — Form đăng ký nhận tin**
Prompt:

```
Tạo component NewsletterForm, validate email bằng zod, submit gọi
API Express POST /api/newsletter (tạo thêm route này trong apps/api
lưu email vào MongoDB), hiển thị toast thông báo thành công/lỗi.
```

Commit:

```bash
git add apps/web apps/api
git commit -m "feat(newsletter): thêm form đăng ký nhận tin kết nối Express API"
```

---

### 🔧 NHÁNH `feature/performance-seo`

**Task 5.1 — Tối ưu ảnh & lazy load**
Prompt:

```
Rà soát toàn bộ ảnh trong dự án, chuyển sang dùng next/image với
width/height chuẩn, format WebP/AVIF, thêm priority cho ảnh hero,
lazy load các section dưới fold bằng dynamic import.
```

Commit:

```bash
git add apps/web
git commit -m "perf: tối ưu ảnh và lazy load section để cải thiện PageSpeed"
```

**Task 5.2 — Metadata trang chủ + Open Graph**
Prompt:

```
Cấu hình metadata trong apps/web/app/layout.tsx: title, description,
Open Graph đầy đủ (title, description, image, url), favicon,
theme-color cho cả light/dark.
```

Commit:

```bash
git add apps/web
git commit -m "feat(seo): cấu hình metadata và Open Graph cho trang chủ"
```

**Task 5.3 — Kiểm tra & sửa PageSpeed**
Prompt:

```
Chạy Google PageSpeed Insights (Mobile) cho trang chủ và 1 trang sản
phẩm. Liệt kê các vấn đề (render-blocking, unused JS, layout shift)
và sửa từng mục để đạt tối thiểu 85/100.
```

Commit:

```bash
git add apps/web
git commit -m "perf: khắc phục các vấn đề PageSpeed Insights (mobile)"
```

---

### 🔧 NHÁNH `feature/enhancements` (điểm cộng — làm nếu còn thời gian)

**Task 6.1 — Dark mode**
Prompt:

```
Tích hợp next-themes, đảm bảo không bị flash light mode khi load
trang (dùng script chống FOUC), toggle đã có ở header từ trước áp
dụng theme thật.
```

Commit:

```bash
git commit -m "feat(theme): tích hợp dark mode hoàn chỉnh với next-themes"
```

**Task 6.2 — Đa ngôn ngữ VI/EN**
Prompt:

```
Tích hợp next-intl, tạo file dịch messages/vi.json và messages/en.json
cho toàn bộ nội dung landing page, kết nối với toggle ngôn ngữ đã có
ở header.
```

Commit:

```bash
git commit -m "feat(i18n): thêm chuyển đổi ngôn ngữ VI/EN"
```

**Task 6.3 — Scroll animation / parallax**
Prompt:

```
Tích hợp GSAP ScrollTrigger cho section scrollytelling (camera, chip,
pin), tắt bớt hiệu ứng nặng trên mobile qua matchMedia để không ảnh
hưởng PageSpeed.
```

Commit:

```bash
git commit -m "feat(animation): thêm scroll animation và parallax cho scrollytelling section"
```

**Task 6.4 — Chatbot tư vấn**
Prompt:

```
Tạo route apps/api/src/routes/chatbot.ts gọi azure open api (giấu API
key qua .env), Next.js gọi qua service tới route này. Tạo widget
chatbot góc màn hình, lazy load khi user click mở.
```

Commit:

```bash
git commit -m "feat(chatbot): tích hợp chatbot tư vấn qua open api"
```

---

## 4. Deploy (thực hiện trên `develop` sau khi merge đủ nhánh)

**Task 7.1 — Deploy Express**

```
Deploy apps/api lên Render hoặc Railway. Cấu hình biến môi trường
MONGO_URI, PORT, CORS_ORIGIN trỏ tới domain Vercel sẽ dùng.
```

**Task 7.2 — Deploy Next.js**

```
Deploy apps/web lên Vercel. Cấu hình biến môi trường API_URL trỏ tới
domain Express vừa deploy ở bước trên.
```

**Task 7.3 — Merge về main**

```bash
git checkout main
git merge develop
git push
```

Commit message cuối cùng gợi ý: `chore: hoàn thiện và deploy phiên bản v1.0 HeliPhone Aurora`

---

## 5. Checklist đối chiếu với đề bài trước khi nộp

- [ ] Hero, tính năng nổi bật, thông số kỹ thuật, form đăng ký nhận tin
- [ ] Responsive Desktop + Mobile
- [ ] PageSpeed Mobile ≥ 85
- [ ] Meta Title/Description/OG đầy đủ
- [ ] Git có nhánh rõ ràng, commit message chuẩn
- [ ] Deploy chạy thực tế (Vercel cho web, Render/Railway cho api)
- [ ] Giỏ hàng + đặt hàng hoạt động thật (lưu MongoDB)
- [ ] URL sản phẩm dạng `.html`
- [ ] (Điểm cộng) Dark mode, i18n, scroll animation, chatbot, webhook validate
