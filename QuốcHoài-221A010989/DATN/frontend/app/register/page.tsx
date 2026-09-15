import React from 'react';
import { Metadata } from 'next';
import { AuthCard } from '@/components/auth/AuthCard';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản - Swift Coffee Store',
  description: 'Đăng ký tài khoản thành viên Swift Coffee để tích điểm mua sắm và nhận ưu đãi độc quyền.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-24 pb-16">
      <AuthCard defaultTab="register" />
    </div>
  );
}
