import nodemailer from 'nodemailer';

// =============================================================
// Cau hinh Nodemailer Transporter
// Su dung bien moi truong cho thong tin xac thuc email
// =============================================================
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'swiftcoffeestore@gmail.com',
      pass: process.env.EMAIL_PASS || '',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Gia lap transporter nếu chua co thong tin email
const sendEmail = async ({ to, subject, html }) => {
  try {
    // Neu chua co EMAIL_PASS thi log ra console thay vi gui that
    if (!process.env.EMAIL_PASS) {
      console.log('📧 [EMAIL MOCK] Se gui email den:', to);
      console.log('📧 [EMAIL MOCK] Chu de:', subject);
      return { success: true, messageId: 'mock-email-id', mock: true };
    }

    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"Swift Coffee Store ☕" <${process.env.EMAIL_USER || 'swiftcoffeestore@gmail.com'}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email gui thanh cong:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Loi gui email:', error.message);
    return { success: false, error: error.message };
  }
};

// =============================================================
// Template Email Hoa don Thanh toan Thanh cong
// =============================================================
export const sendOrderSuccessEmail = async (orderData) => {
  const {
    customerEmail,
    customerName,
    orderCode,
    items = [],
    subtotal = 0,
    discount = 0,
    shippingFee = 0,
    total = 0,
    paymentMethod = '',
    shippingAddress = '',
  } = orderData;

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const itemsHTML = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 8px;border-bottom:1px solid #f0e8d0;">
          <div style="font-weight:600;color:#2d1b0e;">${item.name || item.productName}</div>
          <div style="color:#8b6f47;font-size:13px;">${item.size ? 'Size ' + item.size : ''} x${item.quantity}</div>
        </td>
        <td style="padding:12px 8px;border-bottom:1px solid #f0e8d0;text-align:right;font-weight:600;color:#2d1b0e;">
          ${formatPrice((item.price || 0) * (item.quantity || 1))}
        </td>
      </tr>
    `
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận đơn hàng - Swift Coffee</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#fdf6ef;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#2d1b0e 0%,#4a2c17 50%,#6b3f22 100%);padding:40px 32px;text-align:center;">
      <div style="font-size:40px;margin-bottom:8px;">☕</div>
      <h1 style="color:#f5deb3;font-size:28px;margin:0;font-weight:700;letter-spacing:-0.5px;">Swift Coffee Store</h1>
      <p style="color:#d4a76a;margin:8px 0 0;font-size:14px;">Cà phê thượng hạng - Trải nghiệm đẳng cấp</p>
    </div>

    <!-- Success Banner -->
    <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);padding:24px 32px;text-align:center;border-bottom:2px solid #bbf7d0;">
      <div style="font-size:48px;margin-bottom:8px;">✅</div>
      <h2 style="color:#166534;margin:0;font-size:22px;">Đặt hàng thành công!</h2>
      <p style="color:#4ade80;margin:8px 0 0;font-size:14px;">Cảm ơn bạn đã tin tưởng Swift Coffee</p>
    </div>

    <!-- Content -->
    <div style="padding:32px;">
      <p style="color:#4a2c17;font-size:16px;margin:0 0 24px;">
        Xin chào <strong>${customerName}</strong>,<br>
        Đơn hàng của bạn đã được xác nhận và đang được xử lý. 🎉
      </p>

      <!-- Order Info -->
      <div style="background:#fdf6ef;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #f0e8d0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;color:#8b6f47;font-size:14px;">Mã đơn hàng</td>
            <td style="padding:6px 0;color:#2d1b0e;font-weight:700;text-align:right;font-family:monospace;font-size:14px;">${orderCode}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8b6f47;font-size:14px;">Phương thức thanh toán</td>
            <td style="padding:6px 0;color:#2d1b0e;font-weight:600;text-align:right;font-size:14px;">${paymentMethod}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8b6f47;font-size:14px;">Địa chỉ giao hàng</td>
            <td style="padding:6px 0;color:#2d1b0e;font-weight:600;text-align:right;font-size:13px;">${shippingAddress}</td>
          </tr>
        </table>
      </div>

      <!-- Items Table -->
      <h3 style="color:#2d1b0e;font-size:16px;margin:0 0 12px;">🛒 Sản phẩm đã đặt</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr style="background:#fdf6ef;">
            <th style="padding:10px 8px;text-align:left;color:#8b6f47;font-size:13px;border-bottom:2px solid #f0e8d0;">Sản phẩm</th>
            <th style="padding:10px 8px;text-align:right;color:#8b6f47;font-size:13px;border-bottom:2px solid #f0e8d0;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>${itemsHTML}</tbody>
      </table>

      <!-- Price Breakdown -->
      <div style="border-top:2px solid #f0e8d0;padding-top:16px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:5px 0;color:#8b6f47;font-size:14px;">Tạm tính</td>
            <td style="padding:5px 0;color:#2d1b0e;text-align:right;font-size:14px;">${formatPrice(subtotal)}</td>
          </tr>
          ${discount > 0 ? `<tr><td style="padding:5px 0;color:#16a34a;font-size:14px;">Giảm giá</td><td style="padding:5px 0;color:#16a34a;text-align:right;font-size:14px;">- ${formatPrice(discount)}</td></tr>` : ''}
          <tr>
            <td style="padding:5px 0;color:#8b6f47;font-size:14px;">Phí vận chuyển</td>
            <td style="padding:5px 0;color:#2d1b0e;text-align:right;font-size:14px;">${shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</td>
          </tr>
          <tr>
            <td style="padding:12px 0 0;color:#2d1b0e;font-size:18px;font-weight:700;">TỔNG TIỀN</td>
            <td style="padding:12px 0 0;color:#c8610a;font-size:20px;font-weight:700;text-align:right;">${formatPrice(total)}</td>
          </tr>
        </table>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-top:32px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/profile/orders"
           style="display:inline-block;background:linear-gradient(135deg,#c8610a,#e07b20);color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">
          Xem chi tiết đơn hàng →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#2d1b0e;padding:24px 32px;text-align:center;">
      <p style="color:#d4a76a;margin:0;font-size:13px;">© 2026 Swift Coffee Store. Mọi quyền được bảo lưu.</p>
      <p style="color:#8b6f47;margin:8px 0 0;font-size:12px;">
        📍 123 Đường Cà Phê, Quận 1, TP.HCM | 📞 0901 234 567
      </p>
    </div>
  </div>
</body>
</html>`;

  return sendEmail({
    to: customerEmail,
    subject: `✅ Xác nhận đơn hàng #${orderCode} - Swift Coffee Store`,
    html,
  });
};

