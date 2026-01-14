import { Order, Product, User, Category, Coupon, OrderItem } from '../models/index.js';
import { Op } from 'sequelize';
import { sequelize } from '../models/index.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Total stats
    const totalOrders = await Order.count().catch(() => 0);
    
    // Total revenue - count all orders (for admin view, we show all orders regardless of payment status)
    let totalRevenue = 0;
    try {
      const totalRevenueResult = await Order.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('total')), 'total']
        ],
        raw: true
      });
      const revenueValue = totalRevenueResult[0]?.total;
      totalRevenue = revenueValue ? parseFloat(revenueValue) : 0;
    } catch (err) {
      console.error('Error calculating total revenue:', err);
      totalRevenue = 0;
    }
    
    // Completed payment revenue (for reference)
    let completedPaymentRevenue = 0;
    try {
      const completedRevenueResult = await Order.findAll({
        where: { paymentStatus: 'completed' },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('total')), 'total']
        ],
        raw: true
      });
      const revenueValue = completedRevenueResult[0]?.total;
      completedPaymentRevenue = revenueValue ? parseFloat(revenueValue) : 0;
    } catch (err) {
      console.error('Error calculating completed payment revenue:', err);
      completedPaymentRevenue = 0;
    }

    const totalUsers = await User.count({ where: { role: 'customer' } }).catch(() => 0);
    const totalProducts = await Product.count({ where: { isActive: true } }).catch(() => 0);
    const totalCategories = await Category.count({ where: { isActive: true } }).catch(() => 0);

    // Monthly stats
    const monthlyOrders = await Order.count({
      where: {
        createdAt: { [Op.gte]: startOfMonth }
      }
    }).catch(() => 0);

    // Monthly revenue - count all orders in the month
    let monthlyRevenue = 0;
    try {
      const monthlyRevenueResult = await Order.findAll({
        where: {
          createdAt: { [Op.gte]: startOfMonth }
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('total')), 'total']
        ],
        raw: true
      });
      const revenueValue = monthlyRevenueResult[0]?.total;
      monthlyRevenue = revenueValue ? parseFloat(revenueValue) : 0;
    } catch (err) {
      console.error('Error calculating monthly revenue:', err);
      monthlyRevenue = 0;
    }

    // Yearly stats
    // Yearly revenue - count all orders in the year
    let yearlyRevenue = 0;
    try {
      const yearlyRevenueResult = await Order.findAll({
        where: {
          createdAt: { [Op.gte]: startOfYear }
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('total')), 'total']
        ],
        raw: true
      });
      const revenueValue = yearlyRevenueResult[0]?.total;
      yearlyRevenue = revenueValue ? parseFloat(revenueValue) : 0;
    } catch (err) {
      console.error('Error calculating yearly revenue:', err);
      yearlyRevenue = 0;
    }

    // Order status breakdown
    const orderStatusBreakdown = await Order.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    }).catch(() => []);


    // Recent orders
    const recentOrders = await Order.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    }).catch(() => []);

    // Top selling products
    let topProducts = [];
    try {
      topProducts = await OrderItem.findAll({
        attributes: [
          'productId',
          [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold'],
          [sequelize.fn('SUM', sequelize.literal('quantity * price')), 'revenue']
        ],
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name'],
          required: false
        }],
        group: ['productId', 'product.id', 'product.name'],
        order: [[sequelize.literal('totalSold'), 'DESC']],
        limit: 10
      });
    } catch (err) {
      console.error('Error fetching top products:', err);
      topProducts = [];
    }

    // Log stats for debugging
    console.log('Dashboard Stats:', {
      totalOrders,
      totalRevenue,
      totalUsers,
      totalProducts,
      totalCategories,
      monthlyOrders,
      monthlyRevenue
    });

    res.json({
      success: true,
      stats: {
        overview: {
          totalOrders: Number(totalOrders) || 0,
          totalRevenue: Number(totalRevenue) || 0,
          totalUsers: Number(totalUsers) || 0,
          totalProducts: Number(totalProducts) || 0,
          totalCategories: Number(totalCategories) || 0
        },
        categories: Number(totalCategories) || 0,
        monthly: {
          orders: Number(monthlyOrders) || 0,
          revenue: Number(monthlyRevenue) || 0
        },
        yearly: {
          revenue: Number(yearlyRevenue) || 0
        },
        orderStatusBreakdown: orderStatusBreakdown.map(item => ({
          _id: item.status,
          count: parseInt(item.count || 0)
        })),
        recentOrders: recentOrders || [],
        topProducts: (topProducts || []).map(item => {
          const totalSold = item.dataValues?.totalSold || item.totalSold || 0;
          const revenue = item.dataValues?.revenue || item.revenue || 0;
          return {
            product: item.product?.name || 'Unknown',
            totalSold: parseInt(totalSold) || 0,
            revenue: parseFloat(revenue) || 0
          };
        })
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
    }

    // Get all orders (not just completed payments) for analytics
    const sales = await Order.findAll({
      where: {
        createdAt: { [Op.gte]: startDate }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      raw: true
    }).catch(() => []);

    res.json({
      success: true,
      sales: (sales || []).map(item => ({
        _id: item.date,
        revenue: parseFloat(item.revenue || 0) || 0,
        orders: parseInt(item.orders || 0) || 0
      })),
      period
    });
  } catch (error) {
    console.error('Error in getSalesAnalytics:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
