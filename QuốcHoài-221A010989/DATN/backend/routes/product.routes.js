import express from 'express';
import {
  getProducts,
  getPublicProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// GET /api/products — Public products list
router.get('/', getPublicProducts);

// GET /api/products/:id — Public product detail
router.get('/:id', getProductById);

// POST /api/products — Create product
router.post('/', createProduct);

// PUT /api/products/:id — Update product
router.put('/:id', updateProduct);

// DELETE /api/products/:id — Delete product
router.delete('/:id', deleteProduct);

export default router;
