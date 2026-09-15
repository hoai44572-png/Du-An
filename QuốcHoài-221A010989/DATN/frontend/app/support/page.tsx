'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useChat } from '@/hooks/useChat';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { Phone, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  const { messages, activeConversation, sendMessage, sendTyping, isTyping } = useChat('conv-101', 'USER');

  const faqs = [
    { q: 'Phí giao hàng của Swift Coffee tính thế nào?', a: 'Swift Coffee đồng giá phí giao hàng 20.000đ cho tất cả các quận nội thành. Miễn phí giao cho đơn trên 200.000đ!' },
    { q: 'Thời gian giao hàng hoả tốc là bao lâu?', a: 'Cửa hàng sẽ pha chế tươi mới và giao hàng tận nơi trong vòng 30 - 45 phút.' },
    { q: 'Tôi có thể thay đổi mức đường/đá không?', a: 'Dạ hoàn toàn được ạ! Quý khách có thể ghi chú mức đường/đá khi chọn mua sản phẩm.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-secondary/20 to-background">
      <Header />
      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Title */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              Trung Tâm Hỗ Trợ Khách Hàng
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Chúng Tôi Có Thể Giúp Gì Cho Bạn?
            </h1>
            <p className="text-sm text-foreground/60 max-w-xl mx-auto">
              Đội ngũ tư vấn viên Swift Coffee sẵn sàng giải đáp thắc mắc và hỗ trợ bạn trong vài giây.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Support Chat Box */}
            <div className="lg:col-span-2 bg-card border border-border/80 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[560px]">
              <ChatHeader
                title={activeConversation?.assignedStaffName || 'Swift Coffee Support'}
                avatar={activeConversation?.assignedStaffAvatar}
                isOnline={activeConversation?.isOnline ?? true}
              />

              <div className="flex-1 p-4 overflow-y-auto space-y-2 custom-scrollbar bg-secondary/10">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} currentUserId="user-01" />
                ))}

                {isTyping && <TypingIndicator name={activeConversation?.assignedStaffName} />}
              </div>

              <ChatInput onSend={sendMessage} onTyping={sendTyping} />
            </div>

            {/* Right Info & FAQ Sidebar */}
            <div className="space-y-6">
              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <span>Câu hỏi thường gặp</span>
                </h3>

                <div className="space-y-3 text-xs">
                  {faqs.map((f, i) => (
                    <div key={i} className="space-y-1 p-3 rounded-2xl bg-secondary/40">
                      <p className="font-bold text-foreground">{f.q}</p>
                      <p className="text-foreground/60 leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-6 text-primary-foreground shadow-lg space-y-3">
                <h4 className="font-bold text-sm">Cần hỗ trợ gấp qua điện thoại?</h4>
                <p className="text-xs opacity-90">Tổng đài chăm sóc khách hàng phục vụ 24/7</p>
                <div className="flex items-center gap-2 text-base font-bold pt-1">
                  <Phone className="w-5 h-5" />
                  <span>Hotline: 1900 6868</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
