export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sold: number;
  status: 'active' | 'hidden' | 'out_of_stock';
  image: string;
  gallery: string[];
  description: string;
  variants: { size: string; priceOffset: number }[];
  createdAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
  status: 'active' | 'hidden';
  description: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  totalAmount: number;
  paymentMethod: 'COD' | 'Banking' | 'Momo' | 'VNPay';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  status: 'pending' | 'preparing' | 'shipping' | 'completed' | 'cancelled';
  createdAt: string;
  items: { productName: string; size: string; quantity: number; price: number }[];
  timeline: { time: string; text: string; status: string }[];
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'locked';
  joinedDate: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Manager' | 'Barista' | 'Staff';
  avatar: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

export interface AdminBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  position: number;
  status: 'active' | 'hidden';
}

export interface AdminNews {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  summary: string;
  content: string;
  thumbnail: string;
  publishedAt: string;
  status: 'published' | 'draft';
}

export interface AdminReview {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'hidden';
  adminReply?: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'expired' | 'disabled';
}

export interface AdminInventoryItem {
  id: string;
  name: string;
  unit: string;
  stock: number;
  minAlert: number;
  costPerUnit: number;
  category: string;
  lastUpdated: string;
}

export interface AdminLog {
  id: string;
  user: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
  ip: string;
}

export interface WebsiteUISettings {
  brandName: string;
  tagline: string;
  logoUrl: string;
  primaryColor: string;
  hotline: string;
  email: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  sections: {
    heroBanner: boolean;
    newArrivals: boolean;
    featuredProducts: boolean;
    promotions: boolean;
    newsSection: boolean;
  };
}

// Initial Mock Datasets
export const initialProducts: AdminProduct[] = [
  {
    id: 'PRD-001',
    name: 'Cà Phê Sữa Đá Swift Signature',
    category: 'Cà Phê Việt Nam',
    price: 45000,
    originalPrice: 55000,
    stock: 120,
    sold: 1450,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600&auto=format&fit=crop',
    ],
    description: 'Hạt Robusta Buôn Ma Thuột đậm đà kết hợp với sữa đặc cao cấp, tạo hương vị ngọt béo cân bằng.',
    variants: [
      { size: 'Nhỏ (S)', priceOffset: 0 },
      { size: 'Vừa (M)', priceOffset: 5000 },
      { size: 'Lớn (L)', priceOffset: 10000 },
    ],
    createdAt: '2026-01-15',
  },
  {
    id: 'PRD-002',
    name: 'Espresso Caramel Macchiato',
    category: 'Cà Phê Ý',
    price: 65000,
    stock: 45,
    sold: 890,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=600&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=600&auto=format&fit=crop'],
    description: 'Espresso chắt lọc từ Arabica Cầu Đất, phủ lớp bọt sữa sánh mịn và sốt Caramel hảo hạng.',
    variants: [
      { size: 'Vừa (M)', priceOffset: 0 },
      { size: 'Lớn (L)', priceOffset: 8000 },
    ],
    createdAt: '2026-02-01',
  },
  {
    id: 'PRD-003',
    name: 'Trà Đào Cam Sả Tươi',
    category: 'Trà Trái Cây',
    price: 52000,
    stock: 8,
    sold: 1120,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop'],
    description: 'Trà đen đậm vị thanh mát kết hợp miếng đào giòn tan, cam tươi sảng khoái và hương sả dễ chịu.',
    variants: [
      { size: 'Vừa (M)', priceOffset: 0 },
      { size: 'Lớn (L)', priceOffset: 7000 },
    ],
    createdAt: '2026-02-10',
  },
  {
    id: 'PRD-004',
    name: 'Bánh Croissant Bơ Pháp',
    category: 'Bánh Ngọt',
    price: 38000,
    stock: 0,
    sold: 620,
    status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop'],
    description: 'Bánh sừng bò nướng ngàn lớp thơm lừng bơ Pháp cao cấp, vỏ ngoài giòn xốp ruột mềm mịn.',
    variants: [{ size: 'Tiêu chuẩn', priceOffset: 0 }],
    createdAt: '2026-03-05',
  },
];

