import { z } from 'zod';

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    roleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid roleId'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string(),
    password: z.string().min(8),
  }),
});

export const authValidations = {
  registerSchema,
  loginSchema,
  refreshSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