// =============================================================
// Template Email Xac nhan Dang ky Tai khoan
// =============================================================
export const sendWelcomeEmail = async ({ email, name }) => {
  const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><title>Chào mừng đến Swift Coffee</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#fdf6ef;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#2d1b0e,#6b3f22);padding:40px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">☕</div>
      <h1 style="color:#f5deb3;margin:0;font-size:26px;">Chào mừng đến Swift Coffee!</h1>
    </div>
    <div style="padding:40px;">
      <h2 style="color:#2d1b0e;font-size:20px;">Xin chào ${name}! 👋</h2>
      <p style="color:#6b4226;font-size:15px;line-height:1.8;">
        Tài khoản của bạn đã được tạo thành công. Hãy khám phá hàng trăm loại cà phê thượng hạng,
        theo dõi đơn hàng, và nhận ưu đãi thành viên độc quyền.
      </p>
      <div style="text-align:center;margin-top:32px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/menu"
           style="background:linear-gradient(135deg,#c8610a,#e07b20);color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
          Khám phá Menu ☕
        </a>
      </div>
    </div>
    <div style="background:#2d1b0e;padding:20px;text-align:center;">
      <p style="color:#d4a76a;margin:0;font-size:13px;">© 2026 Swift Coffee Store</p>
    </div>
  </div>
</body>
</html>`;

  return sendEmail({
    to: email,
    subject: '☕ Chào mừng đến với Swift Coffee Store!',
    html,
  });
};

// =============================================================
// Template Email OTP Quen Mat khau
// =============================================================
export const sendForgotPasswordEmail = async ({ email, name, otpCode }) => {
  const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><title>Đặt lại mật khẩu</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#fdf6ef;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#2d1b0e,#6b3f22);padding:40px;text-align:center;">
      <div style="font-size:40px;margin-bottom:12px;">🔐</div>
      <h1 style="color:#f5deb3;margin:0;font-size:24px;">Đặt lại mật khẩu</h1>
    </div>
    <div style="padding:40px;">
      <p style="color:#4a2c17;font-size:15px;">Xin chào <strong>${name}</strong>,</p>
      <p style="color:#6b4226;font-size:15px;line-height:1.8;">
        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng dùng mã OTP bên dưới:
      </p>
      <div style="text-align:center;margin:32px 0;">
        <div style="display:inline-block;background:linear-gradient(135deg,#fdf6ef,#f5deb3);border:2px solid #c8610a;border-radius:16px;padding:20px 40px;">
          <div style="font-size:42px;font-weight:900;letter-spacing:8px;color:#c8610a;font-family:monospace;">${otpCode}</div>
          <div style="color:#8b6f47;font-size:13px;margin-top:8px;">Hết hạn sau 10 phút</div>
        </div>
      </div>
      <p style="color:#8b6f47;font-size:13px;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    </div>
    <div style="background:#2d1b0e;padding:20px;text-align:center;">
      <p style="color:#d4a76a;margin:0;font-size:13px;">© 2026 Swift Coffee Store</p>
    </div>
  </div>
</body>
</html>`;

  return sendEmail({
    to: email,
    subject: '🔐 Mã OTP đặt lại mật khẩu - Swift Coffee Store',
    html,
  });
};

// =============================================================
// Template Email Don hang Hoan thanh
// =============================================================
export const sendOrderCompletedEmail = async ({ customerEmail, customerName, orderCode }) => {
  const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><title>Đơn hàng hoàn thành</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#fdf6ef;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#14532d,#166534);padding:40px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🎉</div>
      <h1 style="color:#bbf7d0;margin:0;font-size:24px;">Đơn hàng đã giao thành công!</h1>
    </div>
    <div style="padding:40px;">
      <p style="color:#14532d;font-size:16px;">Xin chào <strong>${customerName}</strong>,</p>
      <p style="color:#166534;font-size:15px;line-height:1.8;">
        Đơn hàng <strong>#${orderCode}</strong> đã được giao thành công. Cảm ơn bạn đã mua sắm tại Swift Coffee! ☕
      </p>
      <p style="color:#4b5563;font-size:14px;">Bạn có thể để lại đánh giá sản phẩm để giúp chúng tôi cải thiện dịch vụ.</p>
      <div style="text-align:center;margin-top:32px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/profile/orders"
           style="background:linear-gradient(135deg,#16a34a,#22c55e);color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block;font-size:15px;">
          Đánh giá sản phẩm ⭐
        </a>
      </div>
    </div>
    <div style="background:#2d1b0e;padding:20px;text-align:center;">
      <p style="color:#d4a76a;margin:0;font-size:13px;">© 2026 Swift Coffee Store</p>
    </div>
  </div>
</body>
</html>`;

  return sendEmail({
    to: customerEmail,
    subject: `🎉 Đơn hàng #${orderCode} đã giao thành công! - Swift Coffee Store`,
    html,
  });
};
