'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Zap, ArrowRight } from 'lucide-react'
import { BrewingGuideCard as GuideCardType } from '@/types/brewing-guide'

interface Props {
  guide: GuideCardType
  index?: number
}

const getDifficultyBadge = (difficulty: string) => {
  switch (difficulty) {
    case 'Dễ':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    case 'Trung bình':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'Khó':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    default:
      return 'bg-secondary text-muted-foreground border-border'
  }
}

export function BrewingGuideCard({ guide, index = 0 }: Props) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link href={`/brewing-guide/${guide.id}`} className="block h-full">
        <div className="bg-card border border-border/80 hover:border-primary/40 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden bg-secondary/50 flex items-center justify-center shrink-0">
            {!imgError ? (
              <Image
                src={guide.image}
                alt={guide.title}
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-secondary to-muted text-5xl">
                ☕
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Card Content */}
          <div className="p-5 space-y-4 flex flex-col flex-1 justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 text-[11px] font-bold bg-primary/10 text-primary rounded-lg uppercase tracking-wider">
                  {guide.drinkType}
                </span>
                <span
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${getDifficultyBadge(
                    guide.difficulty
                  )}`}
                >
                  {guide.difficulty}
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {guide.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {guide.description}
              </p>
            </div>

            {/* Card Meta Footer */}
            <div className="space-y-3 border-t border-border/60 pt-3.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{guide.brewTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  <span>{guide.postedDate}</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-3 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 group-hover:gap-2.5 shadow-sm">
                Xem chi tiết
                <ArrowRight className="w-3.5 h-3.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
