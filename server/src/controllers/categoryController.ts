/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Services
 */
import { categoryService } from '../services/categoryService';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

export const categoryController = {
  async createCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Category name is required',
        });
      }

      const category = await categoryService.createCategory({
        name,
        description,
      });

      res.status(STATUS_CODE.CREATED).json({
        message: 'Category created successfully',
        data: { category },
      });
    } catch (error) {
      next(error);
    }
  },

  async getCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const categories = await categoryService.getCategories();

      res.status(STATUS_CODE.OK).json({
        message: 'Categories retrieved successfully',
        data: { categories },
      });
    } catch (error) {
      next(error);
    }
  },

  async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const category = await categoryService.getCategoryById(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Category retrieved successfully',
        data: { category },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, isActive } = req.body;

      const category = await categoryService.updateCategory(id, {
        name,
        description,
        isActive,
      });

      res.status(STATUS_CODE.OK).json({
        message: 'Category updated successfully',
        data: { category },
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const result = await categoryService.deleteCategory(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Category deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  async bulkDeleteCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Category IDs array is required',
        });
        return;
      }
      const result = await categoryService.bulkDeleteCategories(ids);

      // Determine response based on results
      if (result.failed.length === 0) {
        // All deletions successful
        res.status(STATUS_CODE.OK).json({
          message: `Successfully deleted ${result.deleted.length} categories`,
          data: result,
        });
      } else if (result.deleted.length === 0) {
        // All deletions failed
        res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Failed to delete any categories',
          data: result,
          errorCode: 'BULK_DELETE_FAILED',
        });
      } else {
        // Partial success
        res.status(STATUS_CODE.MULTI_STATUS).json({
          message: `Deleted ${result.deleted.length} categories, ${result.failed.length} failed`,
          data: result,
          errorCode: 'PARTIAL_DELETE_SUCCESS',
        });
      }
    } catch (error) {
      next(error);
    }
  },
  async getCategoryUsageStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const stats = await categoryService.getCategoryUsageStats(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Category usage stats retrieved successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },
};
