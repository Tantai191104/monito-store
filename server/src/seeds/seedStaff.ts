/**
 * Models
 */
import UserModel from '../models/userModel';

export const seedStaff = async () => {
  try {
    console.log('🌱 Starting to seed staff user...');

    // Check if staff already exists
    const existingStaff = await UserModel.findOne({ role: 'staff' });
    if (existingStaff) {
      console.log('👤 Staff user already exists');
      return existingStaff;
    }

    const staffUser = new UserModel({
      name: 'Staff User',
      email: 'staff@monito.com',
      password: 'staff123',
      role: 'staff',
    });

    await staffUser.save();
    console.log('✅ Successfully created staff user');
    console.log('📧 Email: staff@monito.com');
    console.log('🔑 Password: staff123');

    return staffUser;
  } catch (error) {
    console.error('❌ Error seeding staff user:', error);
    throw error;
  }
};
