# HeliPhone Aurora

Dự án Landing Page và E-commerce cao cấp dành cho sản phẩm điện thoại thông minh HeliPhone Aurora. Giao diện được thiết kế hiện đại, mượt mà (glassmorphism, animations) với khả năng đáp ứng đa ngôn ngữ và chế độ sáng/tối.

## Công nghệ sử dụng

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logoColor=white)

### Backend

![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logoColor=white)

---

## Hình ảnh giao diện

**1. Trang chủ (Hero Section)**

<!-- CHÈN ẢNH TRANG CHỦ VÀO DƯỚI DÒNG NÀY -->

![alt text](image/image.png)
![alt text](image/image-1.png)

**2. Giao diện Giỏ hàng (Cart Drawer)**
![alt text](image/image-2.png)

**3. Giao diện Yêu thích (Wishlist Drawer)**
![alt text](image/image-3.png)

**4. danh sách sản phẩm**
![alt text](/image/image5.png)

**5. Chatbot**
![alt text](image/image-4.png)

---

## Tính năng nổi bật

- **Giao diện hiện đại cao cấp**: Hỗ trợ đầy đủ Light/Dark mode, hiệu ứng mờ kính (Glassmorphism), thiết kế chuẩn Apple-like.
- **Đa ngôn ngữ (i18n)**: Tích hợp `next-intl` cho phép chuyển đổi nhanh chóng giữa Tiếng Việt và Tiếng Anh.
- **Quản lý trạng thái (Zustand)**: Giỏ hàng, Danh sách yêu thích và Xác thực người dùng được lưu trữ cục bộ và đồng bộ mượt mà.
- **Trải nghiệm mua sắm**: Tích hợp các menu trượt (Drawers) tiện lợi cho việc quản lý Cart và Wishlist.
- **Trợ lý ảo (Chatbot)**: Tích hợp Chatbot tư vấn thông minh giúp người dùng dễ dàng lựa chọn sản phẩm và giải đáp thắc mắc.
- **Animation (GSAP & Tailwind)**: Trải nghiệm cuộn trang (Scrollytelling) và các micro-animations tinh tế.

## Cấu trúc thư mục

Dự án được cấu trúc theo dạng Monorepo với NPM Workspaces:

```text
helicorp-landing/
├── frontend/             # Next.js App Router (Giao diện người dùng)
├── backend/              # Express API (Xử lý dữ liệu, MongoDB)
└── package.json          # Quản lý Workspaces cho cả frontend và backend
```

## Hướng dẫn cài đặt và chạy nội bộ

**1. Cài đặt các gói thư viện (Dependencies)**

```bash
npm install
```

**2. Cấu hình biến môi trường**
Sao chép các file `.env.example` thành `.env` tương ứng:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

**3. Khởi tạo dữ liệu mẫu (Sản phẩm)**

```bash
npm run seed
```

**4. Khởi chạy dự án**

Mở 2 cửa sổ terminal và chạy lần lượt các lệnh sau:

Chạy Backend (API Server):

```bash
npm run dev:backend
```

Chạy Frontend (Giao diện web):

```bash
npm run dev:frontend
```

Ứng dụng sẽ khả dụng tại: `http://localhost:3000`
