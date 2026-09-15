import React from 'react';
import { Loader2, CheckCircle2, AlertTriangle, RefreshCw, Clock } from 'lucide-react';

export default function PaymentStatus({
  status = 'Pending', // Pending, Paid, Expired, Failed
  timeLeft = 900, // seconds
  onNewQR,
}) {
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (status === 'Paid') {
    return (
      <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl text-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h4 className="font-serif font-bold text-xl text-emerald-400">✔ Thanh toán thành công!</h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Hệ thống đã tự động ghi nhận giao dịch của bạn. Đơn hàng đang được tiến hành xử lý ngay lập tức.
        </p>
      </div>
    );
  }

  if (status === 'Expired') {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive/30 rounded-3xl text-center space-y-4 animate-in fade-in duration-300">
        <div className="w-12 h-12 bg-destructive/20 text-destructive rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-lg text-destructive">Hết hạn thanh toán</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Mã QR hoặc phiên giao dịch hiện tại đã hết hiệu lực. Vui lòng tạo mã QR mới để hoàn tất đơn hàng.
          </p>
        </div>
        {onNewQR && (
          <button
            onClick={onNewQR}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Tạo QR mới
          </button>
        )}
      </div>
    );
  }

  // Pending State
  return (
    <div className="p-5 bg-secondary/40 border border-border rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
          <div className="absolute w-2 h-2 bg-primary rounded-full animate-ping" />
        </div>
        <div>
          <h4 className="font-serif font-bold text-sm text-foreground flex items-center gap-2">
            Đang chờ thanh toán...
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hệ thống đang kiểm tra giao dịch tự động qua Webhook
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-background/80 px-3.5 py-1.5 rounded-2xl border border-border shrink-0 text-xs font-semibold">
        <Clock className="w-4 h-4 text-amber-500" />
        <span className="text-muted-foreground">Thời gian còn lại:</span>
        <span className="font-mono text-primary font-bold">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
}
