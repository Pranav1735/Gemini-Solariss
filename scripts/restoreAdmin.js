import dotenv from 'dotenv';
import { sequelize, User } from '../models/index.js';

dotenv.config();

const restoreAdmin = async () => {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL Connected...');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: { email: 'admin@geminisolariss.com' }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Active: ${existingAdmin.isActive}`);
      
      // If exists but is inactive, activate it
      if (!existingAdmin.isActive) {
        await existingAdmin.update({ isActive: true });
        console.log('✓ Admin user activated');
      }
      
      // If exists but role is not admin, update it
      if (existingAdmin.role !== 'admin') {
        await existingAdmin.update({ role: 'admin' });
        console.log('✓ Admin user role updated to admin');
      }
      
      return;
    }

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@geminisolariss.com',
      password: 'Admin@123',
      phone: '+91-9876543210',
      role: 'admin',
      isActive: true,
      address: {
        street: 'No.63-A, Anna Enclave',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipCode: '600115',
        country: 'India'
      }
    });

    console.log('✅ Admin user restored successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: Admin@123`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error restoring admin user:', error);
    process.exit(1);
  }
};

restoreAdmin();

