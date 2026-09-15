import express from 'express';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware.js';
import {
  getCustomers,
  getCustomerDetails,
  toggleLockCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';

const router = express.Router();

// GET /api/customers - Lấy danh sách khách hàng (Admin)
router.get('/', getCustomers);

// GET /api/customers/:id - Chi tiết khách hàng + Thống kê + Lịch sử mua hàng + Lịch sử giao dịch + Lịch sử đăng nhập
router.get('/:id', getCustomerDetails);

// PUT /api/customers/:id/toggle-lock - Khóa / Mở khóa tài khoản
router.put('/:id/toggle-lock', toggleLockCustomer);

// PUT /api/customers/:id - Cập nhật thông tin khách hàng
router.put('/:id', updateCustomer);

// DELETE /api/customers/:id - Xóa tài khoản khách hàng
router.delete('/:id', deleteCustomer);

export default router;
