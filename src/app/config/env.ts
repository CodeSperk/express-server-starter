import z from 'zod';
import ms, { StringValue } from 'ms';

/**
 * Validate duration strings like: 15m, 7d, 1h
 * Runtime-safe AND type-safe
 */
const durationSchema = z
  .string()
  .refine(val => ms(val as StringValue) !== undefined, {
    message: 'Invalid duration format (use 15m, 1h, 7d, etc.)',
  })
  .transform(val => val as StringValue);

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: durationSchema,

  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: durationSchema,

  PASSWORD_RESET_SECRET: z.string().min(32),
  PASSWORD_RESET_EXPIRES_IN: durationSchema,
});

export const env = envSchema.parse(process.env);
