'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ShoppingCart, Menu, X, Coffee, User, LogOut, ChevronDown, LayoutDashboard, ShoppingBag, CreditCard, Shield, Heart
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { authStorage, UserProfile } from '@/lib/auth'

const navItems = [
  { href: '/',              label: 'Trang chủ' },
  { href: '/menu',          label: 'Menu' },
  { href: '/brewing-guide', label: 'Hướng dẫn pha chế' },
  { href: '/about',         label: 'Về chúng tôi' },
  { href: '/contact',       label: 'Liên hệ' },
  { href: '/support',       label: 'Hỗ trợ' },
]

export function Header() {
  const [isOpen,    setIsOpen]    = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const [prevCount, setPrevCount] = useState(0)
  const [cartBounce, setCartBounce] = useState(false)
  const [prevWishlistCount, setPrevWishlistCount] = useState(0)
  const [wishlistBounce, setWishlistBounce] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [showAccountMenu, setShowAccountMenu] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const { totalItems } = useCart()
  const { totalWishlist } = useWishlist()
  const { scrollY } = useScroll()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Scroll listener
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))

  // Close mobile menu & account dropdown on route change
  useEffect(() => {
    setIsOpen(false)
    setShowAccountMenu(false)
    setUser(authStorage.getUser())
  }, [pathname])

  // Sync user state on mount & click outside handler
  useEffect(() => {
    setUser(authStorage.getUser())

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cart badge bounce on change
  useEffect(() => {
    if (totalItems !== prevCount) {
      if (totalItems > 0) {
        setCartBounce(true)
        const timer = setTimeout(() => setCartBounce(false), 250)
        setPrevCount(totalItems)
        return () => clearTimeout(timer)
      }
      setPrevCount(totalItems)
    }
  }, [totalItems, prevCount])

  // Wishlist badge bounce on change
  useEffect(() => {
    if (totalWishlist !== prevWishlistCount) {
      if (totalWishlist > 0) {
        setWishlistBounce(true)
        const timer = setTimeout(() => setWishlistBounce(false), 250)
        setPrevWishlistCount(totalWishlist)
        return () => clearTimeout(timer)
      }
      setPrevWishlistCount(totalWishlist)
    }
  }, [totalWishlist, prevWishlistCount])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleLogout = () => {
    authStorage.removeToken()
    setUser(null)
    setShowAccountMenu(false)
    router.push('/')
  }

  const isActive = (href: string) => pathname === href

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        animate={{
          backgroundColor: scrolled
            ? 'oklch(1 0 0 / 0.88)'
            : 'oklch(1 0 0 / 0)',
          boxShadow: scrolled
            ? '0 2px 20px oklch(0.2 0.01 40 / 0.08), 0 1px 0 oklch(0.92 0.002 45)'
            : '0 0 0 oklch(0 0 0 / 0)',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ backdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'blur(0px)' }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="flex items-center justify-between"
            animate={{ height: scrolled ? '56px' : '72px' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="Swift Coffee - Trang chủ">
              <motion.div
                className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[var(--shadow-sm)] shadow-primary/20"
                whileHover={{ scale: 1.06, rotate: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Coffee className="w-4 h-4 text-primary-foreground" />
              </motion.div>
              <motion.span
                className="text-[17px] font-serif font-bold text-foreground hidden sm:inline tracking-tight"
                animate={{ opacity: scrolled ? 0.9 : 1 }}
              >
                Swift Coffee
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Menu chính">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'relative px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors duration-150',
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-foreground/60 hover:text-foreground hover:bg-secondary/70',
                  ].join(' ')}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0.5 left-3 right-3 h-[1.5px] bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="absolute bottom-0.5 left-3 right-3 h-[1.5px] bg-primary/35 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200" />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* User Account / Login Dropdown */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-secondary/60 hover:bg-secondary border border-border/60 transition-all text-xs font-semibold text-foreground"
                  >
                    <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[11px] font-bold text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate font-bold">{user.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-foreground/50 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showAccountMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-56 bg-card border border-border/80 rounded-2xl shadow-xl p-2 space-y-1 z-50 text-xs font-medium"
                      >
                        <div className="px-3 py-2 border-b border-border/50">
                          <p className="font-bold text-foreground text-sm truncate">{user.name}</p>
                          <p className="text-[11px] text-foreground/50 truncate">{user.email}</p>
                        </div>

                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground/80 hover:bg-secondary hover:text-primary transition-colors"
                        >
                          <User className="w-4 h-4 text-primary" />
                          <span>Hồ sơ & Dashboard</span>
                        </Link>

                        <Link
                          href="/profile/orders"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground/80 hover:bg-secondary hover:text-primary transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 text-emerald-500" />
                          <span>Lịch sử mua hàng</span>
                        </Link>

                        <Link
                          href="/profile/transactions"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground/80 hover:bg-secondary hover:text-primary transition-colors"
                        >
                          <CreditCard className="w-4 h-4 text-indigo-500" />
                          <span>Lịch sử giao dịch</span>
                        </Link>

                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-600 bg-amber-500/10 font-bold hover:bg-amber-500/20 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-amber-600" />
                            <span>Quản trị Admin</span>
                          </Link>
                        )}

                        <div className="border-t border-border/50 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-bold"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  aria-label="Tài khoản & Đăng nhập"
                  className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:bg-primary/90 flex items-center gap-1.5 transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label={`Yêu thích (${totalWishlist} sản phẩm)`}
                className="relative p-2 rounded-xl hover:bg-secondary transition-colors duration-150 group"
                title="Sản phẩm yêu thích"
              >
                <Heart
                  className={`w-5 h-5 transition-colors duration-200 ${
                    totalWishlist > 0
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-foreground/70 group-hover:text-rose-500'
                  }`}
                />
                <AnimatePresence>
                  {totalWishlist > 0 && (
                    <motion.span
                      key="wishlist-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: wishlistBounce ? [1, 1.35, 0.9, 1] : 1,
                        opacity: 1,
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm z-10 select-none pointer-events-none"
                    >
                      {totalWishlist > 99 ? '99+' : totalWishlist}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label={`Giỏ hàng (${totalItems} sản phẩm)`}
                className="relative p-2 rounded-xl hover:bg-secondary transition-colors duration-150"
              >
                <ShoppingCart className="w-5 h-5 text-foreground/70 hover:text-primary transition-colors" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="cart-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: cartBounce ? [1, 1.35, 0.9, 1] : 1,
                        opacity: 1,
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-[#DC2626] text-white text-[11px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm z-10 select-none pointer-events-none"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Mobile toggle */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors duration-150"
                whileTap={{ scale: 0.92 }}
                aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
                aria-expanded={isOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isOpen ? 'x' : 'menu'}
                    initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                    transition={{ duration: 0.18 }}
                  >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl"
              aria-label="Menu điều hướng mobile"
            >
              <div className="container mx-auto px-4 py-4 space-y-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                  >
                    <Link
                      href={item.href}
                      className={[
                        'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-150',
                        isActive(item.href)
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-foreground/70 hover:bg-secondary hover:text-foreground',
                      ].join(' ')}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                      {isActive(item.href) && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/60" />
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile: Wishlist quick link */}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05, duration: 0.25 }}
                >
                  <Link
                    href="/wishlist"
                    className={[
                      'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-150',
                      isActive('/wishlist')
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-foreground/70 hover:bg-secondary hover:text-foreground',
                    ].join(' ')}
                    onClick={() => setIsOpen(false)}
                  >
                    <Heart
                      className={`w-4 h-4 shrink-0 ${
                        totalWishlist > 0 ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                    <span>Yêu thích</span>
                    {totalWishlist > 0 && (
                      <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {totalWishlist}
                      </span>
                    )}
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
