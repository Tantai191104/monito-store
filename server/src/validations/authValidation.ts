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

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, 'Reset token is required'),
    password: z.string().trim().min(4, 'Password must be at least 4 characters'),
    confirmPassword: z.string().trim().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
