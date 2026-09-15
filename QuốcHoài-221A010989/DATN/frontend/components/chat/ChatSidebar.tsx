'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { ConversationItem } from './ConversationItem';
import { ChatConversation } from '@/lib/services/chatService';

export interface ChatSidebarProps {
  conversations: ChatConversation[];
  activeId?: string;
  onSelect: (conv: ChatConversation) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
}: ChatSidebarProps) {
  return (
    <div className="w-full lg:w-80 bg-card border-r border-border/80 flex flex-col h-full shrink-0">
      {/* Header & Search */}
      <div className="p-4 border-b border-border/60 space-y-3">
        <h3 className="text-base font-serif font-bold text-foreground">Hội Thoại Khách Hàng</h3>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Tìm tin nhắn, tên khách hàng..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-secondary/50 border border-border/60 text-xs text-foreground focus:outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-semibold">
          {[
            { key: 'ALL', label: 'Tất cả' },
            { key: 'open', label: 'Đang mở' },
            { key: 'completed', label: 'Đã hoàn thành' },
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => onStatusFilterChange(st.key)}
              className={`px-2.5 py-1 rounded-lg transition-colors shrink-0 ${
                statusFilter === st.key ? 'bg-primary text-primary-foreground font-bold' : 'text-foreground/60 hover:bg-secondary'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-foreground/40">Không tìm thấy cuộc trò chuyện nào</div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={activeId === conv.id}
              onSelect={() => onSelect(conv)}
              role="ADMIN"
            />
          ))
        )}
      </div>
    </div>
  );
}
