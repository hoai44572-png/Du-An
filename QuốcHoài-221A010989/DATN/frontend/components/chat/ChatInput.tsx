'use client';

import React, { useState } from 'react';
import { Send, Smile, X } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';
import { AttachmentButton } from './AttachmentButton';

export interface ChatInputProps {
  onSend: (content: string, attachments: any[]) => void;
  onTyping?: (isTyping: boolean) => void;
}

export function ChatInput({ onSend, onTyping }: ChatInputProps) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim() && attachments.length === 0) return;
    onSend(text, attachments);
    setText('');
    setAttachments([]);
    setShowEmoji(false);
    onTyping?.(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (onTyping) {
      onTyping(e.target.value.length > 0);
    }
  };

  return (
    <div className="p-3 bg-card border-t border-border/80 relative rounded-b-3xl">
      {showEmoji && (
        <EmojiPicker
          onSelect={(emoji) => setText((prev) => prev + emoji)}
          onClose={() => setShowEmoji(false)}
        />
      )}

      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 p-2 bg-secondary/50 rounded-xl overflow-x-auto">
          {attachments.map((att, i) => (
            <div key={i} className="relative group shrink-0">
              {att.type === 'image' ? (
                <img src={att.url} alt={att.name} className="w-12 h-12 rounded-lg object-cover border" />
              ) : (
                <div className="p-2 bg-card rounded-lg text-[10px] font-semibold truncate max-w-[100px]">
                  {att.name}
                </div>
              )}
              <button
                type="button"
                onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                className="absolute -top-1.5 -right-1.5 bg-destructive text-white p-0.5 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <AttachmentButton onAttach={(att) => setAttachments([...attachments, att])} />

        <button
          type="button"
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-2 rounded-xl text-foreground/50 hover:text-amber-500 hover:bg-secondary transition-colors"
          title="Thêm biểu tượng cảm xúc"
        >
          <Smile className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3.5 py-2 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() && attachments.length === 0}
          className="p-2.5 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-primary/20 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
