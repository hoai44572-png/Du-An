'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  Upload,
  Check,
  X,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { AdminConfirmModal } from '@/components/admin/ui/AdminConfirmModal';
import { adminApi } from '@/lib/services/apiService';
import { AdminProduct, initialCategories } from '@/lib/admin-data';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  
  // Modal & Drawer states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [detailProduct, setDetailProduct] = useState<AdminProduct | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<AdminProduct>>({
    name: '',
    category: 'Cà Phê Việt Nam',
    price: 45000,
    originalPrice: 50000,
    stock: 50,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
    description: '',
    variants: [
      { size: 'Nhỏ (S)', priceOffset: 0 },
      { size: 'Vừa (M)', priceOffset: 5000 },
      { size: 'Lớn (L)', priceOffset: 10000 },
    ],
  });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  // === FETCH sản phẩm từ API ===
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      if (selectedStatus !== 'ALL') params.status = selectedStatus;

      const data = await adminApi.getProducts(params);
      if (data.success) {
        // Map DB product format to AdminProduct format
        const mapped = (data.products || []).map((p: any) => ({
          id: String(p.id),
          name: p.name,
          category: p.category?.name || 'Chưa phân loại',
          categoryId: p.categoryId,
          price: p.price,
          originalPrice: p.salePrice || p.price,
          stock: p.stock,
          sold: p.sold,
          status: p.status,
          image: p.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600',
          gallery: p.images || [],
          description: p.description || '',
          variants: p.variants || [],
          sku: p.sku,
          featured: p.featured,
          createdAt: p.createdAt?.split('T')[0] || '',
        }));
        setProducts(mapped);
      }
    } catch (err) {
      // Nếu Backend chưa chạy, giữ danh sách rỗng
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await adminApi.getCategories();
      if (data.success) setCategories(data.categories || []);
    } catch {}
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter & Search Logic (client-side filter trên kết quả đã fetch)
  const filteredProducts = products;

  // Handle Create or Edit Submit — gọi API thật
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Map AdminProduct format → API format
      const body: Record<string, unknown> = {
        name: formData.name,
        price: formData.price,
        salePrice: formData.originalPrice,
        stock: formData.stock,
        image: formData.image,
        description: formData.description,
        status: formData.status,
        variants: formData.variants,
      };

      // Tìm categoryId từ tên category
      const matchedCat = categories.find(c => c.name === formData.category);
      if (matchedCat) body.categoryId = matchedCat.id;

      if (editingProduct) {
        // UPDATE
        await adminApi.updateProduct(editingProduct.id, body);
        showToast(`Đã cập nhật sản phẩm "${formData.name}".`, 'success');
      } else {
        // CREATE
        await adminApi.createProduct(body);
        showToast(`Đã thêm sản phẩm "${formData.name}" thành công.`, 'success');
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      await fetchProducts(); // Reload từ DB
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi lưu sản phẩm.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Duplicate Product
  const handleDuplicate = async (product: AdminProduct) => {
    try {
      const body = {
        name: `${product.name} (Bản sao)`,
        price: product.price,
        salePrice: product.originalPrice,
        stock: product.stock,
        image: product.image,
        description: product.description,
        status: 'hidden',
        variants: product.variants,
      };
      await adminApi.createProduct(body);
      showToast(`Đã nhân đôi sản phẩm "${product.name}".`, 'success');
      await fetchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi nhân đôi sản phẩm.';
      showToast(msg, 'error');
    }
  };

  // Toggle Visibility
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'hidden' : 'active';
      await adminApi.updateProduct(id, { status: newStatus });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus as any } : p));
      showToast(`Đã ${newStatus === 'active' ? 'hiển thị' : 'ẩn'} sản phẩm.`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi thay đổi trạng thái.';
      showToast(msg, 'error');
    }
  };

  // Delete Single — gọi API
  const handleDelete = async () => {
    if (!confirmModal.id) return;
    try {
      const data = await adminApi.deleteProduct(confirmModal.id);
      showToast(data.message || 'Đã xóa sản phẩm.', 'success');
      await fetchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi xóa sản phẩm.';
      showToast(msg, 'error');
    } finally {
      setConfirmModal({ isOpen: false, id: null });
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedItems.map(id => adminApi.deleteProduct(id)));
      showToast(`Đã xóa ${selectedItems.length} sản phẩm.`, 'success');
      setSelectedItems([]);
      await fetchProducts();
    } catch (err: unknown) {
      showToast('Lỗi xóa hàng loạt.', 'error');
    }
  };


  const openEditModal = (p: AdminProduct) => {
    setEditingProduct(p);
    setFormData(p);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Cà Phê Việt Nam',
      price: 45000,
      stock: 50,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
      description: '',
      variants: [
        { size: 'Nhỏ (S)', priceOffset: 0 },
        { size: 'Vừa (M)', priceOffset: 5000 },
        { size: 'Lớn (L)', priceOffset: 10000 },
      ],
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Sản phẩm', href: '/admin/products' }, { label: 'Danh sách sản phẩm' }]} />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed top-4 right-4 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-destructive text-destructive-foreground'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Quản Lý Sản Phẩm</h1>
          <p className="text-xs text-foreground/60">Quản lý danh sách thực đơn, tồn kho và các biến thể sản phẩm Swift Coffee</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchProducts()}
            className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground/60 transition-colors"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2.5 rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa {selectedItems.length} mục đã chọn</span>
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-card border border-border/80 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm hoặc mã SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-foreground/40" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs font-semibold text-foreground focus:outline-none"
            >
              <option value="ALL">Tất cả danh mục</option>
              {initialCategories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs font-semibold text-foreground focus:outline-none shrink-0"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="hidden">Đang ẩn</option>
            <option value="out_of_stock">Hết hàng</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card border border-border/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-[11px] font-bold text-foreground/50 uppercase tracking-wider bg-secondary/30">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedItems(filteredProducts.map((p) => p.id));
                      else setSelectedItems([]);
                    }}
                    className="w-4 h-4 rounded border-border text-primary accent-primary"
                  />
                </th>
                <th className="py-3.5 px-4">Sản phẩm</th>
                <th className="py-3.5 px-4">Danh mục</th>
                <th className="py-3.5 px-4">Giá bán</th>
                <th className="py-3.5 px-4">Tồn kho</th>
                <th className="py-3.5 px-4">Đã bán</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs font-medium">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(prod.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedItems([...selectedItems, prod.id]);
                        else setSelectedItems(selectedItems.filter((i) => i !== prod.id));
                      }}
                      className="w-4 h-4 rounded border-border text-primary accent-primary"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-border/60" />
                      <div>
                        <h4 className="font-bold text-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => setDetailProduct(prod)}>
                          {prod.name}
                        </h4>
                        <span className="text-[10px] text-foreground/40 font-mono block">{prod.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-foreground/70 font-semibold">{prod.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-foreground block">{formatVND(prod.price)}</span>
                    {prod.originalPrice && (
                      <span className="text-[10px] text-foreground/40 line-through block">{formatVND(prod.originalPrice)}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-bold ${prod.stock <= 10 ? 'text-amber-600' : 'text-foreground'}`}>
                      {prod.stock} món
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-foreground/70 font-bold">{prod.sold}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleStatus(prod.id, prod.status)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        prod.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : prod.status === 'hidden'
                          ? 'bg-secondary text-foreground/60 border border-border/60 hover:bg-secondary/80'
                          : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      }`}
                    >
                      {prod.status === 'active' ? 'Đang bán' : prod.status === 'hidden' ? 'Đang ẩn' : 'Hết hàng'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setDetailProduct(prod)}
                        className="p-1.5 rounded-xl hover:bg-secondary text-foreground/60 hover:text-primary transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 rounded-xl hover:bg-secondary text-foreground/60 hover:text-primary transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(prod)}
                        className="p-1.5 rounded-xl hover:bg-secondary text-foreground/60 hover:text-accent transition-colors"
                        title="Sao chép bản sao"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, id: prod.id })}
                        className="p-1.5 rounded-xl hover:bg-destructive/10 text-foreground/60 hover:text-destructive transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-border/60 flex items-center justify-between text-xs text-foreground/60">
          <span>Hiển thị {filteredProducts.length} trên tổng số {products.length} sản phẩm</span>
          <div className="flex items-center gap-1">
            <button disabled className="p-2 rounded-xl bg-secondary opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-xl bg-primary text-primary-foreground font-bold">1</span>
            <button disabled className="p-2 rounded-xl bg-secondary opacity-50 cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-card border border-border/80 rounded-3xl p-6 shadow-2xl z-10 space-y-6 overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <h3 className="text-lg font-serif font-bold text-foreground">
                  {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-foreground/40 hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Tên sản phẩm *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Cà Phê Muối Swift"
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Danh mục *</label>
                    <select
                      value={formData.category || 'Cà Phê Việt Nam'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/60 text-xs font-semibold focus:outline-none"
                    >
                      {initialCategories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Giá bán (VNĐ) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/60 text-xs font-medium focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Giá gốc (nếu có)</label>
                    <input
                      type="number"
                      value={formData.originalPrice || ''}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/60 text-xs font-medium focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80">Số lượng tồn kho *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock || 0}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/60 text-xs font-medium focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image Upload Gallery Preview */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80">Đường dẫn hình ảnh (URL)</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/60 text-xs font-medium focus:outline-none"
                    />
                    {formData.image && (
                      <img src={formData.image} alt="Preview" className="w-10 h-10 rounded-xl object-cover border" />
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80">Mô tả sản phẩm</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả hương vị, nguyên liệu chế biến..."
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/60 text-xs font-medium focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-foreground/70 hover:bg-secondary transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all"
                  >
                    Lưu sản phẩm
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Detail Drawer */}
      <AnimatePresence>
        {detailProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailProduct(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md h-full bg-card border-l border-border/80 p-6 shadow-2xl z-10 space-y-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <h3 className="text-base font-bold text-foreground">Chi Tiết Sản Phẩm</h3>
                <button
                  onClick={() => setDetailProduct(null)}
                  className="p-1.5 rounded-xl text-foreground/40 hover:text-foreground hover:bg-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <img src={detailProduct.image} alt={detailProduct.name} className="w-full h-48 rounded-2xl object-cover shadow-md" />

              <div className="space-y-3">
                <h2 className="text-xl font-serif font-bold text-foreground">{detailProduct.name}</h2>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{formatVND(detailProduct.price)}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-foreground/70">
                    {detailProduct.category}
                  </span>
                </div>

                <p className="text-xs text-foreground/70 leading-relaxed bg-secondary/30 p-3 rounded-2xl border border-border/60">
                  {detailProduct.description || 'Chưa có mô tả chi tiết.'}
                </p>

                <div className="space-y-2 pt-2 border-t border-border/60">
                  <h4 className="text-xs font-bold text-foreground">Biến thể kích thước:</h4>
                  <div className="space-y-1.5">
                    {detailProduct.variants.map((v, i) => (
                      <div key={i} className="flex justify-between items-center text-xs p-2 bg-secondary/50 rounded-xl">
                        <span className="font-semibold text-foreground">{v.size}</span>
                        <span className="text-primary font-bold">+{formatVND(v.priceOffset)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title="Xác nhận xóa sản phẩm"
        description="Hành động này sẽ xóa vĩnh viễn sản phẩm khỏi danh sách thực đơn của Swift Coffee. Bạn có chắc chắn không?"
        onConfirm={handleDelete}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
