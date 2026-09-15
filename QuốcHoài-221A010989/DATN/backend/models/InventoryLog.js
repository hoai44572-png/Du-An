import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// Model Lich su Nhap/Xuat kho (InventoryLog)
export const InventoryLog = sequelize.define('InventoryLogs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  changeQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, // 'sale', 'restock', 'adjustment'
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});
