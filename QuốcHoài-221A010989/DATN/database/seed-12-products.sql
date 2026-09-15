-- ============================================================
-- SEED DATA: 12 Sản phẩm cà phê mới
-- Swift Coffee Database — swift_coffee_db
-- Chạy file này sau khi MySQL đang hoạt động
-- ============================================================

USE swift_coffee_db;

-- Bước 1: Đảm bảo có danh mục (tạo nếu chưa có)
INSERT IGNORE INTO `Categories` (`name`, `slug`, `description`, `icon`, `status`, `sortOrder`, `createdAt`, `updatedAt`)
VALUES
  ('Rang nhạt', 'rang-nhat', 'Cà phê rang nhạt, hương hoa và trái cây', '🌸', 'active', 1, NOW(), NOW()),
  ('Rang vừa', 'rang-vua', 'Cà phê rang vừa, cân bằng và đậm đà', '☕', 'active', 2, NOW(), NOW()),
  ('Rang đậm', 'rang-dam', 'Cà phê rang đậm, mạnh mẽ và nồng nàn', '🔥', 'active', 3, NOW(), NOW());

-- Bước 2: Lấy ID danh mục (dùng trong INSERT)
SET @cat_nhat = (SELECT id FROM `Categories` WHERE slug = 'rang-nhat' LIMIT 1);
SET @cat_vua  = (SELECT id FROM `Categories` WHERE slug = 'rang-vua'  LIMIT 1);
SET @cat_dam  = (SELECT id FROM `Categories` WHERE slug = 'rang-dam'  LIMIT 1);

-- Bước 3: Insert 12 sản phẩm mới
-- LƯU Ý: Dùng INSERT IGNORE để tránh lỗi nếu slug đã tồn tại
INSERT IGNORE INTO `Products`
  (`name`, `slug`, `categoryId`, `description`, `price`, `stock`, `sold`, `image`, `images`, `variants`, `status`, `featured`, `createdAt`, `updatedAt`)
VALUES

-- Sản phẩm 1
(
  'Cà Phê Rang Xay Alambé',
  'ca-phe-rang-xay-alambe',
  @cat_vua,
  'Cà phê rang xay Alambé - hương thơm dịu dàng, đậm đà và mịn màng. Phù hợp pha phin hoặc pour-over.',
  250000,
  100,
  0,
  '/products/SanPham-1.webp',
  '[]',
  '[]',
  'active',
  0,
  NOW(), NOW()
),

-- Sản phẩm 2
(
  'Cà phê Rang Xay Culi Highlands Coffee 200g',
  'ca-phe-rang-xay-culi-highlands-coffee-200g',
  @cat_dam,
  'Hạt cà phê Culi (Peaberry) từ vùng cao nguyên Đắk Lắk. Mạnh mẽ, đậm đà với hương socola đen đặc trưng.',
  290000,
  80,
  0,
  '/products/SanPham-2.webp',
  '[]',
  '[]',
  'active',
  0,
  NOW(), NOW()
),

-- Sản phẩm 3
(
  'Cà phê rang ESPRESSO BLEND',
  'ca-phe-rang-espresso-blend',
  @cat_dam,
  'Hỗn hợp cà phê đặc chế cho Espresso - đậm đà, crema dày, hậu vị caramel. Chuẩn vị ý đồ barista.',
  200000,
  150,
  0,
  '/products/SanPham-3.webp',
  '[]',
  '[]',
  'active',
  0,
  NOW(), NOW()
),

-- Sản phẩm 4
(
  'Cà phê rang xay GO! túi 400g',
  'ca-phe-rang-xay-go-tui-400g',
  @cat_vua,
  'Cà phê rang xay GO! túi 400g - thơm nhẹ, cân bằng, gợi hương trái cây nhiệt đới. Dùng được nhiều phương pháp pha.',
  390000,
  60,
  0,
  '/products/SanPham-4.webp',
  '[]',
  '[]',
  'active',
  0,
  NOW(), NOW()
),

-- Sản phẩm 5
(
  'Cà Phê rang xay đặc biệt',
  'ca-phe-rang-xay-dac-biet',
  @cat_vua,
  'Blend đặc biệt với công thức bí mật - hương hoa, vị ngọt dịu và phức hợp độc đáo. Sản phẩm giới hạn.',
  400000,
  50,
  0,
  '/products/SanPham-5.webp',
  '[]',
  '[]',
  'active',
  1,
  NOW(), NOW()
),

