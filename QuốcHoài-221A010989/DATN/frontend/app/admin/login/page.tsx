'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Coffee, Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus, LogIn } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth-context';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, isAdminAuthenticated, isLoading: authLoading } = useAdminAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  // Nếu đã đăng nhập → redirect về Dashboard
  useEffect(() => {
    if (!authLoading && isAdminAuthenticated) {
      router.replace('/admin');
    }
  }, [isAdminAuthenticated, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await loginAdmin(form.email, form.password);

    if (result.success) {
      router.replace('/admin');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      setError('Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu.');
      return;
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE}/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(`Đăng ký thành công! Role: ${data.admin?.role}. Hãy đăng nhập.`);
        setMode('login');
        setForm(prev => ({ ...prev, fullName: '', phone: '' }));
      } else {
        setError(data.message || 'Đăng ký thất bại.');
      }
    } catch {
      setError('Lỗi kết nối server. Hãy kiểm tra Backend đang chạy.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg mb-4">
            <Coffee className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Swift Coffee</h1>
          <p className="text-sm text-foreground/50 mt-1">Admin Management System</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border/70 rounded-2xl shadow-lg p-8">
          {/* Tabs */}
          <div className="flex rounded-lg bg-secondary/50 p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-foreground/50 hover:text-foreground'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Đăng nhập
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'register'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-foreground/50 hover:text-foreground'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Đăng ký
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs mt-0.5 shrink-0">✓</div>
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/8 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {/* Full Name (chỉ register) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">Họ tên *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-secondary/40 border border-border/60 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@swiftcoffee.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/40 border border-border/60 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone (chỉ register) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0901234567"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-secondary/40 border border-border/60 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">Mật khẩu *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={mode === 'register' ? 'Ít nhất 6 ký tự' : 'Mật khẩu của bạn'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-secondary/40 border border-border/60 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/35 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  {mode === 'login' ? 'Đang đăng nhập...' : 'Đang tạo tài khoản...'}
                </>
              ) : (
                mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản Admin'
              )}
            </button>
          </form>

          {/* Note for register */}
          {mode === 'register' && (
            <p className="text-[11px] text-foreground/40 text-center mt-4">
              Admin đầu tiên đăng ký sẽ có role <strong>SUPER_ADMIN</strong>. Các tài khoản tiếp theo sẽ có role ADMIN.
            </p>
          )}
        </div>

        <p className="text-center text-xs text-foreground/30 mt-6">
          © 2026 Swift Coffee. Hệ thống quản trị nội bộ.
        </p>
      </motion.div>
    </div>
  );
}
