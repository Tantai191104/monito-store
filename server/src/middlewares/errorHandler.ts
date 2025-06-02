/**
 * Node modules
 */
import { ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Utils
 */
import { ApiError, formatZodError } from '../utils/errors';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

const REFRESH_PATH = `${process.env.BASE_PATH}/auth/refresh-token`;

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  console.error(`Error Occurred on PATH: ${req.path} `, error);

  if (req.path === REFRESH_PATH) {
    res
      .clearCookie('accessToken', { path: '/' })
      .clearCookie('refreshToken', { path: REFRESH_PATH });
  }

  if (error instanceof SyntaxError) {
    return res.status(400).json({
      message: 'Invalid JSON format, please check your request body',
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  if (error instanceof ZodError) {
    return formatZodError(res, error);
  }

  return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
    error: error?.message || 'Unknown error occurred',
  });
};