-- Sản phẩm 6 - GIÁ 3.650.000 VNĐ (ĐÚNG)
(
  'Cà Phê Rang Xay Nguyên Chất',
  'ca-phe-rang-xay-nguyen-chat-premium',
  @cat_nhat,
  'Cà phê nguyên chất cao cấp từ vùng Đắk Nông - tinh tế, hương hoa đặc biệt, dành cho những tâm hồn sành điệu. Sản phẩm cao cấp nhất trong dòng sản phẩm.',
  3650000,
  20,
  0,
  '/products/SanPham-6.webp',
  '[]',
  '[]',
  'active',
  1,
  NOW(), NOW()
),

-- Sản phẩm 7
(
  'Cà phê rang xay Robusta Lover',
  'ca-phe-rang-xay-robusta-lover',
  @cat_dam,
  'Dành cho những ai yêu Robusta thuần chất - nồng nàn, mạnh mẽ, hậu vị dài. Không pha trộn, 100% Robusta.',
  280000,
  90,
  0,
  '/products/SanPham-7.webp',
  '[]',
  '[]',
  'active',
  0,
  NOW(), NOW()
),

-- Sản phẩm 8
(
  'Cà phê Blended số 7 rang mộc nguyên chất 500 gram',
  'ca-phe-blended-so-7-rang-moc-nguyen-chat-500g',
  @cat_vua,
  'Blended số 7 rang mộc - mộc tự nhiên, đậm vừa và hài hoà. Gói 500g tiết kiệm cho gia đình.',
  390000,
  70,
  0,
  '/products/SanPham-8.webp',
  '[]',
  '[]',
  'active',
  0,
  NOW(), NOW()
),

-- Sản phẩm 9
(
  'Cà Phê Rang Mộc Chuyên Biệt',
  'ca-phe-rang-moc-chuyen-biet',
  @cat_nhat,
  'Cà phê rang mộc chuyên biệt từ Cầu Đất - nhẹ thanh, chua dịu đặc trưng, thơm lâu. Phù hợp pha cold brew và pour-over.',
  310000,
  85,
  0,
  '/products/SanPham-9.webp',
  '[]',
  '[]',
  'active',
  0,
  NOW(), NOW()
),

-- Sản phẩm 10
(
  'Cà phê rang xay cao cấp GO! túi 200g',
  'ca-phe-rang-xay-cao-cap-go-tui-200g',
  @cat_vua,
  'Phiên bản cao cấp của dòng GO! - mềm mại, dịu ngọt và tinh tế. Gói 200g tiện lợi khi đi du lịch.',
  345000,
  65,
  0,
  '/products/SanPham-10.webp',
  '[]',
  '[]',
  'active',
  0,
  NOW(), NOW()
),

-- Sản phẩm 11
(
  'Cà phê rang xay black K-Coffee túi 454g',
  'ca-phe-rang-xay-black-k-coffee-tui-454g',
  @cat_dam,
  'K-Coffee Black - đen đậm, mạnh mẽ với hương socola đắng đặc trưng. Lý tưởng cho Espresso và cà phê phin đậm.',
  290000,
  110,
  0,
  '/products/SanPham-11.jpg',
  '[]',
  '[]',
  'active',
  0,
  NOW(), NOW()
),

-- Sản phẩm 12
(
  'Cà Phê Rang Xay Expert Blend 2 KING COFFEE - Túi 500g',
  'ca-phe-rang-xay-expert-blend-2-king-coffee-500g',
  @cat_dam,
  'KING COFFEE Expert Blend 2 - công thức pha chế chuyên nghiệp: đậm đà, caramel và hạt dẻ. Lựa chọn của các barista.',
  410000,
  75,
  0,
  '/products/SanPham-12.webp',
  '[]',
  '[]',
  'active',
  1,
  NOW(), NOW()
);

-- Xác nhận kết quả
SELECT
  id,
  name,
  FORMAT(price, 0) AS gia_vnd,
  image,
  status
FROM `Products`
WHERE slug LIKE 'ca-phe-rang%'
   OR slug LIKE 'alambe%'
   OR slug LIKE '%highlands%'
   OR slug LIKE '%espresso%'
   OR slug LIKE '%go-tui%'
   OR slug LIKE '%dac-biet%'
   OR slug LIKE '%nguyen-chat%'
   OR slug LIKE '%robusta%'
   OR slug LIKE '%blended%'
   OR slug LIKE '%moc-chuyen%'
   OR slug LIKE '%k-coffee%'
   OR slug LIKE '%king-coffee%'
ORDER BY id DESC
LIMIT 15;
