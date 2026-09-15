'use client';

import React from 'react';

export function TypingIndicator({ name = 'Nhân viên' }: { name?: string }) {
  return (
    <div className="flex items-center gap-2 p-2 px-3 bg-secondary/60 rounded-2xl w-fit text-xs text-foreground/60">
      <span className="font-semibold">{name} đang nhập</span>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
      </div>
    </div>
  );
}
