'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Search, Filter, Eye, X, Ban, CheckSquare, RotateCcw, Star,
  Package, Truck, CheckCircle, Clock, AlertCircle, Printer, Download, Coffee
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { ordersApi } from '@/lib/services/apiService';
import { useCart } from '@/lib/cart-context';

type OrderStatus = 'all' | 'pending' | 'preparing' | 'shipping' | 'completed' | 'cancelled';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: 'Chờ xử lý',  color: 'bg-amber-500/10 text-amber-600 border-amber-200',   icon: Clock },
  preparing: { label: 'Đang chuẩn bị', color: 'bg-blue-500/10 text-blue-600 border-blue-200', icon: Package },
  shipping:  { label: 'Đang giao',  color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200', icon: Truck },
  completed: { label: 'Hoàn thành', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', icon: CheckCircle },
  cancelled: { label: 'Đã hủy',     color: 'bg-rose-500/10 text-rose-600 border-rose-200',      icon: AlertCircle },
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const DEMO_ORDERS = [
  {
    id: 1, orderCode: 'ORD-8821', userId: 'demo',
    customerName: 'Nguyễn Văn A', customerEmail: 'an.nguyen@gmail.com', customerPhone: '0912345678',
    shippingAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    total: 240000, shippingFee: 15000, discount: 20000,
    paymentMethod: 'vnpay', paymentStatus: 'paid', orderStatus: 'completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: 1, productId: 'caphe-muoi', productName: 'Cà Phê Muối Chế Biển', quantity: 2, price: 65000 },
      { id: 2, productId: 'cold-brew-cam-sa', productName: 'Cold Brew Ủ Lạnh Đào Cam Sả', quantity: 1, price: 55000 },
    ],
  },
  {
    id: 2, orderCode: 'ORD-9102', userId: 'demo',
    customerName: 'Nguyễn Văn A', customerEmail: 'an.nguyen@gmail.com', customerPhone: '0912345678',
    shippingAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    total: 110000, shippingFee: 15000, discount: 0,
    paymentMethod: 'cod', paymentStatus: 'pending', orderStatus: 'preparing',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: 3, productId: 'espresso-sua-da', productName: 'Espresso Sữa Đá Premium', quantity: 2, price: 55000 },
    ],
  },
];

