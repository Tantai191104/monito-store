/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Services
 */
import { staffService } from '../services/staffService';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

export const staffController = {
  async createStaff(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const {
        name,
        email,
        password,
        phone,
        department,
        position,
        permissions,
      } = req.body;

      if (!name || !email || !password || !department || !position) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({
          message:
            'Name, email, password, department, and position are required',
        });
      }

      const staff = await staffService.createStaff({
        name,
        email,
        password,
        phone,
        department,
        position,
        permissions,
      });

      res.status(STATUS_CODE.CREATED).json({
        message: 'Staff member created successfully',
        data: { staff },
      });
    } catch (error) {
      next(error);
    }
  },

  async getStaff(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { department, status, search } = req.query;

      const staff = await staffService.getStaff({
        department: department as string,
        status: status as 'active' | 'inactive',
        search: search as string,
      });

      res.status(STATUS_CODE.OK).json({
        message: 'Staff retrieved successfully',
        data: staff,
      });
    } catch (error) {
      next(error);
    }
  },

  async getStaffById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const staff = await staffService.getStaffById(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Staff member retrieved successfully',
        data: { staff },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateStaff(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const staff = await staffService.updateStaff(id, updateData);

      res.status(STATUS_CODE.OK).json({
        message: 'Staff member updated successfully',
        data: { staff },
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteStaff(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const result = await staffService.deleteStaff(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Staff member deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePermissions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { permissions } = req.body;

      if (!Array.isArray(permissions)) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Permissions must be an array',
        });
        return;
      }

      const staff = await staffService.updatePermissions(id, permissions);

      res.status(STATUS_CODE.OK).json({
        message: 'Staff permissions updated successfully',
        data: { staff },
      });
    } catch (error) {
      next(error);
    }
  },

  async getStaffStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const stats = await staffService.getStaffStats();

      res.status(STATUS_CODE.OK).json({
        message: 'Staff statistics retrieved successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },
};
