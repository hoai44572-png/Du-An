'use client';

import React from 'react';

export function RevenueBarChart() {
  const data = [
    { day: 'T2', amount: 14.2 },
    { day: 'T3', amount: 18.5 },
    { day: 'T4', amount: 16.0 },
    { day: 'T5', amount: 22.8 },
    { day: 'T6', amount: 29.4 },
    { day: 'T7', amount: 38.6 },
    { day: 'CN', amount: 35.1 },
  ];

  const max = Math.max(...data.map((d) => d.amount));

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-foreground/50 block">Doanh thu tuần này</span>
          <span className="text-xl font-bold text-foreground">174.600.000 đ</span>
        </div>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
          +14.8% vs tuần trước
        </span>
      </div>

      <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 border-b border-border/60">
        {data.map((item, idx) => {
          const heightPercent = (item.amount / max) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                {item.amount}tr
              </div>
              <div
                className="w-full max-w-[28px] bg-gradient-to-t from-primary to-accent rounded-t-xl group-hover:brightness-110 transition-all duration-300 shadow-sm"
                style={{ height: `${heightPercent}%` }}
              />
              <span className="text-[11px] font-medium text-foreground/60">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function OrdersLineChart() {
  const months = ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7'];
  const values = [420, 510, 680, 740, 890, 1150, 1420];
  const max = 1600;

  const points = values
    .map((val, i) => {
      const x = (i / (values.length - 1)) * 300 + 10;
      const y = 140 - (val / max) * 120;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-foreground/50 block">Đơn hàng theo tháng</span>
          <span className="text-xl font-bold text-foreground">1,420 Đơn</span>
        </div>
        <span className="text-xs font-bold text-sky-600 bg-sky-500/10 px-2.5 py-1 rounded-full">
          Tăng trưởng đều
        </span>
      </div>

      <div className="relative h-44 w-full">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 320 150">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="10" y1="20" x2="310" y2="20" stroke="currentColor" className="text-border/40" strokeDasharray="4" />
          <line x1="10" y1="80" x2="310" y2="80" stroke="currentColor" className="text-border/40" strokeDasharray="4" />
          <line x1="10" y1="140" x2="310" y2="140" stroke="currentColor" className="text-border/60" />

          {/* Area fill */}
          <polygon
            points={`10,140 ${points} 310,140`}
            fill="url(#lineGrad)"
          />

          {/* Polyline */}
          <polyline
            fill="none"
            stroke="oklch(0.35 0.1 45)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Data Points */}
          {values.map((val, i) => {
            const x = (i / (values.length - 1)) * 300 + 10;
            const y = 140 - (val / max) * 120;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                className="fill-background stroke-primary stroke-[3px] hover:r-6 transition-all"
              />
            );
          })}
        </svg>

        <div className="flex justify-between text-[11px] text-foreground/50 pt-2 px-1">
          {months.map((m, idx) => (
            <span key={idx}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
