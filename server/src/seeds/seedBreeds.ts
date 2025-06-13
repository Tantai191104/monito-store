/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Models
 */
import BreedModel from '../models/breedModel';
import UserModel from '../models/userModel';

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

    // Find admin user
    const adminUser = await UserModel.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('Admin user not found. Please create admin user first.');
    }

    // Insert breeds
    const breedsWithCreator = breedsData.map((breed) => ({
      ...breed,
      createdBy: adminUser._id,
    }));

    const createdBreeds = await BreedModel.insertMany(breedsWithCreator);
    console.log(`✅ Successfully seeded ${createdBreeds.length} breeds`);

    return createdBreeds;
  } catch (error) {
    console.error('❌ Error seeding breeds:', error);
    throw error;
  }
};
