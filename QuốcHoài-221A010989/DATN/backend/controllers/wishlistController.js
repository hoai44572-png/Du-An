import { Wishlist } from '../models/index.js';

// In-memory fallback khi chua co MySQL
const inMemoryWishlists = new Map(); // userId -> Set(productId)

/**
 * GET /api/wishlist - Lay danh sach yeu thich cua nguoi dung
 */
export const getWishlist = async (req, res) => {
  try {
    const userId = String(req.user.id);
    let wishlist = [];

    try {
      wishlist = await Wishlist.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    } catch {
      const set = inMemoryWishlists.get(userId) || new Set();
      wishlist = [...set].map(productId => ({ userId, productId }));
    }

    return res.status(200).json({ success: true, wishlist: wishlist.map(w => w.productId) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi lay danh sach yeu thich.', error: err.message });
  }
};

/**
 * POST /api/wishlist - Them san pham vao danh sach yeu thich
 */
export const addToWishlist = async (req, res) => {
  try {
    const userId = String(req.user.id);
    const { productId } = req.body;

    if (!productId) return res.status(400).json({ success: false, message: 'Thieu productId.' });

    try {
      // Kiem tra da ton tai chua
      const existing = await Wishlist.findOne({ where: { userId, productId: String(productId) } });
      if (existing) return res.status(200).json({ success: true, message: 'San pham da co trong danh sach yeu thich.' });

      await Wishlist.create({ userId, productId: String(productId) });
    } catch {
      const set = inMemoryWishlists.get(userId) || new Set();
      set.add(String(productId));
      inMemoryWishlists.set(userId, set);
    }

    return res.status(201).json({ success: true, message: 'Da them vao danh sach yeu thich!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi them yeu thich.', error: err.message });
  }
};

/**
 * DELETE /api/wishlist/:productId - Xoa san pham khoi danh sach yeu thich
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = String(req.user.id);
    const { productId } = req.params;

    try {
      await Wishlist.destroy({ where: { userId, productId: String(productId) } });
    } catch {
      const set = inMemoryWishlists.get(userId);
      if (set) set.delete(String(productId));
    }

    return res.status(200).json({ success: true, message: 'Da xoa khoi danh sach yeu thich.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi xoa yeu thich.', error: err.message });
  }
};

/**
 * DELETE /api/wishlist - Xoa toan bo danh sach yeu thich
 */
export const clearWishlist = async (req, res) => {
  try {
    const userId = String(req.user.id);

    try {
      await Wishlist.destroy({ where: { userId } });
    } catch {
      inMemoryWishlists.set(userId, new Set());
    }

    return res.status(200).json({ success: true, message: 'Da xoa toan bo danh sach yeu thich.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi xoa danh sach yeu thich.', error: err.message });
  }
};
