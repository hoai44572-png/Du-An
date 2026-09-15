import React from 'react';
import { Truck, Landmark, QrCode, CreditCard, DollarSign, Wallet, Check } from 'lucide-react';

export const PAYMENT_METHODS = [
  {
    id: 'COD',
    name: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt trực tiếp cho shipper khi nhận được hàng',
    icon: Truck,
    badge: 'Phổ biến',
    color: 'from-amber-500/20 to-orange-500/10 text-amber-500',
  },
  {
    id: 'Banking',
    name: 'Chuyển khoản ngân hàng',
    description: 'Quét mã VietQR chuyển khoản nhanh bằng bất kỳ ứng dụng Ngân hàng nào',
    icon: Landmark,
    badge: 'Tự động QR',
    color: 'from-blue-500/20 to-cyan-500/10 text-blue-500',
  },
  {
    id: 'SePay',
    name: 'Cổng thanh toán SePay',
    description: 'Tự động xác nhận giao dịch ngân hàng theo thời gian thực qua Webhook',
    icon: QrCode,
    badge: 'Xác nhận tức thì',
    color: 'from-emerald-500/20 to-teal-500/10 text-emerald-500',
  },
  {
    id: 'PayOS',
    name: 'Thanh toán PayOS',
    description: 'Tích hợp thanh toán siêu tốc bảo mật cao không phí giao dịch',
    icon: Wallet,
    badge: 'Bảo mật',
    color: 'from-purple-500/20 to-indigo-500/10 text-purple-500',
  },
  {
    id: 'PayPal',
    name: 'Ví quốc tế PayPal',
    description: 'Thanh toán an toàn toàn cầu qua thẻ Visa / Mastercard / Tài khoản PayPal',
    icon: DollarSign,
    badge: 'Quốc tế',
    color: 'from-sky-500/20 to-blue-600/10 text-sky-400',
  },
  {
    id: 'VNPay',
    name: 'Ví VNPay QR',
    description: 'Thanh toán cực nhanh qua ví điện tử VNPay hoặc app ngân hàng liên kết',
    icon: CreditCard,
    badge: 'Mở rộng',
    color: 'from-rose-500/20 to-red-500/10 text-rose-500',
  },
];

export default function PaymentMethod({ selectedMethod, onSelectMethod }) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-primary" /> Chọn Phương Thức Thanh Toán
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={`relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-primary/10 border-primary shadow-md shadow-primary/10 ring-1 ring-primary'
                  : 'bg-card border-border hover:border-primary/50 hover:bg-secondary/40'
              }`}
            >
              {/* Radio Indicator */}
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40 bg-background'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              {/* Icon */}
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${method.color} shrink-0 border border-border/40`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-xs text-foreground truncate">{method.name}</h4>
                  {method.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold border border-primary/20">
                      {method.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {method.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