export const initialCategories: AdminCategory[] = [
  { id: 'CAT-01', name: 'Cà Phê Việt Nam', slug: 'ca-phe-viet-nam', icon: 'Coffee', productCount: 12, status: 'active', description: 'Đậm đà chuẩn gu Việt' },
  { id: 'CAT-02', name: 'Cà Phê Ý', slug: 'ca-phe-y', icon: 'CupSoda', productCount: 8, status: 'active', description: 'Espresso & Bọt sữa thanh lịch' },
  { id: 'CAT-03', name: 'Trà Trái Cây', slug: 'tra-trai-cay', icon: 'GlassWater', productCount: 10, status: 'active', description: 'Sảng khoái & Thanh lọc' },
  { id: 'CAT-04', name: 'Bánh Ngọt & Đồ Ăn Kèm', slug: 'banh-ngot', icon: 'Cookie', productCount: 6, status: 'active', description: 'Thương hạng nướng tươi mỗi ngày' },
];

export const initialOrders: AdminOrder[] = [
  {
    id: 'ORD-9821',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0988 123 456',
    customerEmail: 'an.nguyen@gmail.com',
    shippingAddress: '72 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
    totalAmount: 142000,
    paymentMethod: 'Banking',
    paymentStatus: 'Paid',
    status: 'pending',
    createdAt: '2026-07-26 14:15',
    items: [
      { productName: 'Cà Phê Sữa Đá Swift Signature', size: 'Vừa (M)', quantity: 2, price: 50000 },
      { productName: 'Bánh Croissant Bơ Pháp', size: 'Tiêu chuẩn', quantity: 1, price: 42000 },
    ],
    timeline: [
      { time: '14:15 - 26/07', text: 'Khách hàng đặt đơn hàng thành công', status: 'pending' },
    ],
  },
  {
    id: 'ORD-9820',
    customerName: 'Trần Thị Mai',
    customerPhone: '0912 345 678',
    customerEmail: 'mai.tran@gmail.com',
    shippingAddress: '15 Nguyễn Huệ, Quận 1, TP.HCM',
    totalAmount: 195000,
    paymentMethod: 'Momo',
    paymentStatus: 'Paid',
    status: 'preparing',
    createdAt: '2026-07-26 13:40',
    items: [
      { productName: 'Espresso Caramel Macchiato', size: 'Lớn (L)', quantity: 3, price: 65000 },
    ],
    timeline: [
      { time: '13:40 - 26/07', text: 'Đơn hàng được tạo thành công', status: 'pending' },
      { time: '13:42 - 26/07', text: 'Quầy Barista bắt đầu pha chế', status: 'preparing' },
    ],
  },
  {
    id: 'ORD-9819',
    customerName: 'Lê Hoàng Nam',
    customerPhone: '0977 888 999',
    customerEmail: 'nam.le@gmail.com',
    shippingAddress: '450 Điện Biên Phủ, Bình Thạnh, TP.HCM',
    totalAmount: 104000,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    status: 'shipping',
    createdAt: '2026-07-26 12:20',
    items: [
      { productName: 'Trà Đào Cam Sả Tươi', size: 'Vừa (M)', quantity: 2, price: 52000 },
    ],
    timeline: [
      { time: '12:20 - 26/07', text: 'Đặt đơn', status: 'pending' },
      { time: '12:25 - 26/07', text: 'Đã chuẩn bị xong', status: 'preparing' },
      { time: '12:35 - 26/07', text: 'Tài xế nhận đơn đang giao', status: 'shipping' },
    ],
  },
  {
    id: 'ORD-9818',
    customerName: 'Phạm Thu Hương',
    customerPhone: '0903 112 233',
    customerEmail: 'huong.pham@gmail.com',
    shippingAddress: '102 Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM',
    totalAmount: 230000,
    paymentMethod: 'VNPay',
    paymentStatus: 'Paid',
    status: 'completed',
    createdAt: '2026-07-26 10:10',
    items: [
      { productName: 'Cà Phê Sữa Đá Swift Signature', size: 'Lớn (L)', quantity: 2, price: 55000 },
      { productName: 'Espresso Caramel Macchiato', size: 'Vừa (M)', quantity: 2, price: 60000 },
    ],
    timeline: [
      { time: '10:10 - 26/07', text: 'Đặt đơn', status: 'pending' },
      { time: '10:30 - 26/07', text: 'Giao hàng thành công', status: 'completed' },
    ],
  },
];

