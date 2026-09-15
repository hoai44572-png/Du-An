import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// Model San pham Yeu thich (Wishlist)
export const Wishlist = sequelize.define('Wishlists', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});
