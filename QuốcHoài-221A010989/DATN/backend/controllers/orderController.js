import { Order, OrderItem } from '../models/index.js';
import { sendOrderCompletedEmail } from '../utils/emailService.js';

// In-memory fallback khi chua co MySQL
const inMemoryOrders = new Map();

// Helper: Tim don hang theo ma don
const findOrder = async (orderCode) => {
  try {
    return await Order.findOne({
      where: { orderCode },
      include: [{ model: OrderItem, as: 'items' }],
    });
  } catch {
    return inMemoryOrders.get(orderCode) || null;
  }
};

/**
 * GET /api/orders/my-orders - Lay danh sach don hang cua nguoi dung hien tai
 */
export const getMyOrders = async (req, res) => {
  try {
    const userId = String(req.user.id);
    let orders = [];

    try {
      orders = await Order.findAll({
        where: { userId },
        include: [{ model: OrderItem, as: 'items' }],
        order: [['createdAt', 'DESC']],
      });
    } catch {
      // Fallback: Tra ve don hang tu in-memory
      orders = [...inMemoryOrders.values()].filter(o => String(o.userId) === userId);
    }

    return res.status(200).json({ success: true, orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi lay danh sach don hang.', error: err.message });
  }
};

/**
 * GET /api/orders/:orderCode - Lay chi tiet don hang theo ma
 */
export const getOrderDetail = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const userId = String(req.user.id);

    const order = await findOrder(orderCode);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Khong tim thay don hang.' });
    }

    // Kiem tra quyen truy cap: Chi duoc xem don hang cua minh (tru Admin)
    if (String(order.userId) !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Ban khong co quyen xem don hang nay.' });
    }

    return res.status(200).json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi lay chi tiet don hang.', error: err.message });
  }
};

/**
 * PUT /api/orders/cancel/:orderCode - Huy don hang
 * Chi huy duoc khi trang thai la 'pending' hoac 'preparing'
 */
export const cancelOrder = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const userId = String(req.user.id);

    const order = await findOrder(orderCode);

    if (!order) return res.status(404).json({ success: false, message: 'Khong tim thay don hang.' });
    if (String(order.userId) !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Khong co quyen huy don hang nay.' });
    }

    const cancelableStatuses = ['pending', 'preparing'];
    if (!cancelableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Khong the huy don hang dang o trang thai "${order.orderStatus}". Chi huy duoc khi don chua van chuyen.`,
      });
    }

    try {
      await Order.update({ orderStatus: 'cancelled', paymentStatus: 'Cancelled' }, { where: { orderCode } });
    } catch {
      if (order) { order.orderStatus = 'cancelled'; order.paymentStatus = 'Cancelled'; }
    }

    return res.status(200).json({ success: true, message: 'Don hang da duoc huy thanh cong.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi huy don hang.', error: err.message });
  }
};

/**
 * PUT /api/orders/received/:orderCode - Xac nhan da nhan hang
 * Chuyen trang thai tu 'shipping' sang 'completed'
 */
export const markReceived = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const userId = String(req.user.id);

    const order = await findOrder(orderCode);
    if (!order) return res.status(404).json({ success: false, message: 'Khong tim thay don hang.' });
    if (String(order.userId) !== userId) {
      return res.status(403).json({ success: false, message: 'Khong co quyen cap nhat don hang nay.' });
    }

    if (order.orderStatus !== 'shipping') {
      return res.status(400).json({
        success: false,
        message: 'Chi co the xac nhan nhan hang khi don hang dang o trang thai "Dang giao".',
      });
    }

    try {
      await Order.update({ orderStatus: 'completed' }, { where: { orderCode } });
    } catch {
      if (order) order.orderStatus = 'completed';
    }

    // Gui email thong bao don hang hoan thanh
    if (order.customerEmail) {
      sendOrderCompletedEmail({
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        orderCode,
      }).catch(() => {});
    }

    return res.status(200).json({ success: true, message: 'Cam on ban! Don hang da duoc xac nhan hoan thanh.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi cap nhat trang thai don hang.', error: err.message });
  }
};

/**
 * POST /api/orders/reorder/:orderCode - Mua lai don hang
 * Tra ve danh sach san pham tu don hang cu de them vao gio hang
 */
export const reorder = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const userId = String(req.user.id);

    const order = await findOrder(orderCode);
    if (!order) return res.status(404).json({ success: false, message: 'Khong tim thay don hang.' });
    if (String(order.userId) !== userId) {
      return res.status(403).json({ success: false, message: 'Khong co quyen truy cap don hang nay.' });
    }

    // Lay danh sach san pham tu don hang cu
    const items = order.items || [];

    return res.status(200).json({
      success: true,
      message: 'Da lay danh sach san pham tu don hang cu!',
      items: items.map(item => ({
        id: item.productId,
        productId: item.productId,
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi xu ly mua lai don hang.', error: err.message });
  }
};
