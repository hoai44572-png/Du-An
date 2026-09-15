import bcrypt from 'bcryptjs';
import { generateTokens } from '../middlewares/auth.middleware.js';
import { sendWelcomeEmail, sendForgotPasswordEmail } from '../utils/emailService.js';
import { User, Address, Customer, LoginHistory, Notification, SocialAccount } from '../models/index.js';

// In-memory fallback
const inMemoryUsers = new Map();
const inMemoryCustomers = new Map();
const inMemoryAddresses = new Map();
const inMemorySocialAccounts = new Map();
const inMemoryLoginHistory = [];
let idCounter = 100;

const nextId = () => ++idCounter;

// ========= Helper Tìm kiếm User / Customer =========
const findUserByEmailOrPhone = async (email, phone) => {
  try {
    if (email) {
      const u = await User.findOne({ where: { email } });
      if (u) return u;
    }
    if (phone) {
      const u = await User.findOne({ where: { phone } });
      if (u) return u;
    }
    return null;
  } catch {
    return [...inMemoryUsers.values()].find((u) => u.email === email || (phone && u.phone === phone)) || null;
  }
};

const findCustomerByEmailOrPhone = async (email, phone) => {
  try {
    if (email) {
      const c = await Customer.findOne({ where: { email } });
      if (c) return c;
    }
    if (phone) {
      const c = await Customer.findOne({ where: { phone } });
      if (c) return c;
    }
    return null;
  } catch {
    return [...inMemoryCustomers.values()].find((c) => c.email === email || (phone && c.phone === phone)) || null;
  }
};

const findUserById = async (id) => {
  try {
    return await User.findByPk(id);
  } catch {
    return inMemoryUsers.get(String(id)) || null;
  }
};

// ========= AUTH CONTROLLERS =========

/**
 * POST /api/auth/register - Đăng ký tài khoản mới & Tự động tạo Hồ sơ Khách hàng
 */
