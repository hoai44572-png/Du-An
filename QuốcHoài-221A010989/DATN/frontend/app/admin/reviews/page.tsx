'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, EyeOff, Trash2, MessageSquare, X } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { initialReviews, AdminReview } from '@/lib/admin-data';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>(initialReviews);
  const [replyModal, setReplyModal] = useState<{ isOpen: boolean; review: AdminReview | null }>({ isOpen: false, review: null });
  const [replyText, setReplyText] = useState('');

  const handleApprove = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)));
  };

  const handleHide = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'hidden' } : r)));
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyModal.review) {
      setReviews((prev) =>
        prev.map((r) => (r.id === replyModal.review!.id ? { ...r, adminReply: replyText } : r))
      );
    }
    setReplyModal({ isOpen: false, review: null });
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Đánh giá', href: '/admin/reviews' }, { label: 'Quản lý đánh giá sản phẩm' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Quản Lý Đánh Giá & Phản Hồi</h1>
          <p className="text-xs text-foreground/60">Duyệt nhận xét của khách hàng, phản hồi chính thức từ cửa hàng</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-primary block">{rev.productName}</span>
                <p className="text-xs font-bold text-foreground mt-0.5">{rev.customerName} - <span className="text-foreground/40 font-normal">{rev.createdAt}</span></p>
              </div>

              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-500' : 'text-border'}`} />
                ))}
              </div>
            </div>

            <p className="text-xs text-foreground/80 leading-relaxed bg-secondary/30 p-3 rounded-2xl border border-border/60">
              "{rev.comment}"
            </p>

            {rev.adminReply && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-primary block">Phản hồi từ Swift Coffee Admin:</span>
                <p className="text-foreground/80">{rev.adminReply}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${rev.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' : rev.status === 'pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'}`}>
                {rev.status === 'approved' ? 'Đã duyệt' : rev.status === 'pending' ? 'Chờ duyệt' : 'Đã ẩn'}
              </span>

              <div className="flex items-center gap-2">
                {rev.status !== 'approved' && (
                  <button onClick={() => handleApprove(rev.id)} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700">Duyệt</button>
                )}
                {rev.status !== 'hidden' && (
                  <button onClick={() => handleHide(rev.id)} className="px-3 py-1.5 rounded-xl bg-secondary text-foreground/60 font-semibold hover:bg-secondary/80">Ẩn</button>
                )}
                <button onClick={() => { setReplyModal({ isOpen: true, review: rev }); setReplyText(rev.adminReply || ''); }} className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/20 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Trả lời</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReplyModal({ isOpen: false, review: null })} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-base font-bold text-foreground">Trả Lời Đánh Giá</h3>
                <button onClick={() => setReplyModal({ isOpen: false, review: null })} className="p-1 rounded-xl text-foreground/40"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSendReply} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Nội dung phản hồi công khai</label>
                  <textarea rows={3} required value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Nhập câu trả lời từ cửa hàng..." className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none" />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                  <button type="button" onClick={() => setReplyModal({ isOpen: false, review: null })} className="px-4 py-2 rounded-xl text-foreground/60">Hủy</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md">Gửi phản hồi</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
