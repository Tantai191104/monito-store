/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Validations
 */
import { loginSchema, registerSchema } from '../validations/authValidation';

/**
 * Services
 */
import { authService } from '../services/authService';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = registerSchema.parse(req.body);

      await authService.register(body);

      res.status(STATUS_CODE.CREATED).json({
        message: 'User created successfully',
      });
    } catch (error) {
      next(error);
    }
  },
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = loginSchema.parse(req.body);

      const { user, tokens } = await authService.login(body);

      res.status(STATUS_CODE.OK).json({
        message: 'Login successful',
        data: {
          user,
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
