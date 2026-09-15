'use client';

import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import PaymentFailedPage from '@/components/payment/PaymentFailed';

export default function AppPaymentFailedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="pt-28 md:pt-36 pb-16 flex-1 bg-background">
        <Suspense fallback={<div className="text-center py-20">Đang tải...</div>}>
          <PaymentFailedPage />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
