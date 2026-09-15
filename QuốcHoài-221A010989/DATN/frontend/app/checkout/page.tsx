'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import CheckoutPage from '@/components/payment/Checkout';

export default function AppCheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="pt-28 md:pt-36 pb-16 flex-1 bg-background">
        <CheckoutPage />
      </main>
      <Footer />
    </div>
  );
}
