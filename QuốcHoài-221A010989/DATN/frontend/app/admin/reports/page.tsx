'use client';

import React from 'react';
import { BarChart3, TrendingUp, Clock, MapPin, Coffee, Users } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Báo cáo', href: '/admin/reports' }, { label: 'Báo cáo thống kê chuyên sâu' }]} />

      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Báo Cáo & Phân Tích Thống Kê</h1>
        <p className="text-xs text-foreground/60">Phân tích xu hướng tiêu dùng, giờ cao điểm và khu vực đặt hàng phổ biến</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Khung Giờ Cao Điểm</h3>
          <p className="text-xs text-foreground/60 leading-relaxed">
            Khung giờ từ <span className="font-bold text-primary">07:30 - 09:30</span> sáng chiếm 45% tổng lượng đơn hàng cà phê trong ngày.
          </p>
        </div>

        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Khu Vực Giao Hàng Top 1</h3>
          <p className="text-xs text-foreground/60 leading-relaxed">
            <span className="font-bold text-primary">Quận 1 & Bình Thạnh</span> là hai khu vực có mật độ giao hàng cao nhất (chiếm 62% doanh số online).
          </p>
        </div>

        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <Coffee className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Sản Phẩm Tăng Trưởng Nhanh</h3>
          <p className="text-xs text-foreground/60 leading-relaxed">
            <span className="font-bold text-primary">Cà Phê Sữa Đá Swift Signature</span> giữ vị trí số 1 liên tiếp trong 6 tháng.
          </p>
        </div>
      </div>
    </div>
  );
}
