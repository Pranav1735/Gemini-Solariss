import { Cart, CartItem, Product, Coupon, User } from '../models/index.js';
import { generateQuotationPDF } from '../utils/generateQuotation.js';

// Helper to calculate cart totals
const calculateCartTotals = (cart, items) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.price) * item.quantity);
  }, 0);
  
  let discount = 0;
  if (cart.coupon) {
    const coupon = cart.coupon;
    if (coupon.isValid && coupon.isValid()) {
      discount = coupon.calculateDiscount(subtotal);
    }
  }
  
  const total = subtotal - discount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return { subtotal, discount, total, itemCount };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'images', 'sku']
          }]
        },
        {
          model: Coupon,
          as: 'coupon',
          attributes: ['id', 'code', 'discountType', 'discountValue']
        }
      ]
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
      cart.items = [];
      cart.coupon = null;
    }

    const totals = calculateCartTotals(cart, cart.items || []);

    res.json({
      success: true,
      cart: {
        id: cart.id,
        userId: cart.userId,
        items: cart.items || [],
        coupon: cart.coupon,
        ...totals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    // Check if product already in cart
    const existingItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: productId
      }
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      await existingItem.update({ quantity: newQuantity });
    } else {
      // Add new item
      await CartItem.create({
        cartId: cart.id,
        productId: productId,
        quantity,
        price: product.price
      });
    }

    // Fetch updated cart
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'images', 'sku']
          }]
        },
        {
          model: Coupon,
          as: 'coupon'
        }
      ]
    });

    const totals = calculateCartTotals(updatedCart, updatedCart.items || []);

    res.json({
      success: true,
      cart: {
        id: updatedCart.id,
        userId: updatedCart.userId,
        items: updatedCart.items || [],
        coupon: updatedCart.coupon,
        ...totals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }]
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = await CartItem.findByPk(req.params.itemId);
    if (!item || item.cartId !== cart.id) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    await item.update({ quantity });

    // Fetch updated cart
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'images', 'sku']
          }]
        },
        {
          model: Coupon,
          as: 'coupon'
        }
      ]
    });

    const totals = calculateCartTotals(updatedCart, updatedCart.items || []);

    res.json({
      success: true,
      cart: {
        id: updatedCart.id,
        userId: updatedCart.userId,
        items: updatedCart.items || [],
        coupon: updatedCart.coupon,
        ...totals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = await CartItem.findByPk(req.params.itemId);
    if (item && item.cartId === cart.id) {
      await item.destroy();
    }

    // Fetch updated cart
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'images', 'sku']
          }]
        },
        {
          model: Coupon,
          as: 'coupon'
        }
      ]
    });

    const totals = calculateCartTotals(updatedCart, updatedCart.items || []);

    res.json({
      success: true,
      cart: {
        id: updatedCart.id,
        userId: updatedCart.userId,
        items: updatedCart.items || [],
        coupon: updatedCart.coupon,
        ...totals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });
    await cart.update({ couponId: null });

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Apply coupon
// @route   POST /api/cart/coupon
// @access  Private
export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      });
    }

    const coupon = await Coupon.findOne({
      where: { code: code.toUpperCase() }
    });

    if (!coupon || !coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired coupon'
      });
    }

    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }]
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + (parseFloat(item.price) * item.quantity),
      0
    );

    if (subtotal < coupon.minPurchaseAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase amount of ₹${coupon.minPurchaseAmount} required`
      });
    }

    await cart.update({ couponId: coupon.id });

    // Fetch updated cart
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'images', 'sku']
          }]
        },
        {
          model: Coupon,
          as: 'coupon'
        }
      ]
    });

    const totals = calculateCartTotals(updatedCart, updatedCart.items || []);
    const discount = coupon.calculateDiscount(subtotal);
    totals.discount = discount;
    totals.total = totals.subtotal - discount;

    res.json({
      success: true,
      cart: {
        id: updatedCart.id,
        userId: updatedCart.userId,
        items: updatedCart.items || [],
        coupon: updatedCart.coupon,
        ...totals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate quotation from cart
// @route   GET /api/cart/quotation
// @access  Private
export const generateQuotation = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'images', 'sku']
          }]
        },
        {
          model: Coupon,
          as: 'coupon'
        }
      ]
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please add products to generate a quotation.'
      });
    }

    // Get user details
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'phone', 'address']
    });

    // Calculate totals
    const totals = calculateCartTotals(cart, cart.items);

    // Prepare cart data for quotation
    const cartData = {
      items: cart.items,
      subtotal: totals.subtotal,
      discount: totals.discount,
      total: totals.total
    };

    // Generate quotation PDF
    const filePath = await generateQuotationPDF(cartData, user);

    // Send file for download
    res.download(filePath, `quotation-${Date.now()}.pdf`, (err) => {
      if (err) {
        console.error('Error downloading quotation:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error generating quotation'
          });
        }
      }
    });
  } catch (error) {
    console.error('Error generating quotation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate quotation'
    });
  }
};

// @desc    Remove coupon
// @route   DELETE /api/cart/coupon
// @access  Private
export const removeCoupon = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.update({ couponId: null });

    // Fetch updated cart
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'images', 'sku']
          }]
        },
        {
          model: Coupon,
          as: 'coupon'
        }
      ]
    });

    const totals = calculateCartTotals(updatedCart, updatedCart.items || []);

    res.json({
      success: true,
      cart: {
        id: updatedCart.id,
        userId: updatedCart.userId,
        items: updatedCart.items || [],
        coupon: updatedCart.coupon,
        ...totals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
