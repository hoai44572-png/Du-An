'use client';

import { useRef, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Leaf, Award, Star, Coffee } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCounter } from '@/hooks/useCounter';
import { useToast } from '@/components/ui/toast';

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'Cà Phê Rang Xay Alambé',
    origin: 'Việt Nam',
    price: 250000,
    image: '/products/SanPham-1.webp',
    description: 'Hương thơm dịu dàng, đậm đà và mịn màng',
    category: 'Rang vừa',
    tasting: 'Thơm dịu, Đậm đà, Mịn màng',
    rating: 4.7,
    reviewsCount: 38,
  },
  {
    id: 3,
    name: 'Cà phê rang ESPRESSO BLEND',
    origin: 'Việt Nam',
    price: 200000,
    image: '/products/SanPham-3.webp',
    description: 'Đậm đà, crema dày, hậu vị caramel chuẩn vị barista',
    category: 'Rang đậm',
    tasting: 'Espresso, Đậm, Caramel',
    rating: 4.6,
    reviewsCount: 55,
  },
  {
    id: 5,
    name: 'Cà Phê rang xay đặc biệt',
    origin: 'Việt Nam',
    price: 400000,
    image: '/products/SanPham-5.webp',
    description: 'Blend đặc biệt hương hoa, vị ngọt dịu và phức hợp',
    category: 'Rang vừa',
    tasting: 'Hoa, Ngọt dịu, Phức hợp',
    rating: 4.9,
    reviewsCount: 61,
  },
  {
    id: 12,
    name: 'KING COFFEE Expert Blend 2 - Túi 500g',
    origin: 'Việt Nam',
    price: 410000,
    image: '/products/SanPham-12.webp',
    description: 'Đậm đà, caramel và hạt dẻ — lựa chọn của barista',
    category: 'Rang đậm',
    tasting: 'Expert blend, Đậm đà, Caramel, Hạt dẻ',
    rating: 4.9,
    reviewsCount: 105,
  },
];

function StatItem({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const count = useCounter({ to: value, duration: 1500, viewRef: containerRef });

  return (
    <div ref={containerRef} className="text-center py-2 px-3 border-r border-border/50 last:border-r-0">
      <p className="text-xl md:text-2xl font-serif font-bold text-foreground">
        {count}
        {suffix}
      </p>
      <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const { success, warning } = useToast();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      warning('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    setNewsletterLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setNewsletterLoading(false);
    success('Đăng ký thành công! Cảm ơn bạn đã đồng hành cùng Swift Coffee.');
    setEmail('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section — Clean, Hand-coded look */}
      <section
        ref={heroRef}
        className="pt-28 md:pt-36 pb-16 md:pb-20 px-4 bg-secondary/30 relative"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/8 border border-primary/15 rounded text-primary text-xs font-semibold uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-primary" />
                  <span>Cà phê chuyên biệt 100% Nguyên Chất</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground leading-[1.2]">
                  Khám phá hương vị cà phê đỉnh cao
                </h1>
              </div>

              <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                Hạt cà phê chuyên biệt được chọn lọc trực tiếp từ những vùng trồng tốt nhất thế giới, rang nướng thủ công theo phương pháp Châu Âu.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/menu">
                  <Button size="lg" className="gap-2 font-medium">
                    Khám phá Menu <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="font-medium">
                    Về chúng tôi
                  </Button>
                </Link>
              </div>

              {/* Clean Stats Grid */}
              <div className="grid grid-cols-4 pt-6 border-t border-border/60 max-w-md">
                <StatItem value={50} suffix="+" label="Nguồn gốc" />
                <StatItem value={10} suffix="K+" label="Khách hàng" />
                <StatItem value={98} suffix="%" label="Hài lòng" />
                <StatItem value={12} suffix=" Năm" label="Kinh nghiệm" />
              </div>
            </div>

            {/* Hero Visual Image — Clean rounded-lg frame, no float badges */}
            <motion.div
              style={{ y: heroY, opacity: heroOpacity }}
              className="relative h-80 md:h-[440px] rounded-lg overflow-hidden shadow-md border border-border/60"
            >
              <Image
                src="/Trang-Chu/1C6A6769-scaled.jpg"
                alt="Swift Coffee Premium Beans"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 space-y-2">
            <p className="text-primary font-semibold text-xs uppercase tracking-widest">
              Cam kết chất lượng
            </p>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-foreground">
              Tại sao chọn Swift Coffee?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Chúng tôi chú trọng từng công đoạn nhỏ nhất để mang tới tách cà phê hoàn hảo cho bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: 'Lựa chọn cao cấp',
                description: 'Hạt cà phê Specialty đoạt giải từ các trang trại nổi tiếng toàn cầu.',
              },
              {
                icon: Zap,
                title: 'Mới rang nướng',
                description: 'Rang theo mẻ nhỏ (Small-batch) hàng ngày để đảm bảo độ tươi mới tuyệt đối.',
              },
              {
                icon: Leaf,
                title: 'Phát triển bền vững',
                description: 'Thương mại trực tiếp Fair-Trade hỗ trợ người nông dân trồng cà phê.',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="text-center space-y-3 p-6 rounded-lg bg-card border border-border/70 shadow-xs hover:border-primary/30 transition-colors"
                >
                  <div className="inline-flex p-3 bg-secondary rounded text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 px-4 bg-secondary/20 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <p className="text-primary font-semibold text-xs uppercase tracking-widest">
                Sản phẩm nổi bật
              </p>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-foreground mt-1">
                Cà phê tiêu biểu
              </h2>
            </div>
            <Link href="/menu">
              <Button variant="ghost" className="gap-2 text-primary text-xs font-semibold">
                Xem toàn bộ Menu <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Newsletter Section — Clean, Flat */}
      <section className="py-16 md:py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-xl text-center space-y-6">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-primary-foreground/10 rounded flex items-center justify-center mx-auto">
              <Coffee className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">
              Đăng ký nhận ưu đãi & Cà phê tươi
            </h2>
            <p className="text-sm opacity-85 leading-relaxed">
              Nhận thông báo khi có lô cà phê Single-Origin mới vừa cập cảng cùng mã giảm giá 15% cho đơn hàng đầu tiên.
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email của bạn..."
              className="px-3.5 py-2.5 rounded bg-primary-foreground text-foreground flex-1 placeholder:text-muted-foreground focus:outline-none text-xs font-medium"
            />
            <Button
              type="submit"
              variant="secondary"
              isLoading={newsletterLoading}
              className="font-semibold shrink-0"
            >
              Đăng ký ngay
            </Button>
          </form>

          <p className="text-[11px] opacity-60">Miễn phí hủy bất cứ lúc nào. Bảo mật thông tin 100%.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
