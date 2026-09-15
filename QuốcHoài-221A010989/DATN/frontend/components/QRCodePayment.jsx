import React, { useState } from 'react';
import { Copy, RefreshCw, Check, QrCode, Building2, UserCheck, Hash, ShieldCheck, Zap } from 'lucide-react';

export default function QRCodePayment({
  qrInfo,
  orderCode,
  amount,
  onRefreshQR,
  onSimulateSuccess,
}) {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

  const bankName = qrInfo?.bankName || 'MBBank (Ngân hàng Quân Đội)';
  const accountNo = qrInfo?.accountNo || '0388888888';
  const accountName = qrInfo?.accountName || 'SWIFT COFFEE STORE';
  const transferContent = orderCode || qrInfo?.transferContent || 'TT123456';
  const qrCodeUrl = qrInfo?.qrCodeUrl || `https://img.vietqr.io/image/MB-0388888888-compact2.png?amount=${Math.round(amount * 25400)}&addInfo=${transferContent}&accountName=${encodeURIComponent(accountName)}`;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'account') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    }
  };

  return (
    <div className="p-6 bg-card border border-border rounded-3xl space-y-6 shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" /> Thanh Toán Qua Mã QR Code
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quét mã QR bằng App Ngân hàng hoặc Ví điện tử bất kỳ để chuyển khoản tự động
          </p>
        </div>
        <button
          onClick={onRefreshQR}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border"
          title="Làm mới QR Code"
        >
          <RefreshCw className="w-3.5 h-3.5 text-primary" /> Làm mới QR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-border shadow-inner text-center">
          <div className="relative p-2 bg-white rounded-xl">
            <img
              src={qrCodeUrl}
              alt="Mã QR Thanh Toán Swift Coffee"
              className="w-48 h-48 md:w-56 md:h-56 object-contain rounded-lg"
            />
          </div>
          <div className="mt-2 text-center">
            <p className="text-[11px] font-bold text-slate-800 tracking-wide uppercase">VietQR • Napas247</p>
            <p className="text-[10px] text-slate-500">Quét mã để tự động điền đúng số tiền và nội dung</p>
          </div>
        </div>

        {/* Transfer Details & Copy Buttons */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-3 text-xs">
            {/* Bank Name */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                <Building2 className="w-4 h-4 text-primary" /> Ngân hàng:
              </span>
              <span className="font-bold text-foreground text-right">{bankName}</span>
            </div>

            {/* Account Owner */}
            <div className="flex items-start justify-between gap-2 border-t border-border/40 pt-2.5">
              <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                <UserCheck className="w-4 h-4 text-primary" /> Chủ tài khoản:
              </span>
              <span className="font-bold text-foreground text-right">{accountName}</span>
            </div>

            {/* Account Number */}
            <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-2.5">
              <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                <Hash className="w-4 h-4 text-primary" /> Số tài khoản:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono text-sm text-primary">{accountNo}</span>
                <button
                  onClick={() => handleCopy(accountNo, 'account')}
                  className="p-1.5 rounded-lg bg-background hover:bg-secondary text-foreground border border-border transition-colors"
                  title="Copy số tài khoản"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Transfer Content */}
            <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-2.5">
              <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                <Zap className="w-4 h-4 text-accent" /> Nội dung CK:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono text-sm text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
                  {transferContent}
                </span>
                <button
                  onClick={() => handleCopy(transferContent, 'content')}
                  className="p-1.5 rounded-lg bg-background hover:bg-secondary text-foreground border border-border transition-colors"
                  title="Copy nội dung"
                >
                  {copiedContent ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Copy Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleCopy(accountNo, 'account')}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs border border-border transition-colors"
            >
              {copiedAccount ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAccount ? 'Đã sao chép STK' : 'Copy số tài khoản'}
            </button>

            <button
              onClick={() => handleCopy(transferContent, 'content')}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs border border-primary/30 transition-colors"
            >
              {copiedContent ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedContent ? 'Đã sao chép nội dung' : 'Copy nội dung'}
            </button>
          </div>

          {/* Demo Simulation button */}
          {onSimulateSuccess && (
            <button
              onClick={onSimulateSuccess}
              className="w-full py-2 bg-gradient-to-r from-accent/20 to-primary/20 hover:from-accent/30 hover:to-primary/30 text-foreground text-xs font-bold rounded-xl border border-accent/30 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-accent" /> Mô phỏng Quét QR Thanh Toán Thành Công (Demo Webhook)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
