import { Order } from '../models/index.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import paypal from 'paypal-rest-sdk';

// Initialize payment gateways
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const razorpay = (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
  : null;

if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
  paypal.configure({
    mode: process.env.PAYPAL_MODE || 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
  });
}

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create-intent
// @access  Private
export const createStripeIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: 'Stripe is not configured'
      });
    }

    const order = await Order.findByPk(orderId);
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Convert to cents (Stripe uses smallest currency unit)
    const amount = Math.round(parseFloat(order.total) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      metadata: {
        orderId: order.id,
        userId: req.user.id
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Confirm Stripe payment
// @route   POST /api/payments/stripe/confirm
// @access  Private
export const confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: 'Stripe is not configured'
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const order = await Order.findByPk(orderId);
      if (order) {
        await order.update({
          paymentStatus: 'completed',
          paymentId: paymentIntentId,
          status: 'confirmed'
        });
      }

      const updatedOrder = await Order.findByPk(orderId);

      res.json({
        success: true,
        message: 'Payment successful',
        order: updatedOrder
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay/create-order
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay is not configured'
      });
    }

    const order = await Order.findByPk(orderId);
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Convert to paise (Razorpay uses smallest currency unit)
    const amount = Math.round(parseFloat(order.total) * 100);

    const options = {
      amount,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        userId: req.user.id
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay is not configured'
      });
    }

    const crypto = await import('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature === razorpaySignature) {
      const order = await Order.findByPk(orderId);
      if (order) {
        await order.update({
          paymentStatus: 'completed',
          paymentId: razorpayPaymentId,
          status: 'confirmed'
        });
      }

      const updatedOrder = await Order.findByPk(orderId);

      res.json({
        success: true,
        message: 'Payment verified successfully',
        order: updatedOrder
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create PayPal payment
// @route   POST /api/payments/paypal/create
// @access  Private
export const createPayPalPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!process.env.PAYPAL_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: 'PayPal is not configured'
      });
    }

    const order = await Order.findByPk(orderId);
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const createPaymentJson = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `${process.env.FRONTEND_URL}/payment/success?orderId=${orderId}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      },
      transactions: [{
        item_list: {
          items: [{
            name: `Order ${order.orderNumber}`,
            sku: order.id,
            price: parseFloat(order.total).toFixed(2),
            currency: 'INR',
            quantity: 1
          }]
        },
        amount: {
          currency: 'INR',
          total: parseFloat(order.total).toFixed(2)
        },
        description: `Order ${order.orderNumber}`
      }]
    };

    paypal.payment.create(createPaymentJson, (error, payment) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      } else {
        const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
        res.json({
          success: true,
          paymentId: payment.id,
          approvalUrl: approvalUrl.href
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Execute PayPal payment
// @route   POST /api/payments/paypal/execute
// @access  Private
export const executePayPalPayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    if (!process.env.PAYPAL_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: 'PayPal is not configured'
      });
    }

    const executePaymentJson = {
      payer_id: payerId
    };

    paypal.payment.execute(paymentId, executePaymentJson, async (error, payment) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      } else if (payment.state === 'approved') {
        const order = await Order.findByPk(orderId);
        if (order) {
          await order.update({
            paymentStatus: 'completed',
            paymentId: paymentId,
            status: 'confirmed'
          });
        }

        const updatedOrder = await Order.findByPk(orderId);

        res.json({
          success: true,
          message: 'Payment successful',
          order: updatedOrder
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Payment not approved'
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
