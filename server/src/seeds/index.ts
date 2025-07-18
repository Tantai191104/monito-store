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
import { seedCustomers } from './seedCustomers';
import { seedBreeds } from './seedBreeds';
import { seedColors } from './seedColors';
import { seedCategories } from './seedCategories';
import { seedPets } from './seedPets';
import { seedProducts } from './seedProducts';
import { seedOrders } from './seedOrders';

const runSeeds = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('🔗 Connected to database');

    // ✅ Clear ALL data first
    console.log('\n🗑️  Clearing all existing data...');

    // Clear in reverse dependency order
    const { default: OrderModel } = await import('../models/orderModel');
    const { default: ProductModel } = await import('../models/productModel');
    const { default: PetModel } = await import('../models/petModel');
    const { default: CategoryModel } = await import('../models/categoryModel');
    const { default: ColorModel } = await import('../models/colorModel');
    const { default: BreedModel } = await import('../models/breedModel');
    const { default: UserModel } = await import('../models/userModel');

    await OrderModel.deleteMany({});
    await ProductModel.deleteMany({});
    await PetModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await ColorModel.deleteMany({});
    await BreedModel.deleteMany({});
    await UserModel.deleteMany({});

    console.log('✅ All existing data cleared');

    // Run seeds in order
    console.log('\n🚀 Starting seed process...\n');

    // 1. Create admin user first
    await seedAdmin();
    console.log('');

    // 2. Create staff users
    await seedStaff();
    console.log('');

    // 3. Create customer users
    await seedCustomers();
    console.log('');

    // 4. Seed breeds
    await seedBreeds();
    console.log('');

    // 5. Seed colors
    await seedColors();
    console.log('');

    // 6. Seed categories
    await seedCategories();
    console.log('');

    // 7. Seed pets
    await seedPets();
    console.log('');

    // 8. Seed products
    await seedProducts();
    console.log('');

    // 9. Seed orders
    await seedOrders();
    console.log('');

    console.log('🎉 All seeds completed successfully!');

    // Show summary
    const userCount = await UserModel.countDocuments();
    const adminCount = await UserModel.countDocuments({ role: 'admin' });
    const staffCount = await UserModel.countDocuments({ role: 'staff' });
    const customerCount = await UserModel.countDocuments({ role: 'customer' });
    const breedCount = await BreedModel.countDocuments();
    const colorCount = await ColorModel.countDocuments();
    const categoryCount = await CategoryModel.countDocuments();
    const petCount = await PetModel.countDocuments();
    const orderCount = await OrderModel.countDocuments();
    const productCount = await ProductModel.countDocuments();

    console.log('\n📊 Final Database Summary:');
    console.log(
      `   • Users: ${userCount} (Admin: ${adminCount}, Staff: ${staffCount}, Customers: ${customerCount})`,
    );
    console.log(`   • Breeds: ${breedCount}`);
    console.log(`   • Colors: ${colorCount}`);
    console.log(`   • Categories: ${categoryCount}`);
    console.log(`   • Pets: ${petCount}`);
    console.log(`   • Products: ${productCount}`);
    console.log(`   • Orders: ${orderCount}`);

    console.log('\n🔐 Login Credentials:');
    console.log('👤 Admin: admin@monito.com / admin123');
    console.log('👨‍💼 Staff: sarah@monito.com / staff123');
    console.log('👥 Customer: john@example.com / customer123');

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
