import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  couponId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'coupons',
      key: 'id'
    }
  }
}, {
  tableName: 'carts',
  timestamps: true
});

export default Cart;
