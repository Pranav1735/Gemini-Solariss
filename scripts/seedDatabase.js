import dotenv from 'dotenv';
import { sequelize, User, Category, Product, Coupon } from '../models/index.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL Connected for seeding...');

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('Database synchronized...');

    // Clear existing data
    await User.destroy({ where: {}, truncate: true, cascade: true });
    await Category.destroy({ where: {}, truncate: true, cascade: true });
    await Product.destroy({ where: {}, truncate: true, cascade: true });
    await Coupon.destroy({ where: {}, truncate: true, cascade: true });
    console.log('Cleared existing data...');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@geminisolariss.com',
      password: 'Admin@123',
      phone: '+91-9876543210',
      role: 'admin',
      address: {
        street: 'No.63-A, Anna Enclave',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipCode: '600115',
        country: 'India'
      }
    });
    console.log('✓ Admin user created');

    // Create Test Customer
    const customer = await User.create({
      name: 'Test Customer',
      email: 'customer@test.com',
      password: 'Customer@123',
      phone: '+91-9876543211',
      role: 'customer',
      address: {
        street: '123 Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      }
    });
    console.log('✓ Test customer created');

    // Create Categories
    const categories = await Category.bulkCreate([
      {
        name: 'Solar Panels',
        description: 'High-efficiency solar panels for residential and commercial use',
        isActive: true
      },
      {
        name: 'Solar Inverters',
        description: 'Grid-tie, off-grid, and hybrid inverters',
        isActive: true
      },
      {
        name: 'Solar Batteries',
        description: 'Lithium-ion and lead-acid batteries for energy storage',
        isActive: true
      },
      {
        name: 'Mounting Systems',
        description: 'Roof and ground mounting solutions',
        isActive: true
      },
      {
        name: 'Accessories',
        description: 'Cables, connectors, and other solar accessories',
        isActive: true
      }
    ]);
    console.log('✓ Categories created');

    const solarPanelsCategory = categories[0];
    const invertersCategory = categories[1];
    const batteriesCategory = categories[2];
    const mountingCategory = categories[3];
    const accessoriesCategory = categories[4];

    // Create Products
    const products = await Product.bulkCreate([
      // Solar Panels
      {
        name: 'GEMINI SOLARISS 400W Monocrystalline Panel',
        description: 'High-efficiency 400W monocrystalline solar panel with 21.5% efficiency. Perfect for residential rooftop installations. Features anti-reflective coating and excellent low-light performance.',
        shortDescription: '400W Monocrystalline Solar Panel - 21.5% Efficiency',
        categoryId: solarPanelsCategory.id,
        brand: 'GEMINI SOLARISS',
        price: 18500,
        compareAtPrice: 22000,
        images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=800&fit=crop'],
        wattage: 400,
        efficiency: 21.5,
        type: 'Residential',
        dimensions: { length: 2100, width: 1048, height: 40, unit: 'mm' },
        weight: 22.5,
        warranty: 25,
        warrantyUnit: 'years',
        technicalSpecs: {
          'Cell Type': 'Monocrystalline',
          'Max Power Voltage': '41.2V',
          'Max Power Current': '9.71A',
          'Open Circuit Voltage': '49.5V',
          'Short Circuit Current': '10.25A'
        },
        isActive: true,
        isFeatured: true
      },
      {
        name: 'GEMINI SOLARISS 550W Monocrystalline Panel',
        description: 'Premium 550W monocrystalline solar panel with 22.3% efficiency. Ideal for commercial installations and large-scale projects. Superior durability and weather resistance.',
        shortDescription: '550W Monocrystalline Solar Panel - 22.3% Efficiency',
        categoryId: solarPanelsCategory.id,
        brand: 'GEMINI SOLARISS',
        price: 24500,
        compareAtPrice: 29000,
        images: ['https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&h=800&fit=crop'],
        wattage: 550,
        efficiency: 22.3,
        type: 'Commercial',
        dimensions: { length: 2279, width: 1134, height: 35, unit: 'mm' },
        weight: 28.5,
        warranty: 25,
        warrantyUnit: 'years',
        technicalSpecs: {
          'Cell Type': 'Monocrystalline',
          'Max Power Voltage': '41.8V',
          'Max Power Current': '13.16A',
          'Open Circuit Voltage': '50.2V',
          'Short Circuit Current': '13.85A'
        },
        isActive: true,
        isFeatured: true
      },
      {
        name: 'GEMINI SOLARISS 300W Polycrystalline Panel',
        description: 'Cost-effective 300W polycrystalline solar panel. Great for budget-conscious residential installations. Reliable performance with 18.5% efficiency.',
        shortDescription: '300W Polycrystalline Solar Panel - 18.5% Efficiency',
        categoryId: solarPanelsCategory.id,
        brand: 'GEMINI SOLARISS',
        price: 12500,
        compareAtPrice: 15000,
        images: ['https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=800&fit=crop'],
        wattage: 300,
        efficiency: 18.5,
        type: 'Residential',
        dimensions: { length: 1956, width: 992, height: 40, unit: 'mm' },
        weight: 19.5,
        warranty: 20,
        warrantyUnit: 'years',
        technicalSpecs: {
          'Cell Type': 'Polycrystalline',
          'Max Power Voltage': '36.5V',
          'Max Power Current': '8.22A',
          'Open Circuit Voltage': '44.8V',
          'Short Circuit Current': '8.75A'
        },
        isActive: true,
        isFeatured: false
      },
      // Inverters
      {
        name: 'GEMINI SOLARISS 5kW Grid-Tie Inverter',
        description: 'High-performance 5kW grid-tie inverter with MPPT technology. Perfect for residential solar systems. Features WiFi monitoring and mobile app integration.',
        shortDescription: '5kW Grid-Tie Inverter with MPPT',
        categoryId: invertersCategory.id,
        brand: 'GEMINI SOLARISS',
        price: 45000,
        compareAtPrice: 55000,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'],
        wattage: 5000,
        efficiency: 97.5,
        type: 'On-Grid',
        dimensions: { length: 500, width: 350, height: 200, unit: 'mm' },
        weight: 18.5,
        warranty: 5,
        warrantyUnit: 'years',
        technicalSpecs: {
          'Type': 'Grid-Tie',
          'Max DC Input': '6000W',
          'AC Output': '5000W',
          'MPPT Voltage Range': '200-500V',
          'Efficiency': '97.5%'
        },
        isActive: true,
        isFeatured: true
      },
      {
        name: 'GEMINI SOLARISS 10kW Hybrid Inverter',
        description: 'Advanced 10kW hybrid inverter with battery backup. Supports both grid-tie and off-grid modes. Ideal for homes requiring uninterrupted power supply.',
        shortDescription: '10kW Hybrid Inverter with Battery Backup',
        categoryId: invertersCategory.id,
        brand: 'GEMINI SOLARISS',
        price: 125000,
        compareAtPrice: 150000,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'],
        wattage: 10000,
        efficiency: 96.8,
        type: 'Hybrid',
        dimensions: { length: 650, width: 450, height: 250, unit: 'mm' },
        weight: 35.0,
        warranty: 5,
        warrantyUnit: 'years',
        technicalSpecs: {
          'Type': 'Hybrid',
          'Max DC Input': '12000W',
          'AC Output': '10000W',
          'Battery Voltage': '48V',
          'Efficiency': '96.8%'
        },
        isActive: true,
        isFeatured: true
      },
      {
        name: 'GEMINI SOLARISS 3kW Off-Grid Inverter',
        description: 'Reliable 3kW off-grid inverter for remote locations. Perfect for rural homes and cabins. Includes built-in charge controller.',
        shortDescription: '3kW Off-Grid Inverter',
        categoryId: invertersCategory.id,
        brand: 'GEMINI SOLARISS',
        price: 32000,
        compareAtPrice: 40000,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'],
        wattage: 3000,
        efficiency: 95.5,
        type: 'Off-Grid',
        dimensions: { length: 400, width: 300, height: 180, unit: 'mm' },
        weight: 12.5,
        warranty: 3,
        warrantyUnit: 'years',
        technicalSpecs: {
          'Type': 'Off-Grid',
          'Max DC Input': '3600W',
          'AC Output': '3000W',
          'Battery Voltage': '24V',
          'Efficiency': '95.5%'
        },
        isActive: true,
        isFeatured: false
      },
      // Batteries
      {
        name: 'GEMINI SOLARISS 5kWh Lithium Battery',
        description: 'High-capacity 5kWh lithium-ion battery for solar energy storage. Long lifespan with 6000+ cycles. Perfect for residential backup power.',
        shortDescription: '5kWh Lithium-Ion Battery - 6000+ Cycles',
        categoryId: batteriesCategory.id,
        brand: 'GEMINI SOLARISS',
        price: 95000,
        compareAtPrice: 120000,
        images: ['https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=800&fit=crop'],
        wattage: 5000,
        efficiency: 95,
        type: 'Hybrid',
        dimensions: { length: 600, width: 500, height: 200, unit: 'mm' },
        weight: 45.0,
        warranty: 10,
        warrantyUnit: 'years',
        technicalSpecs: {
          'Type': 'Lithium-Ion',
          'Capacity': '5kWh',
          'Voltage': '48V',
          'Cycles': '6000+',
          'Efficiency': '95%'
        },
        isActive: true,
        isFeatured: true
      },
      {
        name: 'GEMINI SOLARISS 10kWh Lithium Battery',
        description: 'Premium 10kWh lithium-ion battery system. Ideal for large homes and commercial applications. Advanced BMS for safety and performance.',
        shortDescription: '10kWh Lithium-Ion Battery System',
        categoryId: batteriesCategory.id,
        brand: 'GEMINI SOLARISS',
        price: 180000,
        compareAtPrice: 220000,
        images: ['https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=800&fit=crop'],
        wattage: 10000,
        efficiency: 95,
        type: 'Commercial',
        dimensions: { length: 800, width: 600, height: 250, unit: 'mm' },
        weight: 85.0,
        warranty: 10,
        warrantyUnit: 'years',
        technicalSpecs: {
          'Type': 'Lithium-Ion',
          'Capacity': '10kWh',
          'Voltage': '48V',
          'Cycles': '6000+',
          'Efficiency': '95%'
        },
        isActive: true,
        isFeatured: true
      },
      // Mounting Systems
      {
        name: 'GEMINI SOLARISS Roof Mounting Kit',
        description: 'Complete roof mounting kit for solar panels. Includes rails, clamps, and all necessary hardware. Suitable for tiled and metal roofs.',
        shortDescription: 'Complete Roof Mounting Kit',
        categoryId: mountingCategory.id,
        brand: 'GEMINI SOLARISS',
        price: 8500,
        compareAtPrice: 11000,
        images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=800&fit=crop'],
        wattage: 0,
        efficiency: 0,
        type: 'Residential',
        dimensions: {},
        weight: 25.0,
        warranty: 10,
        warrantyUnit: 'years',
        technicalSpecs: {
          'Type': 'Roof Mount',
          'Material': 'Aluminum',
          'Capacity': 'Up to 20 panels',
          'Roof Type': 'Tiled/Metal'
        },
        isActive: true,
        isFeatured: false
      },
      // Accessories
      {
        name: 'GEMINI SOLARISS MC4 Connector Set',
        description: 'Premium MC4 connectors for solar panel wiring. Weatherproof and UV resistant. Includes male and female connectors.',
        shortDescription: 'MC4 Connector Set - Weatherproof',
        categoryId: accessoriesCategory.id,
        brand: 'GEMINI SOLARISS',
        price: 450,
        compareAtPrice: 600,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'],
        wattage: 0,
        efficiency: 0,
        type: 'Residential',
        dimensions: {},
        weight: 0.1,
        warranty: 2,
        warrantyUnit: 'years',
        technicalSpecs: {
          'Type': 'MC4 Connector',
          'Rating': '1000V DC',
          'Current': '30A',
          'IP Rating': 'IP67'
        },
        isActive: true,
        isFeatured: false
      }
    ]);
    console.log('✓ Products created');

    // Create Coupons
    const coupons = await Coupon.bulkCreate([
      {
        code: 'WELCOME10',
        description: 'Welcome discount for new customers',
        discountType: 'percentage',
        discountValue: 10,
        minPurchaseAmount: 10000,
        maxDiscountAmount: 5000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        usageLimit: 1000,
        isActive: true
      },
      {
        code: 'SOLAR2024',
        description: 'Special solar panel discount',
        discountType: 'percentage',
        discountValue: 15,
        minPurchaseAmount: 50000,
        maxDiscountAmount: 15000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        usageLimit: 500,
        isActive: true,
        applicableCategories: [solarPanelsCategory.id]
      },
      {
        code: 'FLAT5000',
        description: 'Flat ₹5000 discount',
        discountType: 'fixed',
        discountValue: 5000,
        minPurchaseAmount: 25000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
        usageLimit: 200,
        isActive: true
      }
    ]);
    console.log('✓ Coupons created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin: admin@geminisolariss.com / Admin@123');
    console.log('   Customer: customer@test.com / Customer@123');
    console.log('\n🎁 Sample Coupons:');
    console.log('   WELCOME10 - 10% off (min ₹10,000)');
    console.log('   SOLAR2024 - 15% off solar panels (min ₹50,000)');
    console.log('   FLAT5000 - ₹5,000 off (min ₹25,000)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
