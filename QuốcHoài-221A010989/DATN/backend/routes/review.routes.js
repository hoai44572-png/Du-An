import express from 'express';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware.js';
import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
  adminReplyReview,
  adminGetAllReviews,
} from '../controllers/reviewController.js';

const router = express.Router();

// GET /api/reviews/product/:productId - Lay danh gia cua mot san pham (public)
router.get('/product/:productId', getProductReviews);

// Admin routes
// GET /api/reviews/admin/all - Admin: Lay tat ca danh gia
router.get('/admin/all', verifyToken, requireAdmin, adminGetAllReviews);

// PUT /api/reviews/admin/reply/:id - Admin: Tra loi hoac doi trang thai
router.put('/admin/reply/:id', verifyToken, requireAdmin, adminReplyReview);

// User routes (yeu cau dang nhap)
// POST /api/reviews - Them danh gia moi
router.post('/', verifyToken, addReview);

// PUT /api/reviews/:id - Sua danh gia cua minh
router.put('/:id', verifyToken, updateReview);

// DELETE /api/reviews/:id - Xoa danh gia
router.delete('/:id', verifyToken, deleteReview);

export default router;
