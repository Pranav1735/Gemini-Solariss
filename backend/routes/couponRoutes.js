import express from 'express';
import {
  getCoupons,
  validateCoupon,
  getAllCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCoupons);
router.post('/validate', validateCoupon);
router.get('/admin/all', protect, admin, getAllCoupons);
router.get('/admin/:id', protect, admin, getCoupon);
router.post('/admin', protect, admin, createCoupon);
router.put('/admin/:id', protect, admin, updateCoupon);
router.delete('/admin/:id', protect, admin, deleteCoupon);

export default router;