export const initialCustomers: AdminCustomer[] = [
  {
    id: 'CUST-001',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@gmail.com',
    phone: '0988 123 456',
    address: '72 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    totalOrders: 18,
    totalSpent: 1840000,
    status: 'active',
    joinedDate: '2025-11-10',
  },
  {
    id: 'CUST-002',
    name: 'Trần Thị Mai',
    email: 'mai.tran@gmail.com',
    phone: '0912 345 678',
    address: '15 Nguyễn Huệ, Quận 1, TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    totalOrders: 25,
    totalSpent: 3250000,
    status: 'active',
    joinedDate: '2025-09-04',
  },
  {
    id: 'CUST-003',
    name: 'Lê Hoàng Nam',
    email: 'nam.le@gmail.com',
    phone: '0977 888 999',
    address: '450 Điện Biên Phủ, Bình Thạnh, TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
    totalOrders: 6,
    totalSpent: 520000,
    status: 'active',
    joinedDate: '2026-01-20',
  },
  {
    id: 'CUST-004',
    name: 'Đặng Minh Trí',
    email: 'tri.dang@spam.com',
    phone: '0933 000 111',
    address: '88 Tân Bình, TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    totalOrders: 1,
    totalSpent: 45000,
    status: 'locked',
    joinedDate: '2026-03-01',
  },
];

