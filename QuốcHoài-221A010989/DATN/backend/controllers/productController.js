import { Op } from 'sequelize';
import { Product, Category, OrderItem, AdminActivityLog } from '../models/index.js';

// ===== Helper: Tạo slug từ tên sản phẩm =====
const createSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// ===== Helper: Ghi activity log =====
const logActivity = async (adminId, adminName, action, description, targetId, req) => {
  try {
    await AdminActivityLog.create({
      adminId,
      adminName,
      action,
      module: 'PRODUCT',
      description,
      targetId: String(targetId || ''),
      ipAddress: req?.ip || 'unknown',
      userAgent: req?.headers?.['user-agent'] || 'unknown',
    });
  } catch (err) {
    console.warn('⚠️ Không ghi được product activity log:', err.message);
  }
};

/**
 * GET /api/admin/products — Lấy danh sách sản phẩm (admin)
 * Query: ?search=&category=&status=&page=1&limit=20&featured=
 */
export const getProducts = async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 50, featured } = req.query;

    const where = {
      status: { [Op.ne]: 'deleted' }, // Không lấy sản phẩm đã xóa cứng
    };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status && status !== 'ALL') where.status = status;
    if (featured === 'true') where.featured = true;

    const categoryWhere = {};
    if (category && category !== 'ALL') {
      categoryWhere.name = category;
    }

    const products = await Product.findAndCountAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
        where: Object.keys(categoryWhere).length ? categoryWhere : undefined,
        required: Object.keys(categoryWhere).length > 0,
      }],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    return res.status(200).json({
      success: true,
      products: products.rows,
      total: products.count,
      page: Number(page),
      totalPages: Math.ceil(products.count / Number(limit)),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách sản phẩm.', error: err.message });
  }
};

/**
 * GET /api/admin/products/public — Lấy sản phẩm cho website khách hàng (chỉ active)
 */
export const getPublicProducts = async (req, res) => {
  try {
    const { search, category, featured, page = 1, limit = 50 } = req.query;

    const where = { status: 'active' };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
      ];
    }

    if (featured === 'true') where.featured = true;

    const products = await Product.findAndCountAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
        where: category && category !== 'ALL' ? { name: category } : undefined,
        required: false,
      }],
      order: [['sold', 'DESC'], ['createdAt', 'DESC']],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    return res.status(200).json({
      success: true,
      products: products.rows,
      total: products.count,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy sản phẩm.', error: err.message });
  }
};

