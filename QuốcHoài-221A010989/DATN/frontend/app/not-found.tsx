import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="flex-1 flex items-center justify-center px-4 bg-background">
        <div className="text-center space-y-6">
          <div className="text-9xl font-serif font-bold text-primary">404</div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Không tìm thấy trang
          </h1>
          <p className="text-lg text-foreground/70 max-w-md mx-auto">
            Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Hãy để chúng tôi giúp bạn quay lại.
          </p>
          <Link href="/">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              Về trang chủ <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
