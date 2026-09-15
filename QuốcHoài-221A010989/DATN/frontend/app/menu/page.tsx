'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import { Filter, Plus, X, Search, AlertTriangle } from 'lucide-react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/ui/toast'

interface Product {
  id: number
  name: string
  origin: string
  price: number
  category: string
  tasting: string
  image: string
  rating?: number
  reviewsCount?: number
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Cà Phê Rang Xay Alambé',
    origin: 'Việt Nam',
    price: 250000,
    category: 'Rang vừa',
    tasting: 'Thơm dịu, Đậm đà, Mịn màng',
    image: '/products/SanPham-1.webp',
    rating: 4.7,
    reviewsCount: 38,
  },
  {
    id: 2,
    name: 'Cà phê Rang Xay Culi Highlands Coffee 200g',
    origin: 'Đắk Lắk',
    price: 290000,
    category: 'Rang đậm',
    tasting: 'Mạnh mẽ, Socola đen, Đất',
    image: '/products/SanPham-2.webp',
    rating: 4.8,
    reviewsCount: 92,
  },
  {
    id: 3,
    name: 'Cà phê rang ESPRESSO BLEND',
    origin: 'Việt Nam',
    price: 200000,
    category: 'Rang đậm',
    tasting: 'Espresso, Đậm, Caramel',
    image: '/products/SanPham-3.webp',
    rating: 4.6,
    reviewsCount: 55,
  },
  {
    id: 4,
    name: 'Cà phê rang xay GO! túi 400g',
    origin: 'Việt Nam',
    price: 390000,
    category: 'Rang vừa',
    tasting: 'Thơm nhẹ, Cân bằng, Trái cây',
    image: '/products/SanPham-4.webp',
    rating: 4.5,
    reviewsCount: 27,
  },
  {
    id: 5,
    name: 'Cà Phê rang xay đặc biệt',
    origin: 'Việt Nam',
    price: 400000,
    category: 'Rang vừa',
    tasting: 'Hoa, Ngọt dịu, Phức hợp',
    image: '/products/SanPham-5.webp',
    rating: 4.9,
    reviewsCount: 61,
  },
  {
    id: 6,
    name: 'Cà Phê Rang Xay Nguyên Chất',
    origin: 'Đắk Nông',
    price: 3650000,
    category: 'Rang nhạt',
    tasting: 'Cao cấp, Tinh tế, Hương hoa đặc biệt',
    image: '/products/SanPham-6.webp',
    rating: 5.0,
    reviewsCount: 14,
  },
  {
    id: 7,
    name: 'Cà phê rang xay Robusta Lover',
    origin: 'Việt Nam',
    price: 280000,
    category: 'Rang đậm',
    tasting: 'Robusta thuần, Nồng, Hậu vị dài',
    image: '/products/SanPham-7.webp',
    rating: 4.7,
    reviewsCount: 83,
  },
  {
    id: 8,
    name: 'Cà phê Blended số 7 rang mộc nguyên chất 500 gram',
    origin: 'Việt Nam',
    price: 390000,
    category: 'Rang vừa',
    tasting: 'Mộc tự nhiên, Đậm vừa, Hài hoà',
    image: '/products/SanPham-8.webp',
    rating: 4.8,
    reviewsCount: 47,
  },
  {
    id: 9,
    name: 'Cà Phê Rang Mộc Chuyên Biệt',
    origin: 'Cầu Đất',
    price: 310000,
    category: 'Rang nhạt',
    tasting: 'Nhẹ thanh, Chua dịu, Thơm lâu',
    image: '/products/SanPham-9.webp',
    rating: 4.7,
    reviewsCount: 33,
  },
  {
    id: 10,
    name: 'Cà phê rang xay cao cấp GO! túi 200g',
    origin: 'Việt Nam',
    price: 345000,
    category: 'Rang vừa',
    tasting: 'Cao cấp, Mềm mại, Dịu ngọt',
    image: '/products/SanPham-10.webp',
    rating: 4.6,
    reviewsCount: 19,
  },
  {
    id: 11,
    name: 'Cà phê rang xay black K-Coffee túi 454g',
    origin: 'Việt Nam',
    price: 290000,
    category: 'Rang đậm',
    tasting: 'Đen đậm, Mạnh, Socola đắng',
    image: '/products/SanPham-11.jpg',
    rating: 4.8,
    reviewsCount: 76,
  },
  {
    id: 12,
    name: 'Cà Phê Rang Xay Expert Blend 2 KING COFFEE - Túi 500g',
    origin: 'Việt Nam',
    price: 410000,
    category: 'Rang đậm',
    tasting: 'Expert blend, Đậm đà, Caramel, Hạt dẻ',
    image: '/products/SanPham-12.webp',
    rating: 4.9,
    reviewsCount: 105,
  },
]
const CATEGORIES = ['Tất cả', 'Rang nhạt', 'Rang vừa', 'Rang đậm']

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Custom Delete Confirm Modal State (replaces window.confirm)
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null)

  // Form States
  const [name, setName] = useState('')
  const [origin, setOrigin] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Rang nhạt')
  const [tasting, setTasting] = useState('')
  const [formError, setFormError] = useState('')

  const { success, error, info } = useToast()

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'Tất cả' || p.category === selectedCategory
      const matchSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tasting.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [products, selectedCategory, searchQuery])

  // ESC Key listener to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
        setDeletingProductId(null)
      }
    },
    []
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Try fetching products from backend API when available
  useEffect(() => {
    let isMounted = true
    async function loadProducts() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const res = await fetch(`${baseUrl}/products`)
        if (res.ok) {
          const data = await res.json()
          if (data.success && Array.isArray(data.products) && data.products.length > 0 && isMounted) {
            const mapped: Product[] = data.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              origin: p.origin || 'Việt Nam',
              price: p.price,
              category: p.category?.name || 'Rang vừa',
              tasting: p.tasting || 'Đậm đà, Thơm nồng',
              image: p.image || '/products/SanPham-1.webp',
              rating: p.rating || 4.8,
              reviewsCount: p.reviewsCount || p.sold || 42,
            }))
            setProducts(mapped)
          }
        }
      } catch (err) {
        // Fallback to static INITIAL_PRODUCTS
      }
    }
    loadProducts()
    return () => { isMounted = false }
  }, [])

  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setName('')
    setOrigin('')
    setPrice('')
    setCategory('Rang nhạt')
    setTasting('')
    setFormError('')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (id: number) => {
    const prod = products.find((p) => p.id === id)
    if (!prod) return
    setEditingProduct(prod)
    setName(prod.name)
    setOrigin(prod.origin)
    setPrice(prod.price.toString())
    setCategory(prod.category)
    setTasting(prod.tasting)
    setFormError('')
    setIsModalOpen(true)
  }

  const handleDeleteRequest = (id: number) => {
    setDeletingProductId(id)
  }

  const confirmDeleteProduct = () => {
    if (deletingProductId === null) return
    const prod = products.find((p) => p.id === deletingProductId)
    setProducts((prev) => prev.filter((p) => p.id !== deletingProductId))
    setDeletingProductId(null)
    if (prod) {
      info(`Đã xóa sản phẩm "${prod.name}"`)
    }
  }

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !origin.trim() || !price) {
      setFormError('Vui lòng điền đầy đủ các thông tin bắt buộc')
      return
    }

    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Giá sản phẩm phải là một số lớn hơn 0')
      return
    }

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, name, origin, price: parsedPrice, category, tasting }
            : p
        )
      )
      success(`Cập nhật sản phẩm "${name}" thành công`)
    } else {
      const newProduct: Product = {
        id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        name,
        origin,
        price: parsedPrice,
        category,
        tasting,
        image: '/products/colombian-reserve.png',
        rating: 5.0,
        reviewsCount: 1,
      }
      setProducts((prev) => [newProduct, ...prev])
      success(`Đã thêm sản phẩm mới "${name}"`)
    }
    setIsModalOpen(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Page Header */}
      <section className="pt-32 md:pt-40 pb-12 px-4 bg-gradient-to-b from-background via-secondary/40 to-secondary">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <span className="text-accent uppercase text-xs font-bold tracking-widest px-3 py-1 bg-accent/10 rounded-full">
                Bộ sưu tập Đặc Biệt
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                Menu Cà Phê Chuyên Biệt
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                Khám phá bộ sưu tập hạt cà phê nguyên chất được thu hoạch từ những nông trại cao nguyên danh tiếng nhất.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                variant="glow"
                size="lg"
                onClick={handleOpenAddModal}
                className="gap-2 font-bold shrink-0"
              >
                <Plus className="w-5 h-5" /> Thêm sản phẩm
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-12 md:py-16 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          {/* Search & Filter Top Bar */}
          <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-secondary/30 p-4 rounded-2xl border border-border/60">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên, nguồn gốc hoặc hương vị..."
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                      : 'bg-background hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-secondary/20 rounded-3xl border border-dashed border-border/80"
            >
              <span className="text-5xl block mb-3">🔍</span>
              <h3 className="text-xl font-serif font-bold text-foreground">Không tìm thấy sản phẩm nào</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục rang khác.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory('Tất cả')
                  setSearchQuery('')
                }}
              >
                Xóa bộ lọc
              </Button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                  >
                    <ProductCard
                      {...product}
                      onEdit={handleOpenEditModal}
                      onDelete={handleDeleteRequest}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-2xl font-bold mb-6 text-foreground">
                {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>

              {formError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold rounded-xl animate-shake">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="text-xs font-bold mb-1.5 block text-foreground/80">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Cà phê Robusta Đắk Lắk"
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold mb-1.5 block text-foreground/80">Nguồn gốc / Quốc gia *</label>
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Ví dụ: Việt Nam"
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold mb-1.5 block text-foreground/80">Giá ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="15.99"
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold mb-1.5 block text-foreground/80">Mức độ rang *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow cursor-pointer"
                    >
                      <option value="Rang nhạt">Rang nhạt</option>
                      <option value="Rang vừa">Rang vừa</option>
                      <option value="Rang đậm">Rang đậm</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold mb-1.5 block text-foreground/80">Hương vị / Ghi chú</label>
                  <input
                    type="text"
                    value={tasting}
                    onChange={(e) => setTasting(e.target.value)}
                    placeholder="Ví dụ: Đậm đà, Socola, Hạt dẻ"
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" variant="default" className="flex-1 font-bold">
                    {editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal (Custom replacement for window.confirm) */}
      <AnimatePresence>
        {deletingProductId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingProductId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-border rounded-3xl max-w-sm w-full p-6 shadow-2xl relative z-10 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-destructive/15 text-destructive rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-xl font-serif font-bold text-foreground">Xác nhận xóa</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh mục không? Hành động này không thể hoàn tác.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeletingProductId(null)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 font-bold"
                  onClick={confirmDeleteProduct}
                >
                  Đồng ý Xóa
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
