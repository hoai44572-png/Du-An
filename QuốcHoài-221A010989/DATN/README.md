# ☕ Swift Coffee — Website Bán Cà Phê

Dự án website thương mại điện tử cà phê đầy đủ tính năng, được chia thành **Frontend** (Next.js) và **Backend** (Express.js + MySQL).

---

## 📁 Cấu trúc dự án

```
Đồ-Án-Tốt-Nghiệp/
│
├── frontend/               ← Giao diện người dùng (Next.js + Tailwind CSS)
│   ├── app/                ← Trang (App Router): trang chủ, menu, giỏ hàng, admin...
│   ├── components/         ← Các React component UI (Header, Footer, ProductCard...)
│   ├── hooks/              ← Custom React hooks
│   ├── lib/                ← Context (Cart, Wishlist), auth helpers, API services
│   ├── pages/              ← Trang thanh toán (Checkout, Payment)
│   ├── types/              ← TypeScript type definitions
│   ├── public/             ← Assets tĩnh (ảnh, icon)
│   ├── package.json
│   ├── next.config.mjs
│   ├── tsconfig.json
│   ├── .env.local          ← Biến môi trường Frontend (KHÔNG commit)
│   └── .env.example        ← Mẫu biến môi trường Frontend
│
├── backend/                ← API Server (Express.js + MySQL + Sequelize)
│   ├── config/             ← Cấu hình database (db.js)
│   ├── controllers/        ← Nhận request, trả response
│   ├── middlewares/        ← Auth, security, audit log
│   ├── models/             ← Sequelize models (User, Product, Order...)
│   ├── routes/             ← Định nghĩa API routes
│   ├── services/           ← Business logic (payment, chat, email)
│   ├── utils/              ← Tiện ích (emailService, response helper)
│   ├── data/               ← Dữ liệu mock cho development
│   ├── index.js            ← Entry point Express server
│   ├── package.json
│   ├── .env                ← Biến môi trường Backend (KHÔNG commit)
│   └── .env.example        ← Mẫu biến môi trường Backend
│
├── database/
│   └── setup-database.sql  ← Script khởi tạo database MySQL
│
├── README.md               ← File hướng dẫn này
└── .gitignore
```

---

## 🚀 Hướng dẫn cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 18.x
- MySQL >= 8.x (hoặc XAMPP/WAMP)
- npm hoặc pnpm

---

### 1. Cấu hình Database

Khởi động MySQL server và chạy:

```bash
mysql -u root -p < database/setup-database.sql
```

Database mặc định: **swift_coffee_db**

---

### 2. Chạy Backend

```bash
cd backend
npm install
copy .env.example .env
# Chỉnh sửa .env: điền DB_USER, DB_PASS, JWT_SECRET
npm run dev
```

✅ Backend: http://localhost:5000

---

### 3. Chạy Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

✅ Frontend: http://localhost:3000

---

## 🌐 URL

| Service | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| API Base | http://localhost:5000/api |
| Admin Panel | http://localhost:3000/admin |

---

## 📡 API Endpoints

### Auth: POST /api/auth/register | POST /api/auth/login | GET /api/auth/profile
### Orders: GET /api/orders/my-orders | GET /api/orders/:orderCode
### Products: GET /api/admin/products | POST /api/admin/products
### Admin: POST /api/admin/login | GET /api/admin/dashboard

---

## 🏗 Kiến trúc

```
Frontend (Next.js :3000)
    ↓  HTTP REST API
Backend (Express.js :5000)
    ↓
MySQL Database (swift_coffee_db)
```

---

## 🛠 Công nghệ

**Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion

**Backend**: Node.js, Express.js 4, MySQL 8, Sequelize 6, JWT, bcryptjs, Nodemailer

---

## ⚠️ Lưu ý
- Không commit file `.env` và `.env.local` lên Git
- Backend phải chạy trước khi mở Frontend
- Không thay đổi tên database `swift_coffee_db`
