/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Services
 */
import { colorService } from '../services/colorService';

/**
 * Validations
 */
import {
  createColorSchema,
  updateColorSchema,
} from '../validations/colorValidation';

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
      const { name, hexCode, description } = createColorSchema.parse(req.body);

      const color = await colorService.createColor({
        name,
        hexCode,
        description,
      });

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

      const { name, hexCode, description, isActive } = updateColorSchema.parse(
        req.body,
      );

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

  async deleteColor(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      await colorService.deleteColor(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Color deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
