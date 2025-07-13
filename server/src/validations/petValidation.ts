import { z } from 'zod';

// Helper to convert comma-separated string or array to array
const stringToArray = z.preprocess((val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.length > 0) return val.split(',');
  return [];
}, z.array(z.string()));

export const createPetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Pet name is required')
    .max(100, 'Pet name must be less than 100 characters'),
  breed: z
    .string()
    .min(1, 'Breed ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid breed ID format'),
  gender: z.enum(['Male', 'Female'], {
    errorMap: () => ({ message: 'Gender must be Male or Female' }),
  }),
  age: z.string().trim().min(1, 'Age is required'),
  size: z.enum(['Small', 'Medium', 'Large'], {
    errorMap: () => ({ message: 'Size must be Small, Medium, or Large' }),
  }),
  color: z
    .string()
    .min(1, 'Color ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid color ID format'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  images: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  isVaccinated: z.boolean().default(false),
  isDewormed: z.boolean().default(false),
  hasCert: z.boolean().default(false),
  hasMicrochip: z.boolean().default(false),
  location: z.string().trim().min(1, 'Location is required'),
  publishedDate: z.date().optional(),
  additionalInfo: z
    .string()
    .trim()
    .max(500, 'Additional info must be less than 500 characters')
    .optional(),
  isAvailable: z.boolean().default(true),
});

export const updatePetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Pet name is required')
    .max(100, 'Pet name must be less than 100 characters')
    .optional(),
  breed: z
    .string()
    .min(1, 'Breed ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid breed ID format')
    .optional(),
  gender: z.enum(['Male', 'Female'], {
    errorMap: () => ({ message: 'Gender must be Male or Female' }),
  }),
  age: z.string().trim().min(1, 'Age is required').optional(),
  size: z.enum(['Small', 'Medium', 'Large'], {
    errorMap: () => ({ message: 'Size must be Small, Medium, or Large' }),
  }),
  color: z
    .string()
    .min(1, 'Color ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid color ID format')
    .optional(),
  price: z
    .number()
    .min(0, 'Price must be greater than or equal to 0')
    .optional(),
  images: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  isVaccinated: z.boolean().default(false).optional(),
  isDewormed: z.boolean().default(false).optional(),
  hasCert: z.boolean().default(false).optional(),
  hasMicrochip: z.boolean().default(false).optional(),
  location: z.string().trim().min(1, 'Location is required').optional(),
  publishedDate: z.date().optional(),
  additionalInfo: z
    .string()
    .trim()
    .max(500, 'Additional info must be less than 500 characters')
    .optional(),
  isAvailable: z.boolean().default(true).optional(),
});

export const petFiltersSchema = z.object({
  breed: stringToArray.optional(),
  gender: stringToArray.optional(),
  size: stringToArray.optional(),
  color: stringToArray.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  location: z.string().optional(),
  isAvailable: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  sortBy: z
    .enum(['name', 'price', 'publishedDate', 'createdAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
