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

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  console.error(`Error Occurred on PATH: ${req.path} `, error);

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
