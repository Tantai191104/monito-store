/**
 * Node modules
 */
import ms, { StringValue } from 'ms';
import { NextFunction, Request, Response } from 'express';

/**
 * Validations
 */
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../validations/authValidation';

/**
 * Services
 */
import { authService } from '../services/authService';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

/**
 * Utils
 */
import { UnauthorizedException } from '../utils/errors';

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

      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict',
        path: '/',
        maxAge: ms(process.env.ACCESS_TOKEN_EXPIRE! as StringValue), // 15 minutes
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict',
        path: `${process.env.BASE_PATH}/auth/refresh-token`,
        maxAge: ms(process.env.REFRESH_TOKEN_EXPIRE! as StringValue), // 7 days
      });

      res.status(STATUS_CODE.OK).json({
        message: 'Login successfully',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new UnauthorizedException('No token provided');
      }

      const tokens = await authService.refreshToken(refreshToken);

      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: ms(process.env.ACCESS_TOKEN_EXPIRE! as StringValue),
      });

      res.status(STATUS_CODE.OK).json({
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.status(STATUS_CODE.OK).json({
        message: 'Logout successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = forgotPasswordSchema.parse(req.body);

      const result = await authService.forgotPassword(body.email);

      res.status(STATUS_CODE.OK).json(result);
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = resetPasswordSchema.parse(req.body);

      const result = await authService.resetPassword(body.token, body.password);

      res.status(STATUS_CODE.OK).json(result);
    } catch (error) {
      next(error);
    }
  },
};
