'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, Edit, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { initialBanners, AdminBanner } from '@/lib/admin-data';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<AdminBanner[]>(initialBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '/menu',
    position: 1,
    status: 'active' as 'active' | 'hidden',
  });

  const handleToggleStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: b.status === 'active' ? 'hidden' : 'active' } : b))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      setBanners((prev) => prev.map((b) => (b.id === editingBanner.id ? { ...b, ...formData } : b)));
    } else {
      const newB: AdminBanner = {
        id: `BNR-0${banners.length + 1}`,
        ...formData,
      };
      setBanners([...banners, newB]);
    }
    setIsModalOpen(false);
  };

  const openCreate = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
      linkUrl: '/menu',
      position: banners.length + 1,
      status: 'active',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Banner', href: '/admin/banners' }, { label: 'Quản lý Banner quảng cáo' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Quản Lý Banner Quảng Cáo</h1>
          <p className="text-xs text-foreground/60">Thay đổi hình ảnh banner slider chính trên trang chủ website</p>
        </div>

        <button
          onClick={openCreate}
          className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Banner mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((bnr) => (
          <div key={bnr.id} className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-sm space-y-4 p-4">
            <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
              <img src={bnr.imageUrl} alt={bnr.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full w-fit mb-1">
                  Vị trí #{bnr.position}
                </span>
                <h3 className="text-lg font-serif font-bold">{bnr.title}</h3>
                <p className="text-xs text-white/80">{bnr.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs font-semibold">
              <button
                onClick={() => handleToggleStatus(bnr.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  bnr.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-secondary text-foreground/50'
                }`}
              >
                {bnr.status === 'active' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{bnr.status === 'active' ? 'Đang hiển thị' : 'Đã ẩn'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBanners(banners.filter((b) => b.id !== bnr.id))}
                  className="p-2 rounded-xl text-foreground/50 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Banner */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-base font-bold text-foreground">Thêm Banner</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-foreground/40"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Tiêu đề Banner *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Mô tả phụ</label>
                  <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">URL hình ảnh *</label>
                  <input type="text" required value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none" />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-foreground/60">Hủy</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md">Lưu Banner</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
