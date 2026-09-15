import { Customer, User, Order } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * GET /api/admin/customers — Lấy danh sách khách hàng từ Database
 */
export const getAdminCustomers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status && status !== 'ALL') where.status = status;

    // Thử lấy từ Customer model trước
    try {
      const customers = await Customer.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
        attributes: [
          'id', 'fullName', 'email', 'phone', 'avatar',
          'status', 'totalOrders', 'totalSpent', 'createdAt', 'updatedAt',
        ],
      });

      return res.status(200).json({
        success: true,
        customers: customers.rows,
        total: customers.count,
        page: Number(page),
        totalPages: Math.ceil(customers.count / Number(limit)),
      });
    } catch {
      // Fallback: lấy từ User model nếu Customer không có
      const userWhere = { role: 'user' };
      if (search) {
        userWhere[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ];
      }

      const users = await User.findAndCountAll({
        where: userWhere,
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
        attributes: ['id', 'name', 'email', 'phone', 'avatar', 'status', 'createdAt'],
      });

      const mapped = users.rows.map(u => ({
        id: u.id,
        fullName: u.name,
        email: u.email,
        phone: u.phone,
        avatar: u.avatar,
        status: u.status,
        totalOrders: 0,
        totalSpent: 0,
        createdAt: u.createdAt,
      }));

      return res.status(200).json({
        success: true,
        customers: mapped,
        total: users.count,
        page: Number(page),
        totalPages: Math.ceil(users.count / Number(limit)),
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách khách hàng.', error: err.message });
  }
};

/**
 * GET /api/admin/customers/:id — Chi tiết khách hàng + lịch sử đơn hàng
 */
export const getAdminCustomerDetail = async (req, res) => {
  try {
    let customer = null;

    try {
      customer = await Customer.findByPk(req.params.id, {
        include: [{
          model: Order,
          as: 'orders',
          order: [['createdAt', 'DESC']],
          limit: 20,
        }],
      });
    } catch {
      // fallback to User
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password', 'otpCode', 'otpExpiresAt'] },
      });
      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng.' });
      }
      return res.status(200).json({ success: true, customer: user, orders: [] });
    }

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng.' });
    }

    return res.status(200).json({ success: true, customer });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết khách hàng.', error: err.message });
  }
};

/**
 * PUT /api/admin/customers/:id/status — Khóa/mở khóa khách hàng
 */
export const updateCustomerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'locked'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status không hợp lệ.' });
    }

    // Thử cập nhật Customer
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (customer) {
        await customer.update({ status });
        return res.status(200).json({ success: true, message: `Đã ${status === 'locked' ? 'khóa' : 'mở khóa'} tài khoản.` });
      }
    } catch {}

    // Fallback: cập nhật User
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng.' });
    }
    await user.update({ status });

    return res.status(200).json({ success: true, message: `Đã ${status === 'locked' ? 'khóa' : 'mở khóa'} tài khoản.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật khách hàng.', error: err.message });
  }
};
