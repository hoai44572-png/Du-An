'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Edit, Trash2, Heart, Eye, Star, Check } from 'lucide-react'
import { formatCurrencyVN } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart-context'
import { useToast } from '@/components/ui/toast'
import { useWishlist } from '@/lib/wishlist-context'

interface ProductCardProps {
  id: number
  name: string
  origin: string
  price: number
  description?: string
  image: string
  category?: string
  tasting?: string
  rating?: number
  reviewsCount?: number
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onQuickView?: (id: number) => void
}

export function ProductCard({
  id,
  name,
  origin,
  price,
  description,
  image,
  category,
  tasting,
  rating = 4.8,
  reviewsCount = 42,
  onEdit,
  onDelete,
  onQuickView,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const [added, setAdded] = useState(false)
  const [heartAnim, setHeartAnim] = useState(false)

  const { addItem } = useCart()
  const { success } = useToast()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const strId = String(id)
  const inWishlist = isInWishlist(strId)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      id,
      name,
      origin,
      price,
      image,
    })

    setAdded(true)
    success(`Đã thêm "${name}" vào giỏ hàng`, 'Thành công')
    setTimeout(() => setAdded(false), 1500)
  }

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Trigger heart animation
    setHeartAnim(true)
    setTimeout(() => setHeartAnim(false), 400)

    await toggleWishlist({
      id: strId,
      name,
      origin,
      price,
      image,
      category,
      tasting,
      rating,
      reviewsCount,
    })
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link href={`/product/${id}`} className="block h-full">
        <div className="group relative h-full rounded-2xl overflow-hidden bg-card border border-border/80 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
          {/* Image Container */}
          <div className="relative h-64 bg-secondary/50 rounded-t-2xl overflow-hidden flex items-center justify-center shrink-0">
            {!imgError ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-secondary to-muted">
                <span className="text-6xl animate-float">☕</span>
                <span className="text-xs text-foreground/50 mt-2 font-medium">{origin}</span>
              </div>
            )}

            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Category Tag Badge */}
            {category && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-background/90 backdrop-blur-md text-primary text-[11px] font-semibold tracking-wide uppercase rounded-lg shadow-sm border border-border/50">
                {category}
              </span>
            )}

            {/* Wishlist Button — connected to global WishlistContext */}
            <button
              type="button"
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-md rounded-full shadow-md transition-all duration-200 hover:scale-110 z-20"
              title={inWishlist ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              aria-label={inWishlist ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              aria-pressed={inWishlist}
            >
              <motion.div
                animate={heartAnim ? { scale: [1, 1.45, 0.88, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Heart
                  className={`w-4 h-4 transition-colors duration-200 ${
                    inWishlist
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-foreground/60 hover:text-rose-500'
                  }`}
                />
              </motion.div>
            </button>

            {/* Action buttons overlay (Quick view / Edit / Delete) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
              {onQuickView && (
                <button
                  type="button"
                  className="p-2.5 bg-background/95 hover:bg-primary hover:text-primary-foreground text-foreground rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onQuickView(id)
                  }}
                  title="Xem nhanh"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  className="p-2.5 bg-background/95 hover:bg-primary hover:text-primary-foreground text-foreground rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onEdit(id)
                  }}
                  title="Sửa sản phẩm"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  className="p-2.5 bg-background/95 hover:bg-destructive hover:text-destructive-foreground text-foreground rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDelete(id)
                  }}
                  title="Xóa sản phẩm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground font-medium">{origin}</span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{rating}</span>
                  <span className="text-muted-foreground font-normal">({reviewsCount})</span>
                </div>
              </div>

              <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {name}
              </h3>

              {tasting ? (
                <p className="text-xs text-muted-foreground line-clamp-1 italic">
                  Nốt hương: {tasting}
                </p>
              ) : description ? (
                <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
              ) : null}
            </div>

            {/* Price & Add to Cart */}
            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <div>
                <span className="text-xs text-muted-foreground block font-medium">Giá bán</span>
                <p className="text-xl font-bold text-primary">{formatCurrencyVN(price)}</p>
              </div>

              <Button
                size="sm"
                variant={added ? 'accent' : 'default'}
                className="gap-2 transition-all duration-300"
                onClick={handleAddToCart}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Đã thêm
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-4 h-4" /> Thêm
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
