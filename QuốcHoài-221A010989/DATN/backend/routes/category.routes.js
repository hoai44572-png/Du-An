import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

// GET /api/categories — Public categories list
router.get('/', getCategories);

// POST /api/categories — Create category
router.post('/', createCategory);

// PUT /api/categories/:id — Update category
router.put('/:id', updateCategory);

// DELETE /api/categories/:id — Delete category
router.delete('/:id', deleteCategory);

export default router;
