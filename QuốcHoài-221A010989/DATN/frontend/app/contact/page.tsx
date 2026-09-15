'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/ui/toast'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { success, error } = useToast()

  const MAX_MESSAGE_CHARS = 500

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setFormError('Vui lòng nhập đầy đủ các trường thông tin.')
      error('Vui lòng điền đầy đủ các thông tin bắt buộc.')
      return
    }

    if (message.length > MAX_MESSAGE_CHARS) {
      setFormError(`Tin nhắn quá dài (tối đa ${MAX_MESSAGE_CHARS} ký tự).`)
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
    success('Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong 24h.', 'Gửi thành công')

    // Reset form after 3 seconds
    setTimeout(() => {
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 px-4 bg-gradient-to-b from-background via-secondary/40 to-secondary">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent uppercase text-xs font-bold tracking-widest px-3 py-1 bg-accent/10 rounded-full inline-block"
          >
            Hỗ trợ 24/7
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-foreground"
          >
            Liên Hệ Với Swift Coffee
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Bạn có thắc mắc về hương vị cà phê hoặc cần tư vấn sản phẩm? Đội ngũ ngũ Barista chuyên nghiệp của chúng tôi luôn sẵn sàng giải đáp.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="flex-1 py-16 md:py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-serif font-bold text-foreground">Thông Tin Liên Hệ Direct</h2>
              <p className="text-sm text-muted-foreground">
                Hãy ghé thăm showroom của chúng tôi hoặc liên lạc trực tiếp qua thông tin hotline hỗ trợ dưới đây:
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    icon: Phone,
                    title: 'Điện thoại hotline',
                    content: '(028) 3812 4567 / 090 123 4567',
                    sub: 'Hỗ trợ khách hàng từ 8:00 - 20:00',
                  },
                  {
                    icon: Mail,
                    title: 'Email hỗ trợ',
                    content: 'hello@swiftcoffee.vn',
                    sub: 'Phản hồi trong vòng 24 giờ làm việc',
                  },
                  {
                    icon: MapPin,
                    title: 'Địa chỉ Showroom',
                    content: '123 Đường Cà Phê, Phường Bến Nghé\nQuận 1, Thành phố Hồ Chí Minh',
                    sub: 'Có chỗ đỗ xe hơi miễn phí',
                  },
                  {
                    icon: Clock,
                    title: 'Giờ mở cửa',
                    content: 'Thứ Hai - Thứ Sáu: 7:00 AM - 9:00 PM\nThứ Bảy - Chủ Nhật: 8:00 AM - 10:00 PM',
                    sub: 'Mở cửa tất cả các ngày lễ',
                  },
                ].map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/60 hover:border-primary/30 transition-all duration-200"
                    >
                      <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0 h-fit">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
                        <p className="text-sm text-foreground/80 font-medium whitespace-pre-line leading-relaxed">
                          {item.content}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Contact Form with Floating Labels & Character Counter */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border/80 p-6 md:p-8 rounded-3xl shadow-lg space-y-6"
            >
              <div className="space-y-1">
                <h3 className="text-2xl font-serif font-bold text-foreground">Gửi Tin Nhắn Cho Chúng Tôi</h3>
                <p className="text-xs text-muted-foreground">Điền thông tin và phản hồi của bạn vào biểu mẫu bên dưới.</p>
              </div>

              {formError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold rounded-xl animate-shake">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Floating Label: Name */}
                <div className="field-float">
                  <input
                    type="text"
                    required
                    placeholder=" "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                  <label>Họ và tên *</label>
                </div>

                {/* Floating Label: Email */}
                <div className="field-float">
                  <input
                    type="email"
                    required
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                  <label>Địa chỉ Email *</label>
                </div>

                {/* Floating Label: Subject */}
                <div className="field-float">
                  <input
                    type="text"
                    required
                    placeholder=" "
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                  <label>Chủ đề thắc mắc *</label>
                </div>

                {/* Floating Label: Message with Counter */}
                <div className="space-y-1">
                  <div className="field-float">
                    <textarea
                      required
                      rows={4}
                      maxLength={MAX_MESSAGE_CHARS}
                      placeholder=" "
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
                    ></textarea>
                    <label>Nội dung tin nhắn *</label>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground px-1">
                    <span>Vui lòng trình bày rõ ràng nhu cầu của bạn</span>
                    <span className={message.length > MAX_MESSAGE_CHARS - 20 ? 'text-destructive font-bold' : ''}>
                      {message.length} / {MAX_MESSAGE_CHARS} ký tự
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant={submitted ? 'accent' : 'glow'}
                  size="lg"
                  isLoading={loading}
                  className="w-full font-bold"
                >
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.span
                        key="sent"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" /> Đã Gửi Tin Nhắn!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="send"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" /> Gửi Tin Nhắn Ngay
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
