'use client';

import React from 'react';
import { Check, CheckCheck, FileText } from 'lucide-react';
import { ChatMessageItem } from '@/lib/services/chatService';

export interface MessageBubbleProps {
  message: ChatMessageItem;
  isSelf: boolean;
}

export function MessageBubble({ message, isSelf }: MessageBubbleProps) {
  const formatTime = (timeStr: string) => {
    try {
      return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  return (
    <div className={`flex flex-col max-w-[75%] space-y-1 ${isSelf ? 'items-end' : 'items-start'}`}>
      <div
        className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
          isSelf
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card border border-border/80 text-foreground rounded-bl-none'
        }`}
      >
        {message.content && <p>{message.content}</p>}

        {message.attachments && message.attachments.length > 0 && (
          <div className="space-y-1.5 mt-2">
            {message.attachments.map((att, i) =>
              att.type === 'image' ? (
                <img
                  key={i}
                  src={att.url}
                  alt={att.name}
                  className="w-full max-w-xs rounded-xl object-cover border border-black/10 shadow-sm"
                />
              ) : (
                <div key={i} className="flex items-center gap-2 p-2 bg-black/10 rounded-xl">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate text-xs font-semibold">{att.name}</span>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 text-[10px] text-foreground/40 px-1">
        <span>{formatTime(message.createdAt)}</span>
        {isSelf && (
          <span>
            {message.isRead ? <CheckCheck className="w-3.5 h-3.5 text-primary" /> : <Check className="w-3.5 h-3.5" />}
          </span>
        )}
      </div>
    </div>
  );
}

export function ChatMessage({ message, currentUserId = 'user-01' }: { message: ChatMessageItem; currentUserId?: string }) {
  const isSelf = message.senderId === currentUserId || message.senderRole === 'USER';

  return (
    <div className={`flex items-end gap-2.5 my-2 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isSelf && (
        <img
          src={message.senderAvatar}
          alt={message.senderName}
          className="w-7 h-7 rounded-full object-cover shrink-0 border border-border/60 shadow-sm"
        />
      )}
      <MessageBubble message={message} isSelf={isSelf} />
    </div>
  );
}
