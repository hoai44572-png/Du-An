'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, BookOpen } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BrewingGuideCard } from '@/components/brewing-guide/BrewingGuideCard'
import { BREWING_GUIDES, DRINK_TYPES } from '@/lib/brewing-guides-data'

const ITEMS_PER_PAGE = 6

export default function BrewingGuidePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('Tất cả')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and search
  const filteredGuides = useMemo(() => {
    let result = BREWING_GUIDES

    // Filter by type
    if (selectedType !== 'Tất cả') {
      result = result.filter((guide) => guide.drinkType === selectedType)
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (guide) =>
          guide.title.toLowerCase().includes(query) ||
          guide.description.toLowerCase().includes(query)
      )
    }

    return result
  }, [searchQuery, selectedType])

  // Pagination
  const totalPages = Math.ceil(filteredGuides.length / ITEMS_PER_PAGE)
  const paginatedGuides = filteredGuides.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="pt-28 md:pt-36 pb-16 flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-background via-secondary/40 to-secondary text-center">
          <div className="container mx-auto max-w-4xl space-y-4">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-accent uppercase text-xs font-bold tracking-widest px-3 py-1 bg-accent/10 rounded-full inline-block"
            >
              Cẩm nang Barista
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-serif font-bold text-foreground"
            >
              Hướng Dẫn Pha Chế Cà Phê
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Khám phá các bí quyết pha chế tinh tế từ những Barista hàng đầu. Từ Pour Over, Espresso cho tới Cold Brew chuẩn vị.
            </motion.p>
          </div>
        </section>

        {/* Search and Filter Bar */}
        <section className="py-6 px-4 bg-background border-b border-border/80 sticky top-14 md:top-18 z-30 backdrop-blur-md">
          <div className="container mx-auto max-w-5xl space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm công thức, dụng cụ pha..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mr-1">
                <Filter className="w-3.5 h-3.5" /> Phân loại:
              </span>
              {['Tất cả', ...DRINK_TYPES].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type)
                    setCurrentPage(1)
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                      : 'bg-secondary hover:bg-secondary/80 text-muted-foreground border border-border/50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto max-w-5xl space-y-8">
            <p className="text-xs text-muted-foreground font-medium">
              Hiển thị {filteredGuides.length} bài hướng dẫn chi tiết
            </p>

            {paginatedGuides.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedGuides.map((guide, idx) => (
                    <BrewingGuideCard key={guide.id} guide={guide} index={idx} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentPage === page
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-secondary/20 rounded-3xl border border-dashed border-border">
                <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-base text-muted-foreground font-medium">
                  Không tìm thấy bài hướng dẫn nào phù hợp.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
