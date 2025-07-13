/**
 * Models
 */
import UserModel from '../models/userModel';

export const seedAdmin = async () => {
  try {
    console.log('🌱 Starting to seed admin user...');

    // ✅ Clear existing admin users
    await UserModel.deleteMany({ role: 'admin' });
    console.log('🗑️  Cleared existing admin users');

    const adminUser = new UserModel({
      name: 'Admin',
      email: 'admin@monito.com',
      password: 'admin123',
      role: 'admin',
      permissions: [
        'products',
        'pets',
        'orders',
        'customers',
        'categories',
        'breeds',
        'colors',
        'inventory',
        'shipping',
        'reports',
      ],
      joinDate: new Date('2024-01-01'),
      lastLogin: new Date(),
    });

    await adminUser.save();
    console.log('✅ Successfully created admin user');
    console.log('📧 Email: admin@monito.com');
    console.log('🔑 Password: admin123');

    return adminUser;
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  }
};
