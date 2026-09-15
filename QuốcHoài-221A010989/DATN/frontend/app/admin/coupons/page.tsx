'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Plus, Search, Edit, Trash2, Calendar, CheckCircle2, X } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { initialCoupons, AdminCoupon } from '@/lib/admin-data';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    type: 'percent' as 'percent' | 'fixed',
    value: 20,
    minOrder: 100000,
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    usageLimit: 500,
  });

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: AdminCoupon = {
      id: `CPN-0${coupons.length + 1}`,
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: Number(formData.value),
      minOrder: Number(formData.minOrder),
      startDate: formData.startDate,
      endDate: formData.endDate,
      usageLimit: Number(formData.usageLimit),
      usedCount: 0,
      status: 'active',
    };
    setCoupons([newCoupon, ...coupons]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Mã giảm giá', href: '/admin/coupons' }, { label: 'Quản lý mã khuyến mãi' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Quản Lý Mã Giảm Giá</h1>
          <p className="text-xs text-foreground/60">Tạo mã ưu đãi %, giảm số tiền cố định, cấu hình thời hạn và lượt dùng</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Mã Giảm Giá</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((cpn) => (
          <div key={cpn.id} className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-mono font-bold text-primary tracking-wider">{cpn.code}</span>
                  <p className="text-xs text-foreground/60">
                    {cpn.type === 'percent' ? `Giảm ${cpn.value}%` : `Giảm ${formatVND(cpn.value)}`}
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${cpn.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                {cpn.status === 'active' ? 'Đang áp dụng' : 'Hết hạn'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-secondary/30 p-3 rounded-2xl border border-border/60">
              <div>
                <span className="text-foreground/50 block">Đơn tối thiểu:</span>
                <span className="font-bold text-foreground">{formatVND(cpn.minOrder)}</span>
              </div>
              <div>
                <span className="text-foreground/50 block">Lượt sử dụng:</span>
                <span className="font-bold text-foreground">{cpn.usedCount} / {cpn.usageLimit}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-foreground/50">
              <span>Hạn dùng: {cpn.startDate} đến {cpn.endDate}</span>
              <button onClick={() => setCoupons(coupons.filter((c) => c.id !== cpn.id))} className="text-rose-600 font-semibold hover:underline">Xóa</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-base font-bold text-foreground">Tạo Mã Giảm Giá Mới</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-foreground/40"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Mã voucher (Viết hoa không dấu) *</label>
                  <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="VD: SWIFT50K" className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none uppercase font-mono font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Loại giảm giá</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none font-semibold">
                      <option value="percent">Giảm theo %</option>
                      <option value="fixed">Giảm số tiền cố định</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Giá trị giảm *</label>
                    <input type="number" required value={formData.value} onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })} className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-foreground/60">Hủy</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md">Tạo Voucher</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
