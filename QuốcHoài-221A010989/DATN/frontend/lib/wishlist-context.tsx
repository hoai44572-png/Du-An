'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { wishlistApi } from '@/lib/services/apiService';
import { authStorage } from '@/lib/auth';
import { useToast } from '@/components/ui/toast';

/* ── Product metadata stored locally for display in wishlist page ── */
export interface WishlistProduct {
  id: string;
  name: string;
  origin: string;
  price: number;
  image: string;
  category?: string;
  tasting?: string;
  rating?: number;
  reviewsCount?: number;
}

/* ── Context contract ── */
interface WishlistContextValue {
  wishlist: string[];                              // product IDs
  wishlistProducts: WishlistProduct[];             // full product objects
  totalWishlist: number;
  isInWishlist: (productId: string | number) => boolean;
  toggleWishlist: (product: WishlistProduct) => Promise<void>;
  clearWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

/* ── Storage keys, user-specific to prevent cross-account leakage ── */
const wishlistIdsKey = (userId?: string | number | null) =>
  userId ? `swift_coffee_wishlist_ids_${userId}` : 'swift_coffee_wishlist_ids_guest';

const wishlistMetaKey = (userId?: string | number | null) =>
  userId ? `swift_coffee_wishlist_meta_${userId}` : 'swift_coffee_wishlist_meta_guest';

/* ── Helpers ── */
const readLocal = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeLocal = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

/* ── Provider ── */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const [currentUser, setCurrentUser] = useState<unknown>(null);

  useEffect(() => {
    setCurrentUser(authStorage.getUser());
  }, []);

  const userId = (currentUser as { id?: string | number })?.id ?? null;
  const idsKey  = wishlistIdsKey(userId);
  const metaKey = wishlistMetaKey(userId);

  /* ── Merge product metadata helper ── */
  const mergeProduct = useCallback((product: WishlistProduct) => {
    setWishlistProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev;
      const next = [...prev, product];
      writeLocal(metaKey, next);
      return next;
    });
  }, [metaKey]);

  const removeProduct = useCallback((productId: string) => {
    setWishlistProducts(prev => {
      const next = prev.filter(p => p.id !== productId);
      writeLocal(metaKey, next);
      return next;
    });
  }, [metaKey]);

  /* ── Initial sync ── */
  const syncFromServer = useCallback(async () => {
    // Always load cached metadata first for instant render
    const cachedMeta = readLocal<WishlistProduct[]>(metaKey, []);
    setWishlistProducts(cachedMeta);

    if (!authStorage.isAuthenticated()) {
      const ids = readLocal<string[]>(idsKey, []);
      setWishlist(ids);
      return;
    }

    setLoading(true);
    try {
      const data = await wishlistApi.getWishlist();
      if (data.success) {
        const serverIds: string[] = data.wishlist || [];
        setWishlist(serverIds);
        writeLocal(idsKey, serverIds);

        // Remove meta entries that no longer exist on server
        setWishlistProducts(prev => {
          const next = prev.filter(p => serverIds.includes(p.id));
          writeLocal(metaKey, next);
          return next;
        });
      }
    } catch {
      // Fallback to localStorage
      const ids = readLocal<string[]>(idsKey, []);
      setWishlist(ids);
    } finally {
      setLoading(false);
    }
  }, [idsKey, metaKey]);

  useEffect(() => {
    syncFromServer();
  }, [syncFromServer]);

  /* ── Helpers ── */
  const isInWishlist = useCallback(
    (productId: string | number) => wishlist.includes(String(productId)),
    [wishlist],
  );

  /* ── Toggle ── */
  const toggleWishlist = useCallback(async (product: WishlistProduct) => {
    const strId    = String(product.id);
    const alreadyIn = wishlist.includes(strId);

    // Optimistic update
    const nextIds = alreadyIn
      ? wishlist.filter(id => id !== strId)
      : [...wishlist, strId];
    setWishlist(nextIds);
    writeLocal(idsKey, nextIds);

    if (alreadyIn) {
      removeProduct(strId);
      error('Đã xóa khỏi danh sách yêu thích');
    } else {
      mergeProduct({ ...product, id: strId });
      success('Đã thêm vào sản phẩm yêu thích ❤️');
    }

    if (!authStorage.isAuthenticated()) return;

    try {
      if (alreadyIn) {
        await wishlistApi.removeFromWishlist(strId);
      } else {
        await wishlistApi.addToWishlist(strId);
      }
    } catch {
      // Revert on server error
      const revert = alreadyIn ? [...nextIds, strId] : nextIds.filter(id => id !== strId);
      setWishlist(revert);
      writeLocal(idsKey, revert);
      if (alreadyIn) {
        mergeProduct({ ...product, id: strId });
      } else {
        removeProduct(strId);
      }
    }
  }, [wishlist, idsKey, mergeProduct, removeProduct, success, error]);

  /* ── Clear all ── */
  const clearWishlist = useCallback(async () => {
    setWishlist([]);
    setWishlistProducts([]);
    writeLocal(idsKey, []);
    writeLocal(metaKey, []);
    if (authStorage.isAuthenticated()) {
      try { await wishlistApi.clearWishlist(); } catch {}
    }
    success('Đã xóa toàn bộ danh sách yêu thích.');
  }, [idsKey, metaKey, success]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistProducts,
        totalWishlist: wishlist.length,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
