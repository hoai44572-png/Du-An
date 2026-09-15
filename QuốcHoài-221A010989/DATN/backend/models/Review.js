import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// Model Danh gia san pham (Review)
export const Review = sequelize.define('Reviews', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userAvatar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  images: {
    type: DataTypes.TEXT, // Rich JSON string of image URLs
    allowNull: true,
  },
  adminReply: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  verifiedPurchase: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'approved', // 'approved', 'pending', 'hidden'
  },
}, {
  timestamps: true,
});
