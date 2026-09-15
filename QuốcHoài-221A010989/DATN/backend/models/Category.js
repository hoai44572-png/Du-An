import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * Model danh mục sản phẩm
 */
export const Category = sequelize.define('Categories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '☕',
  },
  status: {
    type: DataTypes.ENUM('active', 'hidden'),
    allowNull: false,
    defaultValue: 'active',
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});
