'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Plus, Search, Edit, Trash2, Coffee, CupSoda, GlassWater, Cookie, X, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { adminApi } from '@/lib/services/apiService';
import { AdminCategory } from '@/lib/admin-data';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'active' as 'active' | 'hidden',
  });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getCategories();
      if (data.success) {
        const mapped = (data.categories || []).map((c: any) => ({
          id: String(c.id),
          name: c.name,
          slug: c.slug,
          icon: c.icon || 'Coffee',
          productCount: c.productCount || 0,
          status: c.status,
          description: c.description || '',
        }));
        setCategories(mapped);
      }
    } catch {
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const body = {
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description,
        status: formData.status,
      };
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, body);
        showToast(`Đã cập nhật danh mục "${formData.name}".`, 'success');
      } else {
        await adminApi.createCategory(body);
        showToast(`Đã thêm danh mục "${formData.name}".`, 'success');
      }
      setIsModalOpen(false);
      await fetchCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi lưu danh mục.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    try {
      const data = await adminApi.deleteCategory(id);
      showToast(data.message || 'Đã xóa danh mục.', 'success');
      await fetchCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi xóa danh mục.';
      showToast(msg, 'error');
    }
  };

  const openCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', status: 'active' });
    setIsModalOpen(true);
  };

  const openEdit = (c: AdminCategory) => {
    setEditingCategory(c);
    setFormData({ name: c.name, slug: c.slug, description: c.description, status: c.status });
    setIsModalOpen(true);
  };


  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Danh mục', href: '/admin/categories' }, { label: 'Danh sách danh mục' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Quản Lý Danh Mục Sản Phẩm</h1>
          <p className="text-xs text-foreground/60">Phân loại các nhóm thực đơn cà phê, thức uống và đồ ăn kèm</p>
        </div>

        <button
          onClick={openCreate}
          className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm danh mục mới</span>
        </button>
      </div>

      <div className="bg-card border border-border/80 rounded-3xl p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Tìm danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((cat) => (
          <div key={cat.id} className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all space-y-3 relative group">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 bg-primary/10 rounded-2xl text-primary flex items-center justify-center font-bold">
                <Coffee className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(cat)} className="p-1.5 rounded-xl hover:bg-secondary text-foreground/60">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCategories(categories.filter((c) => c.id !== cat.id))}
                  className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-foreground">{cat.name}</h3>
              <p className="text-xs text-foreground/50 leading-relaxed mt-1">{cat.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold">
              <span className="text-primary">{cat.productCount} sản phẩm</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${cat.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-secondary text-foreground/40'}`}>
                {cat.status === 'active' ? 'Đang hiển thị' : 'Đang ẩn'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-base font-bold text-foreground">{editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-foreground/40"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Tên danh mục *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Mô tả ngắn</label>
                  <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none" />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-foreground/60">Hủy</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md">Lưu danh mục</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