/**
 * GET /api/admin/products/:id — Lấy chi tiết sản phẩm
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
    });

    if (!product || product.status === 'deleted') {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }

    return res.status(200).json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy sản phẩm.', error: err.message });
  }
};

/**
 * POST /api/admin/products — Tạo sản phẩm mới
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name, categoryId, description, price, salePrice, costPrice,
      stock, image, images, variants, status, featured, sku,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Tên sản phẩm và giá là bắt buộc.' });
    }

    if (price < 0) {
      return res.status(400).json({ success: false, message: 'Giá sản phẩm không hợp lệ.' });
    }

    // Tạo slug duy nhất
    let slug = createSlug(name);
    const existing = await Product.findOne({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    // Kiểm tra SKU nếu có
    if (sku) {
      const skuExists = await Product.findOne({ where: { sku } });
      if (skuExists) {
        return res.status(409).json({ success: false, message: 'SKU này đã tồn tại.' });
      }
    }

    const product = await Product.create({
      name,
      slug,
      sku: sku || null,
      categoryId: categoryId || null,
      description: description || '',
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      costPrice: costPrice ? Number(costPrice) : null,
      stock: Number(stock) || 0,
      sold: 0,
      image: image || null,
      images: images || [],
      variants: variants || [],
      status: status || 'active',
      featured: featured || false,
    });

    // Lấy thêm thông tin category
    const productWithCategory = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
    });

    await logActivity(req.admin.id, req.admin.fullName, 'CREATE',
      `Thêm sản phẩm mới: "${name}" - Giá: ${price}đ`, product.id, req);

    return res.status(201).json({
      success: true,
      message: `Sản phẩm "${name}" đã được thêm thành công.`,
      product: productWithCategory,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi tạo sản phẩm.', error: err.message });
  }
};

/**
 * PUT /api/admin/products/:id — Cập nhật sản phẩm
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product || product.status === 'deleted') {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }

    const {
      name, categoryId, description, price, salePrice, costPrice,
      stock, image, images, variants, status, featured, sku,
    } = req.body;

    // Nếu đổi tên → cập nhật slug
    let newSlug = product.slug;
    if (name && name !== product.name) {
      newSlug = createSlug(name);
      const slugExists = await Product.findOne({
        where: { slug: newSlug, id: { [Op.ne]: product.id } }
      });
      if (slugExists) newSlug = `${newSlug}-${Date.now()}`;
    }

    // Kiểm tra SKU nếu đổi
    if (sku && sku !== product.sku) {
      const skuExists = await Product.findOne({
        where: { sku, id: { [Op.ne]: product.id } }
      });
      if (skuExists) {
        return res.status(409).json({ success: false, message: 'SKU này đã tồn tại.' });
      }
    }

    await product.update({
      name: name || product.name,
      slug: newSlug,
      sku: sku !== undefined ? sku : product.sku,
      categoryId: categoryId !== undefined ? categoryId : product.categoryId,
      description: description !== undefined ? description : product.description,
      price: price !== undefined ? Number(price) : product.price,
      salePrice: salePrice !== undefined ? (salePrice ? Number(salePrice) : null) : product.salePrice,
      costPrice: costPrice !== undefined ? (costPrice ? Number(costPrice) : null) : product.costPrice,
      stock: stock !== undefined ? Number(stock) : product.stock,
      image: image !== undefined ? image : product.image,
      images: images !== undefined ? images : product.images,
      variants: variants !== undefined ? variants : product.variants,
      status: status || product.status,
      featured: featured !== undefined ? featured : product.featured,
    });

    const updated = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
    });

    await logActivity(req.admin.id, req.admin.fullName, 'UPDATE',
      `Cập nhật sản phẩm: "${product.name}"`, product.id, req);

    return res.status(200).json({
      success: true,
      message: `Sản phẩm "${product.name}" đã được cập nhật.`,
      product: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật sản phẩm.', error: err.message });
  }
};

/**
 * DELETE /api/admin/products/:id — Xóa sản phẩm
 * Soft delete nếu có OrderItem liên quan, hard delete nếu chưa có
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product || product.status === 'deleted') {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }

    // Kiểm tra có OrderItem liên quan không
    let hasOrders = false;
    try {
      const orderItemCount = await OrderItem.count({
        where: { productId: product.id }
      });
      hasOrders = orderItemCount > 0;
    } catch {
      // Nếu cột productId chưa có → soft delete mặc định
      hasOrders = true;
    }

    const productName = product.name;

    if (hasOrders) {
      // Soft delete: đánh dấu status = deleted + deletedAt
      await product.update({ status: 'deleted', deletedAt: new Date() });
      await logActivity(req.admin.id, req.admin.fullName, 'SOFT_DELETE',
        `Xóa mềm sản phẩm: "${productName}" (còn liên kết đơn hàng)`, product.id, req);

      return res.status(200).json({
        success: true,
        message: `Sản phẩm "${productName}" đã được ẩn (xóa mềm) vì đã có đơn hàng liên quan.`,
        softDeleted: true,
      });
    } else {
      // Hard delete
      await product.destroy();
      await logActivity(req.admin.id, req.admin.fullName, 'DELETE',
        `Xóa vĩnh viễn sản phẩm: "${productName}"`, req.params.id, req);

      return res.status(200).json({
        success: true,
        message: `Sản phẩm "${productName}" đã được xóa vĩnh viễn.`,
        softDeleted: false,
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi xóa sản phẩm.', error: err.message });
  }
};
