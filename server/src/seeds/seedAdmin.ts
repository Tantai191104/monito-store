
/**
 * Models
 */
import UserModel from '../models/userModel';

export const seedAdmin = async () => {
  try {
    console.log('🌱 Starting to seed admin user...');

    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('👤 Admin user already exists');
      return existingAdmin;
    }

    const adminUser = new UserModel({
      name: 'Admin',
      email: 'admin@monito.com',
      password: "admin123",
      role: 'admin',
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
