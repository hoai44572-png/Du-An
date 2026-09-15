import express from 'express';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/security.middleware.js';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  socialLogin,
  getSocialAccounts,
  linkSocialAccount,
  unlinkSocialAccount,
  setSocialPassword,
} from '../controllers/userController.js';

const router = express.Router();

// ===== Auth Routes =====
// POST /api/auth/register - Dang ky tai khoan
router.post('/register', authLimiter, register);

// POST /api/auth/login - Dang nhap
router.post('/login', authLimiter, login);

// POST /api/auth/social-login - Dang nhap bang Google, Facebook, Microsoft, GitHub, Apple
router.post('/social-login', authLimiter, socialLogin);

// POST /api/auth/forgot-password - Gui OTP quen mat khau
router.post('/forgot-password', authLimiter, forgotPassword);

// POST /api/auth/reset-password - Dat lai mat khau bang OTP
router.post('/reset-password', resetPassword);

// ===== Social Account Management Routes =====
// GET /api/auth/social-accounts - Lay danh sach mang xa hoi da lien ket
router.get('/social-accounts', verifyToken, getSocialAccounts);

// POST /api/auth/social-link - Lien ket tai khoan mang xa hoi moi
router.post('/social-link', verifyToken, linkSocialAccount);

// DELETE /api/auth/social-unlink/:provider - Huy lien ket mang xa hoi
router.delete('/social-unlink/:provider', verifyToken, unlinkSocialAccount);

// PUT /api/auth/set-password - Thiet lap mat khau moi cho tai khoan Social
router.put('/set-password', verifyToken, setSocialPassword);

// ===== Profile Routes (yeu cau xac thuc JWT) =====
// GET /api/auth/profile - Lay thong tin ca nhan
router.get('/profile', verifyToken, getProfile);

// PUT /api/auth/profile - Cap nhat thong tin ca nhan
router.put('/profile', verifyToken, updateProfile);

// PUT /api/auth/change-password - Doi mat khau
router.put('/change-password', verifyToken, changePassword);

// ===== Address Routes =====
// GET /api/auth/addresses - Lay so dia chi
router.get('/addresses', verifyToken, getAddresses);

// POST /api/auth/addresses - Them dia chi moi
router.post('/addresses', verifyToken, addAddress);

// PUT /api/auth/addresses/:id - Sua dia chi
router.put('/addresses/:id', verifyToken, updateAddress);

// DELETE /api/auth/addresses/:id - Xoa dia chi
router.delete('/addresses/:id', verifyToken, deleteAddress);

// PUT /api/auth/addresses/:id/default - Dat mac dinh
router.put('/addresses/:id/default', verifyToken, setDefaultAddress);

export default router;
