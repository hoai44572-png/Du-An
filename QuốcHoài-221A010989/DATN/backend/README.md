# Swift Coffee Store - Backend Express.js Module (RESTful API)

Thư mục **Backend** chứa toàn bộ hệ thống API backend của website **Swift Coffee**, được đóng gói theo mô hình **MVC (Model - View - Controller)** độc lập.

---

## 📂 Cấu trúc Thư mục Backend

```
Backend/
├── controllers/
│   └── chat.controller.js      # Controller tiếp nhận HTTP Request & trả về phản hồi
├── data/
│   ├── mockConversations.json  # Dữ liệu cuộc trò chuyện
│   ├── mockMessages.json       # Dữ liệu tin nhắn & tệp đính kèm
│   └── mockUsers.json          # Dữ liệu người dùng & Admin
├── middlewares/
│   └── auth.middleware.js      # Middleware xác thực JWT Bearer Token & Phân quyền Role
├── routes/
│   └── chat.routes.js          # Định tuyến 11 RESTful API Endpoints
├── services/
│   └── chat.service.js         # Business Logic thao tác dữ liệu (Repository pattern)
├── utils/
│   └── response.js             # Định dạng phản hồi chuẩn API (successResponse, errorResponse)
├── index.js                    # Entry point cho Server Express.js (Port 5000)
├── package.json                # Cấu hình dependency cho Backend
└── README.md
```

---

## 🚀 Hướng Dẫn Khởi Chạy Độc Lập

1. Chuyển vào thư mục Backend:
   ```bash
   cd Backend
   ```
2. Cài đặt thư viện:
   ```bash
   npm install
   ```
3. Khởi chạy Express Server:
   ```bash
   npm start
   ```
   Server sẽ lắng nghe tại địa chỉ: `http://localhost:5000`

---

## 📡 Các RESTful API Endpoints

- `GET /api/chat/conversations` - Danh sách cuộc trò chuyện
- `GET /api/chat/conversations/:id` - Chi tiết cuộc trò chuyện
- `GET /api/chat/messages/:conversationId` - Lịch sử tin nhắn
- `POST /api/chat/send` - Gửi tin nhắn mới
- `PUT /api/chat/read/:conversationId` - Đánh dấu đã đọc
- `PUT /api/chat/typing` - Cập nhật trạng thái "Đang nhập..."
- `PUT /api/chat/online` - Cập nhật trạng thái Online/Offline
- `DELETE /api/chat/message/:id` - Xóa tin nhắn
- `PUT /api/chat/close/:conversationId` - Đóng hội thoại
- `PUT /api/chat/open/:conversationId` - Mở lại hội thoại
- `GET /api/chat/unread` - Lấy số lượng tin nhắn chưa đọc

---

## 🛠️ Tích hợp Database MySQL (Prisma / Sequelize)

Trong tương lai, để kết nối với cơ sở dữ liệu MySQL thật:
1. Mở file `Backend/services/chat.service.js`.
2. Thay đổi việc lưu dữ liệu tạm trong mảng `conversationsStore` & `messagesStore` bằng các lệnh truy vấn ORM:
   ```javascript
   // Ví dụ Prisma ORM
   static async getConversations() {
     return await prisma.conversation.findMany();
   }
   ```
3. Các file Routes, Controller, Middlewares và Frontend hoàn toàn không cần phải sửa bất kỳ dòng code nào!
