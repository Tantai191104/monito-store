/**
 * Models
 */
import ColorModel from '../models/colorModel';

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

    const createdColors = await ColorModel.insertMany(colorsData);
    console.log(`✅ Successfully seeded ${createdColors.length} colors`);

    return createdColors;
  } catch (error) {
    console.error('❌ Error seeding colors:', error);
    throw error;
  }
};
