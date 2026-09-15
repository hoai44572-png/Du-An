'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/products/ProductCard'
import { Star, ShoppingCart, Check, ArrowLeft, Heart, Share2, ShieldCheck, Truck, RefreshCw, ChevronRight, Zap, Award } from 'lucide-react'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart-context'
import { useToast } from '@/components/ui/toast'
import { useWishlist } from '@/lib/wishlist-context'
import { formatCurrencyVN } from '@/lib/utils'

interface ProductDetail {
  id: number
  name: string
  origin: string
  price: number
  salePrice?: number
  rating: number
  reviews: number
  category: string
  brand?: string
  weight?: string
  stock?: number
  tasting: string
  image: string
  description: string
  details: Record<string, string>
}

const PRODUCT_DATABASE: Record<string, ProductDetail> = {
  '1': {
    id: 1,
    name: 'Cà Phê Rang Xay Alambé',
    origin: 'Việt Nam',
    price: 250000,
    rating: 4.7,
    reviews: 38,
    category: 'Rang vừa',
    brand: 'Alambé',
    weight: '250g',
    stock: 100,
    tasting: 'Thơm dịu, Đậm đà, Mịn màng',
    image: '/products/SanPham-1.webp',
    description:
      'Cà Phê Rang Xay Alambé tuyển chọn từ những hạt cà phê hảo hạng tại vùng cao nguyên Việt Nam. Công nghệ rang độc quyền giữ trọn hương thơm dịu mát, hậu vị đậm đà mượt mà sảng khoái.',
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
  '2': {
    id: 2,
    name: 'Cà phê Rang Xay Culi Highlands Coffee 200g',
    origin: 'Đắk Lắk, Việt Nam',
    price: 290000,
    rating: 4.8,
    reviews: 92,
    category: 'Rang đậm',
    brand: 'Highlands Coffee',
    weight: '200g',
    stock: 80,
    tasting: 'Mạnh mẽ, Socola đen, Đất',
    image: '/products/SanPham-2.webp',
    description:
      'Hạt cà phê Culi (Peaberry) độc đáo từ thủ phủ cà phê Đắk Lắk. Mỗi quả cà phê chỉ chứa một hạt duy nhất tích tụ trọn vẹn dưỡng chất, mang đến thể chất đậm đà mạnh mẽ quyện vị Socola đắng thanh.',
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
  '3': {
    id: 3,
    name: 'Cà phê rang ESPRESSO BLEND',
    origin: 'Việt Nam',
    price: 200000,
    rating: 4.6,
    reviews: 55,
    category: 'Rang đậm',
    brand: 'Swift Coffee',
    weight: '500g',
    stock: 150,
    tasting: 'Espresso, Đậm, Caramel',
    image: '/products/SanPham-3.webp',
    description:
      'Dòng sản phẩm đặc chế chuẩn barista cho máy pha Espresso. Lớp crema vàng óng sánh mịn, hương thơm nồng nàn cùng cấu trúc vị caramel cháy ngọt ngào quyến rũ.',
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
  '4': {
    id: 4,
    name: 'Cà phê rang xay GO! túi 400g',
    origin: 'Việt Nam',
    price: 390000,
    rating: 4.5,
    reviews: 27,
    category: 'Rang vừa',
    brand: 'GO!',
    weight: '400g',
    stock: 60,
    tasting: 'Thơm nhẹ, Cân bằng, Trái cây',
    image: '/products/SanPham-4.webp',
    description:
      'Cà phê GO! túi 400g với độ rang vừa sảng khoái, lưu giữ hương trái cây tự nhiên kết hợp độ đắng thanh êm ái. Phù hợp cho những ai thích vị cà phê hiện đại thanh thoát.',
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
  '5': {
    id: 5,
    name: 'Cà Phê rang xay đặc biệt',
    origin: 'Lâm Đồng, Việt Nam',
    price: 400000,
    rating: 4.9,
    reviews: 61,
    category: 'Rang vừa',
    brand: 'Swift Coffee Premium',
    weight: '250g',
    stock: 50,
    tasting: 'Hoa, Ngọt dịu, Phức hợp',
    image: '/products/SanPham-5.webp',
    description:
      'Phiên bản đặc biệt giới hạn được nghệ nhân rang xay thủ công. Hương hoa nhài tinh tế quyện cùng nốt hương thảo mộc và vị ngọt sâu khó quên.',
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
  '6': {
    id: 6,
    name: 'Cà Phê Rang Xay Nguyên Chất',
    origin: 'Đắk Nông, Việt Nam',
    price: 3650000,
    rating: 5.0,
    reviews: 14,
    category: 'Rang nhạt',
    brand: 'Swift Grand Cru',
    weight: '1kg',
    stock: 20,
    tasting: 'Cao cấp, Tinh tế, Hương hoa đặc biệt',
    image: '/products/SanPham-6.webp',
    description:
      'Cà phê nguyên chất cao cấp nhất thu hoạch từ những mảng đồi đất đỏ bazán mỡ màu Đắk Nông. Tuyển chọn 100% hạt chín cây chín mọng, hạt cà phê cho trải nghiệm thượng hạng vượt trội.',
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
  '7': {
    id: 7,
    name: 'Cà phê rang xay Robusta Lover',
    origin: 'Việt Nam',
    price: 280000,
    rating: 4.7,
    reviews: 83,
    category: 'Rang đậm',
    brand: 'Robusta Lover',
    weight: '500g',
    stock: 90,
    tasting: 'Robusta thuần, Nồng, Hậu vị dài',
    image: '/products/SanPham-7.webp',
    description:
      'Dành riêng cho các tín đồ mê mệt dòng Robusta truyền thống nồng nàn. Vị đậm chát nhẹ, hàm lượng caffeine cao đánh thức mọi giác quan tỉnh táo.',
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
  '8': {
    id: 8,
    name: 'Cà phê Blended số 7 rang mộc nguyên chất 500 gram',
    origin: 'Việt Nam',
    price: 390000,
    rating: 4.8,
    reviews: 47,
    category: 'Rang vừa',
    brand: 'No.7 Blend',
    weight: '500g',
    stock: 70,
    tasting: 'Mộc tự nhiên, Đậm vừa, Hài hoà',
    image: '/products/SanPham-8.webp',
    description:
      'Công thức trộn hạt Số 7 đặc trưng giữa Robusta đậm vị và Arabica thơm thanh. Rang mộc 100% không tẩm ướp chất bảo quản hay hương liệu.',
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
  '9': {
    id: 9,
    name: 'Cà Phê Rang Mộc Chuyên Biệt',
    origin: 'Cầu Đất, Việt Nam',
    price: 310000,
    rating: 4.7,
    reviews: 33,
    category: 'Rang nhạt',
    brand: 'Swift Specialty',
    weight: '250g',
    stock: 85,
    tasting: 'Nhẹ thanh, Chua dịu, Thơm lâu',
    image: '/products/SanPham-9.webp',
    description:
      'Trồng ở độ cao 1.650m tại thánh địa Cầu Đất Đà Lạt. Hạt Arabica rang nhạt giữ nguyên vị thanh chua quả mọng cùng hương hoa phong lan quyến rũ.',
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
  '10': {
    id: 10,
    name: 'Cà phê rang xay cao cấp GO! túi 200g',
    origin: 'Việt Nam',
    price: 345000,
    rating: 4.6,
    reviews: 19,
    category: 'Rang vừa',
    brand: 'GO! Premium',
    weight: '200g',
    stock: 65,
    tasting: 'Cao cấp, Mềm mại, Dịu ngọt',
    image: '/products/SanPham-10.webp',
    description:
      'Dòng sản phẩm cao cấp đóng gói zip 200g nhỏ gọn tiện mang đi làm hay du lịch. Thể chất cà phê mềm mại, hậu vị dịu ngọt ngậy tinh tế.',
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
  '11': {
    id: 11,
    name: 'Cà phê rang xay black K-Coffee túi 454g',
    origin: 'Việt Nam',
    price: 290000,
    rating: 4.8,
    reviews: 76,
    category: 'Rang đậm',
    brand: 'K-Coffee',
    weight: '454g',
    stock: 110,
    tasting: 'Đen đậm, Mạnh, Socola đắng',
    image: '/products/SanPham-11.jpg',
    description:
      'K-Coffee Black vị đen tuyền nguyên bản nồng nàn đậm đà. Đóng túi 454g chuẩn xuất khẩu quốc tế với quy trình chế biến khép kín hiện đại.',
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
  '12': {
    id: 12,
    name: 'Cà Phê Rang Xay Expert Blend 2 KING COFFEE - Túi 500g',
    origin: 'Việt Nam',
    price: 410000,
    rating: 4.9,
    reviews: 105,
    category: 'Rang đậm',
    brand: 'KING COFFEE',
    weight: '500g',
    stock: 75,
    tasting: 'Expert blend, Đậm đà, Caramel, Hạt dẻ',
    image: '/products/SanPham-12.webp',
    description:
      'KING COFFEE Expert Blend 2 tuyệt tác phối trộn từ 4 loại hạt cao cấp nhất. Hương thơm phức hợp caramel quyện vị hạt dẻ nướng nồng nàn đỉnh cao.',
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
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [grind, setGrind] = useState('Hạt nguyên')
  const [weight, setWeight] = useState('250g')
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [apiProduct, setApiProduct] = useState<ProductDetail | null>(null)

  const { addItem } = useCart()
  const { success } = useToast()
  const { isInWishlist, toggleWishlist } = useWishlist()

  // Fetch product from API if available
  useEffect(() => {
    let isMounted = true
    async function fetchProduct() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const res = await fetch(`${baseUrl}/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.product && isMounted) {
            const p = data.product
            setApiProduct({
              id: p.id,
              name: p.name,
              origin: p.origin || 'Việt Nam',
              price: p.price,
              salePrice: p.salePrice || undefined,
              rating: p.rating || 4.8,
              reviews: p.reviewsCount || p.sold || 42,
              category: p.category?.name || 'Cà phê',
              brand: p.brand || undefined,
              weight: p.weight || '250g',
              stock: p.stock ?? 50,
              tasting: p.tasting || 'Đậm đà, Thơm nồng',
              image: p.image || '/products/SanPham-1.webp',
              description: p.description || '',
              details: p.details || {},
            })
          }
        }
      } catch (err) {
        // Fallback to static dictionary on connection error
      }
    }
    fetchProduct()
    return () => { isMounted = false }
  }, [id])

  const product = apiProduct || PRODUCT_DATABASE[id] || PRODUCT_DATABASE['1']
  const strId = String(product.id)
  const inWishlist = isInWishlist(strId)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      origin: product.origin,
      price: product.price,
      image: product.image,
      quantity,
      grind,
      weight,
    })
    setAdded(true)
    success(`Đã thêm ${quantity}x "${product.name}" vào giỏ hàng`, 'Thành công')
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      origin: product.origin,
      price: product.price,
      image: product.image,
      quantity,
      grind,
      weight,
    })
    router.push('/cart')
  }

  const handleWishlistToggle = async () => {
    await toggleWishlist({
      id: strId,
      name: product.name,
      origin: product.origin,
      price: product.price,
      image: product.image,
      category: product.category,
      tasting: product.tasting,
      rating: product.rating,
      reviewsCount: product.reviews,
    })
  }

  // Related products
  const relatedProducts = Object.values(PRODUCT_DATABASE)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="pt-28 md:pt-36 pb-16 px-4 bg-background flex-1">
        <div className="container mx-auto max-w-6xl space-y-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/menu" className="hover:text-primary transition-colors">
              Menu
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-foreground truncate">{product.name}</span>
          </nav>

          {/* Product Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image Showcase */}
            <div className="space-y-4">
              <div className="relative h-96 md:h-[450px] bg-secondary/50 rounded-3xl overflow-hidden border border-border/80 shadow-lg flex items-center justify-center group">
                {!imgError ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-secondary to-muted">
                    <span className="text-8xl animate-float">☕</span>
                    <span className="text-sm text-muted-foreground mt-3 font-medium">{product.origin}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className="absolute top-4 right-4 p-3 bg-background/90 backdrop-blur-md rounded-full shadow-md text-foreground hover:text-red-500 transition-transform hover:scale-110"
                  title={inWishlist ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  aria-label="Yêu thích"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Truck, label: 'Giao nhanh 2h', desc: 'Nội thành TP.HCM' },
                  { icon: ShieldCheck, label: 'Rang mới 100%', desc: 'Trong vòng 48h' },
                  { icon: RefreshCw, label: 'Đổi trả miễn phí', desc: 'Trong 7 ngày' },
                ].map(({ icon: Icon, label, desc }, i) => (
                  <div key={i} className="p-3 bg-secondary/40 rounded-2xl border border-border/50 text-center space-y-1">
                    <Icon className="w-5 h-5 text-primary mx-auto" />
                    <p className="text-xs font-bold text-foreground">{label}</p>
                    <p className="text-[10px] text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details & Selection */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="inline-block px-3 py-1 bg-secondary text-foreground text-xs font-bold rounded-full">
                      Thương hiệu: {product.brand}
                    </span>
                  )}
                  {product.stock !== undefined && (
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                      product.stock > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                    }`}>
                      {product.stock > 0 ? `Còn hàng (${product.stock} sản phẩm)` : 'Hết hàng'}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
                  {product.name}
                </h1>
                <p className="text-base text-muted-foreground font-medium">Xuất xứ: {product.origin}</p>

                {/* Rating summary */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-muted text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-foreground">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews} đánh giá thực tế)</span>
                </div>
              </div>

              {/* Price display with optional salePrice */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-bold text-primary">
                  {formatCurrencyVN(product.price)}
                </span>
                {product.salePrice && product.salePrice < product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrencyVN(product.salePrice)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {product.description}
              </p>

              {product.tasting && (
                <div className="p-3.5 bg-secondary/30 rounded-2xl border border-border/60">
                  <p className="text-xs font-bold text-foreground mb-1">Nốt hương đặc trưng:</p>
                  <p className="text-sm text-primary font-serif font-semibold italic">{product.tasting}</p>
                </div>
              )}

              {/* Variants Selector */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold mb-2 block text-foreground">Loại hạt / Độ xay</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Hạt nguyên', 'Xay mịn (Phin)', 'Xay vừa (Filter)', 'Xay thô (French Press)'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setGrind(opt)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          grind === opt
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-background hover:bg-secondary text-muted-foreground border-border'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold mb-2 block text-foreground">Trọng lượng gói</label>
                  <div className="flex gap-3">
                    {[product.weight || '250g', '500g', '1kg'].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setWeight(w)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          weight === w
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-background hover:bg-secondary text-muted-foreground border-border'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-4 border-t border-border/80 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground font-semibold">Thành tiền:</span>
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrencyVN(product.price * quantity)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden shrink-0 self-start sm:self-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-3 hover:bg-secondary transition-colors font-bold text-lg text-foreground"
                    >
                      −
                    </button>
                    <span className="px-4 font-bold min-w-[2.5rem] text-center text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-3 hover:bg-secondary transition-colors font-bold text-lg text-foreground"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    variant={added ? 'accent' : 'glow'}
                    size="lg"
                    className="flex-1 gap-2 font-bold"
                  >
                    <AnimatePresence mode="wait">
                      {added ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-2"
                        >
                          <Check className="w-5 h-5" /> Đã thêm vào giỏ!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="cart"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>

                  {/* Buy Now Button */}
                  <Button
                    onClick={handleBuyNow}
                    variant="default"
                    size="lg"
                    className="flex-1 font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md"
                  >
                    <Zap className="w-5 h-5 mr-1" /> Mua ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Table (Requirement 3: Only display non-empty key-values) */}
          {product.details && Object.keys(product.details).length > 0 && (
            <div className="pt-8">
              <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Thông tin sản phẩm chi tiết</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.details)
                  .filter(([_, value]) => value && value.trim() !== '')
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center p-4 bg-secondary/40 rounded-2xl border border-border/60"
                    >
                      <span className="text-xs font-semibold text-muted-foreground">{key}</span>
                      <span className="text-sm font-bold text-foreground text-right">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          <div className="pt-12 border-t border-border/80 space-y-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Gợi ý sản phẩm khác</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
