import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// Model Nguoi dung (User) chuand MVC
export const User = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user', // 'user' hoac 'admin'
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'local', // 'local', 'google', 'facebook', 'microsoft', 'github', 'apple'
  },
  providerId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Nam',
  },
  dateOfBirth: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active', // 'active' hoac 'locked'
  },
  otpCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otpExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
});
