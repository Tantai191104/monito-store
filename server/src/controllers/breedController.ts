/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Services
 */
import { breedService } from '../services/breedService';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

export const breedController = {
  async createBreed(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Name are required',
        });
      }

      const breed = await breedService.createBreed({ name, description });

      res.status(STATUS_CODE.CREATED).json({
        message: 'Breed created successfully',
        data: { breed },
      });
    } catch (error) {
      next(error);
    }
  },

  async getBreeds(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const breeds = await breedService.getBreeds();

      res.status(STATUS_CODE.OK).json({
        message: 'Breeds retrieved successfully',
        data: breeds,
      });
    } catch (error) {
      next(error);
    }
  },

  async getBreedById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const breed = await breedService.getBreedById(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Breed retrieved successfully',
        data: { breed },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateBreed(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, isActive } = req.body;

      const breed = await breedService.updateBreed(id, {
        name,
        description,
        isActive,
      });

      res.status(STATUS_CODE.OK).json({
        message: 'Breed updated successfully',
        data: { breed },
      });
    } catch (error) {
      next(error);
    }
  },

  // ✅ Enhanced delete method
  async deleteBreed(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const result = await breedService.deleteBreed(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Breed deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // ✅ New endpoint for bulk delete
  async bulkDeleteBreeds(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Breed IDs array is required',
        });
        return;
      }

      const result = await breedService.bulkDeleteBreeds(ids);

      // Determine response based on results
      if (result.failed.length === 0) {
        res.status(STATUS_CODE.OK).json({
          message: `Successfully deleted ${result.deleted.length} breeds`,
          data: result,
        });
      } else if (result.deleted.length === 0) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Failed to delete any breeds',
          data: result,
          errorCode: 'BULK_DELETE_FAILED',
        });
      } else {
        res.status(STATUS_CODE.MULTI_STATUS).json({
          message: `Deleted ${result.deleted.length} breeds, ${result.failed.length} failed`,
          data: result,
          errorCode: 'PARTIAL_DELETE_SUCCESS',
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // ✅ New endpoint to get breed usage stats
  async getBreedUsageStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const stats = await breedService.getBreedUsageStats(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Breed usage stats retrieved successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },
};
