/**
 * Models
 */
import CategoryModel from '../models/categoryModel';

/**
 * Data
 */
import { categoriesData } from './data/categories';

export const seedCategories = async () => {
  try {
    console.log('🌱 Starting to seed categories...');

    const createdCategories = await CategoryModel.insertMany(categoriesData);
    console.log(
      `✅ Successfully seeded ${createdCategories.length} categories`,
    );

    return createdCategories;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
};
