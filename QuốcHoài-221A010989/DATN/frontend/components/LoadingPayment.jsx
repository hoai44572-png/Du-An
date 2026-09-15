import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function LoadingPayment({ message = 'Đang kết nối cổng thanh toán an toàn...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center bg-card border border-border rounded-3xl shadow-xl max-w-md mx-auto my-8">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin flex items-center justify-center" />
        <ShieldCheck className="w-7 h-7 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="space-y-2">
        <h3 className="font-serif font-bold text-lg text-foreground">{message}</h3>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          Vui lòng không đóng trình duyệt hoặc làm mới trang trong lúc giao dịch đang được khởi tạo.
        </p>
      </div>

      {/* Skeleton placeholders */}
      <div className="w-full space-y-2.5 pt-2">
        <div className="h-3 bg-secondary/80 rounded-full w-3/4 mx-auto animate-pulse" />
        <div className="h-3 bg-secondary/60 rounded-full w-1/2 mx-auto animate-pulse" />
      </div>
    </div>
  );
}

export function PaymentSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 animate-pulse">
      <div className="h-8 bg-secondary/60 rounded-xl w-1/3" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-48 bg-secondary/40 rounded-3xl" />
          <div className="h-64 bg-secondary/40 rounded-3xl" />
        </div>
        <div className="h-96 bg-secondary/40 rounded-3xl" />
      </div>
    </div>
  );
}
