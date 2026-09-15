import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * Model tài khoản Admin - tách biệt với bảng Users (khách hàng)
 * Hỗ trợ phân quyền: SUPER_ADMIN, ADMIN, STAFF
 */
export const Admin = sequelize.define('Admins', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  role: {
    type: DataTypes.ENUM('SUPER_ADMIN', 'ADMIN', 'STAFF'),
    allowNull: false,
    defaultValue: 'ADMIN',
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'LOCKED'),
    allowNull: false,
    defaultValue: 'ACTIVE',
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true, // createdAt, updatedAt tự động
});
