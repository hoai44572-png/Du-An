'use client';

import React from 'react';

const commonEmojis = ['☕', '❤️', '👍', '😊', '🔥', '🎉', '🙏', '✨', '👌', '⭐'];

export interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  return (
    <div className="absolute bottom-14 right-4 z-50 bg-card border border-border/80 rounded-2xl p-2.5 shadow-2xl grid grid-cols-5 gap-1 text-lg">
      {commonEmojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => {
            onSelect(emoji);
            onClose();
          }}
          className="p-2 rounded-xl hover:bg-secondary transition-transform hover:scale-125"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
