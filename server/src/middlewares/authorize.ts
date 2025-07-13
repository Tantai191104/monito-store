/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Models
 */
import UserModel from '../models/userModel';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

/**
 * Authorize middleware to check user roles
 */
export const authorize = (...allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          message: 'Authentication required',
        });
        return;
      }

      // Get user with role
      const user = await UserModel.findById(userId).select('role isActive');

      if (!user) {
        res.status(STATUS_CODE.UNAUTHORIZED).json({
          message: 'User not found',
        });
        return;
      }

      if (!user.isActive) {
        res.status(STATUS_CODE.FORBIDDEN).json({
          message: 'Account is deactivated',
        });
        return;
      }

      // Check if user role is in allowed roles
      if (!allowedRoles.includes(user.role)) {
        res.status(STATUS_CODE.FORBIDDEN).json({
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        });
        return;
      }

      // Add user role to request for further use
      req.userRole = user.role;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user is admin
 */
export const requireAdmin = authorize('admin');

/**
 * Check if user is admin or staff
 */
export const requireAdminOrStaff = authorize('admin', 'staff');

/**
 * Check if user is authenticated (any role)
 */
export const requireAuth = authorize('admin', 'staff', 'customer');
