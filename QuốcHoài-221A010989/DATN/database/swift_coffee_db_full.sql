-- ============================================================
-- SWIFT COFFEE E-COMMERCE DATABASE SCRIPT
-- Database Engine: MySQL 8.0+ / MariaDB
-- Charset: utf8mb4, Collation: utf8mb4_unicode_ci
-- Project: Swift Coffee - Đồ Án Tốt Nghiệp
-- ============================================================

CREATE DATABASE IF NOT EXISTS `swift_coffee_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `swift_coffee_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. BẢNG NGUỜI DÙNG (Users)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NULL,
  `phone` VARCHAR(50) NULL,
  `avatar` TEXT NULL DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  `role` VARCHAR(50) NOT NULL DEFAULT 'user',
  `provider` VARCHAR(50) NOT NULL DEFAULT 'local',
  `providerId` VARCHAR(255) NULL,
  `isEmailVerified` TINYINT(1) NOT NULL DEFAULT 1,
  `username` VARCHAR(100) NULL UNIQUE,
  `gender` VARCHAR(20) NULL DEFAULT 'Nam',
  `dateOfBirth` VARCHAR(50) NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `otpCode` VARCHAR(20) NULL,
  `otpExpiresAt` DATETIME NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. BẢNG KHÁCH HÀNG (Customers)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `Customers`;
CREATE TABLE `Customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NULL,
  `customerCode` VARCHAR(50) NOT NULL UNIQUE,
  `fullName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(50) NULL,
  `gender` VARCHAR(20) NULL DEFAULT 'Nam',
  `dateOfBirth` VARCHAR(50) NULL,
  `address` TEXT NULL,
  `username` VARCHAR(100) NULL,
  `password` VARCHAR(255) NULL,
  `provider` VARCHAR(50) NOT NULL DEFAULT 'local',
  `providerId` VARCHAR(255) NULL,
  `avatar` TEXT NULL DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  `registrationDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `role` VARCHAR(50) NOT NULL DEFAULT 'Customer',
  `rewardPoints` INT NOT NULL DEFAULT 0,
  `memberTier` VARCHAR(50) NOT NULL DEFAULT 'Đồng',
  `totalOrders` INT NOT NULL DEFAULT 0,
  `totalSpent` DOUBLE NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_customers_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. BẢNG ADMIN (Admins)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `Admins`;
CREATE TABLE `Admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fullName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(50) NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `avatar` TEXT NULL,
  `role` ENUM('SUPER_ADMIN', 'ADMIN', 'STAFF') NOT NULL DEFAULT 'ADMIN',
  `status` ENUM('ACTIVE', 'INACTIVE', 'LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `lastLoginAt` DATETIME NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. BẢNG DANH MỤC SẢN PHẨM (Categories)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `Categories`;
CREATE TABLE `Categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `image` TEXT NULL,
  `icon` VARCHAR(50) NULL DEFAULT '☕',
  `status` ENUM('active', 'hidden') NOT NULL DEFAULT 'active',
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. BẢNG SẢN PHẨM (Products)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `Products`;
CREATE TABLE `Products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NULL UNIQUE,
  `sku` VARCHAR(100) NULL UNIQUE,
  `categoryId` INT NULL,
  `description` TEXT NULL,
  `price` FLOAT NOT NULL DEFAULT 0,
  `salePrice` FLOAT NULL DEFAULT NULL,
  `costPrice` FLOAT NULL DEFAULT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `sold` INT NOT NULL DEFAULT 0,
  `image` TEXT NULL,
  `images` JSON NULL,
  `variants` JSON NULL,
  `status` ENUM('active', 'hidden', 'out_of_stock', 'deleted') NOT NULL DEFAULT 'active',
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `origin` VARCHAR(255) NULL,
  `tasting` VARCHAR(255) NULL,
  `brand` VARCHAR(255) NULL,
  `weight` VARCHAR(100) NULL,
  `rating` FLOAT NULL DEFAULT 4.8,
  `reviewsCount` INT NULL DEFAULT 0,
  `details` JSON NULL,
  `deletedAt` DATETIME NULL DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_products_category` FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. BẢNG ĐƠN HÀNG (Orders)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `Orders`;
CREATE TABLE `Orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderCode` VARCHAR(100) NOT NULL UNIQUE,
  `userId` VARCHAR(100) NULL DEFAULT 'GUEST',
  `customerId` INT NULL,
  `customerName` VARCHAR(255) NOT NULL,
  `customerPhone` VARCHAR(50) NOT NULL,
  `customerEmail` VARCHAR(255) NOT NULL,
  `shippingAddress` TEXT NOT NULL,
  `note` TEXT NULL,
  `total` FLOAT NOT NULL,
  `shippingFee` FLOAT NOT NULL DEFAULT 0,
  `discount` FLOAT NOT NULL DEFAULT 0,
  `paymentMethod` VARCHAR(50) NOT NULL,
  `paymentStatus` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `orderStatus` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customerId`) REFERENCES `Customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. BẢNG CHI TIẾT ĐƠN HÀNG (OrderItems)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `OrderItems`;
CREATE TABLE `OrderItems` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderId` INT NOT NULL,
  `productId` INT NULL,
  `productName` VARCHAR(255) NOT NULL,
  `size` VARCHAR(50) NULL DEFAULT NULL,
  `quantity` INT NOT NULL,
  `price` FLOAT NOT NULL,
  CONSTRAINT `fk_orderitems_order` FOREIGN KEY (`orderId`) REFERENCES `Orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_orderitems_product` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. BẢNG THANH TOÁN (Payments)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `Payments`;
