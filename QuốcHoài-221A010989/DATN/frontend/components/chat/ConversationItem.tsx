'use client';

import React from 'react';
import { ChatConversation } from '@/lib/services/chatService';
import { NotificationBadge } from './NotificationBadge';

export interface ConversationItemProps {
  conversation: ChatConversation;
  isActive: boolean;
  onSelect: () => void;
  role?: 'USER' | 'ADMIN';
}

export function ConversationItem({ conversation, isActive, onSelect, role = 'ADMIN' }: ConversationItemProps) {
  const unread = role === 'ADMIN' ? conversation.unreadCountAdmin : conversation.unreadCountUser;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-left ${
        isActive
          ? 'bg-primary/10 border border-primary/30 text-foreground shadow-sm'
          : 'hover:bg-secondary/60 text-foreground/80'
      }`}
    >
      <div className="relative shrink-0">
        <img
          src={role === 'ADMIN' ? conversation.userAvatar : conversation.assignedStaffAvatar}
          alt={role === 'ADMIN' ? conversation.userName : conversation.assignedStaffName}
          className="w-11 h-11 rounded-2xl object-cover border border-border/60"
        />
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-card ${
            conversation.isOnline ? 'bg-emerald-500' : 'bg-gray-400'
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
            {role === 'ADMIN' ? conversation.userName : conversation.assignedStaffName}
          </h4>
          <span className="text-[10px] text-foreground/40 shrink-0">
            {conversation.lastMessageTime ? new Date(conversation.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-foreground/60 truncate pr-2">
            {conversation.isTyping ? <span className="text-primary italic font-semibold">Đang nhập...</span> : conversation.lastMessage}
          </p>
          <NotificationBadge count={unread} />
        </div>
      </div>
    </button>
  );
}
