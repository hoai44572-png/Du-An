'use client';

import React, { useState } from 'react';
import { Settings, Save, Check, Shield, Bell, CreditCard } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [shippingFee, setShippingFee] = useState(20000);
  const [vatRate, setVatRate] = useState(8);
  const [allowOnlineOrder, setAllowOnlineOrder] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Cài đặt', href: '/admin/settings' }, { label: 'Cài đặt cấu hình hệ thống' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Cài Đặt Cấu Hình Hệ Thống</h1>
          <p className="text-xs text-foreground/60">Cấu hình phí vận chuyển, thuế VAT, phương thức thanh toán và quy tắc vận hành</p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Đã lưu cấu hình!' : 'Lưu cài đặt'}</span>
        </button>
      </div>

      <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4 text-xs max-w-2xl">
        <h3 className="text-base font-bold text-foreground border-b border-border/60 pb-3">Thanh Toán & Vận Chuyển</h3>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Phí giao hàng mặc định (VNĐ)</label>
          <input
            type="number"
            value={shippingFee}
            onChange={(e) => setShippingFee(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none font-bold text-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Thuế VAT (%)</label>
          <input
            type="number"
            value={vatRate}
            onChange={(e) => setVatRate(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none font-bold"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/60 pt-3">
          <div>
            <h4 className="font-bold text-foreground">Bật nhận đơn hàng Online</h4>
            <p className="text-[11px] text-foreground/50">Cho phép khách hàng đặt giao tận nơi trên Website</p>
          </div>
          <button
            type="button"
            onClick={() => setAllowOnlineOrder(!allowOnlineOrder)}
            className={`w-12 h-6 rounded-full transition-colors relative ${allowOnlineOrder ? 'bg-primary' : 'bg-secondary border border-border/80'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${allowOnlineOrder ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
