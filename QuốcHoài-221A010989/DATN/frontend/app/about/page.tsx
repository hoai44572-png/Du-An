'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Heart, Globe, Award, Sparkles, Coffee, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const MILESTONES = [
  { year: '2015', title: 'Thành lập thương hiệu', event: 'Khởi đầu từ một xưởng rang cà phê nhỏ thủ công tại Seattle, hướng tới trải nghiệm cà phê nguyên bản.' },
  { year: '2017', title: 'Mở rộng nguồn cung', event: 'Kết nối mạng lưới hợp tác trực tiếp với 50+ nông hộ trồng cà phê Specialty trên toàn thế giới.' },
  { year: '2019', title: 'Chứng nhận Fair-Trade', event: 'Đạt chứng nhận thương mại bình đẳng quốc tế, hỗ trợ đời sống nông dân vùng cao.' },
  { year: '2022', title: 'Cột mốc 10.000 Khách hàng', event: 'Phục vụ hơn 10,000 khách hàng trung thành trên toàn quốc với phản hồi hài lòng 98%.' },
  { year: '2024', title: 'Dòng sản phẩm Single-Origin mới', event: 'Chính thức ra mắt bộ sưu tập cà phê đơn nguồn gốc độc bản giới hạn.' },
]

const VALUES = [
  {
    icon: Heart,
    title: 'Đam Mê Tối Thượng',
    description: 'Chúng tôi dành tình yêu thuần khiết cho cà phê và tỉ mỉ gửi gắm cảm xúc vào từng mẻ rang.',
  },
  {
    icon: Globe,
    title: 'Nguồn Gốc Toàn Cầu',
    description: 'Trực tiếp tìm kiếm những hạt cà phê hảo hạng nhất từ Ethiopia, Colombia tới Đắk Lắk.',
  },
  {
    icon: Award,
    title: 'Chất Lượng Thượng Hạng',
    description: 'Quy trình kiểm soát chất lượng 5 bước nghiêm ngặt từ thu hoạch tới khi giao tận tay bạn.',
  },
  {
    icon: Users,
    title: 'Cộng Đồng Bền Vũng',
    description: 'Cam kết chia sẻ lợi nhuận, đồng hành cải thiện đời sống nông dân trồng cà phê.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 px-4 bg-gradient-to-b from-background via-secondary/40 to-secondary relative overflow-hidden">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary font-bold text-xs uppercase tracking-wider">
              Câu chuyện thương hiệu
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight"
          >
            Hành trình kiến tạo <span className="gradient-text-primary">Tách Cà Phê Hoàn Hảo</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Thành lập từ năm 2015, Swift Coffee theo đuổi sứ mệnh mang cà phê chuyên biệt hảo hạng nhất thế giới tới những người yêu hương vị nguyên bản.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="flex-1 py-16 md:py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl space-y-20">
          {/* Mission Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <span className="text-accent uppercase text-xs font-bold tracking-widest px-3 py-1 bg-accent/10 rounded-full">
                Sứ mệnh của chúng tôi
              </span>
              <h2 className="text-3xl font-serif font-bold text-foreground">
                Đưa giá trị nguyên bản tới từng tách cà phê
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Chúng tôi tin rằng mọi tách cà phê tuyệt vời đều bắt đầu từ sự tôn trọng đất mẹ và người trồng. Thông qua hợp tác trực tiếp không qua trung gian, Swift Coffee đảm bảo nguồn nông sản minh bạch và kỹ thuật rang làm nổi bật nốt hương đặc trưng của từng vùng đất.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-secondary to-muted border border-border/80 rounded-3xl h-72 flex flex-col items-center justify-center text-center p-6 shadow-inner"
            >
              <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center text-primary mb-3">
                <Coffee className="w-8 h-8" />
              </div>
              <p className="font-serif font-bold text-xl text-foreground">Specialty Coffee Standard</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Chỉ lựa chọn 5% hạt cà phê chất lượng cao nhất thế giới đạt điểm Cupping từ 85+ trở lên.
              </p>
            </motion.div>
          </div>

          {/* Core Values Grid */}
          <div className="space-y-10">
            <div className="text-center space-y-2">
              <span className="text-accent uppercase text-xs font-bold tracking-widest px-3 py-1 bg-accent/10 rounded-full">
                Triết lý hoạt động
              </span>
              <h2 className="text-3xl font-serif font-bold text-foreground">Giá Trị Cốt Lõi</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {VALUES.map((value, idx) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-3xl bg-secondary/40 border border-border/60 hover:border-primary/40 hover:bg-card transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-2xl shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="font-serif text-lg font-bold text-foreground">{value.title}</h3>
                        <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Development Timeline */}
          <div className="space-y-10">
            <div className="space-y-2">
              <span className="text-accent uppercase text-xs font-bold tracking-widest px-3 py-1 bg-accent/10 rounded-full">
                Lịch sử thương hiệu
              </span>
              <h2 className="text-3xl font-serif font-bold text-foreground">Hành Trình Phát Triển</h2>
            </div>

            <div className="relative border-l-2 border-primary/20 ml-4 space-y-8 pl-6">
              {MILESTONES.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative space-y-1"
                >
                  {/* Timeline Bullet */}
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background shadow" />
                  <span className="text-xs font-bold text-primary tracking-wider">{item.year}</span>
                  <h3 className="text-lg font-serif font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.event}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 bg-primary text-primary-foreground rounded-3xl space-y-6 relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <h3 className="text-2xl md:text-3xl font-serif font-bold">Thưởng thức hương vị chuẩn chỉnh ngay hôm nay</h3>
              <p className="opacity-85 text-sm md:text-base max-w-lg leading-relaxed">
                Khám phá bộ sưu tập cà phê Single-Origin thượng hạng mới nhất được rang tươi nguyên chất.
              </p>
            </div>
            <Link href="/menu" className="inline-block relative z-10">
              <Button variant="accent" size="lg" className="font-bold gap-2">
                Mua ngay bây giờ <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
