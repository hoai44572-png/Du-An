import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { handleChatRoute } from './routes/chat.routes.js';
import paymentRouter from './routes/payment.js';
import authRouter from './routes/auth.routes.js';
import orderRouter from './routes/order.routes.js';
import reviewRouter from './routes/review.routes.js';
import wishlistRouter from './routes/wishlist.routes.js';
import couponRouter from './routes/coupon.routes.js';
import customerRouter from './routes/customer.routes.js';
import transactionRouter from './routes/transaction.routes.js';
import adminRouter from './routes/admin.routes.js';
import productRouter from './routes/product.routes.js';
import categoryRouter from './routes/category.routes.js';
import { checkDbConnection } from './config/db.js';
import { helmetSecurity, apiLimiter } from './middlewares/security.middleware.js';
import { auditLogMiddleware } from './middlewares/auditLog.middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Bao mat Middleware =====
app.use(helmetSecurity);

// CORS - cho phep frontend Next.js giao tiep
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    process.env.FRONTEND_URL || 'http://localhost:3000',
  ],
  credentials: true,
}));

// Parse JSON body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting cho toan bo API
app.use('/api/', apiLimiter);

// Audit log middleware - ghi nhat ky truy cap
app.use('/api/', auditLogMiddleware);

// ===== Ket noi Database =====
checkDbConnection();

// ===== Dang ky cac API Router =====

// Auth & User Profile API
app.use('/api/auth', authRouter);

// Quan ly Khach hang API (Admin)
app.use('/api/customers', customerRouter);

// Lich su Giao dich API
app.use('/api/transactions', transactionRouter);

// Quan ly Don hang API
app.use('/api/orders', orderRouter);

// Danh gia San pham API
app.use('/api/reviews', reviewRouter);

// Danh sach Yeu thich API
app.use('/api/wishlist', wishlistRouter);

// Ma Giam gia API
app.use('/api/coupons', couponRouter);

// Thanh toan API (da co tu truoc)
app.use('/api/payment', paymentRouter);

// Admin API - quan ly he thong toan dien
app.use('/api/admin', adminRouter);

// Products API
app.use('/api/products', productRouter);

// Categories API
app.use('/api/categories', categoryRouter);

// Chat AI API
app.all(/^\/api\/chat/, async (req, res) => {
  try {
    const protocol = req.protocol || 'http';
    const host = req.headers.host || `localhost:${PORT}`;
    const fullUrl = `${protocol}://${host}${req.originalUrl || req.url}`;

    const mockRequest = {
      url: fullUrl,
      method: req.method,
      headers: req.headers,
      json: async () => req.body,
    };

    const result = await handleChatRoute(mockRequest);
    return res.status(result.statusCode || 200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Backend Express Server Internal Error',
      error: err.message,
    });
  }
});

// ===== Root Endpoint =====
app.get('/', (req, res) => {
  res.json({
    name: 'Swift Coffee Express Backend RESTful API',
    status: 'Active',
    port: PORT,
    version: '2.0.0',
    endpoints: [
      // Auth
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/forgot-password',
      'POST /api/auth/reset-password',
      'GET /api/auth/profile',
      'PUT /api/auth/profile',
      'PUT /api/auth/change-password',
      'GET /api/auth/addresses',
      'POST /api/auth/addresses',
      'PUT /api/auth/addresses/:id',
      'DELETE /api/auth/addresses/:id',
      // Orders
      'GET /api/orders/my-orders',
      'GET /api/orders/:orderCode',
      'PUT /api/orders/cancel/:orderCode',
      'PUT /api/orders/received/:orderCode',
      'POST /api/orders/reorder/:orderCode',
      // Reviews
      'GET /api/reviews/product/:productId',
      'POST /api/reviews',
      'PUT /api/reviews/:id',
      'DELETE /api/reviews/:id',
      'PUT /api/reviews/admin/reply/:id',
      // Wishlist
      'GET /api/wishlist',
      'POST /api/wishlist',
      'DELETE /api/wishlist/:productId',
      // Coupons
      'POST /api/coupons/validate',
      // Payment
      'POST /api/payment/order',
      'GET /api/payment/status/:orderCode',
      'POST /api/payment/webhook',
      // Chat
      'POST /api/chat/send',
    ],
  });
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint khong ton tai.' });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error('🚨 Global Error:', err.message);
  res.status(500).json({ success: false, message: 'Loi he thong.', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Swift Coffee Backend v2.0 running on http://localhost:${PORT}`);
  console.log(`💳 Payment Webhook: http://localhost:${PORT}/api/payment/webhook`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`⭐ Reviews API: http://localhost:${PORT}/api/reviews`);
  console.log(`❤️  Wishlist API: http://localhost:${PORT}/api/wishlist`);
  console.log(`🎟️  Coupons API: http://localhost:${PORT}/api/coupons`);
});

export default app;