CREATE TABLE `Payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderId` INT NOT NULL,
  `paymentMethod` VARCHAR(50) NOT NULL,
  `transactionId` VARCHAR(255) NULL,
  `amount` FLOAT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `paidAt` DATETIME NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`orderId`) REFERENCES `Orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. BẢNG GIAO DỊCH (Transactions)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `Transactions`;
CREATE TABLE `Transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transactionCode` VARCHAR(100) NOT NULL UNIQUE,
  `orderId` INT NULL,
  `orderCode` VARCHAR(100) NULL,
  `userId` INT NULL,
  `customerId` INT NULL,
  `paymentTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `paymentMethod` VARCHAR(50) NOT NULL DEFAULT 'vnpay',
  `amount` DOUBLE NOT NULL DEFAULT 0,
  `status` VARCHAR(50) NOT NULL DEFAULT 'completed',
  `content` TEXT NULL,
  `referenceCode` VARCHAR(255) NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_transactions_order` FOREIGN KEY (`orderId`) REFERENCES `Orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_transactions_customer` FOREIGN KEY (`customerId`) REFERENCES `Customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 10. BẢNG SỔ ĐỊA CHỈ (Addresses)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `Addresses`;
CREATE TABLE `Addresses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` VARCHAR(100) NOT NULL,
  `fullName` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `province` VARCHAR(255) NOT NULL,
  `district` VARCHAR(255) NOT NULL,
  `ward` VARCHAR(255) NOT NULL,
  `streetAddress` TEXT NOT NULL,
  `isDefault` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 11. BẢNG ĐÁNH GIÁ SẢN PHẨM (Reviews)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `Reviews`;
CREATE TABLE `Reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` VARCHAR(100) NOT NULL,
  `userName` VARCHAR(255) NOT NULL,
  `userAvatar` TEXT NULL,
  `productId` VARCHAR(100) NOT NULL,
  `orderId` VARCHAR(100) NULL,
  `rating` INT NOT NULL,
  `comment` TEXT NOT NULL,
  `images` TEXT NULL,
  `adminReply` TEXT NULL,
  `verifiedPurchase` TINYINT(1) NOT NULL DEFAULT 1,
  `status` VARCHAR(50) NOT NULL DEFAULT 'approved',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 12. BẢNG SẢN PHẨM YÊU THÍCH (Wishlists)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `Wishlists`;
CREATE TABLE `Wishlists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` VARCHAR(100) NOT NULL,
  `productId` VARCHAR(100) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 13. BẢNG MÃ GIẢM GIÁ (Coupons)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `Coupons`;
CREATE TABLE `Coupons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(100) NOT NULL UNIQUE,
  `discountType` VARCHAR(50) NOT NULL,
  `discountValue` FLOAT NOT NULL,
  `minOrderValue` FLOAT NOT NULL DEFAULT 0,
  `maxDiscount` FLOAT NULL,
  `usageLimit` INT NOT NULL DEFAULT 100,
  `usedCount` INT NOT NULL DEFAULT 0,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `expiresAt` DATETIME NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 14. BẢNG THÔNG BÁO (Notifications)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `Notifications`;
CREATE TABLE `Notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NULL,
  `customerId` INT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `type` VARCHAR(50) NOT NULL DEFAULT 'system',
  `isRead` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notifications_customer` FOREIGN KEY (`customerId`) REFERENCES `Customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 15. BẢNG LỊCH SỬ ĐĂNG NHẬP (LoginHistories)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `LoginHistories`;
