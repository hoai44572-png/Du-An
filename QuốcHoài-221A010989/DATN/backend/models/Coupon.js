import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// Model Ma Giam Gia (Coupon)
export const Coupon = sequelize.define('Coupons', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discountType: {
    type: DataTypes.STRING,
    allowNull: false, // 'percent' hoac 'fixed'
  },
  discountValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  minOrderValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  maxDiscount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
  },
  usedCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true,
});
