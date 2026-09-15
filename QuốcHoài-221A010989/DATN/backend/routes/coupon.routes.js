import express from 'express';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware.js';
import { validateCoupon, getAllCoupons, createCoupon } from '../controllers/couponController.js';

const router = express.Router();

// POST /api/coupons/validate - Kiem tra ma giam gia (public, khong can dang nhap)
router.post('/validate', validateCoupon);

// Admin routes
// GET /api/coupons - Admin: Lay danh sach tat ca coupon
router.get('/', verifyToken, requireAdmin, getAllCoupons);

// POST /api/coupons - Admin: Tao coupon moi
router.post('/', verifyToken, requireAdmin, createCoupon);

export default router;
