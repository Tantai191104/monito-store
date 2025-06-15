/**
 * Models
 */
import BreedModel from '../models/breedModel';

/**
 * Data
 */
import { breedsData } from './data/breeds';

export const seedBreeds = async () => {
  try {
    console.log('🌱 Starting to seed breeds...');

    // Clear existing breeds
    await BreedModel.deleteMany({});
    console.log('🗑️  Cleared existing breeds');

    const createdBreeds = await BreedModel.insertMany(breedsData);
    console.log(`✅ Successfully seeded ${createdBreeds.length} breeds`);

    return createdBreeds;
  } catch (error) {
    console.error('❌ Error seeding breeds:', error);
    throw error;
  }
};
