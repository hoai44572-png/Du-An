'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, Mail, Camera, Save, Lock, Eye, EyeOff, MapPin, Plus, Trash2, CheckCircle,
  ShoppingBag, Award, Gift, Heart, Clock, Bell, Sparkles, Tag, ArrowRight, Shield, Check, Calendar
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { authStorage } from '@/lib/auth';
import Link from 'next/link';

export default function ProfilePage() {
  const { success, error } = useToast();
  const [user, setUser] = useState(authStorage.getUser());
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'info' | 'addresses' | 'social' | 'password'>('dashboard');

  // Social account state
  const [linkedSocials, setLinkedSocials] = useState<string[]>([
    user?.provider && user.provider !== 'local' ? user.provider : 'google',
  ]);
  const [socialSetPwd, setSocialSetPwd] = useState('');
  const [showSetPwdModal, setShowSetPwdModal] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || user?.email?.split('@')[0] || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gender, setGender] = useState(user?.gender || 'Nam');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Address book state
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState({
    fullName: '', phone: '', province: '', district: '', ward: '', streetAddress: '', isDefault: false,
  });

  // Preset Avatars
  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  ];

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  // Update profile info
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = authStorage.getToken();

      if (token) {
        await fetch(`${API_URL}/api/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, phone, avatar, gender, dateOfBirth, address, username }),
        }).catch(() => { });
      }

      const updatedUser = { ...user!, name, phone, avatar, gender, dateOfBirth, address, username };
      authStorage.setUser(updatedUser);
      setUser(updatedUser);
      success('Cập nhật thông tin hồ sơ thành công!');
    } catch (err: any) {
      error(err.message || 'Lỗi cập nhật thông tin.');
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPwd) {
      error('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (newPwd.length < 6) {
      error('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPwd !== confirmPwd) {
      error('Mật khẩu xác nhận không trùng khớp.');
      return;
    }
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = authStorage.getToken();

      if (token) {
        const res = await fetch(`${API_URL}/api/auth/change-password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Đổi mật khẩu không thành công.');
      }

      success('Đổi mật khẩu tài khoản thành công!');
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (err: any) {
      error(err.message || 'Mật khẩu hiện tại không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  // Address actions
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.fullName || !addrForm.phone || !addrForm.streetAddress) {
      error('Vui lòng nhập đầy đủ tên, sđt và địa chỉ.');
      return;
    }
    const newAddr = { ...addrForm, id: Date.now() };
    let updatedList = [...addresses];
    if (addrForm.isDefault) {
      updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
    }
    updatedList.push(newAddr);
    setAddresses(updatedList);
    setShowAddrForm(false);
    setAddrForm({ fullName: '', phone: '', province: '', district: '', ward: '', streetAddress: '', isDefault: false });
    success('Thêm địa chỉ giao hàng thành công!');
  };

  const handleDeleteAddr = (id: number) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    success('Đã xóa địa chỉ khỏi sổ địa chỉ.');
  };

  const handleSetDefaultAddr = (id: number) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    success('Đã đặt địa chỉ làm mặc định!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Customer Code & Welcome */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-primary/20 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-card border-2 border-primary/30 overflow-hidden shadow-md">
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => setActiveTab('info')}
              className="absolute -bottom-1 -right-1 p-1 bg-primary text-white rounded-full shadow-md hover:scale-110 transition-transform"
              title="Đổi ảnh đại diện"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">{user?.name || 'Khách hàng Swift Coffee'}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                Mã KH: {user?.customerCode || 'KH0001'}
              </span>
            </div>
            <p className="text-xs text-foreground/60 mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-foreground/70 mt-1">
              <span className="inline-flex items-center gap-1 text-amber-600 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">
                👑 Cấp thành viên: {user?.memberTier || 'Thành viên mới'}
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                ⭐ {user?.rewardPoints ?? 0} Điểm thưởng
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Link
            href="/"
            className="px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary/90 transition-all inline-flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Quay Lại Trang Chủ</span>
          </Link>
        </div>
      </div>

      {/* Tabs Header Navigation */}
      <div className="flex items-center gap-2 bg-card border border-border/80 p-1.5 rounded-2xl overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === 'dashboard' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:bg-secondary'
            }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Dashboard Tổng Quan</span>
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === 'info' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:bg-secondary'
            }`}
        >
          <User className="w-4 h-4" />
          <span>Thông Tin Hồ Sơ</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === 'addresses' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:bg-secondary'
            }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Sổ Địa Chỉ Giao Hàng ({addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === 'social' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:bg-secondary'
            }`}
        >
          <Shield className="w-4 h-4" />
          <span>Tài Khoản Mạng Xã Hội ({linkedSocials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('password')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === 'password' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:bg-secondary'
            }`}
        >
          <Lock className="w-4 h-4" />
          <span>Đổi Mật Khẩu</span>
        </button>
      </div>

      {/* Tab 1: Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Order Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-foreground/50 text-[11px] font-medium block">Tổng đơn hàng</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-foreground">8 Đơn</span>
                <ShoppingBag className="w-5 h-5 text-primary/70" />
              </div>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-foreground/50 text-[11px] font-medium block">Đơn đang xử lý</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-amber-600">1 Đơn</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-foreground/50 text-[11px] font-medium block">Đơn hoàn thành</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-emerald-600">6 Đơn</span>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-foreground/50 text-[11px] font-medium block">Đơn đã hủy</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-rose-600">1 Đơn</span>
                <Trash2 className="w-5 h-5 text-rose-500" />
              </div>
            </div>
          </div>

          {/* Financial & Loyalty Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Tổng tiền đã chi</h3>
                <Award className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-black text-emerald-600">{formatVND(1850000)}</p>
              <p className="text-[11px] text-foreground/50">Chi tiêu tích lũy giúp thăng hạng lên Vàng</p>
            </div>

            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Điểm thưởng tích lũy</h3>
                <Gift className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-amber-600">150 Điểm</p>
              <p className="text-[11px] text-foreground/50">Dùng 100 điểm đổi giảm 20.000đ khi thanh toán</p>
            </div>

            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Mã giảm giá hiện có</h3>
                <Tag className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-2xl font-black text-indigo-600">3 Mã Ưu Đãi</p>
              <p className="text-[11px] text-foreground/50">SWIFTCOFFEE20, FREESHIP50, MEMBERGOLD</p>
            </div>
          </div>

          {/* Quick Links & Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders Overview */}
            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-sm font-bold text-foreground">Đơn hàng mới nhất</h3>
                <Link href="/profile/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  <span>Xem tất cả</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-secondary/30 border border-border/50 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-primary">Mã: ORD-8821</span>
                    <p className="text-foreground/60 text-[11px]">Cà phê Muối (x2), Cold Brew Cam Sả (x1)</p>
                    <span className="text-[10px] text-foreground/40 font-mono">05/08/2026 14:20</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-foreground block">{formatVND(240000)}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">Hoàn thành</span>
                  </div>
                </div>

                <div className="p-3.5 bg-secondary/30 border border-border/50 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-primary">Mã: ORD-9102</span>
                    <p className="text-foreground/60 text-[11px]">Espresso Sữa Đá Premium (x2)</p>
                    <span className="text-[10px] text-foreground/40 font-mono">07/08/2026 09:15</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-foreground block">{formatVND(110000)}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600">Đang chuẩn bị</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications & Favorite Products */}
            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <span>Thông báo mới</span>
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-2xl space-y-1">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>🎉 Chào mừng bạn đến với Swift Coffee</span>
                    <span className="text-[10px] text-foreground/40">Hôm nay</span>
                  </div>
                  <p className="text-foreground/70">Tài khoản của bạn đã được khởi tạo thành công và được tặng 50 điểm thưởng.</p>
                </div>

                <div className="p-3 bg-secondary/40 border border-border/50 rounded-2xl space-y-1">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>☕ Khám phá Menu Mùa Hè 2026</span>
                    <span className="text-[10px] text-foreground/40">Vừa xong</span>
                  </div>
                  <p className="text-foreground/70">Thử ngay món Cold Brew Ủ Lạnh Trái Cây Đào Cam Sả cực sảng khoái.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Profile Info Edit Form */}
      {activeTab === 'info' && (
        <form onSubmit={handleUpdateProfile} className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-border/60 pb-4">
            <h3 className="text-base font-bold text-foreground">Thông tin cá nhân & Ảnh đại diện</h3>
            <p className="text-xs text-foreground/60">Cập nhật họ tên, địa chỉ, ảnh đại diện và thông tin liên hệ của bạn</p>
          </div>

          {/* Avatar Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-foreground">Chọn Ảnh Đại Diện</label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {presetAvatars.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${avatar === url ? 'border-primary ring-4 ring-primary/20 scale-105' : 'border-border opacity-70 hover:opacity-100'
                    }`}
                >
                  <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                  {avatar === url && (
                    <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="pt-1">
              <label className="block text-xs font-semibold text-foreground/70 mb-1">Hoặc nhập URL Ảnh tùy chọn:</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground/80">Mã Khách Hàng</label>
              <input
                type="text"
                disabled
                value={user?.customerCode || 'KH0001'}
                className="w-full px-4 py-2.5 rounded-2xl bg-secondary/80 border border-border/60 text-xs text-foreground/60 font-mono font-bold cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground/80">Tên Đăng Nhập (Username)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground/80">Họ và tên *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground/80">Địa chỉ Email</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-2.5 rounded-2xl bg-secondary/80 border border-border/60 text-xs text-foreground/60 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground/80">Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground/80">Giới tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground/80">Ngày sinh</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground/80">Địa chỉ giao hàng mặc định</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ nhà / văn phòng của bạn"
              className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary/90 flex items-center gap-2 transition-all disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Thay Đổi Hồ Sơ</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Delivery Addresses */}
      {activeTab === 'addresses' && (
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Sổ địa chỉ nhận hàng</h3>
              <p className="text-xs text-foreground/60">Quản lý các địa chỉ giao nhận đồ uống của bạn</p>
            </div>
            <button
              onClick={() => setShowAddrForm(true)}
              className="px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary/90 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm địa chỉ mới</span>
            </button>
          </div>

          {/* Add Address Form Modal */}
          <AnimatePresence>
            {showAddrForm && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleAddAddress}
                className="p-5 bg-secondary/40 border border-border/80 rounded-3xl space-y-4"
              >
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Điền thông tin địa chỉ mới</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Họ tên người nhận *"
                    value={addrForm.fullName}
                    onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })}
                    className="px-4 py-2.5 rounded-2xl bg-card border border-border/60 text-xs text-foreground focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Số điện thoại *"
                    value={addrForm.phone}
                    onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                    className="px-4 py-2.5 rounded-2xl bg-card border border-border/60 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Tỉnh / Thành phố"
                    value={addrForm.province}
                    onChange={(e) => setAddrForm({ ...addrForm, province: e.target.value })}
                    className="px-4 py-2.5 rounded-2xl bg-card border border-border/60 text-xs text-foreground focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Quận / Huyện"
                    value={addrForm.district}
                    onChange={(e) => setAddrForm({ ...addrForm, district: e.target.value })}
                    className="px-4 py-2.5 rounded-2xl bg-card border border-border/60 text-xs text-foreground focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phường / Xã"
                    value={addrForm.ward}
                    onChange={(e) => setAddrForm({ ...addrForm, ward: e.target.value })}
                    className="px-4 py-2.5 rounded-2xl bg-card border border-border/60 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  required
                  placeholder="Địa chỉ chi tiết (Số nhà, Tên đường...) *"
                  value={addrForm.streetAddress}
                  onChange={(e) => setAddrForm({ ...addrForm, streetAddress: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-card border border-border/60 text-xs text-foreground focus:outline-none"
                />

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-foreground/80 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={addrForm.isDefault}
                      onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                      className="w-4 h-4 rounded text-primary accent-primary"
                    />
                    Đặt làm địa chỉ mặc định
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddrForm(false)}
                      className="px-4 py-2 rounded-xl bg-secondary text-foreground/70 font-semibold text-xs hover:bg-secondary/80"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:bg-primary/90"
                    >
                      Lưu địa chỉ
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* List Addresses */}
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${addr.isDefault ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-secondary/20 border-border/60'
                  }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm">{addr.fullName}</span>
                    <span className="text-xs text-foreground/50">({addr.phone})</span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/70">
                    {addr.streetAddress}, {addr.ward}, {addr.district}, {addr.province}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefaultAddr(addr.id)}
                      className="px-3 py-1.5 rounded-xl bg-secondary text-foreground/80 hover:bg-primary hover:text-white font-semibold text-[11px] transition-colors"
                    >
                      Đặt mặc định
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddr(addr.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Xóa địa chỉ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Social Accounts Link Management */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="border-b border-border/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-foreground">Tài khoản Mạng Xã Hội Đã Liên Kết</h3>
                <p className="text-xs text-foreground/60">
                  Liên kết các mạng xã hội để đăng nhập nhanh chóng chỉ bằng một cú nhấp chuột mà không cần nhớ mật khẩu
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs self-start sm:self-auto">
                {linkedSocials.filter(s => ['google', 'facebook'].includes(s)).length}/2 Mạng xã hội đã kết nối
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[
                {
                  id: 'google',
                  name: 'Google',
                  desc: 'Tài khoản Google Workspace / Gmail',
                  bgColor: 'bg-red-500/10 text-red-600',
                  icon: (
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                    </svg>
                  ),
                },
                {
                  id: 'facebook',
                  name: 'Facebook',
                  desc: 'Tài khoản Trang cá nhân Facebook',
                  bgColor: 'bg-blue-500/10 text-blue-600',
                  icon: (
                    <svg className="w-5 h-5 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
              ].map((item) => {
                const isConnected = linkedSocials.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-border/70 bg-card hover:border-primary/30 transition-all flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-3 rounded-2xl ${item.bgColor}`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-foreground text-sm">{item.name}</h4>
                          {isConnected ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 text-[10px] font-bold inline-flex items-center gap-1">
                              <Check className="w-3 h-3" /> Đã liên kết
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-secondary text-foreground/50 text-[10px] font-bold">
                              Chưa liên kết
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-foreground/60 mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    {isConnected ? (
                      <button
                        onClick={async () => {
                          if (linkedSocials.length <= 1) {
                            error('Bạn không thể hủy liên kết tài khoản duy nhất.');
                            return;
                          }
                          try {
                            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                            const token = authStorage.getToken();
                            if (token) {
                              await fetch(`${API_URL}/api/auth/social-unlink/${item.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` },
                              }).catch(() => { });
                            }
                            setLinkedSocials((prev) => prev.filter((p) => p !== item.id));
                            success(`Đã hủy liên kết tài khoản ${item.name}!`);
                          } catch {
                            error('Không thể hủy liên kết.');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-bold text-xs transition-colors shrink-0"
                      >
                        Hủy liên kết
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          try {
                            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                            const token = authStorage.getToken();
                            if (token) {
                              await fetch(`${API_URL}/api/auth/social-link`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                body: JSON.stringify({ provider: item.id, email: user?.email }),
                              }).catch(() => { });
                            }
                            setLinkedSocials((prev) => [...prev, item.id]);
                            success(`Liên kết thành công tài khoản ${item.name}!`);
                          } catch {
                            error('Lỗi liên kết tài khoản.');
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:bg-primary/90 transition-all shrink-0"
                      >
                        Liên kết ngay
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Option: Set password for Social Login Users */}
          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" />
                Thiết lập Mật khẩu cho Đăng nhập Truyền thống
              </h4>
              <p className="text-xs text-foreground/70">
                Nếu bạn chỉ đăng nhập bằng Google / Facebook, bạn có thể bổ sung mật khẩu để đăng nhập bằng Email và Mật khẩu bất cứ khi nào.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('password')}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors shadow-sm shrink-0"
            >
              Thiết lập ngay
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Password Change */}
      {activeTab === 'password' && (
        <form onSubmit={handleChangePassword} className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4 max-w-xl">
          <div className="border-b border-border/60 pb-3">
            <h3 className="text-base font-bold text-foreground">Đổi mật khẩu tài khoản</h3>
            <p className="text-xs text-foreground/60">Bảo vệ tài khoản của bạn bằng mật khẩu an toàn</p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground/80">Mật khẩu hiện tại *</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                required
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top.1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground/80">Mật khẩu mới *</label>
            <input
              type={showPwd ? 'text' : 'password'}
              required
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground/80">Xác nhận mật khẩu mới *</label>
            <input
              type={showPwd ? 'text' : 'password'}
              required
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary/90 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              <Lock className="w-4 h-4" />
              <span>Cập Nhật Mật Khẩu</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
