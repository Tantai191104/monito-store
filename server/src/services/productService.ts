/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Types
 */
import { CreateProductPayload, UpdateProductPayload, ProductFilters } from '../types/product';

/**
 * Models
 */
import ProductModel from '../models/productModel';
import CategoryModel from '../models/categoryModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';
import { ERROR_CODE_ENUM } from '../constants';

export const productService = {
  /**
   * Create new product
   */
  async createProduct(data: CreateProductPayload, userId: string) {
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

        const newProduct = new ProductModel({
          ...data,
          createdBy: userId,
        });

        await newProduct.save({ session });
        await newProduct.populate([
          { path: 'createdBy', select: 'name email' },
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
    } = filters;

    // Build query
    const query: any = {};

    if (brand) query.brand = new RegExp(brand, 'i');
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    if (inStock !== undefined) query.isInStock = inStock;
    if (isActive !== undefined) query.isActive = isActive;

    // Handle category filter (can be ObjectId or category name)
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
        .populate([
          { path: 'createdBy', select: 'name email' },
          { path: 'category', select: 'name description' },
        ])
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
  async getProductById(productId: string) {
    const product = await ProductModel.findById(productId).populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'category', select: 'name description' },
    ]);

    if (!product) {
      throw new NotFoundException(
        'Product not found',
        ERROR_CODE_ENUM.PRODUCT_NOT_FOUND,
      );
    }

    return product;
  },

  /**
   * Update product
   */
  async updateProduct(
    productId: string,
    data: UpdateProductPayload,
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

        // Admin can update any product, staff/others can only update their own
        // if (userRole !== 'admin' && product.createdBy.toString() !== userId) {
        //   throw new BadRequestException('You can only update your own products');
        // }

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
          { path: 'createdBy', select: 'name email' },
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

        // Admin can delete any product, staff/others can only delete their own
        // if (userRole !== 'admin' && product.createdBy.toString() !== userId) {
        //   throw new BadRequestException('You can only delete your own products');
        // }

        await ProductModel.findByIdAndDelete(productId).session(session);
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

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

        // Admin can update any product stock, staff/others can only update their own
        // if (userRole !== 'admin' && product.createdBy.toString() !== userId) {
        //   throw new BadRequestException('You can only update your own products');
        // }

        const newStock =
          operation === 'add' ? product.stock + quantity : product.stock - quantity;

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