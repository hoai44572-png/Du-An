'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Plus, Search, Edit, Trash2, Calendar, User, X } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { initialNews, AdminNews } from '@/lib/admin-data';

export default function AdminNewsPage() {
  const [news, setNews] = useState<AdminNews[]>(initialNews);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Kiến Thức Cà Phê',
    summary: '',
    content: '',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
  });

  const filteredNews = news.filter((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle: AdminNews = {
      id: `NEWS-0${news.length + 1}`,
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
      author: 'Admin Swift Coffee',
      category: formData.category,
      summary: formData.summary,
      content: formData.content,
      thumbnail: formData.thumbnail,
      publishedAt: new Date().toISOString().split('T')[0],
      status: 'published',
    };
    setNews([newArticle, ...news]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Tin tức', href: '/admin/news' }, { label: 'Quản lý bài viết blog' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Quản Lý Bài Viết & Tin Tức</h1>
          <p className="text-xs text-foreground/60">Viết bài chia sẻ kiến thức cà phê, cập nhật sự kiện và khuyến mãi</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Soạn bài viết mới</span>
        </button>
      </div>

      <div className="bg-card border border-border/80 rounded-3xl p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((article) => (
          <div key={article.id} className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <img src={article.thumbnail} alt={article.title} className="w-full h-44 rounded-2xl object-cover" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {article.category}
                </span>
                <span className="text-[11px] text-foreground/40">{article.publishedAt}</span>
              </div>
              <h3 className="text-base font-bold text-foreground leading-snug">{article.title}</h3>
              <p className="text-xs text-foreground/60 leading-relaxed line-clamp-2">{article.summary}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold">
              <span className="text-foreground/50">Tác giả: {article.author}</span>
              <button
                onClick={() => setNews(news.filter((n) => n.id !== article.id))}
                className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Editor */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-card border border-border/80 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-base font-bold text-foreground">Soạn Bài Viết Mới</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-foreground/40"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Tiêu đề bài viết *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Tóm tắt bài viết</label>
                  <textarea rows={2} value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Nội dung bài viết *</label>
                  <textarea rows={4} required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none" />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-foreground/60">Hủy</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md">Đăng bài viết</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
