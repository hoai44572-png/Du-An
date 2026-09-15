'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Coffee, ArrowUp, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/ui/toast'

/* ── Social icons (SVG inline, chính xác) ── */
const SocialLinks = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

const footerLinks = {
  quickLinks: [
    { href: '/menu',          label: 'Mua cà phê' },
    { href: '/brewing-guide', label: 'Hướng dẫn pha chế' },
    { href: '/about',         label: 'Về chúng tôi' },
    { href: '/contact',       label: 'Liên hệ' },
  ],
  legal: [
    { href: '#', label: 'Chính sách bảo mật' },
    { href: '#', label: 'Điều khoản dịch vụ' },
    { href: '#', label: 'Chính sách hoàn hàng' },
  ],
}

/* ── Back To Top ── */
function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-200"
          aria-label="Cuộn lên đầu trang"
          data-tooltip="Lên đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* ── Newsletter ── */
function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { success, error } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    success('Đăng ký thành công! Cảm ơn bạn đã theo dõi Swift Coffee.', 'Chào mừng!')
    setEmail('')
  }

  return (
    <div>
      <h3 className="font-serif text-lg font-bold mb-3 text-primary-foreground">Bản tin</h3>
      <p className="text-sm opacity-75 mb-4 leading-relaxed">
        Nhận ưu đãi và tin tức mới nhất từ Swift Coffee.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email của bạn"
          required
          className="flex-1 min-w-0 px-3 py-2 text-sm rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-primary-foreground/50 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2.5 rounded-xl bg-primary-foreground/15 hover:bg-primary-foreground/25 border border-primary-foreground/20 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
          aria-label="Đăng ký nhận bản tin"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin block" />
          ) : (
            <Send className="w-4 h-4 text-primary-foreground" />
          )}
        </button>
      </form>
    </div>
  )
}

/* ── Main Footer ── */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <>
      <footer className="bg-primary text-primary-foreground relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/2 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-14 md:py-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-primary-foreground/15 rounded-xl flex items-center justify-center border border-primary-foreground/20">
                  <Coffee className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-serif text-xl font-bold tracking-tight">Swift Coffee</span>
              </div>
              <p className="text-sm opacity-75 leading-relaxed">
                Cà phê chuyên biệt cao cấp từ khắp nơi trên thế giới, rang nướng bởi các chuyên gia và giao tận tay bạn.
              </p>
              {/* Social */}
              <div className="flex gap-2 flex-wrap">
                {SocialLinks.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="p-2.5 rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 hover:bg-primary-foreground/20 hover:border-primary-foreground/30 transition-all duration-200"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-serif text-lg font-bold mb-4">Liên kết nhanh</h3>
              <ul className="space-y-2.5">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm opacity-75 hover:opacity-100 hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-serif text-lg font-bold mb-4">Liên hệ</h3>
              <ul className="space-y-3.5">
                {[
                  { icon: Phone, text: '(028) 3812 4567' },
                  { icon: Mail,  text: 'hello@swiftcoffee.vn' },
                  { icon: MapPin, text: '123 Đường Cà Phê, Quận 1, TP.HCM' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-2.5 text-sm">
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-70" />
                    <span className="opacity-80 leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <Newsletter />
          </div>

          {/* Bottom bar */}
          <div className="border-t border-primary-foreground/15 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs opacity-65">
            <p>© {currentYear} Swift Coffee. Bản quyền được bảo lưu.</p>
            <div className="flex gap-5 flex-wrap justify-center">
              {footerLinks.legal.map((l) => (
                <Link key={l.label} href={l.href} className="hover:opacity-100 transition-opacity">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <BackToTop />
    </>
  )
}
