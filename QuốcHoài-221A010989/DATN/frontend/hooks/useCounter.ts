'use client'

import { useEffect, useRef, useState, RefObject } from 'react'

interface CounterOptions {
  from?: number
  to: number
  duration?: number
  easing?: (t: number) => number
  startOnView?: boolean
  viewRef?: RefObject<HTMLElement | null>
  decimals?: number
}

// Ease-out cubic
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Animated counter hook — counts from `from` to `to` over `duration` ms.
 * Can be triggered when element enters viewport via `startOnView`.
 */
export function useCounter({
  from = 0,
  to,
  duration = 2000,
  easing = easeOutCubic,
  startOnView = true,
  viewRef,
  decimals = 0,
}: CounterOptions) {
  const [count, setCount] = useState(from)
  const [hasStarted, setHasStarted] = useState(false)
  const rafRef = useRef<number | null>(null)

  // Intersection observer
  useEffect(() => {
    if (!startOnView || !viewRef?.current) {
      setHasStarted(true)
      return
    }
    const el = viewRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [startOnView, viewRef, hasStarted])

  // Run counter
  useEffect(() => {
    if (!hasStarted) return
    const startTime = performance.now()
    const range = to - from

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)
      const current = from + range * easedProgress
      const rounded = decimals > 0
        ? parseFloat(current.toFixed(decimals))
        : Math.round(current)
      setCount(rounded)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [hasStarted, from, to, duration, easing, decimals])

  return count
}

/**
 * Format a number with suffix (K, M) for display
 */
export function formatCount(n: number, suffix?: string): string {
  if (suffix) return `${n}${suffix}`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}
