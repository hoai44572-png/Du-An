import { Category, Product, AdminActivityLog } from '../models/index.js';

// ===== Helper: Tạo slug =====
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

const logActivity = async (adminId, adminName, action, description, targetId, req) => {
  try {
    await AdminActivityLog.create({
      adminId, adminName, action, module: 'CATEGORY',
      description, targetId: String(targetId || ''),
      ipAddress: req?.ip || 'unknown',
      userAgent: req?.headers?.['user-agent'] || 'unknown',
    });
  } catch (err) {
    console.warn('⚠️ Không ghi được category log:', err.message);
  }
};

/**
 * GET /api/admin/categories — Lấy tất cả danh mục
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    });

    // Đếm số sản phẩm trong mỗi danh mục
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.count({
          where: { categoryId: cat.id, status: { $ne: 'deleted' } }
        }).catch(() => 0);
        return { ...cat.toJSON(), productCount: count };
      })
    );

    return res.status(200).json({ success: true, categories: categoriesWithCount });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy danh mục.', error: err.message });
  }
};

/**
 * POST /api/admin/categories — Tạo danh mục mới
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description, image, icon, status, sortOrder } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Tên danh mục là bắt buộc.' });
    }

    let slug = createSlug(name);
    const existing = await Category.findOne({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || null,
      icon: icon || '☕',
      status: status || 'active',
      sortOrder: sortOrder || 0,
    });

    await logActivity(req.admin.id, req.admin.fullName, 'CREATE',
      `Thêm danh mục: "${name}"`, category.id, req);

    return res.status(201).json({
      success: true,
      message: `Danh mục "${name}" đã được tạo.`,
      category,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi tạo danh mục.', error: err.message });
  }
};

/**
 * PUT /api/admin/categories/:id — Cập nhật danh mục
 */
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục.' });
    }

    const { name, description, image, icon, status, sortOrder } = req.body;

    let newSlug = category.slug;
    if (name && name !== category.name) {
      newSlug = createSlug(name);
      const slugExists = await Category.findOne({
        where: { slug: newSlug, id: { $ne: category.id } }
      }).catch(() => null);
      if (slugExists) newSlug = `${newSlug}-${Date.now()}`;
    }

    await category.update({
      name: name || category.name,
      slug: newSlug,
      description: description !== undefined ? description : category.description,
      image: image !== undefined ? image : category.image,
      icon: icon || category.icon,
      status: status || category.status,
      sortOrder: sortOrder !== undefined ? sortOrder : category.sortOrder,
    });

    await logActivity(req.admin.id, req.admin.fullName, 'UPDATE',
      `Cập nhật danh mục: "${category.name}"`, category.id, req);

    return res.status(200).json({ success: true, message: 'Cập nhật danh mục thành công.', category });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật danh mục.', error: err.message });
  }
};

/**
 * DELETE /api/admin/categories/:id — Xóa danh mục
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục.' });
    }

    // Kiểm tra còn sản phẩm trong danh mục không
    const productCount = await Product.count({
      where: { categoryId: category.id }
    }).catch(() => 0);

    if (productCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Không thể xóa danh mục "${category.name}" vì còn ${productCount} sản phẩm. Hãy chuyển sản phẩm sang danh mục khác trước.`,
      });
    }

    const catName = category.name;
    await category.destroy();

    await logActivity(req.admin.id, req.admin.fullName, 'DELETE',
      `Xóa danh mục: "${catName}"`, req.params.id, req);

    return res.status(200).json({ success: true, message: `Danh mục "${catName}" đã được xóa.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi xóa danh mục.', error: err.message });
  }
};
