'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

/* ── Types ── */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
  title?: string
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (opts: Omit<Toast, 'id'>) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

/* ── Single Toast Item ── */
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [exiting, setExiting] = useState(false)
  const duration = toast.duration ?? 4000
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleDismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => onDismiss(toast.id), 300)
  }, [toast.id, onDismiss])

  useEffect(() => {
    timerRef.current = setTimeout(handleDismiss, duration)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [duration, handleDismiss])

  const icons = {
    success: <CheckCircle className="w-4 h-4 flex-shrink-0" />,
    error:   <AlertCircle className="w-4 h-4 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 flex-shrink-0" />,
    info:    <Info className="w-4 h-4 flex-shrink-0" />,
  }

  /* Warm brand-aligned palette — no harsh system green/red */
  const styles = {
    success: {
      wrap:     'bg-[oklch(0.97_0.015_145)] border-[oklch(0.82_0.06_145)] text-[oklch(0.28_0.06_145)] border-l-[oklch(0.50_0.12_145)]',
      icon:     'text-[oklch(0.44_0.10_145)]',
      progress: 'bg-[oklch(0.50_0.12_145)]',
    },
    error: {
      wrap:     'bg-[oklch(0.97_0.012_22)] border-[oklch(0.84_0.06_22)] text-[oklch(0.30_0.08_22)] border-l-[oklch(0.52_0.18_22)]',
      icon:     'text-[oklch(0.50_0.18_22)]',
      progress: 'bg-[oklch(0.52_0.18_22)]',
    },
    warning: {
      wrap:     'bg-[oklch(0.98_0.018_70)] border-[oklch(0.88_0.07_70)] text-[oklch(0.30_0.06_60)] border-l-[oklch(0.62_0.14_70)]',
      icon:     'text-[oklch(0.58_0.14_70)]',
      progress: 'bg-[oklch(0.62_0.14_70)]',
    },
    info: {
      wrap:     'bg-[oklch(0.97_0.005_240)] border-[oklch(0.84_0.04_240)] text-[oklch(0.28_0.04_240)] border-l-[oklch(0.42_0.08_240)]',
      icon:     'text-[oklch(0.40_0.08_240)]',
      progress: 'bg-[oklch(0.42_0.08_240)]',
    },
  }

  const s = styles[toast.variant]

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`relative flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-l-4 px-4 py-3 shadow-md overflow-hidden transition-all duration-300 ${s.wrap} ${exiting ? 'animate-toast-out' : 'animate-toast-in'}`}
    >
      <span className={`mt-0.5 shrink-0 ${s.icon}`}>{icons[toast.variant]}</span>
      <div className="flex-1 min-w-0">
        {toast.title && <p className="font-semibold text-[13px] mb-0.5 leading-tight">{toast.title}</p>}
        <p className="text-[13px] leading-relaxed opacity-90">{toast.message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded hover:bg-black/8 transition-colors mt-0.5 opacity-60 hover:opacity-100"
        aria-label="Đóng thông báo"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-[2px] ${s.progress} origin-left animate-progress`}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  )
}

/* ── Provider ── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [{ ...opts, id }, ...prev].slice(0, 5))
  }, [])

  const toast = useCallback((opts: Omit<Toast, 'id'>) => addToast(opts), [addToast])
  const success = useCallback((message: string, title?: string) => addToast({ variant: 'success', message, title }), [addToast])
  const error   = useCallback((message: string, title?: string) => addToast({ variant: 'error',   message, title }), [addToast])
  const warning = useCallback((message: string, title?: string) => addToast({ variant: 'warning', message, title }), [addToast])
  const info    = useCallback((message: string, title?: string) => addToast({ variant: 'info',    message, title }), [addToast])

  return (
    <ToastContext.Provider value={{ toasts, toast, success, error, warning, info, dismiss }}>
      {children}
      {/* Toast container */}
      <div
        aria-label="Thông báo"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

/* ── Hook ── */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
