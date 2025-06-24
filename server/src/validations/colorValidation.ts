import { z } from 'zod';

export const createColorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Color name is required')
    .max(50, 'Color name must be less than 50 characters'),
  hexCode: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color code')
    .min(1, 'Hex code is required'),
  description: z
    .string()
    .trim()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
});

export const updateColorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Color name is required')
    .max(50, 'Color name must be less than 50 characters')
    .optional(),
  hexCode: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color code')
    .optional(),
  description: z
    .string()
    .trim()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  isActive: z.boolean().optional(),
});
