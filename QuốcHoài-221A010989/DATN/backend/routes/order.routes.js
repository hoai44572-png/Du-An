import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {
  getMyOrders,
  getOrderDetail,
  cancelOrder,
  markReceived,
  reorder,
} from '../controllers/orderController.js';

const router = express.Router();

// Tat ca cac route nay yeu cau xac thuc JWT
router.use(verifyToken);

// GET /api/orders/my-orders - Lay danh sach don hang ca nhan
router.get('/my-orders', getMyOrders);

// GET /api/orders/:orderCode - Lay chi tiet don hang
router.get('/:orderCode', getOrderDetail);

// PUT /api/orders/cancel/:orderCode - Huy don hang
router.put('/cancel/:orderCode', cancelOrder);

// PUT /api/orders/received/:orderCode - Xac nhan da nhan hang
router.put('/received/:orderCode', markReceived);

// POST /api/orders/reorder/:orderCode - Mua lai don hang
router.post('/reorder/:orderCode', reorder);

export default router;
