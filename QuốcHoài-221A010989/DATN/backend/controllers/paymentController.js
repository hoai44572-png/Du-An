import {
  createOrderService,
  getPaymentStatusService,
  processWebhookService,
  simulatePaymentSuccessService,
  generateQRCodeUrl,
} from '../services/paymentService.js';
import { sendOrderSuccessEmail } from '../utils/emailService.js';
import { Order, OrderItem, InventoryLog } from '../models/index.js';

// In-memory fallback cho inventory khi chua co MySQL
const inMemoryInventory = new Map();

/**
 * Giam stock san pham sau khi thanh toan thanh cong
 * Ghi nhat ky nhap/xuat kho vao InventoryLog
 */
const deductInventoryForOrder = async (orderCode) => {
  try {
    // Tim don hang va danh sach san pham
    const order = await Order.findOne({
      where: { orderCode },
      include: [{ model: OrderItem, as: 'items' }],
    });

    const items = order?.items || [];

    for (const item of items) {
      try {
        // Ghi log xuat kho vao InventoryLog
        await InventoryLog.create({
          productId: String(item.productId),
          productName: item.productName || 'San pham',
          changeQuantity: -(item.quantity || 1),
          type: 'sale',
          note: `Xuat kho do don hang #${orderCode} thanh toan thanh cong`,
        });
        console.log(`📦 Xuat kho san pham #${item.productId}: -${item.quantity}`);
      } catch (logErr) {
        console.warn('⚠️ Khong the ghi InventoryLog:', logErr.message);
      }
    }
  } catch (err) {
    console.warn('⚠️ Khong the tru ton kho:', err.message);
  }
};

/**
 * Controller Tao don hang moi & Khoi tao thanh toan
 */
export const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    if (!orderData || !orderData.customerName || !orderData.customerPhone || !orderData.shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Vui long cung cap day du thong tin khach hang (Ho ten, SDT, Dia chi)',
      });
    }

    const result = await createOrderService(orderData);
    return res.status(201).json(result);
  } catch (err) {
    console.error('Loi khi tao don hang:', err);
    return res.status(500).json({
      success: false,
      message: 'Khong the khoi tao don hang',
      error: err.message,
    });
  }
};

/**
 * Controller Kiem tra trang thai thanh toan real-time
 */
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderCode } = req.params;
    if (!orderCode) {
      return res.status(400).json({ success: false, message: 'Thieu ma don hang' });
    }

    const result = await getPaymentStatusService(orderCode);
    if (!result.success) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Loi truy van trang thai thanh toan', error: err.message });
  }
};

/**
 * Controller Nhan du lieu Webhook tu dong tu cong SePay / PayOS
 * SAU KHI thanh toan thanh cong: Tu dong tru ton kho + Gui email xac nhan
 */
export const handleWebhook = async (req, res) => {
  try {
    const payload = req.body;
    console.log('🔔 Da nhan Webhook thanh toan:', JSON.stringify(payload));

    const result = await processWebhookService(payload);

    if (result.success) {
      // --- BUO'C 1: Tru ton kho tu dong ---
      if (result.orderCode) {
        await deductInventoryForOrder(result.orderCode);
      }

      // --- BUO'C 2: Tim thong tin don hang de gui email ---
      try {
        let order = null;
        try {
          order = await Order.findOne({
            where: { orderCode: result.orderCode },
            include: [{ model: OrderItem, as: 'items' }],
          });
        } catch {}

        if (order && order.customerEmail) {
          // Gui email hoa don HTML dep
          await sendOrderSuccessEmail({
            customerEmail: order.customerEmail,
            customerName: order.customerName,
            orderCode: order.orderCode,
            items: order.items || [],
            subtotal: (order.total || 0) - (order.shippingFee || 0) + (order.discount || 0),
            discount: order.discount || 0,
            shippingFee: order.shippingFee || 0,
            total: order.total || 0,
            paymentMethod: order.paymentMethod,
            shippingAddress: order.shippingAddress,
          });
          console.log('✅ Da gui email xac nhan don hang den:', order.customerEmail);
        }
      } catch (emailErr) {
        console.warn('⚠️ Khong the gui email:', emailErr.message);
      }

      return res.status(200).json({
        error: 0,
        message: 'Success',
        data: result,
      });
    } else {
      return res.status(400).json({
        error: 1,
        message: result.message,
      });
    }
  } catch (err) {
    console.error('Loi xu ly Webhook:', err);
    return res.status(500).json({ error: 1, message: err.message });
  }
};

/**
 * Controller Mo phong / Test Thanh toan QR thanh cong (Dung cho Demo Quet QR)
 */
export const simulateWebhook = async (req, res) => {
  try {
    const { orderCode } = req.body;
    if (!orderCode) {
      return res.status(400).json({ success: false, message: 'Vui long truyen orderCode' });
    }

    const result = await simulatePaymentSuccessService(orderCode);

    // Sau khi simulate thanh cong thi cung tru ton kho + gui email
    if (result.success && result.orderCode) {
      await deductInventoryForOrder(result.orderCode);

      try {
        const order = await Order.findOne({
          where: { orderCode: result.orderCode },
          include: [{ model: OrderItem, as: 'items' }],
        });

        if (order?.customerEmail) {
          await sendOrderSuccessEmail({
            customerEmail: order.customerEmail,
            customerName: order.customerName,
            orderCode: order.orderCode,
            items: order.items || [],
            subtotal: (order.total || 0) - (order.shippingFee || 0) + (order.discount || 0),
            discount: order.discount || 0,
            shippingFee: order.shippingFee || 0,
            total: order.total || 0,
            paymentMethod: order.paymentMethod,
            shippingAddress: order.shippingAddress,
          });
        }
      } catch {}
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Controller Tao Don Hang PayPal Checkout
 */
export const createPayPalOrder = async (req, res) => {
  try {
    const { amount, orderCode } = req.body;
    const paypalOrderID = `PAYPAL_ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return res.status(200).json({
      success: true,
      paypalOrderID,
      orderCode,
      message: 'Khoi tao PayPal Checkout thanh cong',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Controller Duyet & Capture Thanh Toan PayPal
 */
export const capturePayPalOrder = async (req, res) => {
  try {
    const { paypalOrderID, orderCode } = req.body;
    const transactionId = `PP_TXN_${Date.now()}`;

    const result = await processWebhookService({
      content: `PayPal Checkout ${orderCode}`,
      referenceCode: transactionId,
      orderCode,
    });

    if (result.success) {
      await deductInventoryForOrder(orderCode);
    }

    return res.status(200).json({
      success: true,
      message: 'Thanh toan qua PayPal thanh cong!',
      transactionId,
      orderCode,
      result,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
