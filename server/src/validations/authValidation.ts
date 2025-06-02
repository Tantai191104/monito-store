import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .min(1)
  .max(255);

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: emailSchema,
  password: z.string().trim().min(4),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().trim().min(1),
});
