import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'categories',
  timestamps: true,
  hooks: {
    beforeCreate: (category) => {
      if (!category.slug && category.name) {
        category.slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      }
    },
    beforeUpdate: (category) => {
      if (category.changed('name') && !category.slug) {
        category.slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      }
    }
  }
});

export default Category;
