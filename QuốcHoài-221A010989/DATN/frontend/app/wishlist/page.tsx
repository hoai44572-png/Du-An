'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  ArrowRight,
  Coffee,
  X,
  ShoppingBag,
} from 'lucide-react';
import { useWishlist, WishlistProduct } from '@/lib/wishlist-context';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/components/ui/toast';
import { formatCurrencyVN } from '@/lib/utils';

/* ── Confirm modal ── */
function ConfirmClearModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.22 }}
            className="relative bg-card border border-border rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 z-10"
          >
            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/40 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7 text-rose-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground font-serif">Xóa tất cả yêu thích?</h3>
              <p className="text-sm text-muted-foreground mt-1.5">
                Toàn bộ danh sách sản phẩm yêu thích sẽ bị xóa. Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-secondary rounded-2xl text-sm font-semibold hover:bg-secondary/70 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className="flex-1 py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-sm font-bold transition-colors"
              >
                Xóa tất cả
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ── Wishlist Product Card ── */
function WishlistCard({ product }: { product: WishlistProduct }) {
  const { toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { success } = useToast();
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: Number(product.id) || product.id as any,
      name: product.name,
      origin: product.origin,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    success(`Đã thêm "${product.name}" vào giỏ hàng!`);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleRemove = async () => {
    await toggleWishlist(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88, y: -10 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-card border border-border/80 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative h-52 block overflow-hidden bg-secondary/50">
        {!imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <Coffee className="w-12 h-12 text-primary/30" />
            <span className="text-xs text-muted-foreground mt-2">{product.origin}</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        {product.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-background/90 backdrop-blur-md text-primary text-[10px] font-semibold tracking-wide uppercase rounded-lg shadow-sm border border-border/50">
            {product.category}
          </span>
        )}

        {/* Remove from wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); handleRemove(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/95 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/50 text-foreground/60 transition-all duration-200 hover:scale-110"
          title="Bỏ yêu thích"
          aria-label="Bỏ yêu thích"
        >
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs text-muted-foreground font-medium">{product.origin}</span>
            {product.rating && (
              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                {product.reviewsCount && (
                  <span className="text-muted-foreground font-normal">({product.reviewsCount})</span>
                )}
              </div>
            )}
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif font-bold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
          {product.tasting && (
            <p className="text-xs text-muted-foreground italic mt-1 line-clamp-1">
              Nốt hương: {product.tasting}
            </p>
          )}
        </div>

        {/* Price + Actions */}
        <div className="mt-auto pt-3 border-t border-border/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Giá bán</span>
            <p className="text-lg font-bold text-primary">{formatCurrencyVN(product.price)}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                added
                  ? 'bg-emerald-500 text-white'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {added ? 'Đã thêm!' : 'Thêm vào giỏ'}
            </button>
            <Link
              href={`/product/${product.id}`}
              className="flex items-center justify-center px-3 py-2.5 bg-secondary hover:bg-secondary/70 rounded-xl text-xs font-semibold transition-colors"
              title="Xem chi tiết"
            >
              Xem
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Empty State ── */
function EmptyWishlist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      {/* Animated heart */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mb-6"
      >
        <Heart className="w-12 h-12 text-rose-200 dark:text-rose-800" />
      </motion.div>

      <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
        Bạn chưa có sản phẩm yêu thích
      </h2>
      <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
        Khám phá các sản phẩm cà phê chuyên biệt và nhấn vào biểu tượng ❤️ để lưu những sản phẩm bạn yêu thích vào danh sách.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          <Coffee className="w-4 h-4" />
          Khám phá sản phẩm
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-secondary text-foreground rounded-2xl font-semibold text-sm hover:bg-secondary/70 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function WishlistPage() {
  const { wishlistProducts, totalWishlist, clearWishlist, loading } = useWishlist();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-28 pb-20 max-w-6xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-400" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-foreground">
                  Sản phẩm yêu thích
                </h1>
              </div>
              <p className="text-muted-foreground text-sm ml-[52px]">
                {loading
                  ? 'Đang tải danh sách...'
                  : totalWishlist > 0
                  ? `${totalWishlist} sản phẩm đang được yêu thích`
                  : 'Danh sách yêu thích của bạn'}
              </p>
            </div>

            {totalWishlist > 0 && (
              <div className="flex items-center gap-3">
                <Link
                  href="/cart"
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Giỏ hàng
                </Link>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900 transition-all"
                >
                  <X className="w-4 h-4" />
                  Xóa tất cả
                </button>
              </div>
            )}
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-border mb-10" />

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-52 bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded w-4/5" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                    <div className="h-10 bg-muted rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Product Grid */}
          {!loading && totalWishlist === 0 && <EmptyWishlist />}

          {!loading && totalWishlist > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {wishlistProducts.map((product) => (
                  <WishlistCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Continue shopping */}
          {!loading && totalWishlist > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-14 text-center"
            >
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                <Coffee className="w-4 h-4" />
                Tiếp tục khám phá sản phẩm
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* Clear all confirm modal */}
      <ConfirmClearModal
        open={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearWishlist}
      />
    </>
  );
}
