'use client';

import React, { useState } from 'react';
import { History, Search, ShieldAlert, User } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { initialLogs } from '@/lib/admin-data';

export default function AdminLogsPage() {
  const [logs] = useState(initialLogs);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Nhật ký', href: '/admin/logs' }, { label: 'Nhật ký hoạt động hệ thống' }]} />

      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Nhật Ký Hoạt Động Hệ Thống</h1>
        <p className="text-xs text-foreground/60">Ghi lại toàn bộ lịch sử thao tác của các tài khoản Admin & Nhân viên</p>
      </div>

      <div className="bg-card border border-border/80 rounded-3xl p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Tìm theo Tên Admin, Hành động hoặc Module..."
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
                <th className="py-3.5 px-4">Thời gian</th>
                <th className="py-3.5 px-4">Tài khoản thực hiện</th>
                <th className="py-3.5 px-4">Hành động</th>
                <th className="py-3.5 px-4">Phân loại</th>
                <th className="py-3.5 px-4">Chi tiết thao tác</th>
                <th className="py-3.5 px-4 text-right">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-foreground/60">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-bold text-foreground">{log.user}</td>
                  <td className="py-3.5 px-4 text-primary font-semibold">{log.action}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-foreground/80">{log.details}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-foreground/50">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
