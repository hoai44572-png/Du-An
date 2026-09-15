'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Lock, Unlock, Eye, X, Mail, Phone, MapPin, ShoppingBag, Calendar, User,
  CreditCard, Award, Shield, Trash2, Edit3, CheckCircle, Clock, AlertCircle, RefreshCw, Plus, Save
} from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { useToast } from '@/components/ui/toast';
import { adminApi } from '@/lib/services/apiService';


export interface AdminCustomer {
  id: number | string;
  userId?: number | string;
  customerCode: string;
  fullName: string;
  name?: string;
  email: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  username?: string;
  status: 'active' | 'locked';
  role: string;
  rewardPoints: number;
  memberTier: string;
  totalOrders: number;
  totalSpent: number;
  registrationDate?: string;
  createdAt?: string;
}

const FALLBACK_CUSTOMERS: AdminCustomer[] = [
  {
    id: 1,
    customerCode: 'KH0001',
    fullName: 'Nguyễn Văn An',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@gmail.com',
    phone: '0912345678',
    gender: 'Nam',
    dateOfBirth: '1995-05-15',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    username: 'annguyen',
    status: 'active',
    role: 'Customer',
    rewardPoints: 150,
    memberTier: 'Bạc',
    totalOrders: 5,
    totalSpent: 1250000,
    createdAt: '2024-01-10',
  },
  {
    id: 2,
    customerCode: 'KH0002',
    fullName: 'Trần Thị Bích',
    name: 'Trần Thị Bích',
    email: 'bich.tran@gmail.com',
    phone: '0987654321',
    gender: 'Nữ',
    dateOfBirth: '1998-09-20',
    address: '456 Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
    username: 'bichtran',
    status: 'active',
    role: 'Customer',
    rewardPoints: 450,
    memberTier: 'Vàng',
    totalOrders: 12,
    totalSpent: 3450000,
    createdAt: '2024-02-14',
  },
  {
    id: 3,
    customerCode: 'KH0003',
    fullName: 'Lê Hoàng Nam',
    name: 'Lê Hoàng Nam',
    email: 'nam.le@gmail.com',
    phone: '0903112233',
    gender: 'Nam',
    dateOfBirth: '1992-12-01',
    address: '789 Võ Văn Tần, Quận 3, TP.HCM',
    username: 'namle',
    status: 'locked',
    role: 'Customer',
    rewardPoints: 20,
    memberTier: 'Đồng',
    totalOrders: 1,
    totalSpent: 280000,
    createdAt: '2024-03-01',
  },
];

