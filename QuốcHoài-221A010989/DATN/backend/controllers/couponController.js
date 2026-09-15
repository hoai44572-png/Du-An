import { Coupon } from '../models/index.js';

// Danh sach coupon in-memory fallback (seed data)
const seedCoupons = [
  {
    code: 'SWIFT10',
    discountType: 'percent',
    discountValue: 10,
    minOrderValue: 100000,
    maxDiscount: 50000,
    usageLimit: 100,
    usedCount: 0,
    isActive: true,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'NEWBIE20',
    discountType: 'percent',
    discountValue: 20,
    minOrderValue: 150000,
    maxDiscount: 80000,
    usageLimit: 50,
    usedCount: 0,
    isActive: true,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 30000,
    minOrderValue: 200000,
    maxDiscount: null,
    usageLimit: 200,
    usedCount: 0,
    isActive: true,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
];

const inMemoryCoupons = new Map(seedCoupons.map(c => [c.code, c]));

const findCoupon = async (code) => {
  try {
    return await Coupon.findOne({ where: { code: code.toUpperCase() } });
  } catch {
    return inMemoryCoupons.get(code.toUpperCase()) || null;
  }
};

/**
 * POST /api/coupons/validate - Kiem tra va tinh toan gia tri ma giam gia
 */
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderSubtotal } = req.body;

    if (!code) return res.status(400).json({ success: false, message: 'Vui long nhap ma giam gia.' });
    if (!orderSubtotal || orderSubtotal <= 0) {
      return res.status(400).json({ success: false, message: 'Gio hang trong. Vui long them san pham truoc.' });
    }

    const coupon = await findCoupon(code);

    if (!coupon) return res.status(404).json({ success: false, message: 'Ma giam gia khong ton tai.' });
    if (!coupon.isActive) return res.status(400).json({ success: false, message: 'Ma giam gia nay khong con hoat dong.' });
    if (new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({ success: false, message: 'Ma giam gia da het han su dung.' });
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Ma giam gia da het luot su dung.' });
    }
    if (orderSubtotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Don hang chua dat gia tri toi thieu. Can them ${new Intl.NumberFormat('vi-VN').format(coupon.minOrderValue - orderSubtotal)}đ nua de ap dung.`,
      });
    }

    // Tinh toan so tien giam
    let discountAmount = 0;

    if (coupon.discountType === 'percent') {
      discountAmount = (orderSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    } else if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(coupon.discountValue, orderSubtotal);
    }

    discountAmount = Math.round(discountAmount);

    return res.status(200).json({
      success: true,
      message: `Ma giam gia hop le! Ban duoc giam ${coupon.discountType === 'percent' ? coupon.discountValue + '%' : new Intl.NumberFormat('vi-VN').format(coupon.discountValue) + 'đ'}.`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi kiem tra ma giam gia.', error: err.message });
  }
};

/**
 * GET /api/coupons - Admin: Lay tat ca ma giam gia
 */
export const getAllCoupons = async (req, res) => {
  try {
    let coupons;
    try {
      coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    } catch {
      coupons = [...inMemoryCoupons.values()];
    }
    return res.status(200).json({ success: true, coupons });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi lay danh sach coupon.', error: err.message });
  }
};

/**
 * POST /api/coupons - Admin: Tao ma giam gia moi
 */
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue, maxDiscount, usageLimit, expiresAt } = req.body;

    if (!code || !discountType || !discountValue || !expiresAt) {
      return res.status(400).json({ success: false, message: 'Vui long nhap day du thong tin ma giam gia.' });
    }

    const upperCode = code.toUpperCase();
    const existing = await findCoupon(upperCode);
    if (existing) return res.status(409).json({ success: false, message: 'Ma giam gia nay da ton tai.' });

    let newCoupon;
    try {
      newCoupon = await Coupon.create({
        code: upperCode, discountType, discountValue: parseFloat(discountValue),
        minOrderValue: parseFloat(minOrderValue || 0),
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: parseInt(usageLimit || 100),
        expiresAt: new Date(expiresAt),
      });
    } catch {
      newCoupon = {
        code: upperCode, discountType, discountValue: parseFloat(discountValue),
        minOrderValue: parseFloat(minOrderValue || 0), maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: parseInt(usageLimit || 100), usedCount: 0, isActive: true,
        expiresAt: new Date(expiresAt),
      };
      inMemoryCoupons.set(upperCode, newCoupon);
    }

    return res.status(201).json({ success: true, message: 'Tao ma giam gia thanh cong!', coupon: newCoupon });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi tao ma giam gia.', error: err.message });
  }
};
