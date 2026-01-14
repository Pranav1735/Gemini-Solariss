import { Product, Category } from '../models/index.js';
import { Op } from 'sequelize';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      type,
      minPrice,
      maxPrice,
      minWattage,
      maxWattage,
      search,
      sort = '-createdAt',
      featured,
      isActive
    } = req.query;

    // Build where clause
    const where = {};
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    } else {
      where.isActive = true; // Default to active only for public
    }

    if (category) {
      where.categoryId = category;
    }

    if (type) {
      where.type = type;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    if (minWattage || maxWattage) {
      where.wattage = {};
      if (minWattage) where.wattage[Op.gte] = Number(minWattage);
      if (maxWattage) where.wattage[Op.lte] = Number(maxWattage);
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Build order
    let order = [['createdAt', 'DESC']];
    if (sort === 'createdAt') order = [['createdAt', 'ASC']];
    if (sort === 'price') order = [['price', 'ASC']];
    if (sort === '-price') order = [['price', 'DESC']];
    if (sort === 'wattage') order = [['wattage', 'ASC']];
    if (sort === '-wattage') order = [['wattage', 'DESC']];

    // Execute query
    const offset = (page - 1) * limit;
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      }],
      order,
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'description']
      }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'description']
      }]
    });

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    const productWithCategory = await Product.findByPk(product.id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });

    res.status(201).json({
      success: true,
      product: productWithCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.update(req.body);

    const updatedProduct = await Product.findByPk(product.id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });

    res.json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete
    await product.update({ isActive: false });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
