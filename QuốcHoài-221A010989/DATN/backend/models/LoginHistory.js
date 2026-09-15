import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const LoginHistory = sequelize.define('LoginHistories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  loginTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '127.0.0.1',
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'success', // 'success', 'failed', 'locked'
  },
  deviceInfo: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Desktop / Browser',
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'local', // 'local', 'google', 'facebook', 'microsoft', 'github', 'apple'
  },
  browser: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  os: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  device: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Việt Nam',
  },
}, {
  timestamps: true,
});
