'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Plus,
  Search,
  Key,
  UserCheck,
  UserX,
  X,
  User,
  Mail,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { adminApi } from '@/lib/services/apiService';
import { useAdminAuth } from '@/lib/admin-auth-context';

interface AdminAccount {
  id: string | number;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  lastActive?: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

export default function AdminAccountsPage() {
  const { adminUser } = useAdminAuth();
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [resetModalAccount, setResetModalAccount] = useState<AdminAccount | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'ADMIN' as 'SUPER_ADMIN' | 'ADMIN' | 'STAFF',
  });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getList();
      if (data.success) {
        const mapped = (data.admins || []).map((a: any) => ({
          id: String(a.id),
          name: a.fullName,
          email: a.email,
          role: a.role,
          status: a.status,
          phone: a.phone,
          avatar: a.avatar,
          lastActive: a.lastLoginAt
            ? new Date(a.lastLoginAt).toLocaleDateString('vi-VN')
            : 'Chưa đăng nhập',
          createdAt: a.createdAt,
        }));
        setAccounts(mapped);
      }
    } catch {
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // Khởi tạo profile form từ adminUser
    if (adminUser) {
      setProfileForm({ fullName: adminUser.fullName, phone: adminUser.phone || '' });
    }
  }, [adminUser]);

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminApi.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        role: formData.role,
      });
      showToast(`Đã tạo tài khoản Admin "${formData.fullName}".`, 'success');
      setIsModalOpen(false);
      setFormData({ fullName: '', email: '', password: '', phone: '', role: 'ADMIN' });
      await fetchAccounts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi tạo tài khoản.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (id: string | number, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    try {
      await adminApi.updateStatus(Number(id), newStatus);
      setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: newStatus as any } : a));
      showToast(`Đã ${newStatus === 'LOCKED' ? 'khóa' : 'mở khóa'} tài khoản.`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi cập nhật trạng thái.';
      showToast(msg, 'error');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminApi.updateProfile(profileForm);
      showToast('Đã cập nhật hồ sơ thành công.', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi cập nhật hồ sơ.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminApi.changePassword(passwordForm);
      showToast('Đổi mật khẩu thành công.', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi đổi mật khẩu.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Tài khoản', href: '/admin/accounts' }, { label: 'Tài khoản nhân viên & Admin' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Quản Lý Tài Khoản Quản Trị</h1>
          <p className="text-xs text-foreground/60">Phân quyền nhân viên, tài khoản quản trị viên và bảo mật hệ thống</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm tài khoản mới</span>
        </button>
      </div>

      <div className="bg-card border border-border/80 rounded-3xl p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Tìm theo tên, email hoặc vai trò..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-secondary/50 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-card border border-border/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-[11px] font-bold text-foreground/50 uppercase tracking-wider bg-secondary/30">
                <th className="py-3.5 px-4">Tài khoản</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Vai trò / Cấp bậc</th>
                <th className="py-3.5 px-4">Hoạt động gần nhất</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs font-medium">
              {filteredAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {/* Admin avatar: real photo with fallback icon */}
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-10 h-10 object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.avatar-fallback')) {
                              const span = document.createElement('span');
                              span.className = 'avatar-fallback text-[13px] font-bold text-primary leading-none';
                              span.textContent = acc.name.trim().split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
                              parent.appendChild(span);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{acc.name}</p>
                        <span className="text-[10px] text-foreground/40 font-mono">{acc.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-foreground/80">{acc.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                      {acc.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-foreground/60">{acc.lastActive}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        acc.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      }`}
                    >
                      {acc.status === 'ACTIVE' ? 'Kích hoạt' : 'Tạm khóa'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setResetModalAccount(acc)}
                        className="p-1.5 rounded-xl hover:bg-secondary text-foreground/60 hover:text-amber-600 transition-colors"
                        title="Đặt lại mật khẩu"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(acc.id, acc.status)}
                        className={`p-1.5 rounded-xl transition-colors ${
                          acc.status === 'ACTIVE' ? 'hover:bg-rose-500/10 text-rose-600' : 'hover:bg-emerald-500/10 text-emerald-600'
                        }`}
                        title={acc.status === 'ACTIVE' ? 'Khóa quyền' : 'Mở quyền'}
                      >
                        {acc.status === 'ACTIVE' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Account Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-base font-bold text-foreground">Thêm Tài Khoản Nhân Viên Mới</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-foreground/40 hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Họ và tên nhân viên *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Email làm việc *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Phân quyền vai trò *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/60 focus:outline-none font-bold"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Manager">Manager (Quản lý cửa hàng)</option>
                    <option value="Barista">Barista (Pha chế & Quản lý đơn)</option>
                    <option value="Staff">Staff (Nhân viên phục vụ)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-foreground/60 hover:bg-secondary"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md">
                    Tạo tài khoản
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {resetModalAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setResetModalAccount(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-card border border-border/80 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Đặt lại mật khẩu</h3>
                <p className="text-xs text-foreground/60 mt-1">
                  Đã gửi link khôi phục mật khẩu tạm thời về địa chỉ <span className="font-bold text-foreground">{resetModalAccount.email}</span>.
                </p>
              </div>
              <button
                onClick={() => setResetModalAccount(null)}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md"
              >
                Hoàn tất
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
