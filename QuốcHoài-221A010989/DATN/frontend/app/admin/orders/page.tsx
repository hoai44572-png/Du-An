'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Printer,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  X,
  User,
  MapPin,
  Phone,
  CreditCard,
  Check,
  RefreshCw,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { adminApi } from '@/lib/services/apiService';
import { AdminOrder } from '@/lib/admin-data';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const formatVND = (num: number) => {
    if (num < 1000) {
      return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + '₫';
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // Fetch đơn hàng từ API
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (activeTab !== 'ALL') params.status = activeTab;
      if (paymentFilter !== 'ALL') params.paymentStatus = paymentFilter;
      if (searchQuery) params.search = searchQuery;

      const data = await adminApi.getOrders(params);
      if (data.success) {
        const mapped = (data.orders || []).map((o: any) => ({
          id: o.orderCode || String(o.id),
          customerName: o.customerName,
          customerPhone: o.customerPhone,
          customerEmail: o.customerEmail,
          shippingAddress: o.shippingAddress,
          totalAmount: o.total,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          status: o.orderStatus,
          createdAt: new Date(o.createdAt).toLocaleDateString('vi-VN'),
          items: (o.items || []).map((i: any) => ({
            productName: i.productName || 'Sản phẩm',
            size: i.size || 'M',
            quantity: i.quantity,
            price: i.price,
          })),
          timeline: [],
        }));
        setOrders(mapped);
      }
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, paymentFilter, searchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const tabs = [
    { key: 'ALL', label: 'Tất cả đơn hàng' },
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'preparing', label: 'Đang chuẩn bị' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'completed', label: 'Đã giao' },
    { key: 'cancelled', label: 'Đã hủy' },
  ];

  const filteredOrders = orders;

  const handleStatusChange = async (id: string, newStatus: AdminOrder['status']) => {
    try {
      await adminApi.updateOrderStatus(id, { status: newStatus });
      setOrders((prev) =>
        prev.map((ord) => ord.id === id ? { ...ord, status: newStatus } : ord)
      );
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
      showToast(`Đã cập nhật trạng thái đơn hàng.`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi cập nhật trạng thái.';
      showToast(msg, 'error');
    }
  };


  const handlePaymentStatusChange = async (id: string, newPaymentStatus: AdminOrder['paymentStatus']) => {
    try {
      await adminApi.updateOrderStatus(id, { paymentStatus: newPaymentStatus });
      setOrders((prev) =>
        prev.map((ord) => ord.id === id ? { ...ord, paymentStatus: newPaymentStatus } : ord)
      );
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, paymentStatus: newPaymentStatus } : null);
      }
      showToast('Đã cập nhật trạng thái thanh toán.', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi cập nhật thanh toán.';
      showToast(msg, 'error');
    }
  };


  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Đơn hàng', href: '/admin/orders' }, { label: 'Quản lý đơn hàng' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Quản Lý Đơn Hàng & Thanh Toán</h1>
          <p className="text-xs text-foreground/60">Theo dõi chi tiết mã đơn, khách hàng, tổng tiền, phương thức và trạng thái thanh toán</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-1.5 bg-card border border-border/80 p-1.5 rounded-2xl overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => {
          const count = tab.key === 'ALL' ? orders.length : orders.filter((o) => o.status === tab.key).length;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/60 hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-foreground/70'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar & Payment Filter */}
      <div className="bg-card border border-border/80 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Tìm theo Mã đơn, Tên khách hoặc SĐT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-secondary/50 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Payment Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-muted-foreground shrink-0">Thanh toán:</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-background border border-border/80 text-foreground focus:outline-none cursor-pointer"
          >
            <option value="ALL">Tất cả thanh toán</option>
            <option value="Paid">Đã thanh toán (Paid)</option>
            <option value="Pending">Chưa thanh toán (Pending)</option>
            <option value="Refunded">Đã hoàn tiền (Refunded)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-[11px] font-bold text-foreground/50 uppercase tracking-wider bg-secondary/30">
                <th className="py-3.5 px-4">Mã Đơn</th>
                <th className="py-3.5 px-4">Khách Hàng</th>
                <th className="py-3.5 px-4">Ngày Đặt</th>
                <th className="py-3.5 px-4">Tổng Tiền</th>
                <th className="py-3.5 px-4">Phương Thức</th>
                <th className="py-3.5 px-4">Trạng Thái Thanh Toán</th>
                <th className="py-3.5 px-4">Trạng Thái Đơn</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                    Không tìm thấy đơn hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-primary block">{ord.id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-foreground">{ord.customerName}</p>
                      <p className="text-[11px] text-foreground/50">{ord.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-foreground/70">{ord.createdAt}</td>
                    <td className="py-3.5 px-4 font-bold text-foreground">{formatVND(ord.totalAmount)}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-secondary/80 text-foreground border border-border/60">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.paymentStatus}
                        onChange={(e) => handlePaymentStatusChange(ord.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold focus:outline-none cursor-pointer border ${
                          ord.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : ord.paymentStatus === 'Pending'
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                        }`}
                      >
                        <option value="Paid">Đã thanh toán</option>
                        <option value="Pending">Chưa thanh toán</option>
                        <option value="Refunded">Đã hoàn tiền</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold focus:outline-none cursor-pointer border ${
                          ord.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                            : ord.status === 'preparing'
                            ? 'bg-sky-500/10 text-sky-700 border-sky-500/30'
                            : ord.status === 'shipping'
                            ? 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30'
                            : ord.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-700 border-rose-500/30'
                        }`}
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="preparing">Đang chuẩn bị</option>
                        <option value="shipping">Đang giao</option>
                        <option value="completed">Đã giao</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary transition-colors text-xs font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Modal Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md h-full bg-card border-l border-border/80 p-6 shadow-2xl z-10 space-y-6 overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-foreground">Đơn Hàng #{selectedOrder.id}</h3>
                  <span className="text-xs text-foreground/50">{selectedOrder.createdAt}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-xl text-foreground/40 hover:text-foreground hover:bg-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Details */}
              <div className="space-y-2 bg-secondary/30 p-4 rounded-2xl border border-border/60 text-xs">
                <h4 className="font-bold text-foreground flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary" /> Thông tin khách hàng
                </h4>
                <p className="font-bold text-foreground">{selectedOrder.customerName}</p>
                <p className="text-foreground/70 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-foreground/40" />
                  <span>{selectedOrder.customerPhone}</span>
                </p>
                <p className="text-foreground/70 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-foreground/40 shrink-0 mt-0.5" />
                  <span>{selectedOrder.shippingAddress}</span>
                </p>
              </div>

              {/* Payment Details */}
              <div className="space-y-2 bg-secondary/30 p-4 rounded-2xl border border-border/60 text-xs">
                <h4 className="font-bold text-foreground flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-primary" /> Chi tiết thanh toán
                </h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phương thức:</span>
                  <span className="font-bold text-foreground">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-muted-foreground">Trạng thái TT:</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                    selectedOrder.paymentStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
                  }`}>
                    {selectedOrder.paymentStatus === 'Paid' ? '✔ Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground">Danh sách sản phẩm ({selectedOrder.items.length})</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-secondary/50 rounded-2xl text-xs">
                      <div>
                        <p className="font-bold text-foreground">{it.productName}</p>
                        <p className="text-[11px] text-foreground/50">x{it.quantity}</p>
                      </div>
                      <span className="font-bold text-primary">{formatVND(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="pt-3 border-t border-border flex justify-between items-baseline">
                <span className="font-bold text-foreground text-sm">Tổng cộng thanh toán:</span>
                <span className="text-xl font-bold text-primary">{formatVND(selectedOrder.totalAmount)}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
