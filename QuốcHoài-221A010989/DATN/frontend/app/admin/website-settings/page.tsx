'use client';

import React, { useState } from 'react';
import { Palette, Save, Check, Globe, Phone, Mail, MapPin } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { initialWebsiteUISettings, WebsiteUISettings } from '@/lib/admin-data';

export default function AdminWebsiteSettingsPage() {
  const [settings, setSettings] = useState<WebsiteUISettings>(initialWebsiteUISettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleSection = (key: keyof WebsiteUISettings['sections']) => {
    setSettings((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [key]: !prev.sections[key],
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Giao diện', href: '/admin/website-settings' }, { label: 'Quản lý giao diện Website khách hàng' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Quản Lý Giao Diện Website Khách Hàng</h1>
          <p className="text-xs text-foreground/60">Tùy biến thương hiệu, thông tin liên hệ và bật/tắt các khối nội dung trên trang chủ</p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-2"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Đã lưu cài đặt!' : 'Lưu giao diện'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Brand Settings */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
          <h3 className="text-base font-bold text-foreground border-b border-border/60 pb-3">Thông Tin Thương Hiệu & Liên Hệ</h3>

          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Tên thương hiệu *</label>
            <input
              type="text"
              value={settings.brandName}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Khẩu hiệu / Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Hotline hỗ trợ</label>
              <input
                type="text"
                value={settings.hotline}
                onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Email cửa hàng</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Địa chỉ trụ sở chính</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none"
            />
          </div>
        </div>

        {/* Section Toggles */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
          <h3 className="text-base font-bold text-foreground border-b border-border/60 pb-3">Bật / Tắt Các Khối Trên Trang Chủ</h3>

          <div className="space-y-3">
            {[
              { key: 'heroBanner', label: 'Banner Slider Đầu Trang (Hero)', desc: 'Hiển thị các khối banner khuyến mãi' },
              { key: 'newArrivals', label: 'Khối Sản Phẩm Mới Về', desc: 'Hiển thị các món nước/bánh mới ra mắt' },
              { key: 'featuredProducts', label: 'Khối Sản Phẩm Nổi Bật', desc: 'Thực đơn món bán chạy nhất của Swift Coffee' },
              { key: 'promotions', label: 'Khối Khuyến Mãi & Voucher', desc: 'Banner ưu đãi mã giảm giá cho thành viên' },
              { key: 'newsSection', label: 'Khối Tin Tức & Blog', desc: 'Các bài viết chia sẻ kinh nghiệm thưởng thức cà phê' },
            ].map((item) => {
              const isChecked = settings.sections[item.key as keyof WebsiteUISettings['sections']];
              return (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/60">
                  <div>
                    <h4 className="font-bold text-foreground">{item.label}</h4>
                    <p className="text-[11px] text-foreground/50">{item.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleSection(item.key as any)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${isChecked ? 'bg-primary' : 'bg-secondary border border-border/80'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isChecked ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
