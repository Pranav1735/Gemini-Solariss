import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  getInvoice,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All order routes require authentication

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/admin/all', admin, getAllOrders);
router.get('/:id', getOrder);
router.get('/:id/invoice', getInvoice);
router.put('/:id/status', admin, updateOrderStatus);
router.put('/:id/payment', admin, updatePaymentStatus);

export default router;