export const initialAccounts: AdminAccount[] = [
  { id: 'ACC-01', name: 'Nguyễn Hoài (Admin)', email: 'admin@swiftcoffee.com', role: 'Super Admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', status: 'active', lastActive: 'Đang hoạt động' },
  { id: 'ACC-02', name: 'Lê Thanh Bình', email: 'binh.manager@swiftcoffee.com', role: 'Manager', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop', status: 'active', lastActive: '10 phút trước' },
  { id: 'ACC-03', name: 'Trần Vũ Hoàng', email: 'hoang.barista@swiftcoffee.com', role: 'Barista', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop', status: 'active', lastActive: '2 giờ trước' },
];

export const initialBanners: AdminBanner[] = [
  { id: 'BNR-01', title: 'Thưởng Thức Hương Vị Cà Phê Mới', subtitle: 'Ưu đãi 20% cho thành viên mới', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop', linkUrl: '/menu', position: 1, status: 'active' },
  { id: 'BNR-02', title: 'Espresso Cầu Đất Đậm Đà', subtitle: 'Chiết xuất từ hạt Arabica 100% nguyên chất', imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop', linkUrl: '/menu', position: 2, status: 'active' },
];

export const initialNews: AdminNews[] = [
  {
    id: 'NEWS-01',
    title: 'Bí quyết thưởng thức Espresso chuẩn vị như Barista',
    slug: 'bi-quyet-thuong-thuc-espresso',
    author: 'Admin Swift Coffee',
    category: 'Kiến Thức Cà Phê',
    summary: 'Khám phá sự kỳ diệu từ áp suất chiết xuất và lớp crema béo mịn của ly Espresso đỉnh cao.',
    content: 'Espresso là tinh hoa của cà phê Ý với thời gian chiết xuất chỉ 25-30 giây dưới áp suất 9 bar...',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    publishedAt: '2026-07-20',
    status: 'published',
  },
  {
    id: 'NEWS-02',
    title: 'Khai trương không gian Swift Coffee thứ 5 tại Quận 1',
    slug: 'khai-truong-chi-nhanh-quan-1',
    author: 'Bộ phận Truyền thông',
    category: 'Sự Kiện',
    summary: 'Không gian kiến trúc sang trọng, tối giản tại đường Nguyễn Huệ chính thức đi vào hoạt động.',
    content: 'Chúng tôi hân hạnh chào đón quý khách tới trải nghiệm không gian sang trọng ngập tràn hương thơm...',
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop',
    publishedAt: '2026-07-15',
    status: 'published',
  },
];

export const initialReviews: AdminReview[] = [
  { id: 'REV-01', productName: 'Cà Phê Sữa Đá Swift Signature', customerName: 'Nguyễn Văn An', rating: 5, comment: 'Cà phê cực kỳ thơm đậm đà, sữa đặc vừa phải không quá ngọt. Đóng gói rất kỹ!', createdAt: '2026-07-26 11:30', status: 'approved', adminReply: 'Cảm ơn bạn An rất nhiều! Chúc bạn một ngày làm việc thật tràn đầy năng lượng!' },
  { id: 'REV-02', productName: 'Bánh Croissant Bơ Pháp', customerName: 'Trần Thị Mai', rating: 5, comment: 'Bánh giao tới vẫn còn giòn nóng thơm ngậy vị bơ!', createdAt: '2026-07-25 16:20', status: 'approved' },
  { id: 'REV-03', productName: 'Trà Đào Cam Sả Tươi', customerName: 'Phạm Hoàng', rating: 4, comment: 'Đồ uống ngon nhưng đá hơi nhiều một xíu.', createdAt: '2026-07-24 09:15', status: 'pending' },
];

export const initialCoupons: AdminCoupon[] = [
  { id: 'CPN-01', code: 'SWIFTWELCOME', type: 'percent', value: 20, minOrder: 100000, startDate: '2026-07-01', endDate: '2026-12-31', usageLimit: 1000, usedCount: 342, status: 'active' },
  { id: 'CPN-02', code: 'FREESHIP50K', type: 'fixed', value: 30000, minOrder: 150000, startDate: '2026-07-20', endDate: '2026-08-20', usageLimit: 200, usedCount: 88, status: 'active' },
];

export const initialInventory: AdminInventoryItem[] = [
  { id: 'INV-01', name: 'Hạt Robusta Buôn Ma Thuột', unit: 'kg', stock: 120, minAlert: 30, costPerUnit: 180000, category: 'Hạt Cà Phê', lastUpdated: '2026-07-25' },
  { id: 'INV-02', name: 'Hạt Arabica Cầu Đất Premium', unit: 'kg', stock: 15, minAlert: 20, costPerUnit: 350000, category: 'Hạt Cà Phê', lastUpdated: '2026-07-26' },
  { id: 'INV-03', name: 'Sữa Đặc Ngôi Sao Phương Nam', unit: 'Hộp', stock: 250, minAlert: 50, costPerUnit: 22000, category: 'Nguyên Liệu Nước', lastUpdated: '2026-07-24' },
  { id: 'INV-04', name: 'Ly Giấy Thượng Hạng Swift (450ml)', unit: 'Cái', stock: 1800, minAlert: 500, costPerUnit: 1200, category: 'Bao Bì', lastUpdated: '2026-07-26' },
];

export const initialLogs: AdminLog[] = [
  { id: 'LOG-109', user: 'Admin Swift', action: 'Duyệt đánh giá', module: 'Đánh giá', details: 'Đã duyệt đánh giá của khách hàng Nguyễn Văn An', timestamp: '2026-07-26 14:10', ip: '192.168.1.1' },
  { id: 'LOG-108', user: 'Lê Thanh Bình', action: 'Cập nhật giá', module: 'Sản phẩm', details: 'Thay đổi giá Cà Phê Sữa Đá từ 42k lên 45k', timestamp: '2026-07-26 11:05', ip: '192.168.1.5' },
  { id: 'LOG-107', user: 'Admin Swift', action: 'Tạo mã giảm giá', module: 'Mã giảm giá', details: 'Tạo mã FREESHIP50K giảm 30.000đ', timestamp: '2026-07-25 15:30', ip: '192.168.1.1' },
];

export const initialWebsiteUISettings: WebsiteUISettings = {
  brandName: 'Swift Coffee Store',
  tagline: 'Thương Hiệu Cà Phê Thượng Hạng & Đột Phá Hương Vị',
  logoUrl: '/logo.png',
  primaryColor: '#582b14',
  hotline: '1900 6868',
  email: 'support@swiftcoffee.com',
  address: '72 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  facebookUrl: 'https://facebook.com/swiftcoffee',
  instagramUrl: 'https://instagram.com/swiftcoffee',
  sections: {
    heroBanner: true,
    newArrivals: true,
    featuredProducts: true,
    promotions: true,
    newsSection: true,
  },
};
