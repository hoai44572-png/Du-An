'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Search, Calendar, Filter, CheckCircle2, Clock, XCircle, ArrowUpRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface TransactionItem {
  id: number;
  transactionCode: string;
  orderCode: string;
  paymentTime: string;
  paymentMethod: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  content: string;
  referenceCode: string;
}

const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 1,
    transactionCode: 'TXN-991283',
    orderCode: 'ORD-8821',
    paymentTime: '2026-08-05T14:21:05Z',
    paymentMethod: 'vnpay',
    amount: 240000,
    status: 'completed',
    content: 'Thanh toán trực tuyến qua Thẻ/Ví điện tử VNPay cho đơn ORD-8821',
    referenceCode: 'VNP14829304',
  },
  {
    id: 2,
    transactionCode: 'TXN-881022',
    orderCode: 'ORD-7612',
    paymentTime: '2026-07-25T09:30:00Z',
    paymentMethod: 'cod',
    amount: 195000,
    status: 'completed',
    content: 'Thanh toán tiền mặt khi nhận hàng (COD) đơn ORD-7612',
    referenceCode: 'COD-7612',
  },
  {
    id: 3,
    transactionCode: 'TXN-773821',
    orderCode: 'ORD-5541',
    paymentTime: '2026-07-10T16:45:00Z',
    paymentMethod: 'momo',
    amount: 320000,
    status: 'completed',
    content: 'Thanh toán MoMo QR nhanh cho đơn hàng ORD-5541',
    referenceCode: 'MM-992104',
  },
  {
    id: 4,
    transactionCode: 'TXN-664910',
    orderCode: 'ORD-4190',
    paymentTime: '2026-06-18T11:10:00Z',
    paymentMethod: 'banking',
    amount: 510000,
    status: 'completed',
    content: 'Chuyển khoản ngân hàng Vietcombank đơn ORD-4190',
    referenceCode: 'VCB-883921',
  },
  {
    id: 5,
    transactionCode: 'TXN-552019',
    orderCode: 'ORD-3012',
    paymentTime: '2026-05-02T19:00:00Z',
    paymentMethod: 'zalopay',
    amount: 150000,
    status: 'failed',
    content: 'Thanh toán ZaloPay đơn hàng ORD-3012 thất bại do hết thời gian',
    referenceCode: 'ZALO-FAIL-1',
  },
];

export default function TransactionsPage() {
  const { info } = useToast();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/transactions`);
      const data = await res.json();
      if (data.success && data.transactions && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
      }
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredTransactions = transactions.filter((t) => {
    // Search
    const matchSearch =
      t.transactionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.referenceCode && t.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status
    const matchStatus = selectedStatus === 'all' || t.status === selectedStatus;

    // Method
    const matchMethod = selectedMethod === 'all' || t.paymentMethod.toLowerCase() === selectedMethod.toLowerCase();

    // Month
    const tMonth = new Date(t.paymentTime).toISOString().slice(0, 7); // YYYY-MM
    const matchMonth = selectedMonth === 'all' || tMonth === selectedMonth;

    // Specific Date
    const tDate = new Date(t.paymentTime).toISOString().slice(0, 10); // YYYY-MM-DD
    const matchDate = !selectedDate || tDate === selectedDate;

    return matchSearch && matchStatus && matchMethod && matchMonth && matchDate;
  });

  const methodBadges: Record<string, { label: string; bg: string }> = {
    vnpay: { label: 'VNPay QR / Thẻ', bg: 'bg-blue-500/10 text-blue-600 border-blue-200' },
    zalopay: { label: 'ZaloPay', bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
    momo: { label: 'Ví MoMo', bg: 'bg-pink-500/10 text-pink-600 border-pink-200' },
    banking: { label: 'Chuyển Khoản', bg: 'bg-purple-500/10 text-purple-600 border-purple-200' },
    cod: { label: 'Tiền mặt (COD)', bg: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  };

  return (
    <div className="space-y-5">
      {/* Header Banner & Summary */}
      <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-500" /> Lịch Sử Giao Dịch Thanh Toán
            </h2>
            <p className="text-xs text-foreground/50 mt-0.5">Theo dõi chi tiết các giao dịch nạp tiền, thanh toán đơn hàng tại Swift Coffee</p>
          </div>

          <button
            onClick={fetchTransactions}
            className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground/70 transition-colors"
            title="Làm mới lịch sử"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-border/50 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Mã giao dịch / Mã đơn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Thành công (Completed)</option>
            <option value="pending">Chờ xử lý (Pending)</option>
            <option value="failed">Thất bại (Failed)</option>
            <option value="refunded">Hoàn tiền (Refunded)</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none"
          >
            <option value="all">Tất cả phương thức</option>
            <option value="vnpay">VNPay</option>
            <option value="zalopay">ZaloPay</option>
            <option value="momo">MoMo</option>
            <option value="banking">Ngân hàng (Banking)</option>
            <option value="cod">Tiền mặt COD</option>
          </select>

          {/* Date Picker Filter */}
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/60 text-foreground focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="bg-card border border-border/80 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-foreground/50">Đang tải lịch sử giao dịch...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CreditCard className="w-12 h-12 text-foreground/20 mx-auto" />
            <h3 className="font-bold text-foreground text-sm">Không có giao dịch nào phù hợp</h3>
            <p className="text-xs text-foreground/50">Thử thay đổi bộ lọc tìm kiếm hoặc xem lại sau.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/30 text-foreground/50 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Mã giao dịch / Thời gian</th>
                  <th className="py-3.5 px-4">Đơn hàng</th>
                  <th className="py-3.5 px-4">Phương thức</th>
                  <th className="py-3.5 px-4">Số tiền</th>
                  <th className="py-3.5 px-4">Nội dung</th>
                  <th className="py-3.5 px-4">Mã tham chiếu</th>
                  <th className="py-3.5 px-4 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {filteredTransactions.map((t) => {
                  const mBadge = methodBadges[t.paymentMethod.toLowerCase()] || {
                    label: t.paymentMethod.toUpperCase(),
                    bg: 'bg-secondary text-foreground',
                  };

                  return (
                    <tr key={t.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-primary font-mono block">{t.transactionCode}</span>
                        <span className="text-[10px] text-foreground/40 font-mono">{formatDate(t.paymentTime)}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-foreground font-mono">{t.orderCode}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${mBadge.bg}`}>
                          {mBadge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        {formatVND(t.amount)}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-foreground/70" title={t.content}>
                        {t.content}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-foreground/50 text-[11px]">
                        {t.referenceCode || '---'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            t.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : t.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          }`}
                        >
                          {t.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                          {t.status === 'pending' && <Clock className="w-3 h-3" />}
                          {t.status === 'failed' && <XCircle className="w-3 h-3" />}
                          {t.status === 'completed'
                            ? 'Thành công'
                            : t.status === 'pending'
                            ? 'Chờ xử lý'
                            : 'Thất bại'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
