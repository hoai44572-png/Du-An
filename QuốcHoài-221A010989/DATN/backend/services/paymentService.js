import { Order, OrderItem, Payment } from '../models/index.js';

// In-memory cache fallback khi chưa có MySQL Server thật đang chạy
const inMemoryOrders = new Map();
const inMemoryPayments = new Map();

// Cấu hình Ngân hàng / Tài khoản cho VietQR / SePay / PayOS
const BANK_CONFIG = {
  bankName: 'MBBank (Ngân hàng Quân Đội)',
  bankCode: 'MB',
  accountNo: '0388888888',
  accountName: 'SWIFT COFFEE STORE',
};

/**
 * Sinh mã đơn hàng ngẫu nhiên duy nhất
 */
export const generateOrderCode = () => {
  const prefix = 'TT';
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${randomNumber}`;
};

/**
 * Tạo link VietQR / QR Code động
 */
export const generateQRCodeUrl = (amount, orderCode, paymentMethod = 'Banking') => {
  // Quy đổi USD sang VND (Giả định 1 USD = 25,400 VND) nếu số tiền nhỏ
  const amountVND = amount < 1000 ? Math.round(amount * 25400) : Math.round(amount);
  const addInfo = encodeURIComponent(orderCode);
  const accountName = encodeURIComponent(BANK_CONFIG.accountName);

  // Link API chuẩn VietQR miễn phí, tự động tạo QR hiển thị app ngân hàng
  return `https://img.vietqr.io/image/${BANK_CONFIG.bankCode}-${BANK_CONFIG.accountNo}-compact2.png?amount=${amountVND}&addInfo=${addInfo}&accountName=${accountName}`;
};

/**
 * Tạo Đơn hàng mới và lưu vào MySQL DB hoặc In-Memory
 */
export const createOrderService = async (orderData) => {
  const orderCode = generateOrderCode();
  const {
    userId = 'GUEST',
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    note = '',
    items = [],
    total,
    shippingFee = 0,
    discount = 0,
    paymentMethod = 'COD',
  } = orderData;

  const isPaidDirectly = paymentMethod === 'COD'; // COD mặc định Pending, QR/PayOS/SePay/PayPal chờ xác nhận thanh toán
  const initialPaymentStatus = isPaidDirectly ? 'Pending' : 'Pending';

  let orderRecord;

  try {
    // 1. Thử tạo vào MySQL với Sequelize
    orderRecord = await Order.create({
      orderCode,
      userId,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      note,
      total,
      shippingFee,
      discount,
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      orderStatus: 'pending',
    });

    // Lưu danh sách sản phẩm
    if (items && items.length > 0) {
      const itemRecords = items.map((item) => ({
        orderId: orderRecord.id,
        productId: String(item.id || item.productId),
        productName: item.name || item.productName,
        quantity: item.quantity,
        price: item.price,
      }));
      await OrderItem.bulkCreate(itemRecords);
    }

    // Tạo bản ghi Payments tương ứng
    await Payment.create({
      orderId: orderRecord.id,
      paymentMethod,
      amount: total,
      status: initialPaymentStatus,
    });
  } catch (err) {
    console.warn('⚠️ MySQL chưa sẵn sàng, lưu tạm đơn hàng vào bộ nhớ RAM:', err.message);
    
    // Fallback lưu tạm vào RAM để website hoạt động 100% không bị lỗi kết nối
    const id = Date.now();
    orderRecord = {
      id,
      orderCode,
      userId,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      note,
      total,
      shippingFee,
      discount,
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      items,
    };
    inMemoryOrders.set(orderCode, orderRecord);
    inMemoryPayments.set(orderCode, {
      id,
      orderId: id,
      orderCode,
      paymentMethod,
      amount: total,
      status: initialPaymentStatus,
      transactionId: null,
      paidAt: null,
    });
  }

  // Nếu là phương thức chuyển khoản/SePay/PayOS thì trả thêm thông tin QR Code
  let qrInfo = null;
  if (['Banking', 'SePay', 'PayOS'].includes(paymentMethod)) {
    qrInfo = {
      qrCodeUrl: generateQRCodeUrl(total, orderCode, paymentMethod),
      bankName: BANK_CONFIG.bankName,
      accountNo: BANK_CONFIG.accountNo,
      accountName: BANK_CONFIG.accountName,
      transferContent: orderCode,
      amount: total,
      expiresInSeconds: 900, // 15 phút hết hạn
    };
  }

  return {
    success: true,
    orderCode,
    order: orderRecord,
    qrInfo,
  };
};

