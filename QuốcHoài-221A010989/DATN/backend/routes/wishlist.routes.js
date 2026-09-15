import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../controllers/wishlistController.js';

const router = express.Router();

// Tat ca wishlist routes yeu cau dang nhap
router.use(verifyToken);

// GET /api/wishlist - Lay danh sach yeu thich
router.get('/', getWishlist);

// POST /api/wishlist - Them vao yeu thich
router.post('/', addToWishlist);

// DELETE /api/wishlist - Xoa toan bo yeu thich
router.delete('/', clearWishlist);

// DELETE /api/wishlist/:productId - Xoa mot san pham khoi yeu thich
router.delete('/:productId', removeFromWishlist);

export default router;
