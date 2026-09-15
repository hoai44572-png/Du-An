'use client';

import React from 'react';
import { TrendingUp, DollarSign, Download, Printer, FileText, Calendar } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { RevenueBarChart, OrdersLineChart } from '@/components/admin/charts/AdminCharts';

export default function AdminFinancialsPage() {
  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Doanh thu', href: '/admin/financials' }, { label: 'Báo cáo doanh thu & Lợi nhuận' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Quản Lý Doanh Thu & Tài Chính</h1>
          <p className="text-xs text-foreground/60">Thống kê doanh số bán hàng, chi phí nguyên liệu và xuất báo cáo tài chính</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Đã xuất file báo cáo Excel thành công!')}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={() => alert('Đã xuất file PDF báo cáo tài chính!')}
            className="px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Xuất PDF</span>
          </button>

          <button
            onClick={() => alert('Đang in báo cáo...')}
            className="p-2.5 rounded-2xl bg-secondary text-foreground hover:bg-secondary/80 transition-all"
            title="In báo cáo"
          >
            <Printer className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Tổng Doanh Thu Tháng 7</span>
          <h2 className="text-2xl font-bold text-foreground">174.600.000 đ</h2>
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">
            +18.4% so với tháng 6
          </span>
        </div>

        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Ước Tính Chi Phí Nguyên Liệu</span>
          <h2 className="text-2xl font-bold text-rose-600">52.380.000 đ</h2>
          <span className="text-xs text-foreground/50 block">Chiếm 30% doanh thu</span>
        </div>

        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Lợi Nhuận Ròng Dự Kiến</span>
          <h2 className="text-2xl font-bold text-primary">122.220.000 đ</h2>
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">
            Tỷ suất lợi nhuận 70%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm">
          <RevenueBarChart />
        </div>
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm">
          <OrdersLineChart />
        </div>
      </div>
    </div>
  );
}
