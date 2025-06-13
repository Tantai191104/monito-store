/**
 * Node modules
 */
import 'dotenv/config';

/**
 * Config
 */
import { connectDB } from '../config/connectDB';

/**
 * Seed functions
 */
import { seedAdmin } from './seedAdmin';
import { seedStaff } from './seedStaff';
import { seedBreeds } from './seedBreeds';
import { seedColors } from './seedColors';
import { seedPets } from './seedPets';

const runSeeds = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('🔗 Connected to database');

    // Run seeds in order
    console.log('🚀 Starting seed process...\n');

    // 1. Create admin user first
    await seedAdmin();
    console.log('');

    // 2. Create staff user
    await seedStaff();
    console.log('');

    // 3. Seed breeds
    await seedBreeds();
    console.log('');

    // 4. Seed colors
    await seedColors();
    console.log('');

    // 5. Seed pets
    await seedPets();
    console.log('');

    console.log('🎉 All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Seed process failed:', error);
    process.exit(1);
  }
};

// Run seeds if this file is executed directly
if (require.main === module) {
  runSeeds();
}

export { runSeeds };
