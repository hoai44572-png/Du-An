import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * Model lịch sử thao tác Admin — ghi lại mọi hành động quan trọng
 */
export const AdminActivityLog = sequelize.define('AdminActivityLogs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Admins',
      key: 'id',
    },
  },
  adminName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Snapshot tên Admin tại thời điểm thao tác',
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.',
  },
  module: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'PRODUCT, CATEGORY, ORDER, CUSTOMER, AUTH, etc.',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mô tả chi tiết hành động',
  },
  targetId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'ID của object bị tác động',
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  updatedAt: false, // Log chỉ cần createdAt
});
