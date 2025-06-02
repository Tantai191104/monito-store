import { Response } from 'express';
import { ZodError } from 'zod';
import {
  STATUS_CODE,
  ERROR_CODE_ENUM,
  StatusCodeType,
  ErrorCodeEnumType,
} from '../constants';

/**
 * Zod validation error formatter
 */
export const formatZodError = (res: Response, error: ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
  return res.status(STATUS_CODE.BAD_REQUEST).json({
    message: 'Validation failed',
    errors: errors,
    errorCode: ERROR_CODE_ENUM.VALIDATION_ERROR,
  });
};

/**
 * Base API Error class
 */
export class ApiError extends Error {
  statusCode: StatusCodeType;
  errorCode: ErrorCodeEnumType;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: StatusCodeType,
    errorCode: ErrorCodeEnumType,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpException extends ApiError {
  constructor(
    message = 'Http Exception Error',
    statusCode: StatusCodeType,
    errorCode: ErrorCodeEnumType,
  ) {
    super(message, statusCode, errorCode);
  }
}

export class InternalServerException extends ApiError {
  constructor(
    message = 'Internal Server Error',
    errorCode?: ErrorCodeEnumType,
  ) {
    super(
      message,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode || ERROR_CODE_ENUM.INTERNAL_SERVER_ERROR,
    );
  }
}

export class NotFoundException extends ApiError {
  constructor(message = 'Resource not found', errorCode?: ErrorCodeEnumType) {
    super(
      message,
      STATUS_CODE.NOT_FOUND,
      errorCode || ERROR_CODE_ENUM.RESOURCE_NOT_FOUND,
    );
  }
}

export class BadRequestException extends ApiError {
  constructor(message = 'Bad Request', errorCode?: ErrorCodeEnumType) {
    super(
      message,
      STATUS_CODE.BAD_REQUEST,
      errorCode || ERROR_CODE_ENUM.VALIDATION_ERROR,
    );
  }
}

export class UnauthorizedException extends ApiError {
  constructor(message = 'Unauthorized Access', errorCode?: ErrorCodeEnumType) {
    super(
      message,
      STATUS_CODE.UNAUTHORIZED,
      errorCode || ERROR_CODE_ENUM.ACCESS_UNAUTHORIZED,
    );
  }
}

export class ForbiddenException extends ApiError {
  constructor(message = 'Access Forbidden', errorCode?: ErrorCodeEnumType) {
    super(
      message,
      STATUS_CODE.FORBIDDEN,
      errorCode || ERROR_CODE_ENUM.ACCESS_FORBIDDEN,
    );
  }
}

export class ConflictException extends ApiError {
  constructor(
    message = 'Resource already exists',
    errorCode?: ErrorCodeEnumType,
  ) {
    super(
      message,
      STATUS_CODE.CONFLICT,
      errorCode || ERROR_CODE_ENUM.RESOURCE_CONFLICT,
    );
  }
}
