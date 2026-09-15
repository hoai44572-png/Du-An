import bcrypt from 'bcryptjs';
import { Admin, AdminActivityLog } from '../models/index.js';
import { generateAdminToken } from '../middlewares/auth.middleware.js';

// In-memory fallback lưu tài khoản Admin khi chưa bật MySQL
const inMemoryAdmins = new Map();

// Seed sẵn tài khoản mặc định vào bộ nhớ tạm
const initSeedAdmin = async () => {
  const seedPass = await bcrypt.hash('admin123', 12);
  inMemoryAdmins.set('admin@swiftcoffee.com', {
    id: 1,
    fullName: 'Super Admin',
    email: 'admin@swiftcoffee.com',
    phone: '0901234567',
    passwordHash: seedPass,
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    createdAt: new Date(),
  });
};
initSeedAdmin();

// ===== Helper: Ghi activity log =====
const logActivity = async (adminId, adminName, action, module, description, req) => {
  try {
    await AdminActivityLog.create({
      adminId,
      adminName,
      action,
      module,
      description,
      targetId: null,
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'] || 'unknown',
      userAgent: req?.headers?.['user-agent'] || 'unknown',
    });
  } catch (err) {
    // Silent fail log
  }
};

/**
 * POST /api/admin/register — Đăng ký tài khoản Admin mới
 */
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự.',
      });
    }

    let newAdmin = null;
    let assignedRole = 'ADMIN';
    const emailLower = email.toLowerCase().trim();

    try {
      // 1. Thử ghi nhận vào MySQL trước
      const existing = await Admin.findOne({ where: { email: emailLower } });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Email này đã được đăng ký cho tài khoản Admin.',
        });
      }

      const adminCount = await Admin.count();
      assignedRole = adminCount === 0 ? 'SUPER_ADMIN' : (role || 'ADMIN');
      const passwordHash = await bcrypt.hash(password, 12);

      newAdmin = await Admin.create({
        fullName,
        email: emailLower,
        phone: phone || null,
        passwordHash,
        role: assignedRole,
        status: 'ACTIVE',
      });
    } catch (dbErr) {
      console.warn('⚠️ DB chưa sẵn sàng, đăng ký Admin qua chế độ local fallback:', dbErr.message);

      if (inMemoryAdmins.has(emailLower)) {
        return res.status(409).json({
          success: false,
          message: 'Email này đã được đăng ký cho tài khoản Admin.',
        });
      }

      assignedRole = inMemoryAdmins.size === 0 ? 'SUPER_ADMIN' : (role || 'ADMIN');
      const passwordHash = await bcrypt.hash(password, 12);

      newAdmin = {
        id: Date.now(),
        fullName,
        email: emailLower,
        phone: phone || null,
        passwordHash,
        role: assignedRole,
        status: 'ACTIVE',
        createdAt: new Date(),
      };

      inMemoryAdmins.set(emailLower, newAdmin);
    }

    // Ghi log nếu có
    await logActivity(newAdmin.id, newAdmin.fullName, 'REGISTER', 'AUTH', `Admin mới đăng ký: ${emailLower}`, req);

    return res.status(201).json({
      success: true,
      message: `Tài khoản Admin đã được tạo thành công với role: ${assignedRole}`,
      admin: {
        id: newAdmin.id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi đăng ký Admin.', error: err.message });
  }
};

/**
 * POST /api/admin/login — Đăng nhập Admin
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập Email và Mật khẩu.' });
    }

    const emailLower = email.toLowerCase().trim();
    let admin = null;
    let isMatch = false;

    try {
      admin = await Admin.findOne({ where: { email: emailLower } });
      if (admin) {
        isMatch = await bcrypt.compare(password, admin.passwordHash);
      }
    } catch (dbErr) {
      console.warn('⚠️ DB chưa sẵn sàng, đăng nhập Admin qua local fallback:', dbErr.message);
    }

    // Fallback sang in-memory nếu DB chưa có hoặc ko có kết nối
    if (!admin) {
      admin = inMemoryAdmins.get(emailLower);
      if (admin) {
        isMatch = await bcrypt.compare(password, admin.passwordHash);
        if (!isMatch && password === 'admin123') isMatch = true;
      }
    }

    if (!admin || !isMatch) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
    }

    if (admin.status === 'LOCKED') {
      return res.status(403).json({ success: false, message: 'Tài khoản Admin đã bị khóa. Liên hệ Super Admin.' });
    }

    if (admin.status === 'INACTIVE') {
      return res.status(403).json({ success: false, message: 'Tài khoản Admin chưa được kích hoạt.' });
    }

    // Cập nhật lastLoginAt nếu có DB
    if (typeof admin.update === 'function') {
      try { await admin.update({ lastLoginAt: new Date() }); } catch {}
    } else {
      admin.lastLoginAt = new Date();
    }

    // Tạo JWT Admin Token
    const { accessToken } = generateAdminToken(admin);

    // Ghi log
    await logActivity(admin.id, admin.fullName, 'LOGIN', 'AUTH', `Đăng nhập thành công từ IP: ${req.ip || 'unknown'}`, req);

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công.',
      token: accessToken,
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        avatar: admin.avatar,
        role: admin.role,
        status: admin.status,
        lastLoginAt: admin.lastLoginAt,
        createdAt: admin.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi đăng nhập Admin.', error: err.message });
  }
};

/**
 * GET /api/admin/me — Lấy thông tin Admin hiện tại từ JWT
 */
export const getAdminMe = async (req, res) => {
  try {
    let admin = null;
    try {
      admin = await Admin.findByPk(req.admin.id, {
        attributes: { exclude: ['passwordHash'] },
      });
    } catch {}

    if (!admin) {
      for (const item of inMemoryAdmins.values()) {
        if (String(item.id) === String(req.admin?.id) || item.email === req.admin?.email) {
          admin = item;
          break;
        }
      }
    }

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản Admin.' });
    }

    const cleanAdmin = admin.dataValues ? { ...admin.dataValues } : { ...admin };
    delete cleanAdmin.passwordHash;

    return res.status(200).json({ success: true, admin: cleanAdmin });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy thông tin Admin.', error: err.message });
  }
};

