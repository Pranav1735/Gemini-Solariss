import express from 'express';
import {
  getDashboardStats,
  getSalesAnalytics
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, admin); // All admin routes require admin

router.get('/dashboard', getDashboardStats);
router.get('/analytics/sales', getSalesAnalytics);

export default router;

