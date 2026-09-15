import express from 'express';
import { getTransactions } from '../controllers/transactionController.js';

const router = express.Router();

// GET /api/transactions - Lấy lịch sử giao dịch
router.get('/', getTransactions);

export default router;
