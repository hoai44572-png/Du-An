import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Transaction = sequelize.define('Transactions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  transactionCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  orderCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  paymentTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'vnpay',
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'completed', // 'completed', 'pending', 'failed', 'refunded'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  referenceCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});
