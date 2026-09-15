import express from 'express';
import {
  createOrder,
  getPaymentStatus,
  handleWebhook,
  simulateWebhook,
  createPayPalOrder,
  capturePayPalOrder,
} from '../controllers/paymentController.js';

const router = express.Router();

// Tạo đơn hàng mới
router.post('/order', createOrder);

// Theo dõi trạng thái thanh toán real-time
router.get('/status/:orderCode', getPaymentStatus);

// Webhook tự động nhận từ SePay / PayOS
router.post('/webhook', handleWebhook);

// Mô phỏng Webhook thành công (Phục vụ Test / Quét QR)
router.post('/simulate-webhook', simulateWebhook);

// PayPal Checkout API
router.post('/paypal/create', createPayPalOrder);
router.post('/paypal/capture', capturePayPalOrder);

export default router;
