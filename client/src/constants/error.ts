export const ERROR_MESSAGES = {
  // Validation errors
  VALIDATION_ERROR: 'Invalid input data.',

  // Access errors
  ACCESS_UNAUTHORIZED: 'Unauthorized access.',
  ACCESS_FORBIDDEN: 'Access forbidden.',

  // Resource errors
  RESOURCE_NOT_FOUND: 'Resource not found.',
  RESOURCE_CONFLICT: 'Resource already exists.',

  // Server errors
  INTERNAL_SERVER_ERROR: 'Server error. Please try again later.',

  // Product errors
  PRODUCT_NOT_FOUND: 'Product not found.',
  INSUFFICIENT_STOCK: 'Insufficient stock available.',

  // Authentication errors
  USER_ALREADY_EXISTS: 'User already exists.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Session expired. Please login again.',
  INVALID_TOKEN: 'Invalid token provided.',

  AUTH_EMAIL_ALREADY_EXISTS: 'Email already exists. Please try another email.',
  AUTH_INVALID_TOKEN: 'Invalid authentication token.',
  AUTH_USER_NOT_FOUND: 'Account not found.',
  AUTH_NOT_FOUND: 'Authentication not found.',
  AUTH_TOO_MANY_ATTEMPTS: 'Too many login attempts. Please try again later.',
  AUTH_UNAUTHORIZED_ACCESS: 'Unauthorized access to this resource.',
  AUTH_TOKEN_NOT_FOUND: 'Authentication token not found.',

  // Default
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
} as const;
