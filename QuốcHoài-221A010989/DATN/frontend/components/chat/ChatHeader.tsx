'use client';

import React from 'react';
import { X, Minus, Coffee } from 'lucide-react';

export interface ChatHeaderProps {
  title?: string;
  avatar?: string;
  isOnline?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
}

export function ChatHeader({
  title = 'Swift Coffee Support',
  avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  isOnline = true,
  onClose,
  onMinimize,
}: ChatHeaderProps) {
  return (
    <div className="h-16 px-4 bg-primary text-primary-foreground flex items-center justify-between shadow-md shrink-0 rounded-t-3xl">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={avatar} alt={title} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30" />
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-primary ${
              isOnline ? 'bg-emerald-400' : 'bg-gray-400'
            }`}
          />
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-bold truncate leading-snug">{title}</h4>
          <span className="text-[10px] opacity-80 block">{isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="p-1.5 rounded-xl hover:bg-white/10 transition-colors"
            title="Thu nhỏ"
          >
            <Minus className="w-4 h-4" />
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
