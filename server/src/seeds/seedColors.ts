/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Models
 */
import ColorModel from '../models/colorModel';
import UserModel from '../models/userModel';

/**
 * Data
 */
import { colorsData } from './data/colors';

export const seedColors = async () => {
  try {
    console.log('🌱 Starting to seed colors...');

    // Clear existing colors
    await ColorModel.deleteMany({});
    console.log('🗑️  Cleared existing colors');

    // Find admin user
    const adminUser = await UserModel.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('Admin user not found. Please create admin user first.');
    }

    // Insert colors
    const colorsWithCreator = colorsData.map((color) => ({
      ...color,
      createdBy: adminUser._id,
    }));

    const createdColors = await ColorModel.insertMany(colorsWithCreator);
    console.log(`✅ Successfully seeded ${createdColors.length} colors`);

    return createdColors;
  } catch (error) {
    console.error('❌ Error seeding colors:', error);
    throw error;
  }
};
