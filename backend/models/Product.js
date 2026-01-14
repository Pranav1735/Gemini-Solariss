import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  compareAtPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  sku: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  wattage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  efficiency: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  type: {
    type: DataTypes.ENUM('Residential', 'Commercial', 'On-Grid', 'Off-Grid', 'Hybrid'),
    allowNull: false
  },
  dimensions: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  warranty: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  warrantyUnit: {
    type: DataTypes.ENUM('years', 'months'),
    defaultValue: 'years'
  },
  technicalSpecs: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.JSONB,
    defaultValue: {
      average: 0,
      count: 0
    }
  }
}, {
  tableName: 'products',
  timestamps: true,
  indexes: [
    { fields: ['categoryId'] },
    { fields: ['isActive'] },
    { fields: ['price'] },
    { fields: ['wattage'] },
    { fields: ['name'] },
    { fields: ['brand'] }
  ],
  hooks: {
    beforeCreate: (product) => {
      if (!product.slug && product.name) {
        product.slug = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      }
      if (!product.sku) {
        product.sku = `GS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      }
    },
    beforeUpdate: (product) => {
      if (product.changed('name') && !product.slug) {
        product.slug = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      }
    }
  }
});

export default Product;
