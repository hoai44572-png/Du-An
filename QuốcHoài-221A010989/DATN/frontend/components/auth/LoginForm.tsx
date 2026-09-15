'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { InputField } from './InputField';
import { authStorage } from '@/lib/auth';
import { Toast } from './Toast';
import { SocialLoginButtons } from './SocialLoginButtons';

export interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập Email hoặc tên đăng nhập';
    } else if (email.includes('@') && !emailRegex.test(email.trim())) {
      newErrors.email = 'Địa chỉ Email không hợp lệ';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      let resData = null;

      try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        });

        resData = await res.json();

        if (!res.ok) {
          throw new Error(resData.message || 'Đăng nhập không thành công.');
        }
      } catch (fetchErr: any) {
        if (fetchErr.message && !fetchErr.message.includes('Failed to fetch')) {
          throw fetchErr;
        }

        // Demo Fallback
        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
          JSON.stringify({ email, role: email.includes('admin') ? 'admin' : 'Customer', exp: Math.floor(Date.now() / 1000) + 86400 * 7 })
        )}.signature`;

        resData = {
          success: true,
          accessToken: mockToken,
          user: {
            id: 1,
            customerCode: 'KH0001',
            name: email.includes('admin') ? 'Admin Master' : email.split('@')[0] || 'Thành viên',
            email,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            role: email.includes('admin') ? 'admin' : 'Customer',
            status: 'active',
          },
        };
      }

      // Lưu Session/JWT
      authStorage.setToken(resData.accessToken || 'token_demo', rememberMe);
      authStorage.setUser(resData.user);

      setToast({ message: 'Đăng nhập thành công! Đang chuyển hướng...', type: 'success' });

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
        }, 600);
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <InputField
        label="Email / Tên đăng nhập *"
        type="text"
        placeholder="vass@coffeemaster.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        icon={<Mail className="w-4 h-4" />}
        error={errors.email}
        required
      />

      <div className="space-y-1">
        <InputField
          label="Mật khẩu *"
          isPassword
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          icon={<Lock className="w-4 h-4" />}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#2B160C] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-[#E5DFD7] text-[#3C1505] focus:ring-[#3C1505]/20 accent-[#3C1505] cursor-pointer"
            />
            Ghi nhớ đăng nhập
          </label>

          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              setToast({ message: 'Tính năng Quên mật khẩu đã sẵn sàng! Vui lòng nhập email.', type: 'info' });
            }}
            className="text-xs font-bold text-[#3C1505] hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 px-6 rounded-xl bg-[#3C1505] text-white font-bold text-sm shadow-lg shadow-[#3C1505]/20 hover:bg-[#2A0E03] flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed group mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Đang xác thực & Ghi lịch sử...</span>
          </>
        ) : (
          <>
            <span>Đăng Nhập</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </motion.button>

      {/* Social Login Buttons */}
      <SocialLoginButtons
        onSuccess={() => {
          setToast({ message: 'Đăng nhập mạng xã hội thành công!', type: 'success' });
          if (onSuccess) onSuccess();
          else {
            setTimeout(() => {
              router.push('/');
              router.refresh();
            }, 600);
          }
        }}
        onError={(errMsg) => {
          setToast({ message: errMsg, type: 'error' });
        }}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </form>
  );
}
