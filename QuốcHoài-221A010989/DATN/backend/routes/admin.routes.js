import express from 'express';
import { verifyAdminToken, requireRole } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/security.middleware.js';

// Controllers
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminMe,
  getAdminList,
  updateAdminProfile,
  changeAdminPassword,
  updateAdminStatus,
} from '../controllers/adminAuthController.js';

import {
  getProducts,
  getPublicProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

import {
  getDashboardStats,
  getRevenueData,
  getOrdersData,
  getTopProducts,
  getRecentOrders,
  getTopCustomers,
} from '../controllers/adminDashboardController.js';

import {
  getAdminOrders,
  getAdminOrderDetail,
  updateOrderStatus,
} from '../controllers/adminOrderController.js';

import {
  getAdminCustomers,
  getAdminCustomerDetail,
  updateCustomerStatus,
} from '../controllers/adminCustomerController.js';

import { AdminActivityLog } from '../models/index.js';

const router = express.Router();

// ===== AUTH ROUTES (không cần token) =====

// POST /api/admin/register — Đăng ký Admin (admin đầu tiên tự động là SUPER_ADMIN)
router.post('/register', authLimiter, registerAdmin);

// POST /api/admin/login — Đăng nhập Admin
router.post('/login', authLimiter, loginAdmin);

// ===== PUBLIC PRODUCT ROUTES (khách hàng dùng - không cần admin token) =====

// GET /api/admin/products/public — Lấy sản phẩm active cho website khách hàng
router.get('/products/public', getPublicProducts);

// ===== AUTH ROUTES (cần Admin Token) =====

// POST /api/admin/logout
router.post('/logout', verifyAdminToken, logoutAdmin);

// GET /api/admin/me — Thông tin Admin đang đăng nhập
router.get('/me', verifyAdminToken, getAdminMe);

// GET /api/admin/list — Danh sách Admin (SUPER_ADMIN only)
router.get('/list', verifyAdminToken, requireRole('SUPER_ADMIN'), getAdminList);

// PUT /api/admin/profile — Cập nhật hồ sơ
router.put('/profile', verifyAdminToken, updateAdminProfile);

// PUT /api/admin/change-password — Đổi mật khẩu
router.put('/change-password', verifyAdminToken, changeAdminPassword);

// PUT /api/admin/:id/status — Thay đổi status Admin (SUPER_ADMIN only)
router.put('/:id/status', verifyAdminToken, requireRole('SUPER_ADMIN'), updateAdminStatus);

// ===== PRODUCT ROUTES =====

// GET /api/admin/products — Danh sách sản phẩm
router.get('/products', verifyAdminToken, getProducts);

// GET /api/admin/products/:id — Chi tiết sản phẩm
router.get('/products/:id', verifyAdminToken, getProductById);

// POST /api/admin/products — Tạo sản phẩm mới
router.post('/products', verifyAdminToken, requireRole('SUPER_ADMIN', 'ADMIN'), createProduct);

// PUT /api/admin/products/:id — Cập nhật sản phẩm
router.put('/products/:id', verifyAdminToken, requireRole('SUPER_ADMIN', 'ADMIN'), updateProduct);

// DELETE /api/admin/products/:id — Xóa sản phẩm
router.delete('/products/:id', verifyAdminToken, requireRole('SUPER_ADMIN', 'ADMIN'), deleteProduct);

// ===== CATEGORY ROUTES =====

// GET /api/admin/categories — Danh sách danh mục (không cần token để frontend khách hàng dùng)
router.get('/categories', getCategories);

// POST /api/admin/categories — Tạo danh mục
router.post('/categories', verifyAdminToken, requireRole('SUPER_ADMIN', 'ADMIN'), createCategory);

// PUT /api/admin/categories/:id — Cập nhật danh mục
router.put('/categories/:id', verifyAdminToken, requireRole('SUPER_ADMIN', 'ADMIN'), updateCategory);

// DELETE /api/admin/categories/:id — Xóa danh mục
router.delete('/categories/:id', verifyAdminToken, requireRole('SUPER_ADMIN', 'ADMIN'), deleteCategory);

// ===== DASHBOARD ROUTES =====

// GET /api/admin/dashboard — Tổng hợp số liệu
router.get('/dashboard', verifyAdminToken, getDashboardStats);

// GET /api/admin/dashboard/revenue — Doanh thu theo ngày
router.get('/dashboard/revenue', verifyAdminToken, getRevenueData);

// GET /api/admin/dashboard/orders — Đơn hàng theo tháng
router.get('/dashboard/orders', verifyAdminToken, getOrdersData);

// GET /api/admin/dashboard/top-products — Sản phẩm bán chạy
router.get('/dashboard/top-products', verifyAdminToken, getTopProducts);

// GET /api/admin/dashboard/recent-orders — Đơn hàng mới nhất
router.get('/dashboard/recent-orders', verifyAdminToken, getRecentOrders);

// GET /api/admin/dashboard/top-customers — Khách hàng VIP
router.get('/dashboard/top-customers', verifyAdminToken, getTopCustomers);

// ===== ORDER ROUTES =====

// GET /api/admin/orders — Danh sách đơn hàng
router.get('/orders', verifyAdminToken, getAdminOrders);

// GET /api/admin/orders/:id — Chi tiết đơn hàng
router.get('/orders/:id', verifyAdminToken, getAdminOrderDetail);

// PUT /api/admin/orders/:id/status — Cập nhật trạng thái
router.put('/orders/:id/status', verifyAdminToken, requireRole('SUPER_ADMIN', 'ADMIN'), updateOrderStatus);

// ===== CUSTOMER ROUTES =====

// GET /api/admin/customers — Danh sách khách hàng
router.get('/customers', verifyAdminToken, getAdminCustomers);

// GET /api/admin/customers/:id — Chi tiết khách hàng
router.get('/customers/:id', verifyAdminToken, getAdminCustomerDetail);

// PUT /api/admin/customers/:id/status — Khóa/mở khóa
router.put('/customers/:id/status', verifyAdminToken, requireRole('SUPER_ADMIN', 'ADMIN'), updateCustomerStatus);

// ===== ACTIVITY LOG ROUTES =====

// GET /api/admin/logs — Lịch sử thao tác Admin
router.get('/logs', verifyAdminToken, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { page = 1, limit = 50, module, action } = req.query;
    const where = {};
    if (module) where.module = module;
    if (action) where.action = action;

    const logs = await AdminActivityLog.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    return res.status(200).json({
      success: true,
      logs: logs.rows,
      total: logs.count,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy activity log.', error: err.message });
  }
});

export default router;
