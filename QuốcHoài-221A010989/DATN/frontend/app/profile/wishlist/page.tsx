'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Star, Coffee, ArrowRight, X } from 'lucide-react';
import { useWishlist, WishlistProduct } from '@/lib/wishlist-context';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/components/ui/toast';
import { formatCurrencyVN } from '@/lib/utils';

/* ── Confirm modal ── */
function ConfirmModal({
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-card border border-border rounded-3xl max-w-xs w-full p-6 shadow-xl text-center space-y-4 z-10"
          >
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/40 rounded-xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Xóa toàn bộ?</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Toàn bộ sản phẩm yêu thích sẽ bị xóa.
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-secondary rounded-xl text-xs font-semibold hover:bg-secondary/70 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors"
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

/* ── Wishlist Item Card (compact for profile layout) ── */
function ProfileWishlistCard({ product }: { product: WishlistProduct }) {
  const { toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { success } = useToast();
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: Number(product.id) || (product.id as any),
      name: product.name,
      origin: product.origin,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    success(`Đã thêm "${product.name}" vào giỏ hàng!`);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      className="group bg-background border border-border/60 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative h-44 block overflow-hidden bg-secondary/50">
        {!imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <Coffee className="w-10 h-10 text-primary/30" />
          </div>
        )}

        {/* Remove heart button */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-card/95 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all hover:scale-110"
          title="Bỏ yêu thích"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
        </button>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] text-muted-foreground font-medium">{product.origin}</span>
            {product.rating && (
              <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-semibold">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-bold text-foreground hover:text-primary transition-colors line-clamp-1 mt-0.5">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-auto pt-2 border-t border-border/40">
          <p className="text-base font-bold text-primary mb-2">
            {formatCurrencyVN(product.price)}
          </p>
          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {added ? 'Đã thêm!' : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main export ── */
export default function WishlistPage() {
  const { wishlistProducts, totalWishlist, clearWishlist, loading } = useWishlist();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="bg-card border border-border/80 rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              Danh sách yêu thích
            </h2>
            <p className="text-xs text-foreground/50 mt-0.5">
              {loading ? 'Đang tải...' : `${totalWishlist} sản phẩm`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/wishlist"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-primary hover:bg-secondary rounded-xl transition-colors"
            >
              Xem toàn bộ
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            {totalWishlist > 0 && (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa tất cả
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
              <div className="h-44 bg-muted" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-muted rounded w-1/4" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-8 bg-muted rounded-xl mt-3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && totalWishlist === 0 && (
        <div className="bg-card border border-border/80 rounded-3xl p-12 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex"
          >
            <Heart className="w-16 h-16 mx-auto text-rose-200 dark:text-rose-900 mb-4" />
          </motion.div>
          <h3 className="font-bold text-foreground mb-2">Danh sách yêu thích trống</h3>
          <p className="text-sm text-foreground/50 mb-5">
            Hãy nhấn vào icon ❤️ trên sản phẩm để lưu vào danh sách yêu thích!
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all"
          >
            <Coffee className="w-4 h-4" />
            Khám phá sản phẩm
          </Link>
        </div>
      )}

      {/* Product grid */}
      {!loading && totalWishlist > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {wishlistProducts.map((product) => (
              <ProfileWishlistCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Confirm modal */}
      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={clearWishlist}
      />
    </div>
  );
}