/**
 * Lấy trạng thái thanh toán của đơn hàng theo OrderCode
 */
export const getPaymentStatusService = async (orderCode) => {
  try {
    const order = await Order.findOne({
      where: { orderCode },
      include: [{ model: Payment, as: 'payments' }],
    });

    if (order) {
      return {
        success: true,
        orderCode: order.orderCode,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        total: order.total,
        paidAt: order.payments?.[0]?.paidAt || null,
        transactionId: order.payments?.[0]?.transactionId || null,
      };
    }
  } catch (err) {
    // Fallback memory check
  }

  const memOrder = inMemoryOrders.get(orderCode);
  const memPayment = inMemoryPayments.get(orderCode);

  if (memOrder) {
    return {
      success: true,
      orderCode: memOrder.orderCode,
      paymentStatus: memOrder.paymentStatus,
      orderStatus: memOrder.orderStatus,
      paymentMethod: memOrder.paymentMethod,
      total: memOrder.total,
      paidAt: memPayment?.paidAt || null,
      transactionId: memPayment?.transactionId || null,
    };
  }

  return {
    success: false,
    message: 'Không tìm thấy đơn hàng',
  };
};

/**
 * Xử lý Webhook SePay / PayOS nhận giao dịch tự động
 */
export const processWebhookService = async (webhookPayload) => {
  // SePay payload: { content: "TT123456 thanh toan", transferAmount: 150000, referenceCode: "FT2401...", ... }
  // PayOS payload: { code: "00", data: { orderCode: 123456, amount: 150000, reference: "PAYOS..." } }
  const contentText = webhookPayload.content || webhookPayload.description || webhookPayload.data?.description || '';
  const orderCodeMatch = contentText.match(/TT\d{6}/i) || [webhookPayload.orderCode || webhookPayload.data?.orderCode];
  const orderCode = orderCodeMatch ? String(orderCodeMatch[0]).toUpperCase() : null;

  const transactionId = webhookPayload.referenceCode || webhookPayload.transactionId || webhookPayload.data?.reference || `TXN_${Date.now()}`;
  const paidAt = new Date().toISOString();

  if (!orderCode) {
    return { success: false, message: 'Nội dung chuyển khoản không chứa mã đơn hàng TTxxxxxx' };
  }

  try {
    const order = await Order.findOne({ where: { orderCode } });
    if (order) {
      order.paymentStatus = 'Paid';
      order.orderStatus = 'preparing';
      await order.save();

      await Payment.update(
        { status: 'Paid', transactionId, paidAt: new Date() },
        { where: { orderId: order.id } }
      );

      return {
        success: true,
        message: 'Cập nhật thanh toán thành công qua Webhook (DB)',
        orderCode,
        transactionId,
      };
    }
  } catch (err) {
    // Fallback RAM update
  }

  const memOrder = inMemoryOrders.get(orderCode);
  if (memOrder) {
    memOrder.paymentStatus = 'Paid';
    memOrder.orderStatus = 'preparing';
    const memPay = inMemoryPayments.get(orderCode);
    if (memPay) {
      memPay.status = 'Paid';
      memPay.transactionId = transactionId;
      memPay.paidAt = paidAt;
    }
    return {
      success: true,
      message: 'Cập nhật thanh toán thành công qua Webhook (RAM)',
      orderCode,
      transactionId,
    };
  }

  return { success: false, message: 'Đơn hàng không tồn tại trong hệ thống' };
};

/**
 * Giả lập mô phỏng thanh toán thành công (cho Demo/Quét QR test)
 */
export const simulatePaymentSuccessService = async (orderCode) => {
  const transactionId = `SIM_PAY_${Math.floor(100000 + Math.random() * 900000)}`;
  const paidAt = new Date().toISOString();

  return await processWebhookService({
    content: `Thanh toan don hang ${orderCode}`,
    referenceCode: transactionId,
    orderCode,
  });
};
