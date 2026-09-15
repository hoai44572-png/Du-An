'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ChefHat, Lightbulb, ArrowLeft, BookOpen } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { getGuideById, BREWING_GUIDES } from '@/lib/brewing-guides-data'

interface PageProps {
  params: Promise<{ id: string }>
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default async function BrewingGuideDetailPage({ params }: PageProps) {
  const { id } = await params
  const guide = getGuideById(id)

  if (!guide) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-12 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
              Hướng dẫn không tìm thấy
            </h1>
            <Link href="/brewing-guide">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Get related guides
  const relatedGuides = BREWING_GUIDES.filter((g) => guide.relatedGuides.includes(g.id)).slice(0, 3)

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 pb-12">
        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-96 md:h-96 w-full overflow-hidden"
        >
          <Image
            src={guide.image}
            alt={guide.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-12 md:py-16 px-4"
        >
          <div className="container mx-auto max-w-3xl">
            {/* Header */}
            <motion.div variants={itemVariants} className="space-y-4 mb-8">
              <Link href="/brewing-guide" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium">
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Link>

              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                {guide.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {guide.drinkType}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {guide.brewTime}
                </span>
                <span className={`px-3 py-1 rounded-full font-medium ${
                  guide.difficulty === 'Dễ'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : guide.difficulty === 'Trung bình'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {guide.difficulty}
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p variants={itemVariants} className="text-lg text-foreground/80 mb-12 leading-relaxed">
              {guide.description}
            </motion.p>

            {/* Ingredients Section */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-primary" />
                Nguyên liệu
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guide.ingredients.map((ingredient, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="p-4 bg-secondary rounded-lg border border-border"
                  >
                    <p className="font-semibold text-foreground">{ingredient.name}</p>
                    <p className="text-sm text-foreground/60">{ingredient.amount}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Tools Section */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Dụng cụ cần thiết</h2>
              <div className="space-y-4">
                {guide.tools.map((tool, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="p-4 bg-secondary rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <p className="font-semibold text-foreground">{tool.name}</p>
                    {tool.description && (
                      <p className="text-sm text-foreground/60 mt-1">{tool.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Steps Section */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Các bước thực hiện</h2>
              <div className="space-y-8">
                {guide.steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="border-l-4 border-primary pl-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-foreground/80 mb-4 leading-relaxed">{step.description}</p>
                    {step.tips && step.tips.length > 0 && (
                      <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Mẹo:
                        </p>
                        <ul className="space-y-2">
                          {step.tips.map((tip, tipIdx) => (
                            <li key={tipIdx} className="text-sm text-amber-800 dark:text-amber-200 flex gap-2">
                              <span className="text-amber-600">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Video Section */}
            {guide.videoUrl && (
              <motion.section variants={itemVariants} className="mb-12">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Video hướng dẫn</h2>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border shadow-lg">
                  <iframe
                    width="100%"
                    height="100%"
                    src={guide.videoUrl}
                    title={guide.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  />
                </div>
              </motion.section>
            )}

            {/* Tips Section */}
            {guide.tips && guide.tips.length > 0 && (
              <motion.section variants={itemVariants} className="mb-12">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  Mẹo pha chế
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guide.tips.map((tip, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className="p-4 bg-primary/10 rounded-lg border border-primary/20"
                    >
                      <p className="text-foreground/80">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Related Guides */}
            {relatedGuides.length > 0 && (
              <motion.section variants={itemVariants} className="mt-16 pt-12 border-t border-border">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Các bài hướng dẫn liên quan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedGuides.map((relatedGuide) => (
                    <Link key={relatedGuide.id} href={`/brewing-guide/${relatedGuide.id}`}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow h-full"
                      >
                        <div className="relative h-40 overflow-hidden">
                          <Image
                            src={relatedGuide.image}
                            alt={relatedGuide.title}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                            {relatedGuide.title}
                          </h3>
                          <p className="text-xs text-foreground/60">{relatedGuide.drinkType}</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  )
}