export default function OrdersPage() {
  const { success, error, info } = useToast();
  const { addItem } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus>('all');
  const [searchCode, setSearchCode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersApi.getMyOrders();
      setOrders(data.orders && Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderCode: string) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    setActionLoading(orderCode);
    try {
      const data = await ordersApi.cancelOrder(orderCode);
      if (data.success) {
        success('Đã hủy đơn hàng thành công!');
        await loadOrders();
        setSelectedOrder(null);
      }
    } catch (err: any) {
      error(err.message || 'Không thể hủy đơn hàng.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReceived = async (orderCode: string) => {
    setActionLoading(orderCode);
    try {
      const data = await ordersApi.markReceived(orderCode);
      if (data.success) {
        success('Cảm ơn bạn! Đơn hàng đã được xác nhận hoàn thành.');
        await loadOrders();
        setSelectedOrder(null);
      }
    } catch (err: any) {
      error(err.message || 'Không thể xác nhận nhận hàng.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReorder = (order: any) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item: any) => {
        addItem({
          id: Number(item.productId || item.id) || Date.now(),
          name: item.productName || item.name || 'Sản phẩm',
          price: item.price || 0,
          image: item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300',
          origin: item.origin || 'Việt Nam',
        });
      });
      success('Đã thêm các món vào giỏ hàng! Đang chuyển đến giỏ hàng...');
    }
  };

  const handlePrintInvoice = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hóa đơn Swift Coffee - ${order.orderCode}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #D97706; padding-bottom: 15px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #D97706; }
          .info { margin-bottom: 20px; font-size: 14px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #FFFBEB; color: #92400E; }
          .total { text-align: right; font-size: 16px; font-weight: bold; margin-top: 20px; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #777; border-top: 1px dashed #ccc; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">☕ SWIFT COFFEE STORE</div>
          <p>HÓA ĐƠN BAN HÀNG GIÁ TRỊ GIA TĂNG</p>
          <p><strong>Mã đơn hàng: ${order.orderCode}</strong></p>
        </div>
        <div class="info">
          <p><strong>Khách hàng:</strong> ${order.customerName}</p>
          <p><strong>Số điện thoại:</strong> ${order.customerPhone || 'N/A'}</p>
          <p><strong>Địa chỉ nhận:</strong> ${order.shippingAddress || 'N/A'}</p>
          <p><strong>Ngày đặt hàng:</strong> ${formatDate(order.createdAt)}</p>
          <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod ? order.paymentMethod.toUpperCase() : 'COD'}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map((item: any, idx: number) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.price)}</td>
                <td>${formatPrice(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">
          <p>Phí vận chuyển: ${order.shippingFee ? formatPrice(order.shippingFee) : 'Miễn phí'}</p>
          <p>Giảm giá: ${order.discount ? formatPrice(order.discount) : '0 ₫'}</p>
          <p style="color:#D97706; font-size:18px;">TỔNG CỘNG THANH TOÁN: ${formatPrice(order.total)}</p>
        </div>
        <div class="footer">
          <p>Cảm ơn quý khách đã mua hàng tại Swift Coffee Store!</p>
          <p>Hotline hỗ trợ: 1900 6868 - Website: swiftcoffee.com</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const filteredOrders = orders
    .filter(o => filterStatus === 'all' || o.orderStatus === filterStatus)
    .filter(o => !searchCode || o.orderCode.toLowerCase().includes(searchCode.toLowerCase()));

  const tabs: { key: OrderStatus; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xử lý' },
    { key: 'preparing', label: 'Đang chuẩn bị' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'completed', label: 'Hoàn thành' },
    { key: 'cancelled', label: 'Đã hủy' },
  ];

  return (
    <div className="space-y-5">
      {/* Header & Search */}
      <div className="bg-card border border-border/80 rounded-3xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" /> Lịch Sử Mua Hàng
            </h2>
            <p className="text-xs text-foreground/50 mt-0.5">Quản lý toàn bộ đơn hàng bạn đã đặt tại Swift Coffee</p>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/40" />
            <input
              type="text"
              placeholder="Tìm theo Mã đơn hàng..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-secondary/50 border border-border/60 rounded-xl focus:outline-none"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="mt-4 flex gap-1.5 flex-wrap">
          {tabs.map(({ key, label }) => {
            const count = key === 'all' ? orders.length : orders.filter(o => o.orderStatus === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-secondary/60 text-foreground/60 hover:text-foreground'
                }`}
              >
                {label} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="bg-card border border-border/80 rounded-3xl p-5 animate-pulse">
              <div className="h-4 bg-secondary rounded-lg w-32 mb-3" />
              <div className="h-3 bg-secondary rounded w-48 mb-2" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-card border border-border/80 rounded-3xl p-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
          <h3 className="font-bold text-foreground mb-2">Không tìm thấy đơn hàng nào</h3>
          <p className="text-sm text-foreground/50 mb-5">Thưởng thức cà phê thượng hạng với nhiều ưu đãi hấp dẫn!</p>
          <Link href="/menu" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90">
            Khám phá Menu ngay ☕
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
            const StatusIcon = status.icon;
            const isLoading = actionLoading === order.orderCode;

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border/80 rounded-3xl p-5 space-y-4 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-primary font-mono">{order.orderCode}</p>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground/50 mt-0.5">Đặt ngày: {formatDate(order.createdAt)} · {order.paymentMethod?.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600 text-sm">{formatPrice(order.total)}</p>
                    <p className="text-[11px] text-foreground/40">{(order.items || []).length} sản phẩm</p>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="bg-secondary/30 rounded-2xl p-3 text-xs text-foreground/70 space-y-1">
                  {(order.items || []).map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">{item.productName} (x{item.quantity})</span>
                      <span className="font-bold text-foreground">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-xl text-xs font-semibold hover:bg-secondary/80 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" /> Chi tiết
                    </button>
                    <button
                      onClick={() => handlePrintInvoice(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-xl text-xs font-semibold hover:bg-secondary/80 transition-all text-foreground/80"
                    >
                      <Printer className="w-3.5 h-3.5" /> In hóa đơn
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {['pending', 'preparing'].includes(order.orderStatus) && (
                      <button
                        onClick={() => handleCancel(order.orderCode)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-500/20 disabled:opacity-50 transition-all"
                      >
                        <Ban className="w-3.5 h-3.5" /> {isLoading ? '...' : 'Hủy đơn'}
                      </button>
                    )}

                    <button
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Mua lại
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* View Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border/80 rounded-3xl shadow-2xl z-10 overflow-y-auto max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-card/95 backdrop-blur-sm px-6 py-4 border-b border-border/60 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground">Chi tiết đơn hàng</h3>
                  <p className="text-xs text-primary font-mono font-bold">{selectedOrder.orderCode}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-xl hover:bg-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 text-sm">
                <div className="bg-secondary/30 rounded-2xl p-4 space-y-1.5 text-xs">
                  <p className="font-bold text-foreground/50 uppercase tracking-wider text-[10px]">Thông tin khách hàng</p>
                  <p className="font-bold text-foreground">{selectedOrder.customerName}</p>
                  <p className="text-foreground/60">{selectedOrder.customerPhone || '0912345678'}</p>
                  <p className="text-foreground/60">{selectedOrder.shippingAddress || 'Địa chỉ giao hàng'}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider text-[10px]">Danh sách món đã chọn</p>
                  {(selectedOrder.items || []).map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0 text-xs">
                      <div>
                        <p className="font-bold text-foreground">{item.productName}</p>
                        <p className="text-foreground/50">x{item.quantity} · {formatPrice(item.price)}</p>
                      </div>
                      <p className="font-bold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-secondary/30 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Phí vận chuyển</span>
                    <span>{selectedOrder.shippingFee ? formatPrice(selectedOrder.shippingFee) : 'Miễn phí'}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Giảm giá</span>
                      <span>- {formatPrice(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm pt-2 border-t border-border/60 text-foreground">
                    <span>Tổng thanh toán</span>
                    <span className="text-emerald-600 font-extrabold">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => handlePrintInvoice(selectedOrder)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-secondary text-foreground font-bold text-xs flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>In hóa đơn PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      handleReorder(selectedOrder);
                      setSelectedOrder(null);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Mua lại đơn này</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
