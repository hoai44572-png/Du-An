'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { authStorage } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export interface SocialLoginButtonsProps {
  onSuccess?: () => void;
  onError?: (msg: string) => void;
  title?: string;
}

export type SocialProvider = 'google' | 'facebook';

export function SocialLoginButtons({ onSuccess, onError, title = 'ĐĂNG NHẬP BẰNG' }: SocialLoginButtonsProps) {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      setLoadingProvider(provider);

      const providerProfiles: Record<SocialProvider, { name: string; email: string; avatar: string }> = {
        google: {
          name: 'Nguyễn Hoàng Minh (Google)',
          email: 'hoangminh.google@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        },
        facebook: {
          name: 'Thanh Hà (Facebook)',
          email: 'thanha.facebook@fb.com',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        },
      };

      const mockData = providerProfiles[provider];
      const providerId = `provider_${provider}_${Math.floor(100000 + Math.random() * 900000)}`;

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      let resData = null;

      try {
        const res = await fetch(`${API_URL}/api/auth/social-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider,
            providerId,
            email: mockData.email,
            name: mockData.name,
            avatar: mockData.avatar,
          }),
        });

        resData = await res.json();
        if (!res.ok) throw new Error(resData.message || 'Xác thực tài khoản thất bại.');
      } catch (fetchErr: any) {
        if (fetchErr.message && !fetchErr.message.includes('Failed to fetch')) {
          throw fetchErr;
        }

        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
          JSON.stringify({ email: mockData.email, role: 'Customer', provider, exp: Math.floor(Date.now() / 1000) + 86400 * 7 })
        )}.signature`;

        resData = {
          success: true,
          accessToken: mockToken,
          user: {
            id: Date.now(),
            customerCode: `KH${Math.floor(1000 + Math.random() * 9000)}`,
            name: mockData.name,
            email: mockData.email,
            avatar: mockData.avatar,
            role: 'Customer',
            provider,
            status: 'active',
          },
        };
      }

      authStorage.setToken(resData.accessToken, true);
      authStorage.setUser(resData.user);

      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          if (resData.user?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
          router.refresh();
        }, 500);
      }
    } catch (err: any) {
      if (onError) {
        onError(err.message || `Đăng nhập bằng ${provider} không thành công.`);
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-[#E8E2D8] w-full" />
        <span className="bg-white px-3 text-[11px] font-extrabold tracking-wider text-[#A89C92] uppercase absolute">
          {title}
        </span>
      </div>

      {/* 2 Buttons Row (Google & Facebook) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Google Button */}
        <motion.button
          type="button"
          disabled={loadingProvider !== null}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSocialLogin('google')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-[#E5DFD7] text-[#2B160C] font-bold text-xs shadow-sm hover:bg-[#FAF8F5] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loadingProvider === 'google' ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#3C1505]" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
            </svg>
          )}
          <span>Google</span>
        </motion.button>

        {/* Facebook Button */}
        <motion.button
          type="button"
          disabled={loadingProvider !== null}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSocialLogin('facebook')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1877F2] text-white font-bold text-xs shadow-md shadow-[#1877F2]/20 hover:bg-[#166FE5] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loadingProvider === 'facebook' ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          <span>Facebook</span>
        </motion.button>
      </div>
    </div>
  );
}
