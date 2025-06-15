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

  async deleteBreed(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      await breedService.deleteBreed(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Breed deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
