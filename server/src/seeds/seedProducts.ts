
/**
 * Models
 */
import ProductModel from '../models/productModel';
import UserModel from '../models/userModel';
import CategoryModel from '../models/categoryModel';

/**
 * Data
*/
import { productsData } from './data/product';

export const seedProducts = async () => {
  try {
    console.log('🌱 Starting to seed products...');

    // Clear existing products
    await ProductModel.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Find admin user
    const adminUser = await UserModel.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('Admin user not found. Please create admin user first.');
    }

    // Get category references
    const [
      foodCategory,
      toyCategory,
      accessoryCategory,
      healthcareCategory,
      groomingCategory,
      otherCategory,
    ] = await Promise.all([
      CategoryModel.findOne({ name: 'Food' }),
      CategoryModel.findOne({ name: 'Toy' }),
      CategoryModel.findOne({ name: 'Accessory' }),
      CategoryModel.findOne({ name: 'Healthcare' }),
      CategoryModel.findOne({ name: 'Grooming' }),
      CategoryModel.findOne({ name: 'Other' }),
    ]);

    if (
      !foodCategory ||
      !toyCategory ||
      !accessoryCategory ||
      !healthcareCategory ||
      !groomingCategory ||
      !otherCategory
    ) {
      throw new Error(
        'Required categories not found. Please seed categories first.',
      );
    }

    // Create category mapping
    const categoryMap: { [key: string]: any } = {
      Food: foodCategory._id,
      Toy: toyCategory._id,
      Accessory: accessoryCategory._id,
      Healthcare: healthcareCategory._id,
      Grooming: groomingCategory._id,
      Other: otherCategory._id,
    };

    // Insert products with category ObjectId references
    const productsWithCategoryRefs = productsData.map((product) => ({
      ...product,
      category: categoryMap[product.category], // Replace category name with ObjectId
      createdBy: adminUser._id,
    }));

    const createdProducts = await ProductModel.insertMany(
      productsWithCategoryRefs,
    );
    console.log(`✅ Successfully seeded ${createdProducts.length} products`);

    // Log some examples
    console.log('\n📦 Sample products created:');
    createdProducts.slice(0, 3).forEach((product) => {
      console.log(
        `   • ${product.name} - ${product.price.toLocaleString()} VND`,
      );
    });

    return createdProducts;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};
