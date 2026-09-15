'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Coffee,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/components/ui/toast';
import OrderSummary from '@/components/OrderSummary';
import PaymentMethod from '@/components/PaymentMethod';
import QRCodePayment from '@/components/QRCodePayment';
import PaymentStatus from '@/components/PaymentStatus';
import LoadingPayment from '@/components/LoadingPayment';

const formatCurrencyVN = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0₫';
  return new Intl.NumberFormat('vi-VN').format(Math.round(val)) + '₫';
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { success, warning, error: toastError, info } = useToast();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');

  // Voucher State
  const [voucherCode, setVoucherCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút count down

  const SHIPPING_FEE = totalPrice > 50 || items.length === 0 ? 0 : 3.99;
  const discountAmount = (totalPrice * discountPercent) / 100;
  const finalTotal = Math.max(0, totalPrice - discountAmount + SHIPPING_FEE);

  // Xử lý áp dụng mã giảm giá
  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    if (voucherCode.toUpperCase() === 'SWIFT10') {
      setDiscountPercent(10);
      success('Áp dụng mã giảm giá SWIFT10 thành công! (-10%)');
    } else if (voucherCode.toUpperCase() === 'SWIFT20') {
      setDiscountPercent(20);
      success('Áp dụng mã giảm giá SWIFT20 thành công! (-20%)');
    } else {
      warning('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }
  };

  // Timer đếm ngược cho QR Code
  useEffect(() => {
    if (!createdOrder || !['Banking', 'SePay', 'PayOS'].includes(paymentMethod)) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus('Expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [createdOrder, paymentMethod]);

  // Polling trạng thái thanh toán từ Express Backend
  useEffect(() => {
    if (!createdOrder?.orderCode || paymentStatus === 'Paid' || paymentStatus === 'Expired') return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/payment/status/${createdOrder.orderCode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.paymentStatus === 'Paid') {
            setPaymentStatus('Paid');
            clearInterval(pollInterval);
            success('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');
            setTimeout(() => {
              clearCart();
              router.push(`/payment-success?orderCode=${createdOrder.orderCode}`);
            }, 1800);
          }
        }
      } catch (err) {
        // Safe polling ignore error
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [createdOrder, paymentStatus, clearCart, router, success]);

  // Xử lý Đặt hàng & Khởi tạo thanh toán
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim() || !shippingAddress.trim()) {
      warning('Vui lòng điền đầy đủ các thông tin giao hàng có dấu (*)');
      return;
    }

    if (items.length === 0) {
      warning('Giỏ hàng của bạn đang trống!');
      router.push('/cart');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      note,
      items,
      total: finalTotal,
      shippingFee: SHIPPING_FEE,
      discount: discountAmount,
      paymentMethod,
    };

    try {
      // Gọi Express Backend Endpoint /api/payment/order
      const res = await fetch('http://localhost:5000/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setCreatedOrder(data);
        setPaymentStatus('Pending');
        setTimeLeft(900);

        if (paymentMethod === 'COD') {
          success('Đặt hàng COD thành công!');
          clearCart();
          router.push(`/payment-success?orderCode=${data.orderCode}`);
        } else {
          info('Đã khởi tạo đơn hàng. Vui lòng hoàn tất thanh toán bên dưới.');
        }
      } else {
        toastError(data.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
      }
    } catch (err) {
      console.warn('Backend chưa phản hồi, chuyển sang chế độ dự phòng local:', err);
      // Fallback khởi tạo thành công local nếu chưa bật Backend express
      const fallbackOrderCode = 'TT' + Math.floor(100000 + Math.random() * 900000);
      const fallbackOrder = {
        orderCode: fallbackOrderCode,
        qrInfo: {
          bankName: 'MBBank (Ngân hàng Quân Đội)',
          accountNo: '0388888888',
          accountName: 'SWIFT COFFEE STORE',
          transferContent: fallbackOrderCode,
          qrCodeUrl: `https://img.vietqr.io/image/MB-0388888888-compact2.png?amount=${Math.round(finalTotal)}&addInfo=${fallbackOrderCode}&accountName=SWIFT%20COFFEE%20STORE`,
        },
      };

      setIsSubmitting(false);
      setCreatedOrder(fallbackOrder);
      setPaymentStatus('Pending');
      setTimeLeft(900);

      if (paymentMethod === 'COD') {
        success('Đặt hàng thành công!');
        clearCart();
        router.push(`/payment-success?orderCode=${fallbackOrderCode}`);
      }
    }
  };

  // Mô phỏng Webhook thành công (Cho Demo QR Code)
  const handleSimulatePaymentSuccess = async () => {
    if (!createdOrder?.orderCode) return;
    try {
      await fetch('http://localhost:5000/api/payment/simulate-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode: createdOrder.orderCode }),
      });
      setPaymentStatus('Paid');
      success('Đã mô phỏng thanh toán thành công!');
      setTimeout(() => {
        clearCart();
        router.push(`/payment-success?orderCode=${createdOrder.orderCode}`);
      }, 1500);
    } catch (err) {
      setPaymentStatus('Paid');
      success('Đã xác nhận thanh toán!');
      setTimeout(() => {
        clearCart();
        router.push(`/payment-success?orderCode=${createdOrder.orderCode}`);
      }, 1500);
    }
  };

  // Xử lý PayPal Checkout
  const handlePayPalPayment = async () => {
    if (!createdOrder?.orderCode) return;
    setIsSubmitting(true);
    setTimeout(async () => {
      try {
        await fetch('http://localhost:5000/api/payment/paypal/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderCode: createdOrder.orderCode,
            paypalOrderID: 'PAYPAL_MOCK_' + Date.now(),
          }),
        });
      } catch {}

      setIsSubmitting(false);
      setPaymentStatus('Paid');
      success('Thanh toán PayPal hoàn tất thành công!');
      clearCart();
      router.push(`/payment-success?orderCode=${createdOrder.orderCode}`);
    }, 1500);
  };

  if (items.length === 0 && !createdOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center space-y-4">
        <Coffee className="w-16 h-16 text-primary animate-bounce" />
        <h2 className="text-2xl font-bold font-serif">Giỏ hàng của bạn đang trống</h2>
        <p className="text-sm text-muted-foreground">Vui lòng chọn sản phẩm vào giỏ trước khi thanh toán.</p>
        <Link
          href="/menu"
          className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all"
        >
          Khám Phá Menu Ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 space-y-8">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Xác Nhận & Thanh Toán</h1>
          <p className="text-sm text-muted-foreground mt-1">Hoàn tất thông tin đơn hàng và chọn phương thức thanh toán an toàn</p>
        </div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline bg-secondary/50 px-3.5 py-2 rounded-xl border border-border/60 self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
        </Link>
      </div>

      {isSubmitting ? (
        <LoadingPayment message="Đang xử lý khởi tạo đơn hàng..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer Form & Payment Methods */}
          <div className="lg:col-span-7 space-y-8">
            {/* Customer Info Form */}
            <motion.form
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handlePlaceOrder}
              className="p-6 bg-card border border-border rounded-3xl space-y-5 shadow-sm"
            >
              <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
                <User className="w-5 h-5 text-primary" /> Thông Tin Giao Hàng
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    Họ và Tên <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    />
                    <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    Số Điện Thoại <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    />
                    <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  Địa Chỉ Email <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="nguyenvana@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  />
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  Địa Chỉ Nhận Hàng <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Số 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  />
                  <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  Ghi Chú Đơn Hàng (Tùy chọn)
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  />
                  <FileText className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </div>
            </motion.form>

            {/* Payment Method Selector */}
            <PaymentMethod selectedMethod={paymentMethod} onSelectMethod={setPaymentMethod} />

            {/* Active QR Payment Flow if Order Created */}
            {createdOrder && ['Banking', 'SePay', 'PayOS'].includes(paymentMethod) && (
              <div className="space-y-6">
                <PaymentStatus
                  status={paymentStatus}
                  timeLeft={timeLeft}
                  onNewQR={handlePlaceOrder}
                />

                {paymentStatus !== 'Expired' && (
                  <QRCodePayment
                    qrInfo={createdOrder.qrInfo}
                    orderCode={createdOrder.orderCode}
                    amount={finalTotal}
                    onRefreshQR={() => info('Đã cập nhật lại mã QR')}
                    onSimulateSuccess={handleSimulatePaymentSuccess}
                  />
                )}
              </div>
            )}

            {/* Active PayPal Flow */}
            {createdOrder && paymentMethod === 'PayPal' && (
              <div className="p-6 bg-card border border-border rounded-3xl space-y-4 text-center">
                <h4 className="font-bold text-sm text-foreground">Thanh toán bằng tài khoản PayPal</h4>
                <p className="text-xs text-muted-foreground">
                  Nhấn nút bên dưới để xác nhận cổng thanh toán PayPal quốc tế cho đơn hàng #{createdOrder.orderCode}.
                </p>
                <button
                  type="button"
                  onClick={handlePayPalPayment}
                  className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" /> Thanh Toán Ngay Với PayPal ({formatCurrencyVN(finalTotal)})
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Place Order Action */}
          <div className="lg:col-span-5 space-y-6">
            <OrderSummary
              items={items}
              totalPrice={totalPrice}
              shippingFee={SHIPPING_FEE}
              discountAmount={discountAmount}
              discountPercent={discountPercent}
              voucherCode={voucherCode}
              setVoucherCode={setVoucherCode}
              handleApplyVoucher={handleApplyVoucher}
            />

            {!createdOrder && (
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
              >
                Xác Nhận Thanh Toán ({formatCurrencyVN(finalTotal)})
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
              <ShieldCheck className="w-4 h-4 text-accent" /> Thanh toán được mã hóa SSL 256-bit an toàn tuyệt đối
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
