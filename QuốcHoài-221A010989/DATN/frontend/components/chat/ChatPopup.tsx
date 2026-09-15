'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { useChat } from '@/hooks/useChat';

export interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPopup({ isOpen, onClose }: ChatPopupProps) {
  const { messages, activeConversation, sendMessage, sendTyping, isTyping } = useChat('conv-101', 'USER');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-96 h-[500px] bg-card border border-border/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
        >
          {/* Header */}
          <ChatHeader
            title={activeConversation?.assignedStaffName || 'Swift Coffee Support'}
            avatar={activeConversation?.assignedStaffAvatar}
            isOnline={activeConversation?.isOnline ?? true}
            onClose={onClose}
            onMinimize={onClose}
          />

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 custom-scrollbar bg-secondary/20">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} currentUserId="user-01" />
            ))}

            {isTyping && <TypingIndicator name={activeConversation?.assignedStaffName} />}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <ChatInput onSend={sendMessage} onTyping={sendTyping} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
