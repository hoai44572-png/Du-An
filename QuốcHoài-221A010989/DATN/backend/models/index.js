import { Order } from './Order.js';
import { OrderItem } from './OrderItem.js';
import { Payment } from './Payment.js';
import { User } from './User.js';
import { Address } from './Address.js';
import { Review } from './Review.js';
import { Wishlist } from './Wishlist.js';
import { Coupon } from './Coupon.js';
import { InventoryLog } from './InventoryLog.js';
import { AuditLog } from './AuditLog.js';
import { Customer } from './Customer.js';
import { Transaction } from './Transaction.js';
import { LoginHistory } from './LoginHistory.js';
import { Notification } from './Notification.js';
import { RewardPoints } from './RewardPoints.js';
import { SocialAccount } from './SocialAccount.js';
import { Admin } from './Admin.js';
import { Product } from './Product.js';
import { Category } from './Category.js';
import { AdminActivityLog } from './AdminActivityLog.js';

// ===== Quan he giua cac Model =====

// User <-> Customer (1-1)
User.hasOne(Customer, { foreignKey: 'userId', as: 'customerProfile' });
Customer.belongsTo(User, { foreignKey: 'userId', as: 'userAccount' });

// User <-> SocialAccount (1-n)
User.hasMany(SocialAccount, { foreignKey: 'userId', as: 'socialAccounts' });
SocialAccount.belongsTo(User, { foreignKey: 'userId', as: 'userAccount' });

// Customer <-> SocialAccount (1-n)
Customer.hasMany(SocialAccount, { foreignKey: 'customerId', as: 'socialAccounts' });
SocialAccount.belongsTo(Customer, { foreignKey: 'customerId', as: 'customerInfo' });

// Order <-> OrderItem (1-n)
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Order <-> Payment (1-n)
Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

// Order <-> Transaction (1-n)
Order.hasMany(Transaction, { foreignKey: 'orderId', as: 'transactions' });
Transaction.belongsTo(Order, { foreignKey: 'orderId', as: 'orderInfo' });

// Customer <-> Order (1-n)
Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customerInfo' });

// Customer <-> Transaction (1-n)
Customer.hasMany(Transaction, { foreignKey: 'customerId', as: 'transactions' });
Transaction.belongsTo(Customer, { foreignKey: 'customerId', as: 'customerInfo' });

// Customer <-> LoginHistory (1-n)
Customer.hasMany(LoginHistory, { foreignKey: 'customerId', as: 'loginHistories' });
LoginHistory.belongsTo(Customer, { foreignKey: 'customerId', as: 'customerInfo' });

// Customer <-> Notification (1-n)
Customer.hasMany(Notification, { foreignKey: 'customerId', as: 'notifications' });
Notification.belongsTo(Customer, { foreignKey: 'customerId', as: 'customerInfo' });

// Customer <-> RewardPoints (1-n)
Customer.hasMany(RewardPoints, { foreignKey: 'customerId', as: 'rewardPointsHistory' });
RewardPoints.belongsTo(Customer, { foreignKey: 'customerId', as: 'customerInfo' });

// User <-> Address (1-n)
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'userId' });

// User <-> Review (1-n)
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId' });

// User <-> Wishlist (1-n)
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlists' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });

// ===== Quan he moi: Admin / Product / Category =====

// Category <-> Product (1-n)
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Admin <-> AdminActivityLog (1-n)
Admin.hasMany(AdminActivityLog, { foreignKey: 'adminId', as: 'activityLogs' });
AdminActivityLog.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });

export {
  Order,
  OrderItem,
  Payment,
  User,
  Address,
  Review,
  Wishlist,
  Coupon,
  InventoryLog,
  AuditLog,
  Customer,
  Transaction,
  LoginHistory,
  Notification,
  RewardPoints,
  SocialAccount,
  Admin,
  Product,
  Category,
  AdminActivityLog,
};
