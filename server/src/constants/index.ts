export const STATUS_CODE = {
  // Success responses
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  // Client error responses
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  MULTI_STATUS: 207,

  // Server error responses
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export type StatusCodeType = (typeof STATUS_CODE)[keyof typeof STATUS_CODE];

export const ERROR_CODE_ENUM = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  ACCESS_UNAUTHORIZED: 'ACCESS_UNAUTHORIZED',
  ACCESS_FORBIDDEN: 'ACCESS_FORBIDDEN',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  CATEGORY_IN_USE: 'CATEGORY_IN_USE',
  BREED_IN_USE: 'BREED_IN_USE',
  COLOR_IN_USE: 'COLOR_IN_USE',
  PRODUCT_IN_USE: 'PRODUCT_IN_USE',

  // Authenticate
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',

  AUTH_EMAIL_ALREADY_EXISTS: 'AUTH_EMAIL_ALREADY_EXISTS',
  STAFF_NAME_ALREADY_EXISTS: 'STAFF_NAME_ALREADY_EXISTS',
  STAFF_PHONE_ALREADY_EXISTS: 'STAFF_PHONE_ALREADY_EXISTS',
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_NOT_FOUND: 'AUTH_NOT_FOUND',
  AUTH_TOO_MANY_ATTEMPTS: 'AUTH_TOO_MANY_ATTEMPTS',
  AUTH_UNAUTHORIZED_ACCESS: 'AUTH_UNAUTHORIZED_ACCESS',
  AUTH_TOKEN_NOT_FOUND: 'AUTH_TOKEN_NOT_FOUND',

  // Password reset
  INVALID_RESET_TOKEN: 'INVALID_RESET_TOKEN',
  RESET_TOKEN_EXPIRED: 'RESET_TOKEN_EXPIRED',
  PASSWORD_SAME_AS_CURRENT: 'PASSWORD_SAME_AS_CURRENT',
} as const;

export type ErrorCodeEnumType =
  (typeof ERROR_CODE_ENUM)[keyof typeof ERROR_CODE_ENUM];
