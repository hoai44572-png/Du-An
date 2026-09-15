'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Star,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth-context';

export interface AdminHeaderProps {
  onToggleSidebar: () => void;
  unreadNotifications?: number;
}

export function AdminHeader({ onToggleSidebar, unreadNotifications = 3 }: AdminHeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Lấy thông tin Admin thực từ Context (không hard-code)
  const { adminUser, logoutAdmin } = useAdminAuth();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    logoutAdmin();
    router.replace('/admin/login');
  };

  // Tạo avatar initials từ tên thật
  const getInitials = (name: string) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Tên role hiển thị
  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'ADMIN': return 'Admin';
      case 'STAFF': return 'Staff';
      default: return 'Admin';
    }
  };

  const sampleNotifications = [
    { id: 1, title: 'Đơn hàng mới #ORD-9821', desc: 'Nguyễn Văn An vừa đặt đơn 142.000đ', time: '5 phút trước', type: 'order' },
    { id: 2, title: 'Đánh giá 5 sao mới', desc: 'Trần Thị Mai khen ngợi Bánh Croissant', time: '20 phút trước', type: 'review' },
    { id: 3, title: 'Cảnh báo tồn kho', desc: 'Hạt Arabica Cầu Đất còn dưới 15kg', time: '1 giờ trước', type: 'alert' },
  ];

  const displayName = adminUser?.fullName || 'Admin';
  const displayEmail = adminUser?.email || '';
  const displayRole = getRoleLabel(adminUser?.role);
  const displayInitials = getInitials(displayName);

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/90 backdrop-blur-lg border-b border-border/60 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-foreground/60 hover:text-foreground hover:bg-secondary transition-colors duration-150 lg:hidden shrink-0"
          aria-label="Toggle sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng, sản phẩm, khách hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary/60 border border-border/50 text-[13px] text-foreground placeholder:text-foreground/35 focus:outline-none focus:ring-1 focus:ring-primary/25 focus:border-primary/40 focus:bg-background transition-all duration-150"
          />
        </div>
      </div>

      {/* Right Actions & Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Link to Client Store */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold text-primary bg-primary/8 hover:bg-primary/14 border border-primary/15 transition-all duration-150"
        >
          <span>Xem Website</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md text-foreground/60 hover:text-foreground hover:bg-secondary transition-colors duration-150"
          title="Chuyển chế độ giao diện"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-md text-foreground/60 hover:text-foreground hover:bg-secondary transition-colors duration-150 relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-card" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-[340px] bg-card border border-border/70 rounded-xl shadow-[var(--shadow-lg)] p-3 space-y-2 z-50"
              >
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                  <h4 className="text-[13px] font-semibold text-foreground">Thông báo hệ thống</h4>
                  <span className="text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {unreadNotifications} mới
                  </span>
                </div>

                <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                  {sampleNotifications.map((item) => {
                    const NotifIcon = item.type === 'order' ? ShoppingBag : item.type === 'review' ? Star : AlertTriangle;
                    return (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-lg bg-secondary/40 hover:bg-secondary/70 transition-colors duration-150 flex gap-3 cursor-pointer"
                      >
                        <div className="p-1.5 bg-primary/8 rounded-md text-primary shrink-0 self-start">
                          <NotifIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-foreground truncate">{item.title}</p>
                          <p className="text-[11px] text-foreground/55 leading-snug truncate">{item.desc}</p>
                          <span className="text-[10px] text-foreground/35 mt-0.5 block">{item.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-border/50 text-center">
                  <Link
                    href="/admin/orders"
                    onClick={() => setShowNotifications(false)}
                    className="text-[12px] font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Xem tất cả đơn hàng &amp; thông báo
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar Dropdown - Dùng dữ liệu thật từ Database */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/70 transition-colors duration-150"
          >
            {adminUser?.avatar ? (
              <img
                src={adminUser.avatar}
                alt={displayName}
                className="w-8 h-8 rounded-md object-cover shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shadow-[var(--shadow-sm)] shadow-primary/20">
                {displayInitials}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <span className="text-[13px] font-semibold text-foreground block leading-tight">{displayName}</span>
              <span className="text-[11px] text-foreground/45 block">{displayRole}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-foreground/40 hidden sm:block" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 bg-card border border-border/70 rounded-xl shadow-[var(--shadow-lg)] p-1.5 space-y-0.5 z-50"
              >
                <div className="px-3 py-2.5 border-b border-border/50 mb-1">
                  <p className="text-[13px] font-semibold text-foreground leading-tight">{displayName}</p>
                  <p className="text-[11px] text-foreground/45 mt-0.5 truncate">{displayEmail}</p>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded mt-1 inline-block">
                    {displayRole}
                  </span>
                </div>

                <Link
                  href="/admin/accounts"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium text-foreground hover:bg-secondary transition-colors duration-150"
                >
                  <User className="w-3.5 h-3.5 text-foreground/50" />
                  <span>Hồ sơ Admin</span>
                </Link>

                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium text-foreground hover:bg-secondary transition-colors duration-150"
                >
                  <Settings className="w-3.5 h-3.5 text-foreground/50" />
                  <span>Cài đặt hệ thống</span>
                </Link>

                <div className="border-t border-border/50 pt-1 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium text-destructive hover:bg-destructive/8 transition-colors duration-150"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
