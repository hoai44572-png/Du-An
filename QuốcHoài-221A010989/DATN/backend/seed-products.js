/**
 * SEED SCRIPT — Thêm 12 sản phẩm cà phê vào database qua Sequelize
 * Chạy: node backend/seed-products.js
 * Yêu cầu: MySQL đang chạy, file .env đã cấu hình đúng
 */

import 'dotenv/config';
import { sequelize } from './config/db.js';
import { Product, Category } from './models/index.js';

const PRODUCTS = [
  {
    name: 'Cà Phê Rang Xay Alambé',
    slug: 'ca-phe-rang-xay-alambé',
    categorySlug: 'rang-vua',
    brand: 'Alambé',
    origin: 'Việt Nam',
    weight: '250g',
    description: 'Cà Phê Rang Xay Alambé tuyển chọn từ những hạt cà phê hảo hạng tại vùng cao nguyên Việt Nam. Công nghệ rang độc quyền giữ trọn hương thơm dịu mát, hậu vị đậm đà mượt mà sảng khoái.',
    price: 250000,
    stock: 100,
    tasting: 'Thơm dịu, Đậm đà, Mịn màng',
    image: '/products/SanPham-1.webp',
    featured: false,
    details: {
      'Mức độ rang': 'Vừa (Medium Roast)',
      'Xuất xứ': 'Việt Nam',
      'Thương hiệu': 'Alambé',
      'Trọng lượng': '250g',
      'Loại hạt': 'Arabica & Robusta',
      'Hương vị': 'Thơm dịu, Đậm đà, Hậu vị ngọt nhẹ',
      'Thành phần': '100% Cà phê nguyên chất',
      'Cách pha đề xuất': 'Pha Phin, Pour Over, Espresso',
      'Cách bảo quản': 'Nơi khô ráo, thoáng mát, đậy kín sau khi mở',
      'Hạn sử dụng': '12 tháng kể từ ngày sản xuất',
    },
  },
  {
    name: 'Cà phê Rang Xay Culi Highlands Coffee 200g',
    slug: 'ca-phe-rang-xay-culi-highlands-coffee-200g',
    categorySlug: 'rang-dam',
    brand: 'Highlands Coffee',
    origin: 'Đắk Lắk, Việt Nam',
    weight: '200g',
    description: 'Hạt cà phê Culi (Peaberry) độc đáo từ thủ phủ cà phê Đắk Lắk. Mỗi quả cà phê chỉ chứa một hạt duy nhất tích tụ trọn vẹn dưỡng chất, mang đến thể chất đậm đà mạnh mẽ quyện vị Socola đắng thanh.',
    price: 290000,
    stock: 80,
    tasting: 'Mạnh mẽ, Socola đen, Đất',
    image: '/products/SanPham-2.webp',
    featured: false,
    details: {
      'Mức độ rang': 'Đậm (Dark Roast)',
      'Xuất xứ': 'Đắk Lắk, Việt Nam',
      'Thương hiệu': 'Highlands Coffee',
      'Trọng lượng': '200g',
      'Loại hạt': '100% Culi Robusta (Peaberry)',
      'Hương vị': 'Đậm đà nồng nàn, Socola đen, Vị đất nhẹ',
      'Thành phần': '100% Cà phê Culi nguyên chất',
      'Cách pha đề xuất': 'Pha Phin truyền thống, Cà phê sữa đá',
      'Cách bảo quản': 'Tránh ánh nắng trực tiếp, bảo quản nơi mát mẻ',
      'Hạn sử dụng': '12 tháng kể từ ngày sản xuất',
    },
  },
  {
    name: 'Cà phê rang ESPRESSO BLEND',
    slug: 'ca-phe-rang-espresso-blend',
    categorySlug: 'rang-dam',
    brand: 'Swift Coffee',
    origin: 'Việt Nam',
    weight: '500g',
    description: 'Dòng sản phẩm đặc chế chuẩn barista cho máy pha Espresso. Lớp crema vàng óng sánh mịn, hương thơm nồng nàn cùng cấu trúc vị caramel cháy ngọt ngào quyến rũ.',
    price: 200000,
    stock: 150,
    tasting: 'Espresso, Đậm, Caramel',
    image: '/products/SanPham-3.webp',
    featured: false,
    details: {
      'Mức độ rang': 'Đậm (Dark Roast)',
      'Xuất xứ': 'Việt Nam',
      'Thương hiệu': 'Swift Coffee',
      'Trọng lượng': '500g',
      'Loại hạt': 'Special Blend (Arabica & Robusta)',
      'Hương vị': 'Đậm vị Espresso, Crema dày, Hậu ngọt Caramel',
      'Cách pha đề xuất': 'Máy Espresso, Staresso, Mokapot',
      'Cách bảo quản': 'Đậy kín van một chiều, để nơi thoáng mát',
      'Hạn sử dụng': '12 tháng',
    },
  },
  {
    name: 'Cà phê rang xay GO! túi 400g',
    slug: 'ca-phe-rang-xay-go-tui-400g',
    categorySlug: 'rang-vua',
    brand: 'GO!',
    origin: 'Việt Nam',
    weight: '400g',
    description: 'Cà phê GO! túi 400g với độ rang vừa sảng khoái, lưu giữ hương trái cây tự nhiên kết hợp độ đắng thanh êm ái. Phù hợp cho những ai thích vị cà phê hiện đại thanh thoát.',
    price: 390000,
    stock: 60,
    tasting: 'Thơm nhẹ, Cân bằng, Trái cây',
    image: '/products/SanPham-4.webp',
    featured: false,
    details: {
      'Mức độ rang': 'Vừa (Medium Roast)',
      'Xuất xứ': 'Việt Nam',
      'Thương hiệu': 'GO!',
      'Trọng lượng': '400g',
      'Loại hạt': 'Arabica Việt Nam',
      'Hương vị': 'Thơm thanh, Chua dịu trái cây, Cân bằng',
      'Cách pha đề xuất': 'Pha phin, Drip Coffee, Cold Brew',
      'Hạn sử dụng': '12 tháng',
    },
  },
  {
    name: 'Cà Phê rang xay đặc biệt',
    slug: 'ca-phe-rang-xay-dac-biet',
    categorySlug: 'rang-vua',
    brand: 'Swift Coffee Premium',
    origin: 'Lâm Đồng, Việt Nam',
    weight: '250g',
    description: 'Phiên bản đặc biệt giới hạn được nghệ nhân rang xay thủ công. Hương hoa nhài tinh tế quyện cùng nốt hương thảo mộc và vị ngọt sâu khó quên.',
    price: 400000,
    stock: 50,
    tasting: 'Hoa, Ngọt dịu, Phức hợp',
    image: '/products/SanPham-5.webp',
    featured: true,
    details: {
      'Mức độ rang': 'Vừa (Medium Light)',
      'Xuất xứ': 'Lâm Đồng, Việt Nam',
      'Thương hiệu': 'Swift Coffee Premium',
      'Trọng lượng': '250g',
      'Loại hạt': 'Specialty Arabica',
      'Hương vị': 'Hương hoa nhài, Mật ong, Trái cây khô',
      'Cách pha đề xuất': 'Pour Over V60, Chemex, French Press',
      'Hạn sử dụng': '9 tháng',
    },
  },
  {
    name: 'Cà Phê Rang Xay Nguyên Chất',
    slug: 'ca-phe-rang-xay-nguyen-chat-premium',
    categorySlug: 'rang-nhat',
    brand: 'Swift Grand Cru',
    origin: 'Đắk Nông, Việt Nam',
    weight: '1kg',
    description: 'Cà phê nguyên chất cao cấp nhất thu hoạch từ những mảng đồi đất đỏ bazán mỡ màu Đắk Nông. Tuyển chọn 100% hạt chín cây chín mọng, hạt cà phê cho trải nghiệm thượng hạng vượt trội.',
    price: 3650000,
    stock: 20,
    tasting: 'Cao cấp, Tinh tế, Hương hoa đặc biệt',
    image: '/products/SanPham-6.webp',
    featured: true,
    details: {
      'Mức độ rang': 'Nhạt (Light Roast)',
      'Xuất xứ': 'Đắk Nông, Việt Nam',
      'Thương hiệu': 'Swift Grand Cru Edition',
      'Trọng lượng': '1kg',
      'Loại hạt': 'Single Origin Premium',
      'Hương vị': 'Hương hoa rừng, Trái cây mọng, Hậu vị thượng hạng',
      'Thành phần': '100% Hạt cà phê được thu hái thủ công chín đỏ 100%',
      'Cách pha đề xuất': 'Siphon, Pour Over V60, Cold Drip',
      'Hạn sử dụng': '12 tháng',
    },
  },
  {
    name: 'Cà phê rang xay Robusta Lover',
    slug: 'ca-phe-rang-xay-robusta-lover',
    categorySlug: 'rang-dam',
    brand: 'Robusta Lover',
    origin: 'Việt Nam',
    weight: '500g',
    description: 'Dành riêng cho các tín đồ mê mệt dòng Robusta truyền thống nồng nàn. Vị đậm chát nhẹ, hàm lượng caffeine cao đánh thức mọi giác quan tỉnh táo.',
    price: 280000,
    stock: 90,
    tasting: 'Robusta thuần, Nồng, Hậu vị dài',
    image: '/products/SanPham-7.webp',
    featured: false,
    details: {
      'Mức độ rang': 'Đậm (Dark Roast)',
      'Xuất xứ': 'Việt Nam',
      'Thương hiệu': 'Robusta Lover',
      'Trọng lượng': '500g',
      'Loại hạt': '100% Fine Robusta',
      'Hương vị': 'Đắng nồng, Socola đắng, Đất sồi',
      'Cách pha đề xuất': 'Pha phin Việt Nam, Cà phê đen đá',
      'Hạn sử dụng': '12 tháng',
    },
  },
  {
    name: 'Cà phê Blended số 7 rang mộc nguyên chất 500 gram',
    slug: 'ca-phe-blended-so-7-rang-moc-nguyen-chat-500g',
    categorySlug: 'rang-vua',
    brand: 'No.7 Blend',
    origin: 'Việt Nam',
    weight: '500g',
    description: 'Công thức trộn hạt Số 7 đặc trưng giữa Robusta đậm vị và Arabica thơm thanh. Rang mộc 100% không tẩm ướp chất bảo quản hay hương liệu.',
    price: 390000,
    stock: 70,
    tasting: 'Mộc tự nhiên, Đậm vừa, Hài hoà',
    image: '/products/SanPham-8.webp',
    featured: false,
    details: {
      'Mức độ rang': 'Vừa (Medium Roast)',
      'Xuất xứ': 'Việt Nam',
      'Thương hiệu': 'No.7 Blend',
      'Trọng lượng': '500g',
      'Loại hạt': 'Robusta & Arabica (70/30)',
      'Hương vị': 'Hài hoà đắng ngọt, Hương thơm mộc tự nhiên',
      'Cách pha đề xuất': 'Pha phin, Máy pha gia đình',
      'Hạn sử dụng': '12 tháng',
    },
  },
  {
    name: 'Cà Phê Rang Mộc Chuyên Biệt',
    slug: 'ca-phe-rang-moc-chuyen-biet',
    categorySlug: 'rang-nhat',
    brand: 'Swift Specialty',
    origin: 'Cầu Đất, Đà Lạt, Việt Nam',
    weight: '250g',
    description: 'Trồng ở độ cao 1.650m tại thánh địa Cầu Đất Đà Lạt. Hạt Arabica rang nhạt giữ nguyên vị thanh chua quả mọng cùng hương hoa phong lan quyến rũ.',
    price: 310000,
    stock: 85,
    tasting: 'Nhẹ thanh, Chua dịu, Thơm lâu',
    image: '/products/SanPham-9.webp',
    featured: false,
    details: {
      'Mức độ rang': 'Nhạt (Light Roast)',
      'Xuất xứ': 'Cầu Đất, Đà Lạt, Việt Nam',
      'Thương hiệu': 'Swift Specialty',
      'Trọng lượng': '250g',
      'Loại hạt': '100% Arabica Cầu Đất',
      'Hương vị': 'Chua dịu thanh mượt, Hương hoa, Hậu ngọt sâu',
      'Cách pha đề xuất': 'Cold Brew, Pour Over, Aeropress',
      'Hạn sử dụng': '12 tháng',
    },
  },
  {
    name: 'Cà phê rang xay cao cấp GO! túi 200g',
    slug: 'ca-phe-rang-xay-cao-cap-go-tui-200g',
    categorySlug: 'rang-vua',
    brand: 'GO! Premium',
    origin: 'Việt Nam',
    weight: '200g',
    description: 'Dòng sản phẩm cao cấp đóng gói zip 200g nhỏ gọn tiện mang đi làm hay du lịch. Thể chất cà phê mềm mại, hậu vị dịu ngọt ngậy tinh tế.',
    price: 345000,
    stock: 65,
    tasting: 'Cao cấp, Mềm mại, Dịu ngọt',
    image: '/products/SanPham-10.webp',
    featured: false,
    details: {
      'Mức độ rang': 'Vừa (Medium Roast)',
      'Xuất xứ': 'Việt Nam',
      'Thương hiệu': 'GO! Premium',
      'Trọng lượng': '200g',
      'Loại hạt': 'Arabica Premium',
      'Hương vị': 'Mềm mại, Ngọt dịu, Hương hạt nướng',
      'Cách pha đề xuất': 'Pha phin, Drip Bag',
      'Hạn sử dụng': '12 tháng',
    },
  },
  {
    name: 'Cà phê rang xay black K-Coffee túi 454g',
    slug: 'ca-phe-rang-xay-black-k-coffee-tui-454g',
    categorySlug: 'rang-dam',
    brand: 'K-Coffee',
    origin: 'Việt Nam',
    weight: '454g',
    description: 'K-Coffee Black vị đen tuyền nguyên bản nồng nàn đậm đà. Đóng túi 454g chuẩn xuất khẩu quốc tế với quy trình chế biến khép kín hiện đại.',
    price: 290000,
    stock: 110,
    tasting: 'Đen đậm, Mạnh, Socola đắng',
    image: '/products/SanPham-11.jpg',
    featured: false,
    details: {
      'Mức độ rang': 'Đậm (Dark Roast)',
      'Xuất xứ': 'Việt Nam',
      'Thương hiệu': 'K-Coffee',
      'Trọng lượng': '454g',
      'Loại hạt': 'Pure Robusta & Arabica',
      'Hương vị': 'Đen đậm truyền thống, Socola đắng',
      'Cách pha đề xuất': 'Pha phin, Cà phê sữa đá',
      'Hạn sử dụng': '12 tháng',
    },
  },
  {
    name: 'Cà Phê Rang Xay Expert Blend 2 KING COFFEE - Túi 500g',
    slug: 'ca-phe-rang-xay-expert-blend-2-king-coffee-500g',
    categorySlug: 'rang-dam',
    brand: 'KING COFFEE',
    origin: 'Việt Nam',
    weight: '500g',
    description: 'KING COFFEE Expert Blend 2 tuyệt tác phối trộn từ 4 loại hạt cao cấp nhất. Hương thơm phức hợp caramel quyện vị hạt dẻ nướng nồng nàn đỉnh cao.',
    price: 410000,
    stock: 75,
    tasting: 'Expert blend, Đậm đà, Caramel, Hạt dẻ',
    image: '/products/SanPham-12.webp',
    featured: true,
    details: {
      'Mức độ rang': 'Đậm (Dark Roast)',
      'Xuất xứ': 'Việt Nam',
      'Thương hiệu': 'KING COFFEE',
      'Trọng lượng': '500g',
      'Loại hạt': 'Blend 4 loại hạt cà phê hảo hạng',
      'Hương vị': 'Đậm đà mạnh mẽ, Caramel, Hạt dẻ',
      'Cách pha đề xuất': 'Pha phin, Pha máy Espresso',
      'Hạn sử dụng': '12 tháng',
    },
  },
];

