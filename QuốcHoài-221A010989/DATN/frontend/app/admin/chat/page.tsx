'use client';

import React, { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { CustomerInfo } from '@/components/chat/CustomerInfo';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { CheckCircle2, Lock, RotateCcw } from 'lucide-react';

export default function AdminChatPage() {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    sendMessage,
    sendTyping,
    isTyping,
    closeConversation,
    openConversation,
    markRead,
    fetchConversations,
  } = useChat('conv-101', 'ADMIN');

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectConv = (conv: any) => {
    setActiveConversation(conv);
    markRead(conv.id);
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchConversations(status, searchQuery);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    fetchConversations(statusFilter, search);
  };

  return (
    <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
      <AdminBreadcrumb items={[{ label: 'Hỗ trợ khách hàng', href: '/admin/chat' }, { label: 'Khung Chat trực tuyến' }]} />

      {/* Main Admin Chat Container */}
      <div className="flex-1 bg-card border border-border/80 rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-0">
        {/* Left Conversation List Sidebar */}
        <ChatSidebar
          conversations={conversations}
          activeId={activeConversation?.id}
          onSelect={handleSelectConv}
          statusFilter={statusFilter}
          onStatusFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Center Active Chat Window */}
        <div className="flex-1 flex flex-col min-w-0 bg-secondary/10">
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="h-16 px-4 border-b border-border/60 flex items-center justify-between bg-card shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activeConversation.userAvatar}
                      alt={activeConversation.userName}
                      className="w-10 h-10 rounded-2xl object-cover border border-border/60"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-card ${
                        activeConversation.isOnline ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-tight">{activeConversation.userName}</h3>
                    <p className="text-[11px] text-foreground/50">{activeConversation.userEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeConversation.status === 'open' ? (
                    <button
                      onClick={() => closeConversation(activeConversation.id)}
                      className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground/70 flex items-center gap-1.5"
                      title="Đóng phiên hỗ trợ"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Đóng cuộc trò chuyện</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openConversation(activeConversation.id)}
                      className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-xs font-bold text-primary flex items-center gap-1.5"
                      title="Mở lại phiên hỗ trợ"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Mở lại trò chuyện</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-2 custom-scrollbar">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} currentUserId="staff-01" />
                ))}

                {isTyping && <TypingIndicator name={activeConversation.userName} />}
              </div>

              {/* Input Area */}
              <ChatInput onSend={sendMessage} onTyping={sendTyping} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-foreground/40 p-8">
              Vui lòng chọn một cuộc trò chuyện từ danh sách bên trái
            </div>
          )}
        </div>

        {/* Right Customer Info Panel */}
        <CustomerInfo conversation={activeConversation} />
      </div>
    </div>
  );
}
