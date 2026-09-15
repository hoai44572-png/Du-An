import { Review, Order, OrderItem } from '../models/index.js';

// In-memory fallback khi chua co MySQL
const inMemoryReviews = new Map();
let reviewIdCounter = 1;

// Helper: Kiem tra nguoi dung da mua san pham nay chua
const hasUserPurchasedProduct = async (userId, productId) => {
  try {
    const completedOrders = await Order.findAll({
      where: { userId: String(userId), orderStatus: 'completed' },
      include: [{ model: OrderItem, as: 'items' }],
    });

    return completedOrders.some(order =>
      (order.items || []).some(item => String(item.productId) === String(productId))
    );
  } catch {
    // Neu khong co DB, cho phep danh gia de demo
    return true;
  }
};

/**
 * POST /api/reviews - Them danh gia san pham moi
 * Middleware: Nguoi dung phai co don hang Completed chua san pham nay
 */
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment, images, orderId } = req.body;
    const userId = String(req.user.id);

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Vui long nhap day du productId, rating va comment.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating phai tu 1 den 5 sao.' });
    }

    // Kiem tra nguoi dung da mua san pham nay chua
    const hasPurchased = await hasUserPurchasedProduct(userId, productId);
    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: 'Ban chi co the danh gia san pham da mua va don hang o trang thai "Hoan thanh".',
      });
    }

    let newReview;
    const imagesJSON = Array.isArray(images) ? JSON.stringify(images) : (images || null);

    try {
      newReview = await Review.create({
        userId,
        userName: req.user.name,
        userAvatar: req.user.avatar,
        productId: String(productId),
        orderId: orderId || null,
        rating: parseInt(rating),
        comment,
        images: imagesJSON,
        verifiedPurchase: true,
        status: 'approved',
      });
    } catch {
      const id = reviewIdCounter++;
      newReview = {
        id, userId, userName: req.user.name, userAvatar: req.user.avatar,
        productId: String(productId), orderId, rating: parseInt(rating), comment,
        images: imagesJSON, verifiedPurchase: true, status: 'approved',
        adminReply: null, createdAt: new Date().toISOString(),
      };
      inMemoryReviews.set(id, newReview);
    }

    return res.status(201).json({ success: true, message: 'Cam on ban da danh gia san pham!', review: newReview });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi them danh gia.', error: err.message });
  }
};

/**
 * GET /api/reviews/product/:productId - Lay tat ca danh gia cua san pham
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    let reviews = [];

    try {
      reviews = await Review.findAll({
        where: { productId: String(productId), status: 'approved' },
        order: [['createdAt', 'DESC']],
      });
    } catch {
      reviews = [...inMemoryReviews.values()].filter(
        r => String(r.productId) === String(productId) && r.status === 'approved'
      );
    }

    // Tinh trung binh sao
    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    // Dem so luong danh gia theo moi muc sao (1-5)
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => { if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++; });

    return res.status(200).json({
      success: true,
      reviews,
      stats: { avgRating: parseFloat(avgRating), totalReviews: reviews.length, ratingCounts },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi lay danh gia san pham.', error: err.message });
  }
};

/**
 * PUT /api/reviews/:id - Chinh sua danh gia cua minh
 */
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, images } = req.body;
    const userId = String(req.user.id);

    const imagesJSON = Array.isArray(images) ? JSON.stringify(images) : (images || null);

    try {
      const review = await Review.findByPk(id);
      if (!review) return res.status(404).json({ success: false, message: 'Khong tim thay danh gia.' });
      if (String(review.userId) !== userId) {
        return res.status(403).json({ success: false, message: 'Ban chi co the sua danh gia cua minh.' });
      }
      await review.update({ rating: parseInt(rating) || review.rating, comment: comment || review.comment, images: imagesJSON });
    } catch {
      const review = inMemoryReviews.get(parseInt(id));
      if (!review) return res.status(404).json({ success: false, message: 'Khong tim thay danh gia.' });
      if (String(review.userId) !== userId) {
        return res.status(403).json({ success: false, message: 'Ban chi co the sua danh gia cua minh.' });
      }
      Object.assign(review, { rating: parseInt(rating) || review.rating, comment: comment || review.comment, images: imagesJSON });
    }

    return res.status(200).json({ success: true, message: 'Cap nhat danh gia thanh cong!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi cap nhat danh gia.', error: err.message });
  }
};

/**
 * DELETE /api/reviews/:id - Xoa danh gia
 */
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = String(req.user.id);
    const isAdmin = req.user.role === 'admin';

    try {
      const review = await Review.findByPk(id);
      if (!review) return res.status(404).json({ success: false, message: 'Khong tim thay danh gia.' });
      if (String(review.userId) !== userId && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Ban chi co the xoa danh gia cua minh.' });
      }
      await review.destroy();
    } catch {
      const review = inMemoryReviews.get(parseInt(id));
      if (!review) return res.status(404).json({ success: false, message: 'Khong tim thay danh gia.' });
      if (String(review.userId) !== userId && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Ban chi co the xoa danh gia cua minh.' });
      }
      inMemoryReviews.delete(parseInt(id));
    }

    return res.status(200).json({ success: true, message: 'Xoa danh gia thanh cong!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi xoa danh gia.', error: err.message });
  }
};

/**
 * PUT /api/reviews/admin/reply/:id - Admin tra loi danh gia
 * PUT /api/reviews/admin/status/:id - Admin doi trang thai (duyet/an/xoa)
 */
export const adminReplyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply, status } = req.body;

    const updates = {};
    if (adminReply !== undefined) updates.adminReply = adminReply;
    if (status !== undefined) updates.status = status;

    try {
      await Review.update(updates, { where: { id } });
    } catch {
      const review = inMemoryReviews.get(parseInt(id));
      if (review) Object.assign(review, updates);
    }

    return res.status(200).json({ success: true, message: 'Cap nhat danh gia thanh cong!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi cap nhat danh gia.', error: err.message });
  }
};

/**
 * GET /api/reviews/admin/all - Admin lay tat ca danh gia
 */
export const adminGetAllReviews = async (req, res) => {
  try {
    let reviews = [];

    try {
      reviews = await Review.findAll({ order: [['createdAt', 'DESC']] });
    } catch {
      reviews = [...inMemoryReviews.values()];
    }

    return res.status(200).json({ success: true, reviews });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi lay danh gia.', error: err.message });
  }
};