CREATE TABLE `LoginHistories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NULL,
  `customerId` INT NULL,
  `loginTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ipAddress` VARCHAR(50) NULL DEFAULT '127.0.0.1',
  `userAgent` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'success',
  `deviceInfo` VARCHAR(255) NULL DEFAULT 'Desktop / Browser',
  `provider` VARCHAR(50) NOT NULL DEFAULT 'local',
  `browser` VARCHAR(100) NULL,
  `os` VARCHAR(100) NULL,
  `device` VARCHAR(100) NULL,
  `country` VARCHAR(100) NULL DEFAULT 'Việt Nam',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_loginhistories_customer` FOREIGN KEY (`customerId`) REFERENCES `Customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 16. BẢNG ĐIỂM THƯỞNG (RewardPoints)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `RewardPoints`;
CREATE TABLE `RewardPoints` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NULL,
  `customerId` INT NULL,
  `points` INT NOT NULL,
  `action` VARCHAR(50) NOT NULL DEFAULT 'earn',
  `description` VARCHAR(255) NULL,
  `orderId` INT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_rewardpoints_customer` FOREIGN KEY (`customerId`) REFERENCES `Customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 17. BẢNG TÀI KHOẢN MẠNG XÃ HỘI (SocialAccounts)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `SocialAccounts`;
CREATE TABLE `SocialAccounts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `customerId` INT NULL,
  `provider` VARCHAR(50) NOT NULL,
  `providerId` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL,
  `name` VARCHAR(255) NULL,
  `avatar` TEXT NULL,
  `connectedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_socialaccounts_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_socialaccounts_customer` FOREIGN KEY (`customerId`) REFERENCES `Customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 18. BẢNG LỊCH SỬ KHO (InventoryLogs)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `InventoryLogs`;
CREATE TABLE `InventoryLogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` VARCHAR(100) NOT NULL,
  `productName` VARCHAR(255) NOT NULL,
  `changeQuantity` INT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `note` TEXT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 19. BẢNG AUDIT LOG HỆ THỐNG (AuditLogs)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `AuditLogs`;
CREATE TABLE `AuditLogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` VARCHAR(100) NULL,
  `userEmail` VARCHAR(255) NULL,
  `action` VARCHAR(255) NOT NULL,
  `endpoint` VARCHAR(255) NULL,
  `ip` VARCHAR(50) NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
  `details` TEXT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 20. BẢNG NHẬT KÝ THAO TÁC ADMIN (AdminActivityLogs)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `AdminActivityLogs`;
CREATE TABLE `AdminActivityLogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `adminId` INT NOT NULL,
  `adminName` VARCHAR(255) NULL,
  `action` VARCHAR(100) NOT NULL,
  `module` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `targetId` VARCHAR(100) NULL,
  `ipAddress` VARCHAR(50) NULL,
  `userAgent` TEXT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_adminactivitylogs_admin` FOREIGN KEY (`adminId`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- DỮ LIỆU MẪU (SEED DATA FOR TESTING)
-- ============================================================

-- 1. Insert Admins mẫu
INSERT INTO `Admins` (`id`, `fullName`, `email`, `phone`, `passwordHash`, `role`, `status`, `createdAt`, `updatedAt`)
VALUES
  (1, 'Super Admin', 'admin@swiftcoffee.com', '0901234567', '$2b$10$e.w2T3sR.o.X218G1Wv8I.S2Gv56yZqH9hH1w3.K1L90xJ1', 'SUPER_ADMIN', 'ACTIVE', NOW(), NOW()),
  (2, 'Nhân viên Quản Lý', 'staff@swiftcoffee.com', '0909876543', '$2b$10$e.w2T3sR.o.X218G1Wv8I.S2Gv56yZqH9hH1w3.K1L90xJ1', 'STAFF', 'ACTIVE', NOW(), NOW());

-- 2. Insert Users & Customers mẫu
INSERT INTO `Users` (`id`, `name`, `email`, `password`, `phone`, `role`, `status`, `createdAt`, `updatedAt`)
VALUES
  (1, 'Nguyễn Văn A', 'customer1@gmail.com', '$2b$10$e.w2T3sR.o.X218G1Wv8I.S2Gv56yZqH9hH1w3.K1L90xJ1', '0912345678', 'user', 'active', NOW(), NOW()),
  (2, 'Trần Thị B', 'customer2@gmail.com', '$2b$10$e.w2T3sR.o.X218G1Wv8I.S2Gv56yZqH9hH1w3.K1L90xJ1', '0987654321', 'user', 'active', NOW(), NOW());

INSERT INTO `Customers` (`id`, `userId`, `customerCode`, `fullName`, `email`, `phone`, `address`, `status`, `role`, `rewardPoints`, `memberTier`, `totalOrders`, `totalSpent`, `createdAt`, `updatedAt`)
VALUES
  (1, 1, 'KH00001', 'Nguyễn Văn A', 'customer1@gmail.com', '0912345678', '123 Nguyễn Huệ, Quận 1, TP.HCM', 'active', 'Customer', 150, 'Bạc', 3, 1250000, NOW(), NOW()),
  (2, 2, 'KH00002', 'Trần Thị B', 'customer2@gmail.com', '0987654321', '456 Lê Lợi, Quận 3, TP.HCM', 'active', 'Customer', 500, 'Vàng', 5, 3800000, NOW(), NOW());

-- 3. Insert Danh mục
INSERT INTO `Categories` (`id`, `name`, `slug`, `description`, `icon`, `status`, `sortOrder`, `createdAt`, `updatedAt`)
VALUES
  (1, 'Rang nhạt', 'rang-nhat', 'Cà phê rang nhạt, hương hoa và trái cây', '🌸', 'active', 1, NOW(), NOW()),
  (2, 'Rang vừa', 'rang-vua', 'Cà phê rang vừa, cân bằng và đậm đà', '☕', 'active', 2, NOW(), NOW()),
  (3, 'Rang đậm', 'rang-dam', 'Cà phê rang đậm, mạnh mẽ và nồng nàn', '🔥', 'active', 3, NOW(), NOW());

-- 4. Insert Sản phẩm
INSERT INTO `Products` (`id`, `name`, `slug`, `sku`, `categoryId`, `description`, `price`, `stock`, `sold`, `image`, `status`, `featured`, `createdAt`, `updatedAt`)
VALUES
  (1, 'Cà Phê Rang Xay Alambé', 'ca-phe-rang-xay-alambe', 'SKU-ALAMBE', 2, 'Cà phê rang xay Alambé - hương thơm dịu dàng, đậm đà.', 250000, 100, 12, '/products/SanPham-1.webp', 'active', 1, NOW(), NOW()),
  (2, 'Cà phê Rang Xay Culi Highlands Coffee 200g', 'ca-phe-rang-xay-culi-highlands-coffee-200g', 'SKU-CULI-200G', 3, 'Hạt cà phê Culi (Peaberry) từ vùng cao nguyên Đắk Lắk.', 290000, 80, 25, '/products/SanPham-2.webp', 'active', 1, NOW(), NOW()),
  (3, 'Cà phê rang ESPRESSO BLEND', 'ca-phe-rang-espresso-blend', 'SKU-ESP-BLEND', 3, 'Hỗn hợp cà phê đặc chế cho Espresso - đậm đà, crema dày.', 200000, 150, 40, '/products/SanPham-3.webp', 'active', 0, NOW(), NOW()),
  (4, 'Cà Phê Rang Xay Nguyên Chất Premium', 'ca-phe-rang-xay-nguyen-chat-premium', 'SKU-PREMIUM-3650', 1, 'Cà phê nguyên chất cao cấp nhất trong dòng sản phẩm.', 3650000, 20, 5, '/products/SanPham-6.webp', 'active', 1, NOW(), NOW());

-- 5. Insert Mã giảm giá
INSERT INTO `Coupons` (`id`, `code`, `discountType`, `discountValue`, `minOrderValue`, `maxDiscount`, `usageLimit`, `usedCount`, `isActive`, `expiresAt`, `createdAt`, `updatedAt`)
VALUES
  (1, 'SWIFT10', 'percent', 10, 200000, 50000, 100, 15, 1, '2026-12-31 23:59:59', NOW(), NOW()),
  (2, 'SWIFT20', 'percent', 20, 500000, 100000, 50, 8, 1, '2026-12-31 23:59:59', NOW(), NOW());

-- 6. Insert Đơn hàng mẫu
INSERT INTO `Orders` (`id`, `orderCode`, `userId`, `customerId`, `customerName`, `customerPhone`, `customerEmail`, `shippingAddress`, `note`, `total`, `shippingFee`, `discount`, `paymentMethod`, `paymentStatus`, `orderStatus`, `createdAt`, `updatedAt`)
VALUES
  (1, 'TT882910', '1', 1, 'Nguyễn Văn A', '0912345678', 'customer1@gmail.com', '123 Nguyễn Huệ, Quận 1, TP.HCM', 'Giao giờ hành chính', 540000, 0, 0, 'COD', 'Paid', 'completed', NOW(), NOW());

INSERT INTO `OrderItems` (`id`, `orderId`, `productId`, `productName`, `size`, `quantity`, `price`)
VALUES
  (1, 1, 1, 'Cà Phê Rang Xay Alambé', 'Gói 500g', 1, 250000),
  (2, 1, 2, 'Cà phê Rang Xay Culi Highlands Coffee 200g', 'Gói 200g', 1, 290000);

-- 7. Insert Thanh toán
INSERT INTO `Payments` (`id`, `orderId`, `paymentMethod`, `transactionId`, `amount`, `status`, `paidAt`, `createdAt`, `updatedAt`)
VALUES
  (1, 1, 'COD', 'TXN_COD_882910', 540000, 'Paid', NOW(), NOW(), NOW());
