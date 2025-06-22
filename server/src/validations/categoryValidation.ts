import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be less than 50 characters'),
  description: z
    .string()
    .trim()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be less than 50 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  isActive: z.boolean().optional(),
});
