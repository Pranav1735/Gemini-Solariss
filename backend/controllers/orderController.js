import { Order, OrderItem, Cart, CartItem, Product, Coupon, User } from '../models/index.js';
import { generateInvoicePDF } from '../utils/generateInvoice.js';
import { Op } from 'sequelize';
import { sequelize } from '../models/index.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address and payment method are required'
      });
    }

    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product'
          }]
        },
        {
          model: Coupon,
          as: 'coupon'
        }
      ],
      transaction
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate totals
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findByPk(item.productId, { transaction });
      
      if (!product || !product.isActive) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Product ${item.product.name} is no longer available`
        });
      }

      const itemTotal = parseFloat(item.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: item.price,
        image: product.images && product.images[0] ? product.images[0] : ''
      });
    }

    // Calculate discount
    let discount = 0;
    let couponId = null;
    if (cart.coupon) {
      const coupon = await Coupon.findByPk(cart.coupon.id, { transaction });
      if (coupon && coupon.isValid()) {
        discount = coupon.calculateDiscount(subtotal);
        couponId = coupon.id;
        await coupon.update({ usedCount: coupon.usedCount + 1 }, { transaction });
      }
    }

    // Calculate totals
    const shipping = 0; // Free shipping or calculate based on address
    const tax = (subtotal - discount) * 0.18; // 18% GST
    const total = subtotal - discount + shipping + tax;

    // Generate order number
    const orderCount = await Order.count({ transaction });
    const orderNumber = `GS-${Date.now()}-${String(orderCount + 1).padStart(6, '0')}`;

    // Create order
    const order = await Order.create({
      orderNumber,
      userId: req.user.id,
      shippingAddress,
      paymentMethod,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      couponId,
      notes
    }, { transaction });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      }, { transaction });
    }

    // Clear cart
    await CartItem.destroy({ where: { cartId: cart.id }, transaction });
    await cart.update({ couponId: null }, { transaction });

    await transaction.commit();

    const populatedOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'images']
          }]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      order: populatedOrder
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'images']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'images', 'description']
          }]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get order invoice
// @route   GET /api/orders/:id/invoice
// @access  Private
export const getInvoice = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'images']
          }]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone', 'address']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this invoice'
      });
    }

    // Generate PDF
    const filePath = await generateInvoicePDF(order);

    res.download(filePath, `invoice-${order.orderNumber}.pdf`, (err) => {
      if (err) {
        console.error('Error downloading invoice:', err);
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 1000 } = req.query; // Increased limit to get all orders

    const where = {};
    if (status) {
      where.status = status;
    }

    const offset = (page - 1) * limit;
    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'images']
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.update({
      status,
      trackingNumber: trackingNumber || order.trackingNumber
    });

    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name']
          }]
        }
      ]
    });

    res.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentId } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.update({
      paymentStatus: paymentStatus || order.paymentStatus,
      paymentId: paymentId || order.paymentId
    });

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
