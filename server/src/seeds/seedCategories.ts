
/**
 * Models
 */
import CategoryModel from '../models/categoryModel';
import UserModel from '../models/userModel';

/**
 * Data
 */
import { categoriesData } from './data/categories';

export const seedCategories = async () => {
  try {
    console.log('🌱 Starting to seed categories...');

    // Clear existing categories
    await CategoryModel.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // Find admin user
    const adminUser = await UserModel.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('Admin user not found. Please create admin user first.');
    }

    // Insert categories
    const categoriesWithCreator = categoriesData.map((category) => ({
      ...category,
      createdBy: adminUser._id,
    }));

    const createdCategories = await CategoryModel.insertMany(
      categoriesWithCreator,
    );
    console.log(
      `✅ Successfully seeded ${createdCategories.length} categories`,
    );

    return createdCategories;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
};
