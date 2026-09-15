'use client';

import React from 'react';
import { User, Mail, Phone, ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import { ChatConversation } from '@/lib/services/chatService';

export function CustomerInfo({ conversation }: { conversation: ChatConversation | null }) {
  if (!conversation) return null;

  return (
    <div className="p-4 bg-card border-l border-border/80 w-72 shrink-0 hidden lg:block space-y-6">
      <div className="text-center space-y-2">
        <img
          src={conversation.userAvatar}
          alt={conversation.userName}
          className="w-16 h-16 rounded-2xl object-cover mx-auto ring-4 ring-primary/20"
        />
        <h3 className="text-sm font-bold text-foreground">{conversation.userName}</h3>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${conversation.isOnline ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-200 text-gray-600'}`}>
          {conversation.isOnline ? 'Đang Online' : 'Offline'}
        </span>
      </div>

      <div className="space-y-3 text-xs border-t border-border/60 pt-4">
        <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px] text-foreground/50">Chi tiết thông tin</h4>

        <div className="flex items-center gap-2 text-foreground/70">
          <Mail className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">{conversation.userEmail}</span>
        </div>

        <div className="flex items-center gap-2 text-foreground/70">
          <Phone className="w-4 h-4 text-primary shrink-0" />
          <span>{conversation.userPhone}</span>
        </div>

        <div className="flex items-center gap-2 text-foreground/70">
          <Clock className="w-4 h-4 text-primary shrink-0" />
          <span>Bắt đầu: {new Date(conversation.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="p-3 bg-secondary/40 rounded-2xl border border-border/60 space-y-2 text-xs">
        <h4 className="font-bold text-foreground">Trạng thái hỗ trợ</h4>
        <div className="flex items-center justify-between">
          <span className="text-foreground/60">Phiên chat:</span>
          <span className={`font-bold capitalize ${conversation.status === 'open' ? 'text-emerald-600' : 'text-gray-500'}`}>
            {conversation.status === 'open' ? 'Đang mở' : 'Đã đóng'}
          </span>
        </div>
      </div>
    </div>
  );
}
