'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Calendar,
  Coffee,
  Users,
  UserPlus,
  AlertTriangle,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  TrendingUp,
  ChevronRight,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { RevenueBarChart, OrdersLineChart } from '@/components/admin/charts/AdminCharts';
import { adminApi } from '@/lib/services/apiService';
import { useAdminAuth } from '@/lib/admin-auth-context';

interface DashboardStats {
  totalRevenue: number;
  todayOrders: number;
  monthOrders: number;
  totalProducts: number;
  totalCustomers: number;
  newCustomersThisWeek: number;
  lowStockCount: number;
  orderStatus: {
    pending: number;
    shipping: number;
    completed: number;
    cancelled: number;
  };
}

interface TopProduct {
  id: number;
  name: string;
  image?: string;
  price: number;
  sold: number;
  stock: number;
}

interface TopCustomer {
  id: number;
  fullName: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  avatar?: string;
}

interface RecentOrder {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  total: number;
  paymentMethod: string;
  orderStatus: string;
}

export default function AdminDashboardPage() {
  const { adminUser } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [statsRes, topProductsRes, topCustomersRes, recentOrdersRes] = await Promise.allSettled([
        adminApi.getDashboard(),
        adminApi.getTopProducts(),
        adminApi.getTopCustomers(),
        adminApi.getRecentOrders(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.stats);
      }
      if (topProductsRes.status === 'fulfilled' && topProductsRes.value.success) {
        setTopProducts(topProductsRes.value.topProducts || []);
      }
      if (topCustomersRes.status === 'fulfilled' && topCustomersRes.value.success) {
        setTopCustomers(topCustomersRes.value.topCustomers || []);
      }
      if (recentOrdersRes.status === 'fulfilled' && recentOrdersRes.value.success) {
        setRecentOrders(recentOrdersRes.value.recentOrders || []);
      }
    } catch (err) {
      setError('Không thể kết nối tới Backend. Hãy kiểm tra server đang chạy.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const kpiCards = stats ? [
    {
      label: 'Tổng doanh thu',
      value: formatVND(stats.totalRevenue),
      change: 'Từ đơn hoàn thành',
      up: null as null,
      icon: DollarSign,
    },
    {
      label: 'Đơn hàng hôm nay',
      value: `${stats.todayOrders} đơn`,
      change: 'Đơn trong ngày',
      up: null as null,
      icon: ShoppingBag,
    },
    {
      label: 'Đơn hàng tháng',
      value: `${stats.monthOrders} đơn`,
      change: 'Tháng hiện tại',
      up: null as null,
      icon: Calendar,
    },
    {
      label: 'Tổng sản phẩm',
      value: `${stats.totalProducts} món`,
      change: 'Đang kinh doanh',
      up: null as null,
      icon: Coffee,
    },
    {
      label: 'Tổng khách hàng',
      value: `${stats.totalCustomers}`,
      change: 'Trong hệ thống',
      up: null as null,
      icon: Users,
    },
    {
      label: 'Khách hàng mới',
      value: `+${stats.newCustomersThisWeek} tuần này`,
      change: '7 ngày gần nhất',
      up: null as null,
      icon: UserPlus,
    },
  ] : [];

  const orderStatuses = stats ? [
    { label: 'Chờ xử lý', count: stats.orderStatus.pending, icon: Clock, colorClass: 'text-amber-600' },
    { label: 'Đang giao', count: stats.orderStatus.shipping, icon: Truck, colorClass: 'text-blue-600' },
    { label: 'Hoàn thành', count: stats.orderStatus.completed, icon: CheckCircle2, colorClass: 'text-emerald-600' },
    { label: 'Đã hủy', count: stats.orderStatus.cancelled, icon: XCircle, colorClass: 'text-rose-600' },
  ] : [];

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div>
            <div className="h-6 w-32 bg-secondary/60 rounded animate-pulse" />
            <div className="h-4 w-64 bg-secondary/40 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/70 rounded-lg p-3.5 h-24 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/70 rounded-lg p-3.5 h-20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-xs text-foreground/50 mt-0.5">
            Xin chào,{' '}
            <span className="font-medium text-foreground/70">{adminUser?.fullName || 'Admin'}</span>
            {stats && stats.todayOrders > 0 && ` — Hôm nay có ${stats.todayOrders} đơn hàng mới.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-secondary text-foreground/70 text-xs font-medium hover:bg-secondary/80 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Làm mới
          </button>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors self-start sm:self-auto"
          >
            Quản lý đơn hàng
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error} — Đang hiển thị dữ liệu trống.
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-card border border-border/70 rounded-lg p-3.5 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded bg-secondary text-foreground/60">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <p className="text-[11px] text-foreground/45 truncate">{kpi.label}</p>
                <p className="text-sm font-bold text-foreground mt-0.5 truncate">{kpi.value}</p>
                <p className="text-[10px] text-foreground/40 mt-0.5">{kpi.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {orderStatuses.map((st, idx) => {
          const Icon = st.icon;
          return (
            <Link
              key={idx}
              href="/admin/orders"
              className="bg-card border border-border/70 rounded-lg p-3.5 flex items-center justify-between hover:border-border transition-colors shadow-xs"
            >
              <div>
                <p className="text-[11px] text-foreground/50 font-medium">{st.label}</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{st.count}</p>
              </div>
              <Icon className={`w-5 h-5 ${st.colorClass} opacity-70`} />
            </Link>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border/70 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
            <h3 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              Doanh thu theo ngày
            </h3>
            <span className="text-[11px] text-foreground/40">30 ngày gần nhất</span>
          </div>
          <RevenueBarChart />
        </div>

        <div className="bg-card border border-border/70 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
            <h3 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-foreground/40" />
              Đơn hàng theo tháng
            </h3>
            <span className="text-[11px] text-foreground/40">Năm 2026</span>
          </div>
          <OrdersLineChart />
        </div>
      </div>

      {/* 3-column Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Top Selling Products — từ DB */}
        <div className="bg-card border border-border/70 rounded-lg overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-secondary/20">
            <h3 className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-foreground/40" />
              Sản phẩm bán chạy
            </h3>
            <Link href="/admin/products" className="text-[11px] text-primary hover:underline font-medium">
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-border/40">
            {topProducts.length > 0 ? topProducts.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/30 transition-colors">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center shrink-0">
                    <Coffee className="w-4 h-4 text-foreground/30" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-[11px] text-foreground/45">{formatVND(item.price)}</p>
                </div>
                <span className="text-[11px] font-semibold text-primary shrink-0">{item.sold} món</span>
              </div>
            )) : (
              <div className="px-4 py-6 text-center text-[12px] text-foreground/40">Chưa có dữ liệu sản phẩm</div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats && stats.lowStockCount > 0 ? (
          <div className="bg-card border border-border/70 rounded-lg overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-secondary/20">
              <h3 className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Sắp hết hàng ({stats.lowStockCount})
              </h3>
              <Link href="/admin/inventory" className="text-[11px] text-primary hover:underline font-medium">
                Nhập kho
              </Link>
            </div>
            <div className="px-4 py-6 text-center text-[12px] text-amber-600 font-medium">
              {stats.lowStockCount} sản phẩm có tồn kho ≤ 10
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border/70 rounded-lg overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-secondary/20">
              <h3 className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-emerald-500" />
                Tồn kho
              </h3>
            </div>
            <div className="px-4 py-6 text-center text-[12px] text-emerald-600 font-medium">
              ✓ Tất cả sản phẩm có đủ hàng
            </div>
          </div>
        )}

        {/* VIP Customers — từ DB */}
        <div className="bg-card border border-border/70 rounded-lg overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-secondary/20">
            <h3 className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-foreground/40" />
              Khách hàng VIP
            </h3>
            <Link href="/admin/customers" className="text-[11px] text-primary hover:underline font-medium">
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-border/40">
            {topCustomers.length > 0 ? topCustomers.map((cust) => (
              <div key={cust.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/30 transition-colors">
                <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center shrink-0 text-[11px] font-bold text-foreground/60">
                  {cust.fullName?.split(' ').map((w) => w[0]).slice(-2).join('') || 'KH'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-foreground truncate">{cust.fullName}</p>
                  <p className="text-[11px] text-foreground/45">{cust.totalOrders} đơn hàng</p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 shrink-0">{formatVND(cust.totalSpent)}</span>
              </div>
            )) : (
              <div className="px-4 py-6 text-center text-[12px] text-foreground/40">Chưa có dữ liệu khách hàng</div>
            )}
          </div>
        </div>

      </div>

      {/* Recent Orders Table — từ DB */}
      <div className="bg-card border border-border/70 rounded-lg overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-secondary/20">
          <div>
            <h3 className="text-[13px] font-semibold text-foreground">Đơn hàng mới nhận</h3>
            <p className="text-[11px] text-foreground/45 mt-0.5">Các đơn vừa được khách hàng đặt qua hệ thống</p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
          >
            Tất cả đơn hàng
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 text-[11px] font-semibold text-foreground/40 uppercase tracking-wide bg-secondary/10">
                <th className="py-2.5 px-4">Mã đơn</th>
                <th className="py-2.5 px-4">Khách hàng</th>
                <th className="py-2.5 px-4">Thời gian</th>
                <th className="py-2.5 px-4">Tổng tiền</th>
                <th className="py-2.5 px-4">Thanh toán</th>
                <th className="py-2.5 px-4">Trạng thái</th>
                <th className="py-2.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-[12px]">
              {recentOrders.length > 0 ? recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-semibold text-primary">{ord.orderCode}</td>
                  <td className="py-2.5 px-4">
                    <p className="font-semibold text-foreground">{ord.customerName}</p>
                    <p className="text-[11px] text-foreground/45">{ord.customerPhone}</p>
                  </td>
                  <td className="py-2.5 px-4 text-foreground/55">
                    {new Date(ord.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-foreground">{formatVND(ord.total)}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-foreground/60 border border-border/50">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        ord.orderStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : ord.orderStatus === 'preparing'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : ord.orderStatus === 'shipping'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : ord.orderStatus === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {ord.orderStatus === 'pending' && 'Chờ xác nhận'}
                      {ord.orderStatus === 'preparing' && 'Đang chuẩn bị'}
                      {ord.orderStatus === 'shipping' && 'Đang giao'}
                      {ord.orderStatus === 'completed' && 'Hoàn thành'}
                      {ord.orderStatus === 'cancelled' && 'Đã hủy'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <Link
                      href="/admin/orders"
                      className="p-1.5 rounded hover:bg-secondary text-foreground/40 hover:text-primary transition-colors inline-block"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[12px] text-foreground/40">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
