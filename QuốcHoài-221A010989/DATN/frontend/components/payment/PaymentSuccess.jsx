'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShoppingBag, Coffee, ShieldCheck, Home } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode') || 'TT' + Math.floor(100000 + Math.random() * 900000);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Fetch chi tiết đơn hàng từ backend nếu có
    fetch(`http://localhost:5000/api/payment/status/${orderCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrderDetails(data);
      })
      .catch(() => {});
  }, [orderCode]);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-card border border-border p-8 rounded-3xl text-center space-y-6 shadow-xl"
      >
        {/* Animated Check Icon */}
        <div className="w-20 h-20 bg-accent/15 text-accent rounded-full flex items-center justify-center mx-auto border border-accent/30 shadow-lg animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-foreground">Thanh Toán Thành Công!</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Cảm ơn bạn đã tin tưởng Swift Coffee. Đơn hàng của bạn đã được tiếp nhận và nhân viên pha chế đang tiến hành chuẩn bị.
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="p-4 rounded-2xl bg-secondary/40 border border-border/80 text-xs space-y-2.5 max-w-md mx-auto text-left">
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Mã đơn hàng:</span>
            <span className="font-mono font-bold text-primary text-sm">{orderCode}</span>
          </div>

          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Phương thức thanh toán:</span>
            <span className="font-semibold text-foreground">
              {orderDetails?.paymentMethod || 'Chuyển khoản / COD'}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Trạng thái giao dịch:</span>
            <span className="font-bold text-accent px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20">
              ✔ Đã xác nhận (Paid)
            </span>
          </div>

          {orderDetails?.transactionId && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Mã giao dịch (TxnID):</span>
              <span className="font-mono font-semibold text-foreground">{orderDetails.transactionId}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/menu" className="flex-1 max-w-xs mx-auto sm:mx-0">
            <button className="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Tiếp tục mua sắm
            </button>
          </Link>

          <Link href="/" className="flex-1 max-w-xs mx-auto sm:mx-0">
            <button className="w-full py-3 px-6 bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-sm rounded-xl border border-border transition-all flex items-center justify-center gap-2">
              <Home className="w-4 h-4" /> Về Trang chủ
            </button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-2">
          <ShieldCheck className="w-4 h-4 text-accent" /> Email xác nhận kèm hóa đơn chi tiết đã được gửi cho bạn
        </div>
      </motion.div>
    </div>
  );
}