async function seed() {
  try {
    console.log('🔌 Kết nối database...');
    await sequelize.authenticate();
    console.log('✅ Database kết nối thành công');

    // Sync tables (tạo nếu chưa có)
    await sequelize.sync({ alter: true });
    console.log('✅ Schema đã đồng bộ');

    // Đảm bảo danh mục tồn tại
    const categories = [
      { name: 'Rang nhạt', slug: 'rang-nhat', icon: '🌸', sortOrder: 1 },
      { name: 'Rang vừa',  slug: 'rang-vua',  icon: '☕', sortOrder: 2 },
      { name: 'Rang đậm',  slug: 'rang-dam',  icon: '🔥', sortOrder: 3 },
    ];

    const catMap = {};
    for (const cat of categories) {
      const [record] = await Category.findOrCreate({
        where: { slug: cat.slug },
        defaults: { ...cat, status: 'active' },
      });
      catMap[cat.slug] = record.id;
    }

    // Insert 12 sản phẩm
    let added = 0;
    let updated = 0;

    for (const p of PRODUCTS) {
      const existing = await Product.findOne({ where: { slug: p.slug } });
      if (existing) {
        await existing.update({
          name: p.name,
          categoryId: catMap[p.categorySlug] || null,
          description: p.description,
          price: p.price,
          stock: p.stock,
          image: p.image,
          featured: p.featured,
          details: p.details,
          origin: p.origin,
          tasting: p.tasting,
          brand: p.brand,
          weight: p.weight,
        });
        console.log(`  🔄 Đã cập nhật: ${p.name}`);
        updated++;
      } else {
        await Product.create({
          name: p.name,
          slug: p.slug,
          categoryId: catMap[p.categorySlug] || null,
          description: p.description,
          price: p.price,
          stock: p.stock,
          sold: 0,
          image: p.image,
          images: [],
          variants: [],
          status: 'active',
          featured: p.featured,
          details: p.details,
          origin: p.origin,
          tasting: p.tasting,
          brand: p.brand,
          weight: p.weight,
        });
        console.log(`  ✅ Đã thêm mới: ${p.name}`);
        added++;
      }
    }

    console.log('\n========================================');
    console.log(`✅ SEED HOÀN THÀNH (Thêm mới: ${added}, Cập nhật: ${updated})`);
    console.log('========================================\n');

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi seed:', err.message);
    process.exit(1);
  }
}

seed();