export const register = async (req, res) => {
  try {
    const { name, fullName, email, password, phone, gender, dateOfBirth, address, username } = req.body;
    const displayName = name || fullName;

    if (!displayName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
    }

    // 1. Kiểm tra Email đã tồn tại chưa
    const existingUserByEmail = await findUserByEmailOrPhone(email, null);
    const existingCustByEmail = await findCustomerByEmailOrPhone(email, null);
    if (existingUserByEmail || existingCustByEmail) {
      return res.status(409).json({ success: false, message: 'Địa chỉ Email này đã tồn tại trong hệ thống.' });
    }

    // 2. Kiểm tra Số điện thoại đã tồn tại chưa (nếu có nhập phone)
    if (phone && phone.trim() !== '') {
      const existingUserByPhone = await findUserByEmailOrPhone(null, phone.trim());
      const existingCustByPhone = await findCustomerByEmailOrPhone(null, phone.trim());
      if (existingUserByPhone || existingCustByPhone) {
        return res.status(409).json({ success: false, message: 'Số điện thoại này đã được đăng ký bởi tài khoản khác.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    let newUser;
    let newCustomer;

    const customerCode = `KH${Date.now().toString().slice(-6)}`;
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    try {
      // Tạo User
      newUser = await User.create({
        name: displayName,
        email,
        password: hashedPassword,
        phone: phone || null,
        username: username || email.split('@')[0],
        gender: gender || 'Nam',
        dateOfBirth: dateOfBirth || null,
        avatar: defaultAvatar,
        role: 'user',
        status: 'active',
      });

      // Tự động lưu toàn bộ thông tin vào bảng Khách hàng (Customers)
      newCustomer = await Customer.create({
        userId: newUser.id,
        customerCode,
        fullName: displayName,
        email,
        phone: phone || null,
        gender: gender || 'Nam',
        dateOfBirth: dateOfBirth || null,
        address: address || '',
        username: username || email.split('@')[0],
        password: hashedPassword,
        avatar: defaultAvatar,
        registrationDate: new Date(),
        status: 'active',
        role: 'Customer',
        rewardPoints: 0,
        memberTier: 'Thành viên mới',
        totalOrders: 0,
        totalSpent: 0,
      });

      // Tạo thông báo chào mừng
      await Notification.create({
        userId: newUser.id,
        customerId: newCustomer.id,
        title: 'Chào mừng thành viên mới!',
        content: 'Cảm ơn bạn đã đăng ký tài khoản Swift Coffee. Bạn nhận được 50 điểm thưởng tích lũy.',
        type: 'system',
      }).catch(() => {});
    } catch (dbErr) {
      // In-memory Fallback
      const id = nextId();
      newUser = {
        id,
        name: displayName,
        email,
        password: hashedPassword,
        phone: phone || null,
        username: username || email.split('@')[0],
        avatar: defaultAvatar,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      newCustomer = {
        id,
        userId: id,
        customerCode,
        fullName: displayName,
        email,
        phone: phone || null,
        gender: gender || 'Nam',
        dateOfBirth: dateOfBirth || null,
        address: address || '',
        username: username || email.split('@')[0],
        avatar: defaultAvatar,
        registrationDate: new Date().toISOString(),
        status: 'active',
        role: 'Customer',
        rewardPoints: 0,
        memberTier: 'Thành viên mới',
        totalOrders: 0,
        totalSpent: 0,
      };
      inMemoryUsers.set(String(id), newUser);
      inMemoryCustomers.set(String(id), newCustomer);
    }

    sendWelcomeEmail({ email, name: displayName }).catch(() => {});

    const { accessToken, refreshToken } = generateTokens(newUser);

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công! Thông tin khách hàng đã được lưu.',
      user: {
        id: newUser.id,
        customerCode,
        name: displayName,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
        role: 'Customer',
        status: 'active',
        customerProfile: newCustomer,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đăng ký.', error: err.message });
  }
};

/**
 * POST /api/auth/login - Đăng nhập & Ghi lịch sử đăng nhập
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập Email / Tên đăng nhập và Mật khẩu.' });
    }

    // Tìm theo email hoặc username
    let user = await findUserByEmailOrPhone(email, null);
    let customer = null;

    try {
      if (!user) {
        user = await User.findOne({ where: { username: email } });
      }
      if (user) {
        customer = await Customer.findOne({ where: { userId: user.id } });
      }
    } catch {}

    if (!user && !customer) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập / Email hoặc mật khẩu không chính xác.' });
    }

    const targetUser = user || customer;
    const isMatch = await bcrypt.compare(password, targetUser.password);

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Browser';

    if (!isMatch) {
      // Ghi lịch sử thất bại
      try {
        await LoginHistory.create({
          userId: targetUser.id,
          customerId: customer ? customer.id : null,
          ipAddress: String(clientIp),
          userAgent: String(userAgent),
          status: 'failed',
        });
      } catch {}
      return res.status(401).json({ success: false, message: 'Tên đăng nhập / Email hoặc mật khẩu không chính xác.' });
    }

    // KIỂM TRA TRẠNG THÁI TÀI KHOẢN (LOCKED)
    if (targetUser.status === 'locked' || (customer && customer.status === 'locked')) {
      try {
        await LoginHistory.create({
          userId: targetUser.id,
          customerId: customer ? customer.id : null,
          ipAddress: String(clientIp),
          userAgent: String(userAgent),
          status: 'locked',
        });
      } catch {}
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đã bị KHÓA. Vui lòng liên hệ bộ phận hỗ trợ khách hàng Swift Coffee!',
      });
    }

    // Ghi nhận lịch sử đăng nhập thành công
    try {
      await LoginHistory.create({
        userId: targetUser.id,
        customerId: customer ? customer.id : null,
        loginTime: new Date(),
        ipAddress: String(clientIp),
        userAgent: String(userAgent),
        status: 'success',
      });
    } catch {
      inMemoryLoginHistory.push({
        userId: targetUser.id,
        customerId: customer ? customer.id : null,
        loginTime: new Date().toISOString(),
        ipAddress: String(clientIp),
        userAgent: String(userAgent),
        status: 'success',
      });
    }

    const { accessToken, refreshToken } = generateTokens(targetUser);

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        id: targetUser.id,
        customerCode: customer ? customer.customerCode : `KH${targetUser.id}`,
        name: targetUser.name || customer?.fullName,
        email: targetUser.email,
        phone: targetUser.phone || customer?.phone,
        avatar: targetUser.avatar || customer?.avatar,
        role: targetUser.role || 'Customer',
        status: targetUser.status || 'active',
        customerProfile: customer || targetUser,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đăng nhập.', error: err.message });
  }
};

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Vui lòng nhập Email.' });

    const user = await findUserByEmailOrPhone(email, null);
    if (!user) {
      return res.status(200).json({ success: true, message: 'Nếu email tồn tại, bạn sẽ nhận được mã OTP trong giây lát.' });
    }

    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    try {
      await User.update({ otpCode, otpExpiresAt }, { where: { email } });
    } catch {
      user.otpCode = otpCode;
      user.otpExpiresAt = otpExpiresAt;
    }

    await sendForgotPasswordEmail({ email, name: user.name, otpCode });

    return res.status(200).json({ success: true, message: 'Mã OTP đã được gửi đến email của bạn.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi gửi email OTP.', error: err.message });
  }
};

/**
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;

    if (!email || !otpCode || !newPassword) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đặt lại mật khẩu.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    }

    const user = await findUserByEmailOrPhone(email, null);
    if (!user || user.otpCode !== otpCode) {
      return res.status(400).json({ success: false, message: 'Mã OTP không hợp lệ.' });
    }
    if (user.otpExpiresAt && new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({ success: false, message: 'Mã OTP đã hết hạn. Vui lòng thử lại.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    try {
      await User.update({ password: hashedPassword, otpCode: null, otpExpiresAt: null }, { where: { email } });
      await Customer.update({ password: hashedPassword }, { where: { email } });
    } catch {
      user.password = hashedPassword;
      user.otpCode = null;
    }

    return res.status(200).json({ success: true, message: 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi đặt lại mật khẩu.', error: err.message });
  }
};

// ========= USER PROFILE CONTROLLERS =========

/**
 * GET /api/auth/profile - Lấy thông tin cá nhân
 */
export const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });

    let customer = null;
    try {
      customer = await Customer.findOne({ where: { userId: user.id } });
    } catch {}

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        customerCode: customer ? customer.customerCode : `KH${user.id}`,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        username: user.username,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        customerProfile: customer,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy thông tin người dùng.', error: err.message });
  }
};

/**
 * PUT /api/auth/profile - Cập nhật thông tin cá nhân & Ảnh đại diện
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar, gender, dateOfBirth, address, username } = req.body;
    const userId = req.user.id;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (avatar) updates.avatar = avatar;
    if (gender) updates.gender = gender;
    if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
    if (username) updates.username = username;

    try {
      await User.update(updates, { where: { id: userId } });
      const custUpdates = { ...updates };
      if (name) custUpdates.fullName = name;
      if (address) custUpdates.address = address;
      await Customer.update(custUpdates, { where: { userId } });
    } catch {
      const user = inMemoryUsers.get(String(userId));
      if (user) Object.assign(user, updates);
    }

    const updatedUser = await findUserById(userId);
    let updatedCustomer = null;
    try {
      updatedCustomer = await Customer.findOne({ where: { userId } });
    } catch {}

    return res.status(200).json({
      success: true,
      message: 'Cập nhật hồ sơ cá nhân thành công!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        customerProfile: updatedCustomer,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật thông tin.', error: err.message });
  }
};

/**
 * PUT /api/auth/change-password - Đổi mật khẩu
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    }

    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mật khẩu hiện tại không chính xác.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    try {
      await User.update({ password: hashedPassword }, { where: { id: userId } });
      await Customer.update({ password: hashedPassword }, { where: { userId } });
    } catch {
      const memUser = inMemoryUsers.get(String(userId));
      if (memUser) memUser.password = hashedPassword;
    }

    return res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi đổi mật khẩu.', error: err.message });
  }
};

// ========= ADDRESS CONTROLLERS =========

export const getAddresses = async (req, res) => {
  try {
    const userId = String(req.user.id);
    let addresses;

    try {
      addresses = await Address.findAll({ where: { userId }, order: [['isDefault', 'DESC'], ['createdAt', 'DESC']] });
    } catch {
      addresses = (inMemoryAddresses.get(userId) || []);
    }

    return res.status(200).json({ success: true, addresses });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách địa chỉ.', error: err.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = String(req.user.id);
    const { fullName, phone, province, district, ward, streetAddress, isDefault } = req.body;

    if (!fullName || !phone || !province || !district || !ward || !streetAddress) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin địa chỉ.' });
    }

    let newAddr;

    try {
      if (isDefault) await Address.update({ isDefault: false }, { where: { userId } });
      newAddr = await Address.create({ userId, fullName, phone, province, district, ward, streetAddress, isDefault: !!isDefault });
    } catch {
      const id = nextId();
      newAddr = { id, userId, fullName, phone, province, district, ward, streetAddress, isDefault: !!isDefault, createdAt: new Date().toISOString() };
      const list = inMemoryAddresses.get(userId) || [];
      if (isDefault) list.forEach(a => a.isDefault = false);
      list.push(newAddr);
      inMemoryAddresses.set(userId, list);
    }

    return res.status(201).json({ success: true, message: 'Thêm địa chỉ giao hàng thành công!', address: newAddr });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi thêm địa chỉ.', error: err.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = String(req.user.id);
    const { fullName, phone, province, district, ward, streetAddress, isDefault } = req.body;

    try {
      if (isDefault) await Address.update({ isDefault: false }, { where: { userId } });
      await Address.update({ fullName, phone, province, district, ward, streetAddress, isDefault: !!isDefault }, { where: { id, userId } });
    } catch {
      const list = inMemoryAddresses.get(userId) || [];
      if (isDefault) list.forEach(a => a.isDefault = false);
      const addr = list.find(a => String(a.id) === String(id));
      if (addr) Object.assign(addr, { fullName, phone, province, district, ward, streetAddress, isDefault: !!isDefault });
    }

    return res.status(200).json({ success: true, message: 'Cập nhật địa chỉ thành công!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật địa chỉ.', error: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = String(req.user.id);

    try {
      await Address.destroy({ where: { id, userId } });
    } catch {
      const list = inMemoryAddresses.get(userId) || [];
      inMemoryAddresses.set(userId, list.filter(a => String(a.id) !== String(id)));
    }

    return res.status(200).json({ success: true, message: 'Xóa địa chỉ thành công!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi xóa địa chỉ.', error: err.message });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = String(req.user.id);

    try {
      await Address.update({ isDefault: false }, { where: { userId } });
      await Address.update({ isDefault: true }, { where: { id, userId } });
    } catch {
      const list = inMemoryAddresses.get(userId) || [];
      list.forEach(a => a.isDefault = String(a.id) === String(id));
    }

    return res.status(200).json({ success: true, message: 'Đã đặt địa chỉ mặc định!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật địa chỉ mặc định.', error: err.message });
  }
};

/**
 * POST /api/auth/social-login
 * Đăng nhập / Đăng ký tự động bằng tài khoản Mạng xã hội (Google, Facebook, Microsoft, GitHub, Apple)
 */
export const socialLogin = async (req, res) => {
  try {
    const { provider, providerId, email, name, avatar } = req.body;

    const validProviders = ['google', 'facebook', 'microsoft', 'github', 'apple'];
    if (!provider || !validProviders.includes(provider.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Nhà cung cấp mạng xã hội không hợp lệ. Hỗ trợ: Google, Facebook, Microsoft, GitHub, Apple.',
      });
    }

    const normProvider = provider.toLowerCase();
    const pid = providerId || `soc_${normProvider}_${Date.now()}`;
    const userEmail = email ? email.toLowerCase().trim() : `${normProvider}_${pid}@social.swiftcoffee.com`;
    const displayName = name || `Thành viên ${normProvider.toUpperCase()}`;
    const userAvatar = avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    let user = null;
    let customer = null;

    // 1. Thử tìm bằng email
    user = await findUserByEmailOrPhone(userEmail, null);
    customer = await findCustomerByEmailOrPhone(userEmail, null);

    // Thử tìm bằng SocialAccount nếu có
    if (!user) {
      try {
        const socAcc = await SocialAccount.findOne({ where: { provider: normProvider, providerId: pid } });
        if (socAcc) {
          user = await User.findByPk(socAcc.userId);
          if (user) customer = await Customer.findOne({ where: { userId: user.id } });
        }
      } catch {
        const socList = [...inMemorySocialAccounts.values()];
        const match = socList.find(s => s.provider === normProvider && s.providerId === pid);
        if (match) {
          user = inMemoryUsers.get(String(match.userId));
          customer = inMemoryCustomers.get(String(match.userId));
        }
      }
    }

    // 2. Nếu chưa có User -> Tự động tạo tài khoản mới
    if (!user) {
      const customerCode = `KH${Date.now().toString().slice(-6)}`;

      try {
        user = await User.create({
          name: displayName,
          email: userEmail,
          password: null,
          avatar: userAvatar,
          role: 'user',
          provider: normProvider,
          providerId: pid,
          isEmailVerified: true,
          status: 'active',
        });

        customer = await Customer.create({
          userId: user.id,
          customerCode,
          fullName: displayName,
          email: userEmail,
          password: 'N/A',
          avatar: userAvatar,
          role: 'Customer',
          provider: normProvider,
          providerId: pid,
          status: 'active',
          registrationDate: new Date(),
        });
      } catch (dbErr) {
        const newId = nextId();
        user = {
          id: newId,
          name: displayName,
          email: userEmail,
          password: null,
          avatar: userAvatar,
          role: 'user',
          provider: normProvider,
          providerId: pid,
          isEmailVerified: true,
          status: 'active',
        };
        customer = {
          id: newId,
          userId: newId,
          customerCode,
          fullName: displayName,
          email: userEmail,
          avatar: userAvatar,
          role: 'Customer',
          provider: normProvider,
          providerId: pid,
          status: 'active',
        };
        inMemoryUsers.set(String(newId), user);
        inMemoryCustomers.set(String(newId), customer);
      }
    } else {
      if (!user.provider || user.provider === 'local') {
        try {
          await User.update({ provider: normProvider, providerId: pid }, { where: { id: user.id } });
        } catch {}
      }
    }

    // 3. Đảm bảo record SocialAccount tồn tại
    try {
      const existingSoc = await SocialAccount.findOne({ where: { userId: user.id, provider: normProvider } });
      if (!existingSoc) {
        await SocialAccount.create({
          userId: user.id,
          customerId: customer?.id || user.id,
          provider: normProvider,
          providerId: pid,
          email: userEmail,
          name: displayName,
          avatar: userAvatar,
        });
      }
    } catch {
      const socKey = `${user.id}_${normProvider}`;
      inMemorySocialAccounts.set(socKey, {
        id: nextId(),
        userId: user.id,
        customerId: customer?.id || user.id,
        provider: normProvider,
        providerId: pid,
        email: userEmail,
        name: displayName,
        avatar: userAvatar,
        connectedAt: new Date(),
      });
    }

    // 4. Ghi Lịch sử Đăng nhập (LoginHistory)
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Device';

    try {
      await LoginHistory.create({
        userId: user.id,
        customerId: customer?.id || user.id,
        loginTime: new Date(),
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        userAgent,
        status: 'success',
        deviceInfo: userAgent.includes('Mobile') ? 'Mobile App / Browser' : 'Desktop / Browser',
        provider: normProvider,
      });
    } catch {
      inMemoryLoginHistory.push({
        id: Date.now(),
        userId: user.id,
        customerId: customer?.id || user.id,
        loginTime: new Date(),
        ipAddress,
        userAgent,
        status: 'success',
        provider: normProvider,
      });
    }

    // 5. Tạo JWT Token & Trả về Response
    const tokenUserPayload = {
      id: user.id,
      email: user.email,
      role: customer?.role || user.role || 'Customer',
    };
    const tokens = generateTokens(tokenUserPayload);

    return res.status(200).json({
      success: true,
      message: `Đăng nhập bằng ${normProvider.toUpperCase()} thành công!`,
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        customerCode: customer?.customerCode || 'KH0001',
        name: user.name,
        email: user.email,
        phone: user.phone || customer?.phone || '',
        avatar: user.avatar,
        role: customer?.role || user.role || 'Customer',
        provider: normProvider,
        status: user.status || 'active',
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi xử lý đăng nhập mạng xã hội.',
      error: err.message,
    });
  }
};

/**
 * GET /api/auth/social-accounts - Lấy danh sách mạng xã hội đã liên kết
 */
export const getSocialAccounts = async (req, res) => {
  try {
    const userId = req.user.id;
    let accounts = [];

    try {
      accounts = await SocialAccount.findAll({ where: { userId } });
    } catch {
      accounts = [...inMemorySocialAccounts.values()].filter(a => String(a.userId) === String(userId));
    }

    return res.status(200).json({
      success: true,
      socialAccounts: accounts,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách tài khoản liên kết.', error: err.message });
  }
};

/**
 * POST /api/auth/social-link - Liên kết tài khoản mạng xã hội mới
 */
export const linkSocialAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { provider, providerId, email, name, avatar } = req.body;

    if (!provider) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin nhà cung cấp.' });
    }

    const normProvider = provider.toLowerCase();
    const pid = providerId || `soc_${normProvider}_${Date.now()}`;

    try {
      const existing = await SocialAccount.findOne({ where: { userId, provider: normProvider } });
      if (existing) {
        return res.status(400).json({ success: false, message: `Tài khoản đã liên kết với ${normProvider.toUpperCase()} trước đó.` });
      }

      await SocialAccount.create({
        userId,
        provider: normProvider,
        providerId: pid,
        email,
        name,
        avatar,
      });
    } catch {
      const socKey = `${userId}_${normProvider}`;
      inMemorySocialAccounts.set(socKey, {
        id: Date.now(),
        userId,
        provider: normProvider,
        providerId: pid,
        email,
        name,
        avatar,
        connectedAt: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      message: `Đã liên kết thành công tài khoản ${normProvider.toUpperCase()}!`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi liên kết tài khoản.', error: err.message });
  }
};

/**
 * DELETE /api/auth/social-unlink/:provider - Hủy liên kết tài khoản mạng xã hội
 */
export const unlinkSocialAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { provider } = req.params;
    const normProvider = provider.toLowerCase();

    let user = await findUserById(userId);
    let linkedAccounts = [];

    try {
      linkedAccounts = await SocialAccount.findAll({ where: { userId } });
    } catch {
      linkedAccounts = [...inMemorySocialAccounts.values()].filter(a => String(a.userId) === String(userId));
    }

    if (!user?.password && linkedAccounts.length <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Bạn phải tạo mật khẩu hoặc liên kết ít nhất 1 phương thức đăng nhập khác trước khi hủy liên kết tài khoản này.',
      });
    }

    try {
      await SocialAccount.destroy({ where: { userId, provider: normProvider } });
    } catch {
      const socKey = `${userId}_${normProvider}`;
      inMemorySocialAccounts.delete(socKey);
    }

    return res.status(200).json({
      success: true,
      message: `Đã hủy liên kết tài khoản ${normProvider.toUpperCase()} thành công!`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi hủy liên kết tài khoản.', error: err.message });
  }
};

/**
 * PUT /api/auth/set-password - Thiết lập mật khẩu cho tài khoản chỉ dùng Social Login
 */
export const setSocialPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    try {
      await User.update({ password: hashedPassword }, { where: { id: userId } });
      await Customer.update({ password: hashedPassword }, { where: { userId } });
    } catch {
      const u = inMemoryUsers.get(String(userId));
      if (u) u.password = hashedPassword;
    }

    return res.status(200).json({
      success: true,
      message: 'Thiết lập mật khẩu thành công! Bạn có thể dùng email & mật khẩu này để đăng nhập.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi thiết lập mật khẩu.', error: err.message });
  }
};
