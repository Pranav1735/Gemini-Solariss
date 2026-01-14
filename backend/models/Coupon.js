import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  minPurchaseAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  maxDiscountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  applicableCategories: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  applicableProducts: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  }
}, {
  tableName: 'coupons',
  timestamps: true,
  hooks: {
    beforeCreate: (coupon) => {
      if (coupon.code) {
        coupon.code = coupon.code.toUpperCase().trim();
      }
    },
    beforeUpdate: (coupon) => {
      if (coupon.changed('code')) {
        coupon.code = coupon.code.toUpperCase().trim();
      }
    }
  }
});

// Instance methods
Coupon.prototype.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.endDate &&
    (!this.usageLimit || this.usedCount < this.usageLimit)
  );
};

Coupon.prototype.calculateDiscount = function(amount) {
  if (!this.isValid() || amount < this.minPurchaseAmount) {
    return 0;
  }

  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (parseFloat(amount) * parseFloat(this.discountValue)) / 100;
    if (this.maxDiscountAmount) {
      discount = Math.min(discount, parseFloat(this.maxDiscountAmount));
    }
  } else {
    discount = parseFloat(this.discountValue);
  }

  return Math.min(discount, parseFloat(amount));
};

export default Coupon;
