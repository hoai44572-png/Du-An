'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User, ShoppingBag, Heart, MapPin, Lock, Coffee, LogOut, ChevronRight, CreditCard,
} from 'lucide-react';
import { authStorage } from '@/lib/auth';
import { useToast } from '@/components/ui/toast';

const navItems = [
  { href: '/profile', label: 'Hồ sơ & Dashboard', icon: User },
  { href: '/profile/orders', label: 'Lịch sử mua hàng', icon: ShoppingBag },
  { href: '/profile/transactions', label: 'Lịch sử giao dịch', icon: CreditCard },
  { href: '/profile/wishlist', label: 'Sản phẩm yêu thích', icon: Heart },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { info } = useToast();
  const [user, setUser] = useState(authStorage.getUser());

  useEffect(() => {
    if (!authStorage.isAuthenticated()) {
      router.push('/login');
    } else {
      setUser(authStorage.getUser());
    }
  }, [router]);

  const handleLogout = () => {
    authStorage.removeToken();
    info('Đã đăng xuất khỏi tài khoản.');
    router.push('/');
    router.refresh();
  };

  if (!authStorage.isAuthenticated()) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Coffee className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-serif font-bold text-foreground">Tài khoản của tôi</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-3">
            {/* User Card */}
            <div className="bg-card border border-border/80 rounded-3xl p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 overflow-hidden flex-shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground text-sm truncate">{user?.name || 'Khách hàng'}</p>
                <p className="text-xs text-foreground/50 truncate">{user?.email}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {user?.role === 'admin' ? '👑 Admin' : '⭐ Thành viên'}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-card border border-border/80 rounded-3xl p-2 space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== '/profile' && pathname?.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'text-foreground/70 hover:bg-secondary/60 hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'opacity-70' : 'opacity-30'}`} />
                  </Link>
                );
              })}

              <div className="border-t border-border/60 pt-1 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </nav>

            {/* Admin Link */}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="block w-full text-center px-4 py-3 rounded-2xl bg-amber-500/10 text-amber-600 text-sm font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-all"
              >
                👑 Vào trang Admin
              </Link>
            )}
          </aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}
