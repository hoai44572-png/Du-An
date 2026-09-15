'use client';

import React from 'react';

export interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({ count, className = '' }: NotificationBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={`inline-flex items-center justify-center font-bold text-[10px] text-white bg-destructive rounded-full px-1.5 py-0.5 shadow-sm animate-pulse ${className}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
