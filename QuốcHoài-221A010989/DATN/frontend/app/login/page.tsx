import React from 'react';
import { Metadata } from 'next';
import { AuthCard } from '@/components/auth/AuthCard';

export const metadata: Metadata = {
  title: 'Đăng nhập - Swift Coffee Store',
  description: 'Đăng nhập vào tài khoản Swift Coffee để nhận nhiều ưu đãi và trải nghiệm cà phê thượng hạng.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-24 pb-16">
      <AuthCard defaultTab="login" />
    </div>
  );
}
