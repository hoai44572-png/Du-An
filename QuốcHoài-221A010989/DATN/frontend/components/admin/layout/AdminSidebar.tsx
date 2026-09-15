'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Coffee,
  Grid,
  ShoppingBag,
  Users,
  ShieldCheck,
  ImageIcon,
  Newspaper,
  Star,
  Ticket,
  Boxes,
  TrendingUp,
  BarChart3,
  Palette,
  Settings,
  History,
  LogOut,
  X,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pendingOrderCount?: number;
  pendingReviewCount?: number;
  pendingChatCount?: number;
}

export const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/chat', label: 'Hỗ trợ khách hàng', icon: MessageSquare, badgeKey: 'chat' },
  { href: '/admin/products', label: 'Quản lý sản phẩm', icon: Coffee },
  { href: '/admin/categories', label: 'Quản lý danh mục', icon: Grid },
  { href: '/admin/orders', label: 'Quản lý đơn hàng', icon: ShoppingBag, badgeKey: 'orders' },
  { href: '/admin/customers', label: 'Quản lý khách hàng', icon: Users },
  { href: '/admin/accounts', label: 'Quản lý tài khoản', icon: ShieldCheck },
  { href: '/admin/banners', label: 'Quản lý banner', icon: ImageIcon },
  { href: '/admin/news', label: 'Quản lý tin tức', icon: Newspaper },
  { href: '/admin/reviews', label: 'Quản lý đánh giá', icon: Star, badgeKey: 'reviews' },
  { href: '/admin/coupons', label: 'Quản lý mã giảm giá', icon: Ticket },
  { href: '/admin/inventory', label: 'Quản lý kho', icon: Boxes },
  { href: '/admin/financials', label: 'Quản lý doanh thu', icon: TrendingUp },
  { href: '/admin/reports', label: 'Báo cáo thống kê', icon: BarChart3 },
  { href: '/admin/website-settings', label: 'Quản lý giao diện', icon: Palette },
  { href: '/admin/settings', label: 'Cài đặt hệ thống', icon: Settings },
  { href: '/admin/logs', label: 'Nhật ký hoạt động', icon: History },
];

export function AdminSidebar({ isOpen, onClose, pendingOrderCount = 2, pendingReviewCount = 1, pendingChatCount = 1 }: AdminSidebarProps) {
  const pathname = usePathname();

  const getBadge = (key?: string) => {
    if (key === 'orders' && pendingOrderCount > 0) return pendingOrderCount;
    if (key === 'reviews' && pendingReviewCount > 0) return pendingReviewCount;
    if (key === 'chat' && pendingChatCount > 0) return pendingChatCount;
    return null;
  };

  return (
    <>
      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-card border-r border-border/80 flex flex-col transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Brand Header */}
        <div className="h-[68px] px-5 flex items-center justify-between border-b border-border/50 shrink-0">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-[var(--shadow-sm)] shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
              <Coffee className="w-[18px] h-[18px]" />
            </div>
            <div>
              <span className="text-[15px] font-serif font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-200 block leading-tight">
                Swift Coffee
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase px-1.5 py-0.5 rounded bg-primary/8 text-primary/80">
                Admin
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-foreground/50 hover:text-foreground hover:bg-secondary transition-colors duration-150 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 custom-scrollbar">
          <div className="px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-foreground/35">
            Hệ Thống Quản Trị
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            const badge = getBadge(item.badgeKey);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`group flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150 relative ${
                  isActive
                    ? 'border-l-2 border-primary bg-primary/8 text-primary font-semibold pl-[10px]'
                    : 'text-foreground/65 hover:text-foreground hover:bg-secondary/80 border-l-2 border-transparent pl-[10px]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                      isActive ? 'text-primary' : 'text-foreground/40 group-hover:text-foreground/70'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {badge && (
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-primary/15 text-primary'
                          : 'bg-destructive/12 text-destructive'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Admin User Badge & Logout */}
        <div className="p-4 border-t border-border/50 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                AD
              </div>
              <div className="truncate">
                <p className="text-[13px] font-semibold text-foreground truncate leading-tight">Nguyễn Hoài</p>
                <p className="text-[11px] text-foreground/45 truncate">Super Admin</p>
              </div>
            </div>

            <Link
              href="/login"
              className="p-1.5 rounded-md text-foreground/45 hover:text-destructive hover:bg-destructive/8 transition-colors duration-150 shrink-0"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
