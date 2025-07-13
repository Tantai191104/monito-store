/**
 * Types
 */
import {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../types/category';

/**
 * Models
 */
import CategoryModel from '../models/categoryModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';
import ProductModel from '../models/productModel';

export const categoryService = {
  async createCategory(data: CreateCategoryPayload) {
    try {
      const newCategory = new CategoryModel(data);

      await newCategory.save();
      return newCategory;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Category name already exists');
      }
      throw error;
    }
  },

  async getCategories() {
    const categories = await CategoryModel.find().sort({ name: 1 });
    return categories;
  },

  async getCategoryById(categoryId: string) {
    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  },

  async updateCategory(categoryId: string, data: UpdateCategoryPayload) {
    try {
      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        categoryId,
        data,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updatedCategory) {
        throw new NotFoundException('Category not found');
      }

      // ✅ NO constraint check here - allow deactivate even if products exist
      return updatedCategory;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Category name already exists');
      }
      throw error;
    }
  },

  async deleteCategory(categoryId: string) {
    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // ✅ ONLY check constraint for DELETE
    const productsUsingCategory = await ProductModel.countDocuments({
      category: categoryId,
    });

    if (productsUsingCategory > 0) {
      throw new BadRequestException(
        `Cannot delete category "${category.name}" because it is being used by ${productsUsingCategory} product(s). Please reassign or delete these products first.`,
        'CATEGORY_IN_USE',
      );
    }

    await CategoryModel.findByIdAndDelete(categoryId);
    return { deletedCategory: category, affectedProducts: 0 };
  },

  async bulkDeleteCategories(categoryIds: string[]) {
    const results = {
      deleted: [] as any[],
      failed: [] as {
        categoryId: string;
        categoryName: string;
        reason: string;
        productCount: number;
      }[],
    };

    for (const categoryId of categoryIds) {
      try {
        const category = await CategoryModel.findById(categoryId);

        if (!category) {
          results.failed.push({
            categoryId,
            categoryName: 'Unknown',
            reason: 'Category not found',
            productCount: 0,
          });
          continue;
        }
        // Check if category is being used by any products
        const productsUsingCategory = await ProductModel.countDocuments({
          category: categoryId,
        });

        if (productsUsingCategory > 0) {
          results.failed.push({
            categoryId,
            categoryName: category.name,
            reason: 'Category is being used by products',
            productCount: productsUsingCategory,
          });
          continue;
        }

        // Safe to delete
        await CategoryModel.findByIdAndDelete(categoryId);
        results.deleted.push(category);
      } catch (error: any) {
        results.failed.push({
          categoryId,
          categoryName: 'Unknown',
          reason: error.message || 'Unexpected error',
          productCount: 0,
        });
      }
    }

    return results;
  },
  async getCategoryUsageStats(categoryId: string) {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const productCount = await ProductModel.countDocuments({
      category: categoryId,
    });

    // Get sample products for reference
    const sampleProducts = await ProductModel.find({ category: categoryId })
      .select('name _id')
      .limit(5);

    return {
      category,
      productCount,
      sampleProducts,
      canDelete: productCount === 0,
    };
  },

  // ✅ New method to get products that would be affected by category deactivation
  async getCategoryDeactivationImpact(categoryId: string) {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const affectedProducts = await ProductModel.find({
      category: categoryId,
      isActive: true,
    })
      .select('name _id isActive')
      .limit(10); // Show sample of affected products

    const totalAffectedProducts = await ProductModel.countDocuments({
      category: categoryId,
      isActive: true,
    });

    return {
      category,
      affectedProducts,
      totalAffectedProducts,
      impact: totalAffectedProducts > 0 ? 'warning' : 'safe',
    };
  },
};
