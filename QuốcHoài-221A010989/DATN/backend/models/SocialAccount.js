import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const SocialAccount = sequelize.define('SocialAccounts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false, // 'google', 'facebook', 'microsoft', 'github', 'apple'
  },
  providerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  connectedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});
