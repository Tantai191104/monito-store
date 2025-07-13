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

    const createdColors = await ColorModel.insertMany(colorsData);
    console.log(`✅ Successfully seeded ${createdColors.length} colors`);

    return createdColors;
  } catch (error) {
    console.error('❌ Error seeding colors:', error);
    throw error;
  }
};
