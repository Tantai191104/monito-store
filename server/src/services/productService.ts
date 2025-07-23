/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Types
 */
import {
  CreateProductPayload,
  UpdateProductPayload,
  ProductFilters,
} from '../types/product';

/**
 * Models
 */
import ProductModel from '../models/productModel';
import CategoryModel from '../models/categoryModel';
import OrderModel from '../models/orderModel'; // ✅ Import OrderModel
import { BadRequestException, NotFoundException } from '../utils/errors';
import { ERROR_CODE_ENUM } from '../constants';

export const productService = {
  /**
   * Create new product
   */
  async createProduct(data: CreateProductPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        // Validate category exists
        const categoryExists = await CategoryModel.exists({
          _id: data.category,
          isActive: true,
        }).session(session);
        if (!categoryExists) {
          throw new BadRequestException('Invalid category selected');
        }

        const newProduct = new ProductModel(data);

        await newProduct.save({ session });
        await newProduct.populate([
          { path: 'category', select: 'name description' },
        ]);

        return newProduct;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Get all products with filters and pagination
   */
  async getProducts(filters: ProductFilters) {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      isActive,
      page = 1,
      limit = 15,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      includeInactiveCategories,
    } = filters;

    // Build query
    const query: any = {};

    if (typeof isActive === 'boolean') {
      query.isActive = isActive;
    }

    // Apply search filters
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Apply category filter
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        // Find category by name
        const categoryDoc = await CategoryModel.findOne({
          name: new RegExp(category, 'i'),
          isActive: true,
        });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        } else {
          // If category not found, return empty results
          return {
            products: [],
            pagination: { page, limit, total: 0, pages: 0 },
          };
        }
      }
    }

    // Filter by price
    if (typeof minPrice === 'number') {
      query.price = { ...query.price, $gte: minPrice };
    }
    if (typeof maxPrice === 'number') {
      query.price = { ...query.price, $lte: maxPrice };
    }

    // Only show products with ACTIVE categories in customer view
    // For staff view, show all products regardless of category status
    if (!includeInactiveCategories) {
      const activeCategories = await CategoryModel.find({
        isActive: true,
      }).select('_id');
      const activeCategoryIds = activeCategories.map((cat) => cat._id);
      // Nếu đã có filter category thì không ghi đè
      if (!query.category) {
        query.category = { $in: activeCategoryIds };
      }
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [products, total] = await Promise.all([
      ProductModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate([{ path: 'category', select: 'name description' }])
        .lean(),
      ProductModel.countDocuments(query),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get product by ID
   */
  async getProductById(
    productId: string,
    options: { customerView?: boolean } = {},
  ) {
    const query: any = { _id: productId };

    if (options.customerView === true) {
      query.isActive = true;
    }

    const product = await ProductModel.findOne(query).populate([
      { path: 'category', select: 'name description' },
    ]);

    if (!product) {
      throw new NotFoundException(
        'Product not found or is inactive',
        ERROR_CODE_ENUM.PRODUCT_NOT_FOUND,
      );
    }

    return product;
  },


  /**
   * Update product
   */
  async updateProduct(productId: string, data: UpdateProductPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const product = await ProductModel.findById(productId).session(session);

        if (!product) {
          throw new NotFoundException(
            'Product not found',
            ERROR_CODE_ENUM.PRODUCT_NOT_FOUND,
          );
        }

        // Validate category if updating
        if (data.category) {
          const categoryExists = await CategoryModel.exists({
            _id: data.category,
            isActive: true,
          }).session(session);
          if (!categoryExists) {
            throw new BadRequestException('Invalid category selected');
          }
        }

        Object.assign(product, data);
        await product.save({ session });
        await product.populate([
          { path: 'category', select: 'name description' },
        ]);

        return product;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Delete product
   */
  async deleteProduct(productId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const product = await ProductModel.findById(productId).session(session);

        if (!product) {
          throw new NotFoundException(
            'Product not found',
            ERROR_CODE_ENUM.PRODUCT_NOT_FOUND,
          );
        }

        // ✅ Check if the product is used in any orders
        const orderCount = await OrderModel.countDocuments({
          'items.item': productId,
        }).session(session);

        if (orderCount > 0) {
          throw new BadRequestException(
            `Cannot delete product "${product.name}" because it is part of ${orderCount} order(s). Please deactivate it instead.`,
            ERROR_CODE_ENUM.PRODUCT_IN_USE,
          );
        }

        await ProductModel.findByIdAndDelete(productId).session(session);
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  }
  ,

  /**
   * Update stock
   */
  async updateStock(
    productId: string,
    quantity: number,
    operation: 'add' | 'subtract',
  ) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const product = await ProductModel.findById(productId).session(session);

        if (!product) {
          throw new NotFoundException(
            'Product not found',
            ERROR_CODE_ENUM.PRODUCT_NOT_FOUND,
          );
        }

        const newStock =
          operation === 'add'
            ? product.stock + quantity
            : product.stock - quantity;

        if (newStock < 0) {
          throw new BadRequestException(
            'Insufficient stock',
            ERROR_CODE_ENUM.INSUFFICIENT_STOCK,
          );
        }

        product.stock = newStock;
        await product.save({ session });

        return product;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },
};