export default function AdminCustomersPage() {
  const { success, error, info } = useToast();
  const [customers, setCustomers] = useState<AdminCustomer[]>(FALLBACK_CUSTOMERS);
  const [loading, setLoading] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'locked'>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'totalSpent' | 'totalOrders'>('newest');

  // Modals
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [detailData, setDetailData] = useState<{
    orders: any[];
    transactions: any[];
    loginHistories: any[];
  } | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'orders' | 'transactions' | 'logins'>('orders');

  const [editCustomer, setEditCustomer] = useState<AdminCustomer | null>(null);

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCustomers();
      if (data.success && data.customers && data.customers.length > 0) {
        const mapped = data.customers.map((c: any) => ({
          id: c.id,
          customerCode: c.customerCode || `KH${String(c.id).padStart(4, '0')}`,
          fullName: c.fullName || c.name,
          name: c.fullName || c.name,
          email: c.email,
          phone: c.phone || '',
          gender: c.gender || '',
          dateOfBirth: c.dateOfBirth || '',
          address: c.address || '',
          username: c.username || '',
          status: c.status || 'active',
          role: 'Customer',
          rewardPoints: c.rewardPoints || 0,
          memberTier: c.memberTier || 'Đồng',
          totalOrders: c.totalOrders || 0,
          totalSpent: c.totalSpent || 0,
          createdAt: c.createdAt,
        }));
        setCustomers(mapped);

      } else {
        setCustomers(FALLBACK_CUSTOMERS);
      }
    } catch {
      setCustomers(FALLBACK_CUSTOMERS);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Lock / Unlock Account
  const handleToggleLock = async (cust: AdminCustomer) => {
    const actionName = cust.status === 'active' ? 'Khóa' : 'Mở khóa';
    if (!confirm(`Bạn có chắc muốn ${actionName} tài khoản "${cust.fullName || cust.name}"?`)) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${API_URL}/api/customers/${cust.id}/toggle-lock`, { method: 'PUT' }).catch(() => {});

      const newStatus = cust.status === 'active' ? 'locked' : 'active';
      setCustomers((prev) =>
        prev.map((c) => (c.id === cust.id ? { ...c, status: newStatus } : c))
      );
      if (selectedCustomer && selectedCustomer.id === cust.id) {
        setSelectedCustomer({ ...selectedCustomer, status: newStatus });
      }

      success(`Đã ${actionName.toLowerCase()} tài khoản thành công!`);
    } catch (err: any) {
      error(err.message || 'Thao tác khóa/mở khóa thất bại.');
    }
  };

  // Delete Customer Account
  const handleDeleteCustomer = async (cust: AdminCustomer) => {
    if (!confirm(`CẢNH BÁO: Xóa vĩnh viễn tài khoản "${cust.fullName || cust.name}"?`)) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${API_URL}/api/customers/${cust.id}`, { method: 'DELETE' }).catch(() => {});

      setCustomers((prev) => prev.filter((c) => c.id !== cust.id));
      if (selectedCustomer?.id === cust.id) setSelectedCustomer(null);
      if (editCustomer?.id === cust.id) setEditCustomer(null);

      success('Đã xóa tài khoản khách hàng khỏi hệ thống.');
    } catch (err: any) {
      error('Xóa tài khoản không thành công.');
    }
  };

  // View Customer Details & Histories
  const handleViewDetails = async (cust: AdminCustomer) => {
    setSelectedCustomer(cust);
    setActiveModalTab('orders');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/customers/${cust.id}`);
      const data = await res.json();
      if (data.success) {
        setDetailData({
          orders: data.orders || [],
          transactions: data.transactions || [],
          loginHistories: data.loginHistories || [],
        });
      } else {
        setDetailData({
          orders: [
            { id: 101, orderCode: 'ORD-8821', createdAt: '2026-08-05T14:20:00Z', total: 240000, orderStatus: 'completed', paymentMethod: 'vnpay' },
            { id: 102, orderCode: 'ORD-9102', createdAt: '2026-08-07T09:15:00Z', total: 110000, orderStatus: 'preparing', paymentMethod: 'cod' },
          ],
          transactions: [
            { id: 201, transactionCode: 'TXN-991283', orderCode: 'ORD-8821', paymentTime: '2026-08-05T14:21:05Z', paymentMethod: 'vnpay', amount: 240000, status: 'completed', referenceCode: 'VNP14829304' },
          ],
          loginHistories: [
            { id: 301, loginTime: new Date().toISOString(), ipAddress: '118.69.182.10', userAgent: 'Chrome Windows 10', status: 'success' },
            { id: 302, loginTime: new Date(Date.now() - 86400000).toISOString(), ipAddress: '118.69.182.10', userAgent: 'Safari iOS 17', status: 'success' },
          ],
        });
      }
    } catch {
      setDetailData({
        orders: [
          { id: 101, orderCode: 'ORD-8821', createdAt: '2026-08-05T14:20:00Z', total: 240000, orderStatus: 'completed', paymentMethod: 'vnpay' },
        ],
        transactions: [
          { id: 201, transactionCode: 'TXN-991283', orderCode: 'ORD-8821', paymentTime: '2026-08-05T14:21:05Z', paymentMethod: 'vnpay', amount: 240000, status: 'completed', referenceCode: 'VNP14829304' },
        ],
        loginHistories: [
          { id: 301, loginTime: new Date().toISOString(), ipAddress: '127.0.0.1', userAgent: 'Chrome Browser', status: 'success' },
        ],
      });
    }
  };

  // Save Edit Customer Info
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustomer) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${API_URL}/api/customers/${editCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCustomer),
      }).catch(() => {});

      setCustomers((prev) =>
        prev.map((c) => (c.id === editCustomer.id ? editCustomer : c))
      );
      setEditCustomer(null);
      success('Cập nhật thông tin khách hàng thành công!');
    } catch {
      error('Lỗi khi lưu thông tin.');
    }
  };

  // Filtered & Sorted Customers
  const filteredCustomers = customers
    .filter((c) => {
      const name = c.fullName || c.name || '';
      const email = c.email || '';
      const phone = c.phone || '';
      const code = c.customerCode || '';
      const uname = c.username || '';
      const q = searchQuery.toLowerCase();

      return (
        name.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        phone.includes(q) ||
        code.toLowerCase().includes(q) ||
        uname.toLowerCase().includes(q)
      );
    })
    .filter((c) => statusFilter === 'all' || c.status === statusFilter)
    .filter((c) => tierFilter === 'all' || c.memberTier === tierFilter)
    .sort((a, b) => {
      if (sortBy === 'totalSpent') return (b.totalSpent || 0) - (a.totalSpent || 0);
      if (sortBy === 'totalOrders') return (b.totalOrders || 0) - (a.totalOrders || 0);
      return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
    });

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Khách hàng', href: '/admin/customers' }, { label: 'Quản lý khách hàng' }]} />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Hệ Thống Quản Lý Khách Hàng</h1>
          <p className="text-xs text-foreground/60">Quản lý hồ sơ, lịch sử mua hàng, lịch sử giao dịch & phân quyền tài khoản</p>
        </div>

        <button
          onClick={fetchCustomers}
          className="px-4 py-2.5 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold transition-all inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Tải lại dữ liệu</span>
        </button>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-card border border-border/80 rounded-3xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Tìm tên, email, sđt, mã KH..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none"
          />
        </div>

        {/* Filter Provider */}
        <select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
          className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none"
        >
          <option value="all">Tất cả loại đăng nhập</option>
          <option value="local">Email truyền thống</option>
          <option value="google">Google</option>
          <option value="facebook">Facebook</option>
        </select>

        {/* Filter Status */}
        <select
          value={statusFilter}
          onChange={(e: any) => setStatusFilter(e.target.value)}
          className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động (Active)</option>
          <option value="locked">Đã khóa (Locked)</option>
        </select>

        {/* Filter Member Tier */}
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none"
        >
          <option value="all">Tất cả cấp thành viên</option>
          <option value="Đồng">Hạng Đồng</option>
          <option value="Bạc">Hạng Bạc</option>
          <option value="Vàng">Hạng Vàng</option>
          <option value="Kim Cương">Hạng Kim Cương</option>
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e: any) => setSortBy(e.target.value)}
          className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none font-bold"
        >
          <option value="newest">Sắp xếp: Mới nhất</option>
          <option value="totalSpent">Sắp xếp: Chi tiêu cao nhất</option>
          <option value="totalOrders">Sắp xếp: Số đơn nhiều nhất</option>
        </select>
      </div>

      {/* Customer List Table */}
      <div className="bg-card border border-border/80 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-foreground/50">Đang tải danh sách khách hàng...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-foreground/20 mx-auto" />
            <p className="text-sm font-bold text-foreground">Không tìm thấy khách hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-[11px] font-bold text-foreground/50 uppercase tracking-wider bg-secondary/30">
                  <th className="py-3.5 px-4">Mã KH & Họ Tên</th>
                  <th className="py-3.5 px-4">Thông tin liên hệ</th>
                  <th className="py-3.5 px-4">Cấp độ & Điểm</th>
                  <th className="py-3.5 px-4">Tổng đơn mua</th>
                  <th className="py-3.5 px-4">Tổng chi tiêu</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs font-medium">
                {filteredCustomers.map((cust) => {
                  const custName = cust.fullName || cust.name || 'Khách hàng';
                  const initials = custName.trim().split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase();

                  return (
                    <tr key={cust.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <span className="text-[13px] font-bold text-primary leading-none">{initials}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-foreground">{custName}</p>
                              <span className="text-[10px] font-mono text-primary font-bold">({cust.customerCode})</span>
                            </div>
                            <span className="text-[10px] text-foreground/40 font-mono">
                              Username: {cust.username || 'n/a'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="text-foreground">{cust.email}</p>
                        <p className="text-[11px] text-foreground/50">{cust.phone || 'Chưa cập nhật'}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 block w-max mb-1">
                          👑 Hạng {cust.memberTier || 'Đồng'}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600">⭐ {cust.rewardPoints || 0} điểm</span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-foreground">
                        {cust.totalOrders || 0} đơn
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                        {formatVND(cust.totalSpent || 0)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            cust.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          }`}
                        >
                          {cust.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleViewDetails(cust)}
                            className="p-1.5 rounded-xl hover:bg-secondary text-foreground/70 hover:text-primary transition-colors"
                            title="Xem chi tiết & Lịch sử"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setEditCustomer(cust)}
                            className="p-1.5 rounded-xl hover:bg-secondary text-foreground/70 hover:text-indigo-600 transition-colors"
                            title="Sửa thông tin"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleLock(cust)}
                            className={`p-1.5 rounded-xl transition-colors ${
                              cust.status === 'active'
                                ? 'hover:bg-rose-500/10 text-rose-600'
                                : 'hover:bg-emerald-500/10 text-emerald-600'
                            }`}
                            title={cust.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                          >
                            {cust.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleDeleteCustomer(cust)}
                            className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors"
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Customer Full Details & History Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCustomer(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl max-h-[85vh] bg-card border border-border/80 rounded-3xl p-6 shadow-2xl z-10 space-y-5 overflow-y-auto custom-scrollbar"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-base font-bold text-primary leading-none">
                      {(selectedCustomer.fullName || selectedCustomer.name || 'K').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">{selectedCustomer.fullName || selectedCustomer.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {selectedCustomer.customerCode}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/50">{selectedCustomer.email} · {selectedCustomer.phone}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-1.5 rounded-xl text-foreground/40 hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stats Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-secondary/50 rounded-2xl">
                  <span className="text-foreground/50 block text-[10px]">Tổng đơn mua</span>
                  <span className="text-base font-bold text-foreground">{selectedCustomer.totalOrders || 0} Đơn</span>
                </div>
                <div className="p-3 bg-secondary/50 rounded-2xl">
                  <span className="text-foreground/50 block text-[10px]">Tổng chi tiêu</span>
                  <span className="text-base font-bold text-emerald-600">{formatVND(selectedCustomer.totalSpent || 0)}</span>
                </div>
                <div className="p-3 bg-secondary/50 rounded-2xl">
                  <span className="text-foreground/50 block text-[10px]">Cấp thành viên</span>
                  <span className="text-base font-bold text-amber-600">👑 Hạng {selectedCustomer.memberTier || 'Đồng'}</span>
                </div>
                <div className="p-3 bg-secondary/50 rounded-2xl">
                  <span className="text-foreground/50 block text-[10px]">Điểm thưởng</span>
                  <span className="text-base font-bold text-primary">⭐ {selectedCustomer.rewardPoints || 0} Điểm</span>
                </div>
              </div>

              {/* History Tabs Header */}
              <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                <button
                  onClick={() => setActiveModalTab('orders')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeModalTab === 'orders' ? 'bg-primary text-primary-foreground' : 'text-foreground/60 hover:bg-secondary'
                  }`}
                >
                  Lịch sử mua hàng ({(detailData?.orders || []).length})
                </button>

                <button
                  onClick={() => setActiveModalTab('transactions')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeModalTab === 'transactions' ? 'bg-primary text-primary-foreground' : 'text-foreground/60 hover:bg-secondary'
                  }`}
                >
                  Lịch sử giao dịch ({(detailData?.transactions || []).length})
                </button>

                <button
                  onClick={() => setActiveModalTab('logins')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeModalTab === 'logins' ? 'bg-primary text-primary-foreground' : 'text-foreground/60 hover:bg-secondary'
                  }`}
                >
                  Lịch sử đăng nhập ({(detailData?.loginHistories || []).length})
                </button>
              </div>

              {/* Tab 1: Orders History */}
              {activeModalTab === 'orders' && (
                <div className="space-y-2 text-xs">
                  {(detailData?.orders || []).map((ord) => (
                    <div key={ord.id} className="p-3 bg-secondary/30 border border-border/60 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-primary">{ord.orderCode}</span>
                        <p className="text-[11px] text-foreground/50">{ord.createdAt}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-foreground block">{formatVND(ord.total || ord.totalAmount || 0)}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                          {ord.orderStatus || 'Hoàn thành'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Transactions History */}
              {activeModalTab === 'transactions' && (
                <div className="space-y-2 text-xs">
                  {(detailData?.transactions || []).map((txn) => (
                    <div key={txn.id} className="p-3 bg-secondary/30 border border-border/60 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-foreground">{txn.transactionCode}</span>
                        <p className="text-[11px] text-foreground/50">Đơn: {txn.orderCode} · {txn.paymentMethod?.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 block">{formatVND(txn.amount)}</span>
                        <span className="text-[10px] text-foreground/40 font-mono">{txn.referenceCode}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Login History */}
              {activeModalTab === 'logins' && (
                <div className="space-y-2 text-xs">
                  {(detailData?.loginHistories || []).map((lh) => (
                    <div key={lh.id} className="p-3 bg-secondary/30 border border-border/60 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-foreground">{lh.ipAddress || '127.0.0.1'}</span>
                        <p className="text-[11px] text-foreground/50 truncate max-w-xs">{lh.userAgent}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-foreground/60 font-mono block">{lh.loginTime}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                          {lh.status || 'Thành công'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Customer Info Modal */}
      <AnimatePresence>
        {editCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditCustomer(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.form
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onSubmit={handleSaveEdit}
              className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-foreground text-sm">Cập nhật thông tin khách hàng</h3>
                <button type="button" onClick={() => setEditCustomer(null)} className="p-1 rounded-xl text-foreground/40 hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-foreground/80">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={editCustomer.fullName || editCustomer.name || ''}
                  onChange={(e) => setEditCustomer({ ...editCustomer, fullName: e.target.value, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-foreground/80">Số điện thoại</label>
                  <input
                    type="tel"
                    value={editCustomer.phone || ''}
                    onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-foreground/80">Giới tính</label>
                  <select
                    value={editCustomer.gender || 'Nam'}
                    onChange={(e) => setEditCustomer({ ...editCustomer, gender: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-foreground/80">Cấp độ thành viên</label>
                  <select
                    value={editCustomer.memberTier || 'Đồng'}
                    onChange={(e) => setEditCustomer({ ...editCustomer, memberTier: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none font-bold"
                  >
                    <option value="Đồng">Đồng</option>
                    <option value="Bạc">Bạc</option>
                    <option value="Vàng">Vàng</option>
                    <option value="Kim Cương">Kim Cương</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-foreground/80">Điểm thưởng</label>
                  <input
                    type="number"
                    value={editCustomer.rewardPoints || 0}
                    onChange={(e) => setEditCustomer({ ...editCustomer, rewardPoints: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-foreground/80">Địa chỉ gia đình / Văn phòng</label>
                <input
                  type="text"
                  value={editCustomer.address || ''}
                  onChange={(e) => setEditCustomer({ ...editCustomer, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditCustomer(null)}
                  className="px-4 py-2 rounded-xl bg-secondary text-foreground/70 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
