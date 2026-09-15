'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag, Coffee, Trash2, Plus, Minus, Tag, ShieldCheck, CheckCircle2, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart-context'
import { useToast } from '@/components/ui/toast'
import { formatCurrencyVN } from '@/lib/utils'

import { useRouter } from 'next/navigation'

export default function CartPage() {
  const router = useRouter()
  const { items, totalPrice, updateQty, removeItem, clearCart } = useCart()
  const [voucherCode, setVoucherCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const { success, warning, info } = useToast()

  const SHIPPING_FEE = totalPrice > 50 || items.length === 0 ? 0 : 3.99
  const discountAmount = (totalPrice * discountPercent) / 100
  const finalTotal = Math.max(0, totalPrice - discountAmount + SHIPPING_FEE)
  const freeShippingThreshold = 500000
  const freeShippingProgress = Math.min(100, (totalPrice / freeShippingThreshold) * 100)

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault()
    if (!voucherCode.trim()) return

    if (voucherCode.toUpperCase() === 'SWIFT10') {
      setDiscountPercent(10)
      success('Áp dụng mã giảm giá SWIFT10 thành công! (-10%)')
    } else if (voucherCode.toUpperCase() === 'SWIFT20') {
      setDiscountPercent(20)
      success('Áp dụng mã giảm giá SWIFT20 thành công! (-20%)')
    } else {
      warning('Mã giảm giá không hợp lệ hoặc đã hết hạn')
    }
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)
    setTimeout(() => {
      setIsCheckingOut(false)
      router.push('/checkout')
    }, 500)
  }

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <section className="pt-32 md:pt-40 pb-16 px-4 bg-background flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="container mx-auto max-w-md text-center space-y-6 bg-secondary/30 p-8 rounded-3xl border border-border"
          >
            <div className="w-16 h-16 bg-accent/15 text-accent rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-serif font-bold text-foreground">Đặt Hàng Thành Công!</h1>
              <p className="text-sm text-muted-foreground">
                Cảm ơn bạn đã lựa chọn Swift Coffee. Đơn hàng của bạn đang được chuyên gia chuẩn bị rang và đóng gói.
              </p>
            </div>
            <Link href="/menu" className="block pt-2">
              <Button variant="glow" className="w-full font-bold">
                Tiếp tục mua sắm <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </section>
        <Footer />
      </div>
    )
  }

  // Empty State
  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />

        <section className="pt-32 md:pt-40 pb-16 px-4 bg-background flex-1 flex items-center justify-center">
          <div className="container mx-auto max-w-2xl text-center space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative inline-flex"
            >
              <div className="p-8 bg-secondary/60 rounded-3xl shadow-inner border border-border">
                <ShoppingBag className="w-16 h-16 text-muted-foreground/40 mx-auto" />
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 animate-bounce">
                <Coffee className="w-5 h-5 text-primary" />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                Giỏ hàng của bạn đang trống
              </h1>
              <p className="text-base text-muted-foreground max-w-md mx-auto">
                Hãy khám phá các dòng hạt cà phê Single-Origin đặc biệt mới nhất của chúng tôi.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/menu">
                <Button variant="glow" size="lg" className="gap-2 font-bold">
                  Khám phá Menu ngay <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/brewing-guide">
                <Button variant="outline" size="lg">
                  Xem hướng dẫn pha chế
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  const getImageFileName = (src: string) => {
    if (!src) return 'product-image.jpg'
    try {
      const cleanSrc = src.split('?')[0]
      const filename = cleanSrc.split('/').pop() || src
      return decodeURIComponent(filename)
    } catch {
      return src
    }
  }

  // Active Cart Items UI
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="pt-32 md:pt-40 pb-16 px-4 bg-background flex-1">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Giỏ Hàng Của Bạn</h1>
              <p className="text-sm text-muted-foreground mt-1">Đã chọn {items.reduce((s, i) => s + i.quantity, 0)} sản phẩm</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { clearCart(); info('Đã xóa tất cả sản phẩm khỏi giỏ hàng'); }} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1.5" /> Xóa tất cả
            </Button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-secondary/40 rounded-2xl border border-border/60 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>
                {totalPrice >= freeShippingThreshold ? (
                  <span className="text-accent font-bold">🎉 Bạn đã đủ điều kiện Miễn Phí Giao Hàng!</span>
                ) : (
                  <span>Mua thêm <strong className="text-primary">{formatCurrencyVN(freeShippingThreshold - totalPrice)}</strong> để được Miễn Phí Giao Hàng</span>
                )}
              </span>
              <span className="text-muted-foreground">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${freeShippingProgress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-between p-4 bg-card border border-border rounded-2xl gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="relative w-20 h-20 bg-secondary rounded-xl overflow-hidden shrink-0 border border-border/50">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                          unoptimized
                        />
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <h3 className="font-serif font-bold text-foreground text-base truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">{item.origin} {item.grind ? `• ${item.grind}` : ''} {item.weight ? `• ${item.weight}` : ''}</p>
                        
                        {/* Tên hình ảnh sản phẩm */}
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80 bg-secondary/60 px-2.5 py-0.5 rounded-md w-fit border border-border/50 font-mono">
                          <ImageIcon className="w-3 h-3 text-primary shrink-0" />
                          <span className="truncate max-w-[200px]" title={item.image}>
                            Tên hình ảnh: <strong className="font-medium text-foreground">{getImageFileName(item.image)}</strong>
                          </span>
                        </div>

                        <p className="text-sm font-bold text-primary">{formatCurrencyVN(item.price)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-border rounded-xl bg-background">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-secondary text-foreground"
                          aria-label="Giảm"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-bold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-secondary text-foreground"
                          aria-label="Tăng"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[5rem]">
                        <p className="text-base font-bold text-foreground">{formatCurrencyVN(item.price * item.quantity)}</p>
                      </div>

                      <button
                        onClick={() => { removeItem(item.id); info(`Đã xóa "${item.name}"`); }}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link href="/menu" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline pt-2">
                <ArrowLeft className="w-4 h-4" /> Tiếp tục xem sản phẩm khác
              </Link>
            </div>

            {/* Order Summary & Voucher */}
            <div className="space-y-6">
              {/* Voucher Box */}
              <div className="p-6 bg-card border border-border rounded-3xl space-y-4 shadow-sm">
                <h3 className="font-serif font-bold text-base flex items-center gap-2 text-foreground">
                  <Tag className="w-4 h-4 text-primary" /> Mã Giảm Giá
                </h3>
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Nhập SWIFT10 hoặc SWIFT20"
                    className="flex-1 px-3 py-2 text-xs border border-border rounded-xl uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button type="submit" variant="secondary" size="sm" className="font-bold">
                    Áp dụng
                  </Button>
                </form>
              </div>

              {/* Summary Box */}
              <div className="p-6 bg-card border border-border rounded-3xl space-y-4 shadow-sm">
                <h3 className="font-serif font-bold text-lg text-foreground border-b border-border/80 pb-3">Tóm Tắt Đơn Hàng</h3>

                <div className="space-y-2.5 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Tạm tính ({items.length} món):</span>
                    <span className="font-semibold text-foreground">{formatCurrencyVN(totalPrice)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold text-foreground">
                      {SHIPPING_FEE === 0 ? <strong className="text-accent">Miễn phí</strong> : formatCurrencyVN(SHIPPING_FEE)}
                    </span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-accent font-semibold">
                      <span>Giảm giá ({discountPercent}%):</span>
                      <span>-{formatCurrencyVN(discountAmount)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border/80 flex justify-between items-baseline">
                  <span className="font-bold text-foreground text-sm">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrencyVN(finalTotal)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  variant="glow"
                  size="lg"
                  isLoading={isCheckingOut}
                  className="w-full font-bold mt-2"
                >
                  Xác Nhận Đặt Hàng <ArrowRight className="w-4 h-4 ml-1" />
                </Button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Thanh toán an toàn 100% bảo mật
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
