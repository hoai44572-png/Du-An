import { sequelize } from '../config/db.js';
import { Order, Product, Customer, User } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * GET /api/admin/dashboard — Tổng hợp số liệu Dashboard từ Database
 */
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Tổng doanh thu (từ đơn hàng completed)
    const totalRevenueResult = await Order.sum('total', {
      where: { orderStatus: 'completed' }
    }).catch(() => 0);
    const totalRevenue = totalRevenueResult || 0;

    // Đơn hàng hôm nay
    const todayOrders = await Order.count({
      where: { createdAt: { [Op.between]: [today, todayEnd] } }
    }).catch(() => 0);

    // Đơn hàng tháng này
    const monthOrders = await Order.count({
      where: { createdAt: { [Op.gte]: monthStart } }
    }).catch(() => 0);

    // Tổng sản phẩm (đang kinh doanh)
    const totalProducts = await Product.count({
      where: { status: { [Op.in]: ['active', 'hidden', 'out_of_stock'] } }
    }).catch(() => 0);

    // Tổng khách hàng
    const totalCustomers = await Customer.count().catch(async () => {
      return await User.count({ where: { role: 'user' } }).catch(() => 0);
    });

    // Trạng thái đơn hàng
    const [pendingOrders, shippingOrders, completedOrders, cancelledOrders] = await Promise.all([
      Order.count({ where: { orderStatus: 'pending' } }).catch(() => 0),
      Order.count({ where: { orderStatus: { [Op.in]: ['shipping', 'preparing'] } } }).catch(() => 0),
      Order.count({ where: { orderStatus: 'completed' } }).catch(() => 0),
      Order.count({ where: { orderStatus: 'cancelled' } }).catch(() => 0),
    ]);

    // Khách hàng mới tuần này
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const newCustomersThisWeek = await Customer.count({
      where: { createdAt: { [Op.gte]: weekStart } }
    }).catch(() => 0);

    // Sản phẩm sắp hết hàng (stock <= 10)
    const lowStockCount = await Product.count({
      where: { stock: { [Op.lte]: 10 }, status: 'active' }
    }).catch(() => 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        todayOrders,
        monthOrders,
        totalProducts,
        totalCustomers,
        newCustomersThisWeek,
        lowStockCount,
        orderStatus: {
          pending: pendingOrders,
          shipping: shippingOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy Dashboard stats.', error: err.message });
  }
};

/**
 * GET /api/admin/dashboard/revenue — Doanh thu theo ngày (30 ngày gần nhất)
 */
export const getRevenueData = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const revenueData = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'],
      ],
      where: {
        orderStatus: 'completed',
        createdAt: { [Op.gte]: startDate },
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      raw: true,
    }).catch(() => []);

    return res.status(200).json({ success: true, revenueData });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy dữ liệu doanh thu.', error: err.message });
  }
};

/**
 * GET /api/admin/dashboard/orders — Đơn hàng theo tháng (12 tháng gần nhất)
 */
export const getOrdersData = async (req, res) => {
  try {
    const ordersData = await Order.findAll({
      attributes: [
        [sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        }
      },
      group: [
        sequelize.fn('YEAR', sequelize.col('createdAt')),
        sequelize.fn('MONTH', sequelize.col('createdAt')),
      ],
      order: [
        [sequelize.fn('YEAR', sequelize.col('createdAt')), 'ASC'],
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'ASC'],
      ],
      raw: true,
    }).catch(() => []);

    return res.status(200).json({ success: true, ordersData });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy dữ liệu đơn hàng.', error: err.message });
  }
};

/**
 * GET /api/admin/dashboard/top-products — Sản phẩm bán chạy
 */
export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Product.findAll({
      where: { status: { [Op.ne]: 'deleted' } },
      order: [['sold', 'DESC']],
      limit: 5,
      attributes: ['id', 'name', 'image', 'price', 'sold', 'stock'],
    }).catch(() => []);

    return res.status(200).json({ success: true, topProducts });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy top sản phẩm.', error: err.message });
  }
};

/**
 * GET /api/admin/dashboard/recent-orders — Đơn hàng mới nhất
 */
export const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
    }).catch(() => []);

    return res.status(200).json({ success: true, recentOrders });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy đơn hàng mới nhất.', error: err.message });
  }
};

/**
 * GET /api/admin/dashboard/top-customers — Khách hàng VIP (mua nhiều nhất)
 */
export const getTopCustomers = async (req, res) => {
  try {
    const topCustomers = await Customer.findAll({
      order: [['totalSpent', 'DESC']],
      limit: 5,
      attributes: ['id', 'fullName', 'email', 'phone', 'totalOrders', 'totalSpent', 'avatar'],
    }).catch(() => []);

    return res.status(200).json({ success: true, topCustomers });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy top khách hàng.', error: err.message });
  }
};
