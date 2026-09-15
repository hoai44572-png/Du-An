import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

/**
 * Cau hinh Bao mat Helmet HTTP Headers
 */
export const helmetSecurity = helmet({
  contentSecurityPolicy: false, // Disables CSP default to prevent breaking cross-origin resources in dev
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

/**
 * Rate Limiter phong chong DDOS va Brute force
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phut
  max: 300, // Toi da 300 request / 15 phut cho 1 IP
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu từ IP của bạn. Vui lòng thử lại sau 15 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Limiter cho cac API nhay cảm nhu Auth/Payment
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Toi da 30 luot dang nhap/OTP trong 15 phut
  message: {
    success: false,
    message: 'Thao tác quá nhanh. Vui lòng thử lại sau ít phút.',
  },
});

/**
 * Helper Validate du lieu dau vao va Upload File
 */
export const validateUpload = (req, res, next) => {
  const file = req.file || req.files;
  if (file) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const fileSizeLimit = 5 * 1024 * 1024; // 5MB limit
    
    // Check type if single file
    if (file.mimetype && !allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Định dạng file không hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP.',
      });
    }

    if (file.size && file.size > fileSizeLimit) {
      return res.status(400).json({
        success: false,
        message: 'Kích thước file quá lớn. Tối đa 5MB.',
      });
    }
  }
  next();
};
