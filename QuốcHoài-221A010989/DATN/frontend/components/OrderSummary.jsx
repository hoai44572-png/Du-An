const formatCurrencyVN = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0₫';
  return new Intl.NumberFormat('vi-VN').format(Math.round(val)) + '₫';
};
import React from 'react';
import { ShoppingBag, Tag, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export default function OrderSummary({
  items = [],
  totalPrice = 0,
  shippingFee = 0,
  discountAmount = 0,
  discountPercent = 0,
  voucherCode = '',
  setVoucherCode,
  handleApplyVoucher,
}) {
  const finalTotal = Math.max(0, totalPrice - discountAmount + shippingFee);

  const getImageFileName = (src) => {
    if (!src) return 'product.jpg';
    try {
      const cleanSrc = src.split('?')[0];
      const filename = cleanSrc.split('/').pop() || src;
      return decodeURIComponent(filename);
    } catch {
      return src;
    }
  };

  return (
    <div className="space-y-6">
      {/* List of Products */}
      <div className="p-6 bg-card border border-border rounded-3xl space-y-4 shadow-sm">
        <h3 className="font-serif font-bold text-lg text-foreground flex items-center justify-between border-b border-border/80 pb-3">
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" /> Đơn Hàng Của Bạn
          </span>
          <span className="text-xs font-normal text-muted-foreground">({items.length} sản phẩm)</span>
        </h3>

        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Chưa có sản phẩm trong giỏ hàng</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-2xl bg-secondary/30 border border-border/50">
                <div className="relative w-14 h-14 bg-secondary rounded-xl overflow-hidden shrink-0 border border-border/50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-xs text-foreground truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {item.origin} {item.grind ? `• ${item.grind}` : ''}
                  </p>
                  <p className="text-xs font-bold text-primary">
                    {formatCurrencyVN(item.price)} x {item.quantity}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-sm text-foreground">
                    {formatCurrencyVN(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Voucher Box */}
      {setVoucherCode && handleApplyVoucher && (
        <div className="p-5 bg-card border border-border rounded-3xl space-y-3 shadow-sm">
          <h4 className="font-serif font-bold text-sm flex items-center gap-2 text-foreground">
            <Tag className="w-4 h-4 text-primary" /> Mã Giảm Giá
          </h4>
          <form onSubmit={handleApplyVoucher} className="flex gap-2">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Nhập SWIFT10 hoặc SWIFT20"
              className="flex-1 px-3 py-2 text-xs border border-border rounded-xl uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs rounded-xl transition-colors border border-border"
            >
              Áp dụng
            </button>
          </form>
          {discountPercent > 0 && (
            <p className="text-xs text-accent flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Khuyến mãi giảm {discountPercent}% đã được áp dụng
            </p>
          )}
        </div>
      )}

      {/* Totals Summary */}
      <div className="p-6 bg-card border border-border rounded-3xl space-y-3.5 shadow-sm">
        <h4 className="font-serif font-bold text-base text-foreground border-b border-border/80 pb-2.5">
          Tóm Tắt Thanh Toán
        </h4>

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span className="font-semibold text-foreground">{formatCurrencyVN(totalPrice)}</span>
          </div>

          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span className="font-semibold text-foreground">
              {shippingFee === 0 ? <strong className="text-accent">Miễn phí</strong> : formatCurrencyVN(shippingFee)}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-accent font-semibold">
              <span>Giảm giá ({discountPercent}%):</span>
              <span>-{formatCurrencyVN(discountAmount)}</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-border flex justify-between items-baseline">
          <span className="font-bold text-foreground text-sm">Tổng thanh toán:</span>
          <span className="text-2xl font-bold text-primary">{formatCurrencyVN(finalTotal)}</span>
        </div>
      </div>
    </div>
  );
}
