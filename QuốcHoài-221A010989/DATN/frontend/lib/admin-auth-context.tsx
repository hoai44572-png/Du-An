'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminApi, adminTokenStorage } from '@/lib/services/apiService';

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
  status: string;
  lastLoginAt?: string;
  createdAt?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;
  refreshAdminProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Khởi tạo: đọc user từ localStorage và xác thực lại với server
  const refreshAdminProfile = useCallback(async () => {
    const token = adminTokenStorage.getToken();
    if (!token) {
      setAdminUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await adminApi.getMe();
      if (data.success && data.admin) {
        setAdminUser(data.admin);
        adminTokenStorage.setUser(data.admin);
      } else {
        adminTokenStorage.removeToken();
        setAdminUser(null);
      }
    } catch {
      // Token hết hạn hoặc lỗi → xóa token
      adminTokenStorage.removeToken();
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Khi mount: đọc user cache trước để tránh flash
    const cachedUser = adminTokenStorage.getUser();
    if (cachedUser) {
      setAdminUser(cachedUser as AdminUser);
    }
    // Sau đó verify với server
    refreshAdminProfile();
  }, [refreshAdminProfile]);

  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const data = await adminApi.login({ email, password });
      if (data.success && data.token && data.admin) {
        adminTokenStorage.setToken(data.token);
        adminTokenStorage.setUser(data.admin);
        setAdminUser(data.admin as AdminUser);
        return { success: true, message: 'Đăng nhập thành công!' };
      }
      return { success: false, message: data.message || 'Đăng nhập thất bại.' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi kết nối server.';
      return { success: false, message };
    }
  };

  const logoutAdmin = useCallback(() => {
    // Gọi API logout (không cần await - best effort)
    adminApi.logout().catch(() => {});
    adminTokenStorage.removeToken();
    setAdminUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated: !!adminUser,
        isLoading,
        loginAdmin,
        logoutAdmin,
        refreshAdminProfile,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth phải được dùng bên trong AdminAuthProvider');
  }
  return ctx;
}
