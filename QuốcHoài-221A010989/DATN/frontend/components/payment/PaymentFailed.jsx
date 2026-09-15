'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode') || '';
  const reason = searchParams.get('reason') || 'Giao dịch bị hủy hoặc hết hạn thời gian chờ thanh toán.';

  return (
    <div className="container mx-auto max-w-xl px-4 py-12 flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-card border border-border p-8 rounded-3xl text-center space-y-6 shadow-xl"
      >
        <div className="w-20 h-20 bg-destructive/15 text-destructive rounded-full flex items-center justify-center mx-auto border border-destructive/30 shadow-lg">
          <AlertCircle className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-foreground">Thanh Toán Chưa Hoàn Tất</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{reason}</p>
        </div>

        {orderCode && (
          <div className="p-3 rounded-2xl bg-secondary/40 border border-border/80 text-xs font-mono text-muted-foreground inline-block">
            Mã đơn hàng liên quan: <strong className="text-foreground">{orderCode}</strong>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/checkout" className="flex-1">
            <button className="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" /> Thử thanh toán lại
            </button>
          </Link>

          <Link href="/cart" className="flex-1">
            <button className="w-full py-3 px-6 bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-sm rounded-xl border border-border transition-all flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Đổi phương thức
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
