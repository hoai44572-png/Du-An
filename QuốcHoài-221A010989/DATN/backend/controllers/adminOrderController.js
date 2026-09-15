import { Order, OrderItem, AdminActivityLog } from '../models/index.js';
import { Op } from 'sequelize';

const logActivity = async (adminId, adminName, action, description, targetId, req) => {
  try {
    await AdminActivityLog.create({
      adminId, adminName, action, module: 'ORDER',
      description, targetId: String(targetId || ''),
      ipAddress: req?.ip || 'unknown',
      userAgent: req?.headers?.['user-agent'] || 'unknown',
    });
  } catch (err) {
    console.warn('⚠️ Không ghi được order log:', err.message);
  }
};

/**
 * GET /api/admin/orders — Lấy tất cả đơn hàng (Admin)
 * Query: ?search=&status=&paymentStatus=&page=1&limit=20
 */
export const getAdminOrders = async (req, res) => {
  try {
    const { search, status, paymentStatus, page = 1, limit = 20, dateFrom, dateTo } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { orderCode: { [Op.like]: `%${search}%` } },
        { customerName: { [Op.like]: `%${search}%` } },
        { customerPhone: { [Op.like]: `%${search}%` } },
        { customerEmail: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status && status !== 'ALL') where.orderStatus = status;
    if (paymentStatus && paymentStatus !== 'ALL') where.paymentStatus = paymentStatus;

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt[Op.gte] = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = end;
      }
    }

    const orders = await Order.findAndCountAll({
      where,
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    return res.status(200).json({
      success: true,
      orders: orders.rows,
      total: orders.count,
      page: Number(page),
      totalPages: Math.ceil(orders.count / Number(limit)),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách đơn hàng.', error: err.message });
  }
};

/**
 * GET /api/admin/orders/:id — Chi tiết đơn hàng
 */
export const getAdminOrderDetail = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { [Op.or]: [{ id: req.params.id }, { orderCode: req.params.id }] },
      include: [{ model: OrderItem, as: 'items' }],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
    }

    return res.status(200).json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết đơn hàng.', error: err.message });
  }
};

/**
 * PUT /api/admin/orders/:id/status — Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const validStatuses = ['pending', 'preparing', 'shipping', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái đơn hàng không hợp lệ.' });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
    }

    const updateData = {};
    if (status) updateData.orderStatus = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    await order.update(updateData);

    await logActivity(req.admin.id, req.admin.fullName, 'UPDATE_STATUS',
      `Cập nhật đơn hàng #${order.orderCode} → ${status || paymentStatus}`, order.id, req);

    return res.status(200).json({
      success: true,
      message: `Đã cập nhật đơn hàng #${order.orderCode}.`,
      order,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật đơn hàng.', error: err.message });
  }
};
