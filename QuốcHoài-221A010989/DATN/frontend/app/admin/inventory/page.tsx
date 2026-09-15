'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Boxes, Plus, AlertTriangle, ArrowDownLeft, ArrowUpRight, Search, X } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { initialInventory, AdminInventoryItem } from '@/lib/admin-data';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<AdminInventoryItem[]>(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockModal, setStockModal] = useState<{ isOpen: boolean; item: AdminInventoryItem | null; mode: 'in' | 'out' }>({
    isOpen: false,
    item: null,
    mode: 'in',
  });
  const [stockAmount, setStockAmount] = useState(10);

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockModal.item) {
      setInventory((prev) =>
        prev.map((i) => {
          if (i.id === stockModal.item!.id) {
            const newStock = stockModal.mode === 'in' ? i.stock + Number(stockAmount) : Math.max(0, i.stock - Number(stockAmount));
            return { ...i, stock: newStock, lastUpdated: new Date().toISOString().split('T')[0] };
          }
          return i;
        })
      );
    }
    setStockModal({ isOpen: false, item: null, mode: 'in' });
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Kho hàng', href: '/admin/inventory' }, { label: 'Quản lý kho & Nguyên liệu' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Quản Lý Tồn Kho Nguyên Liệu</h1>
          <p className="text-xs text-foreground/60">Theo dõi số lượng hạt cà phê, ly giấy, sữa đặc và lịch sử nhập xuất kho</p>
        </div>
      </div>

      <div className="bg-card border border-border/80 rounded-3xl p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Tìm theo tên nguyên liệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-card border border-border/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-[11px] font-bold text-foreground/50 uppercase tracking-wider bg-secondary/30">
                <th className="py-3.5 px-4">Mặt hàng nguyên liệu</th>
                <th className="py-3.5 px-4">Danh mục</th>
                <th className="py-3.5 px-4">Tồn kho hiện tại</th>
                <th className="py-3.5 px-4">Ngưỡng cảnh báo</th>
                <th className="py-3.5 px-4">Giá vốn / Đơn vị</th>
                <th className="py-3.5 px-4">Cập nhật cuối</th>
                <th className="py-3.5 px-4 text-right">Thao tác Nhập/Xuất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs font-medium">
              {inventory.map((inv) => (
                <tr key={inv.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">{inv.name}</td>
                  <td className="py-3.5 px-4 text-foreground/70">{inv.category}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${inv.stock <= inv.minAlert ? 'text-amber-600' : 'text-foreground'}`}>
                        {inv.stock} {inv.unit}
                      </span>
                      {inv.stock <= inv.minAlert && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Sắp hết</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-foreground/50">{inv.minAlert} {inv.unit}</td>
                  <td className="py-3.5 px-4 font-bold text-foreground">{formatVND(inv.costPerUnit)}</td>
                  <td className="py-3.5 px-4 text-foreground/60">{inv.lastUpdated}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setStockModal({ isOpen: true, item: inv, mode: 'in' })}
                        className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold hover:bg-emerald-500/20 flex items-center gap-1"
                      >
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        <span>Nhập kho</span>
                      </button>

                      <button
                        onClick={() => setStockModal({ isOpen: true, item: inv, mode: 'out' })}
                        className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-600 font-bold hover:bg-rose-500/20 flex items-center gap-1"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Xuất kho</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Modal */}
      <AnimatePresence>
        {stockModal.isOpen && stockModal.item && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setStockModal({ isOpen: false, item: null, mode: 'in' })} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-card border border-border/80 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-base font-bold text-foreground">
                  {stockModal.mode === 'in' ? 'Phiếu Nhập Kho' : 'Phiếu Xuất Kho'}: {stockModal.item.name}
                </h3>
                <button onClick={() => setStockModal({ isOpen: false, item: null, mode: 'in' })} className="p-1 rounded-xl text-foreground/40"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleUpdateStock} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Số lượng ({stockModal.item.unit}) *</label>
                  <input type="number" required min="1" value={stockAmount} onChange={(e) => setStockAmount(Number(e.target.value))} className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none font-bold" />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                  <button type="button" onClick={() => setStockModal({ isOpen: false, item: null, mode: 'in' })} className="px-4 py-2 rounded-xl text-foreground/60">Hủy</button>
                  <button type="submit" className={`px-5 py-2 rounded-xl text-white font-bold shadow-md ${stockModal.mode === 'in' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                    Xác nhận {stockModal.mode === 'in' ? 'Nhập' : 'Xuất'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
