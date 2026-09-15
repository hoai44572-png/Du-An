'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coffee, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { authStorage } from '@/lib/auth';

export interface AuthCardProps {
  defaultTab?: 'login' | 'register';
  onTabChange?: (tab: 'login' | 'register') => void;
}

export function AuthCard({ defaultTab = 'login', onTabChange }: AuthCardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);

  useEffect(() => {
    if (authStorage.isAuthenticated()) {
      const u = authStorage.getUser();
      if (u?.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    }
  }, [router]);

  const handleTabSwitch = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[460px] mx-auto bg-white border border-[#E8E2D8] rounded-[28px] p-6 sm:p-8 shadow-xl shadow-[#1F120A]/5 space-y-5 relative overflow-hidden"
    >
      {/* Top Header & Logo */}
      <div className="text-center space-y-2 relative z-10">
        <Link href="/" className="inline-flex items-center justify-center gap-2.5 group mb-0.5">
          <motion.div
            className="w-11 h-11 bg-[#3C1B0C] rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#3C1B0C]/20"
            whileHover={{ rotate: -4, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Coffee className="w-5.5 h-5.5 text-white" />
          </motion.div>
          <span className="text-2xl font-serif font-bold text-[#2B160C] tracking-tight group-hover:text-[#3C1505] transition-colors">
            Swift Coffee
          </span>
        </Link>

        <div>
          <h1 className="text-2xl font-extrabold text-[#1F120A] tracking-tight">
            {activeTab === 'login' ? 'Chào mừng bạn trở lại!' : 'Tham gia cùng Swift Coffee'}
          </h1>
          <p className="text-xs sm:text-sm text-[#7D7068] mt-1 font-medium leading-relaxed">
            {activeTab === 'login'
              ? 'Đăng nhập để trải nghiệm hương vị cà phê thượng hạng & ưu đãi'
              : 'Tạo tài khoản mới trong vài giây để nhận quà tặng thành viên'}
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="bg-[#F6F3EE] p-1.5 rounded-2xl flex items-center gap-1.5 border border-[#E8E2D8] relative z-10">
        <button
          type="button"
          onClick={() => handleTabSwitch('login')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center gap-2 ${
            activeTab === 'login' ? 'text-[#3C1505]' : 'text-[#8C7E75] hover:text-[#3C1505]'
          }`}
        >
          <Lock className={`w-4 h-4 ${activeTab === 'login' ? 'text-[#3C1505]' : 'text-[#8C7E75]'}`} />
          <span>Đăng nhập</span>
          {activeTab === 'login' && (
            <motion.div
              layoutId="auth-tab-indicator"
              className="absolute inset-0 bg-white rounded-xl shadow-sm -z-10 border border-[#E2DBD0]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch('register')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center gap-2 ${
            activeTab === 'register' ? 'text-[#3C1505]' : 'text-[#8C7E75] hover:text-[#3C1505]'
          }`}
        >
          <UserPlus className={`w-4 h-4 ${activeTab === 'register' ? 'text-[#3C1505]' : 'text-[#8C7E75]'}`} />
          <span>Đăng ký</span>
          {activeTab === 'register' && (
            <motion.div
              layoutId="auth-tab-indicator"
              className="absolute inset-0 bg-white rounded-xl shadow-sm -z-10 border border-[#E2DBD0]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
        </button>
      </div>

      {/* Form Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'login' ? (
            <motion.div
              key="login-tab"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
            >
              <LoginForm />
            </motion.div>
          ) : (
            <motion.div
              key="register-tab"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <RegisterForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Back Link */}
      <div className="text-center pt-2 border-t border-[#E8E2D8] relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C7E75] hover:text-[#3C1505] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại trang chủ Swift Coffee
        </Link>
      </div>
    </motion.div>
  );
}