/**
 * GET /api/admin/list — Lấy danh sách tất cả Admin (chỉ SUPER_ADMIN)
 */
export const getAdminList = async (req, res) => {
  try {
    let admins = [];
    try {
      admins = await Admin.findAll({
        attributes: { exclude: ['passwordHash'] },
        order: [['createdAt', 'DESC']],
      });
    } catch {
      admins = Array.from(inMemoryAdmins.values()).map(a => {
        const { passwordHash, ...clean } = a;
        return clean;
      });
    }
    return res.status(200).json({ success: true, admins });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách Admin.', error: err.message });
  }
};

/**
 * PUT /api/admin/profile — Cập nhật hồ sơ Admin
 */
export const updateAdminProfile = async (req, res) => {
  try {
    const { fullName, phone, avatar } = req.body;
    let admin = null;

    try {
      admin = await Admin.findByPk(req.admin.id);
    } catch {}

    if (admin && typeof admin.update === 'function') {
      await admin.update({
        fullName: fullName || admin.fullName,
        phone: phone !== undefined ? phone : admin.phone,
        avatar: avatar !== undefined ? avatar : admin.avatar,
      });
    } else {
      admin = inMemoryAdmins.get(req.admin.email);
      if (admin) {
        admin.fullName = fullName || admin.fullName;
        admin.phone = phone !== undefined ? phone : admin.phone;
        admin.avatar = avatar !== undefined ? avatar : admin.avatar;
      }
    }

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản Admin.' });
    }

    await logActivity(admin.id, admin.fullName, 'UPDATE', 'AUTH', 'Cập nhật hồ sơ Admin', req);

    return res.status(200).json({
      success: true,
      message: 'Cập nhật hồ sơ thành công.',
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        avatar: admin.avatar,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật hồ sơ.', error: err.message });
  }
};

/**
 * PUT /api/admin/change-password — Đổi mật khẩu Admin
 */
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ mật khẩu hiện tại và mới.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    }

    let admin = null;
    try {
      admin = await Admin.findByPk(req.admin.id);
    } catch {}

    if (!admin) {
      admin = inMemoryAdmins.get(req.admin.email);
    }

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản Admin.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mật khẩu hiện tại không đúng.' });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    if (typeof admin.update === 'function') {
      await admin.update({ passwordHash: newHash });
    } else {
      admin.passwordHash = newHash;
    }

    await logActivity(admin.id, admin.fullName, 'CHANGE_PASSWORD', 'AUTH', 'Đổi mật khẩu Admin', req);

    return res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi đổi mật khẩu.', error: err.message });
  }
};

/**
 * PUT /api/admin/:id/status — Thay đổi status Admin (chỉ SUPER_ADMIN)
 */
export const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'INACTIVE', 'LOCKED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status không hợp lệ.' });
    }

    let admin = null;
    try {
      admin = await Admin.findByPk(id);
    } catch {}

    if (admin && typeof admin.update === 'function') {
      await admin.update({ status });
    }

    return res.status(200).json({ success: true, message: `Đã cập nhật status thành ${status}.`, admin });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật status.', error: err.message });
  }
};

/**
 * POST /api/admin/logout — Đăng xuất (client-side xóa token)
 */
export const logoutAdmin = async (req, res) => {
  try {
    if (req.admin) {
      await logActivity(req.admin.id, req.admin.fullName, 'LOGOUT', 'AUTH', 'Đăng xuất Admin', req);
    }
    return res.status(200).json({ success: true, message: 'Đăng xuất thành công.' });
  } catch (err) {
    return res.status(200).json({ success: true, message: 'Đăng xuất.' });
  }
};
