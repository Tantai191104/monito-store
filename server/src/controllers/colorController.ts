/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Services
 */
import { colorService } from '../services/colorService';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

export const colorController = {
  async createColor(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { name, hexCode, description } = req.body;

      if (!name || !hexCode) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Name and hex code are required',
        });
      }

      const color = await colorService.createColor({ name, hexCode, description });

      res.status(STATUS_CODE.CREATED).json({
        message: 'Color created successfully',
        data: { color },
      });
    } catch (error) {
      next(error);
    }
  },

  async getColors(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const colors = await colorService.getColors();

      res.status(STATUS_CODE.OK).json({
        message: 'Colors retrieved successfully',
        data: colors,
      });
    } catch (error) {
      next(error);
    }
  },

  async getColorById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const color = await colorService.getColorById(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Color retrieved successfully',
        data: { color },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateColor(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { name, hexCode, description, isActive } = req.body;

      const color = await colorService.updateColor(id, {
        name,
        hexCode,
        description,
        isActive,
      });

      res.status(STATUS_CODE.OK).json({
        message: 'Color updated successfully',
        data: { color },
      });
    } catch (error) {
      next(error);
    }
  },

  // ✅ Enhanced delete method with constraint handling
  async deleteColor(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const result = await colorService.deleteColor(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Color deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // ✅ New endpoint for bulk delete
  async bulkDeleteColors(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Color IDs array is required',
        });
        return;
      }

      const result = await colorService.bulkDeleteColors(ids);

      // Determine response based on results
      if (result.failed.length === 0) {
        res.status(STATUS_CODE.OK).json({
          message: `Successfully deleted ${result.deleted.length} colors`,
          data: result,
        });
      } else if (result.deleted.length === 0) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Failed to delete any colors',
          data: result,
          errorCode: 'BULK_DELETE_FAILED',
        });
      } else {
        res.status(STATUS_CODE.MULTI_STATUS).json({
          message: `Deleted ${result.deleted.length} colors, ${result.failed.length} failed`,
          data: result,
          errorCode: 'PARTIAL_DELETE_SUCCESS',
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // ✅ New endpoint to get color usage stats
  async getColorUsageStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const stats = await colorService.getColorUsageStats(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Color usage stats retrieved successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },
};
