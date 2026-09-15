import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * Model sản phẩm — đầy đủ thông tin để hiển thị trên website khách hàng
 * Hỗ trợ soft delete: deletedAt !== null = đã xóa mềm
 */
export const Product = sequelize.define('Products', {
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
    allowNull: true,
    unique: true,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Categories',
      key: 'id',
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  salePrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
  },
  costPrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  sold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  variants: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: '[{size:"S",priceOffset:0},{size:"M",priceOffset:5000}]',
  },
  status: {
    type: DataTypes.ENUM('active', 'hidden', 'out_of_stock', 'deleted'),
    allowNull: false,
    defaultValue: 'active',
  },
  featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tasting: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  weight: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 4.8,
  },
  reviewsCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Chi tiết sản phẩm tự do: độ rang, xuất xứ, loại hạt...',
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    comment: 'Soft delete timestamp',
  },
}, {
  timestamps: true,
  paranoid: false, // Tự xử lý soft delete bằng deletedAt + status
});
