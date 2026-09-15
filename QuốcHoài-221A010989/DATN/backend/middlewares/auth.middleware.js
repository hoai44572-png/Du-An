import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'swift_coffee_jwt_secret_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'swift_coffee_refresh_secret_key_2026';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'swift_coffee_admin_jwt_secret_2026';

/**
 * Middleware xac thuc JWT Token cho khach hang (Users)
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    // Test/Dev fallback neu co auth token mockup hoac header bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Fallback dev mode check custom user id header neu co
      if (req.headers['x-user-id']) {
        req.user = {
          id: req.headers['x-user-id'],
          name: req.headers['x-user-name'] || 'Khách hàng',
          email: req.headers['x-user-email'] || 'customer@swiftcoffee.com',
          role: req.headers['x-user-role'] || 'user',
        };
        return next();
      }
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy Token xác thực. Vui lòng đăng nhập.',
      });
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token không hợp lệ hoặc đã hết hạn.',
        });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực Token hệ thống.',
      error: error.message,
    });
  }
};

/**
 * Middleware kiem tra quyen Admin (legacy - chi kiem tra role = 'admin')
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Quyền truy cập bị từ chối.Yêu cầu tài khoản Admin.',
    });
  }
  next();
};

/**
 * Middleware xac thuc JWT Token cho Admin (he thong phan quyen rieng)
 */
export const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy Admin Token. Vui lòng đăng nhập.',
      });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, ADMIN_JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Admin Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
        });
      }

      // Chắc chắn đây là Admin token (có trường isAdmin)
      if (!decoded.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Token không phải Admin Token.',
        });
      }

      req.admin = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực Admin Token.',
      error: error.message,
    });
  }
};

/**
 * Middleware kiểm tra role Admin
 * @param {...string} roles - Các role được phép: 'SUPER_ADMIN', 'ADMIN', 'STAFF'
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực Admin.',
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Quyền truy cập bị từ chối. Yêu cầu role: ${roles.join(' hoặc ')}.`,
        yourRole: req.admin.role,
      });
    }

    next();
  };
};

/**
 * Tao JWT Access Token & Refresh Token cho khach hang
 */
export const generateTokens = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'user',
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

/**
 * Tao JWT Token cho Admin
 */
export const generateAdminToken = (admin) => {
  const payload = {
    id: admin.id,
    fullName: admin.fullName,
    email: admin.email,
    role: admin.role,
    isAdmin: true,
  };

  const accessToken = jwt.sign(payload, ADMIN_JWT_SECRET, { expiresIn: '8h' });
  return { accessToken };
};
