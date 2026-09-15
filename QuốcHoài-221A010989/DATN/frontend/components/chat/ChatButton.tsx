'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChatPopup } from './ChatPopup';
import { NotificationBadge } from './NotificationBadge';
import { useChat } from '@/hooks/useChat';

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useChat('conv-101', 'USER');

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-2xl shadow-primary/40 hover:bg-primary/90 transition-all border border-white/20"
        >
          <div className="relative">
            {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
            {!isOpen && <NotificationBadge count={unreadCount} className="absolute -top-2 -right-2" />}
          </div>

          <span className="hidden sm:inline tracking-wide font-serif">Hỗ trợ trực tuyến</span>
        </motion.button>
      </motion.div>

      <ChatPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
