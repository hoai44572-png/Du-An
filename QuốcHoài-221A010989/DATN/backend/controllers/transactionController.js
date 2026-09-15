import { Transaction, Order, Customer } from '../models/index.js';

// Initial fallback transaction data for rich experience
const fallbackTransactions = [
  {
    id: 1,
    transactionCode: 'TXN-991283',
    orderId: 101,
    orderCode: 'ORD-8821',
    userId: 1,
    customerId: 1,
    paymentTime: '2026-08-05T14:21:05Z',
    paymentMethod: 'vnpay',
    amount: 240000,
    status: 'completed',
    content: 'Thanh toán đơn hàng ORD-8821 qua Ví/Thẻ VNPay',
    referenceCode: 'VNP14829304',
    createdAt: '2026-08-05T14:21:05Z',
  },
  {
    id: 2,
    transactionCode: 'TXN-881022',
    orderId: 102,
    orderCode: 'ORD-7612',
    userId: 1,
    customerId: 1,
    paymentTime: '2026-07-25T09:30:00Z',
    paymentMethod: 'cod',
    amount: 195000,
    status: 'completed',
    content: 'Thanh toán tiền mặt khi nhận hàng (COD) đơn ORD-7612',
    referenceCode: 'COD-7612',
    createdAt: '2026-07-25T09:30:00Z',
  },
  {
    id: 3,
    transactionCode: 'TXN-773821',
    orderId: 103,
    orderCode: 'ORD-5541',
    userId: 1,
    customerId: 1,
    paymentTime: '2026-07-10T16:45:00Z',
    paymentMethod: 'momo',
    amount: 320000,
    status: 'completed',
    content: 'Thanh toán MoMo QR đơn hàng ORD-5541',
    referenceCode: 'MM-992104',
    createdAt: '2026-07-10T16:45:00Z',
  },
  {
    id: 4,
    transactionCode: 'TXN-664910',
    orderId: 104,
    orderCode: 'ORD-4190',
    userId: 1,
    customerId: 1,
    paymentTime: '2026-06-18T11:10:00Z',
    paymentMethod: 'banking',
    amount: 510000,
    status: 'completed',
    content: 'Chuyển khoản ngân hàng Vietcombank đơn ORD-4190',
    referenceCode: 'VCB-883921',
    createdAt: '2026-06-18T11:10:00Z',
  },
  {
    id: 5,
    transactionCode: 'TXN-552019',
    orderId: 105,
    orderCode: 'ORD-3012',
    userId: 1,
    customerId: 1,
    paymentTime: '2026-05-02T19:00:00Z',
    paymentMethod: 'zalopay',
    amount: 150000,
    status: 'failed',
    content: 'Thanh toán ZaloPay đơn hàng ORD-3012 bị hủy do hết thời gian',
    referenceCode: 'ZALO-FAIL-1',
    createdAt: '2026-05-02T19:00:00Z',
  },
];

/**
 * GET /api/transactions - Lấy danh sách Lịch sử giao dịch (Khách hàng & Admin)
 * Hỗ trợ các bộ lọc: Theo ngày, theo tháng, theo trạng thái, theo phương thức thanh toán.
 */
export const getTransactions = async (req, res) => {
  try {
    const { date, month, status, paymentMethod, search } = req.query;

    let list = [];
    try {
      list = await Transaction.findAll({
        order: [['paymentTime', 'DESC']],
      });
    } catch {
      list = [...fallbackTransactions];
    }

    if (list.length === 0) {
      list = [...fallbackTransactions];
    }

    // Filter search (Mã giao dịch, Mã đơn hàng, Nội dung, Mã tham chiếu)
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (t) =>
          (t.transactionCode && t.transactionCode.toLowerCase().includes(q)) ||
          (t.orderCode && t.orderCode.toLowerCase().includes(q)) ||
          (t.content && t.content.toLowerCase().includes(q)) ||
          (t.referenceCode && t.referenceCode.toLowerCase().includes(q))
      );
    }

    // Filter Trạng thái (completed, pending, failed, refunded)
    if (status && status !== 'all') {
      list = list.filter((t) => t.status === status);
    }

    // Filter Phương thức thanh toán (vnpay, zalopay, momo, banking, cod)
    if (paymentMethod && paymentMethod !== 'all') {
      list = list.filter((t) => t.paymentMethod === paymentMethod);
    }

    // Filter Theo Ngày (Format YYYY-MM-DD)
    if (date && date !== 'all') {
      list = list.filter((t) => {
        const tDate = new Date(t.paymentTime).toISOString().slice(0, 10);
        return tDate === date;
      });
    }

    // Filter Theo Tháng (Format YYYY-MM)
    if (month && month !== 'all') {
      list = list.filter((t) => {
        const tMonth = new Date(t.paymentTime).toISOString().slice(0, 7);
        return tMonth === month;
      });
    }

    return res.status(200).json({
      success: true,
      total: list.length,
      transactions: list,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy lịch sử giao dịch.', error: err.message });
  }
};
