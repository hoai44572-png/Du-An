'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <AlertCircle className="w-5 h-5 text-sky-600 shrink-0" />,
  };

  const styles = {
    success: 'bg-emerald-50/95 border-emerald-200 text-emerald-950 shadow-emerald-500/10',
    error: 'bg-rose-50/95 border-rose-200 text-rose-950 shadow-rose-500/10',
    info: 'bg-sky-50/95 border-sky-200 text-sky-950 shadow-sky-500/10',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md max-w-md ${styles[type]}`}
      >
        {icons[type]}
        <p className="text-sm font-medium leading-snug flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-foreground/40 hover:text-foreground hover:bg-black/5 transition-colors"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
