import express from 'express';
import {
  createStripeIntent,
  confirmStripePayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createPayPalPayment,
  executePayPalPayment
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All payment routes require authentication

// Stripe
router.post('/stripe/create-intent', createStripeIntent);
router.post('/stripe/confirm', confirmStripePayment);

// Razorpay
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);

// PayPal
router.post('/paypal/create', createPayPalPayment);
router.post('/paypal/execute', executePayPalPayment);

export default router;

