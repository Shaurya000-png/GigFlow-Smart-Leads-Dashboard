import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().url().optional(),
  CORS_ORIGINS: z.string().optional(),
  ALLOW_ADMIN_REGISTER: z.string().optional().default('false'),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export const resetEnvCache = () => {
  cached = null;
};

export const getEnv = (): Env => {
  if (!cached) {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      const message = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      throw new Error(`Invalid environment configuration: ${message}`);
    }
    cached = parsed.data;
  }
  return cached;
};

export const getCorsOrigins = (): string | string[] => {
  const env = getEnv();
  if (env.CORS_ORIGINS) {
    return env.CORS_ORIGINS.split(',').map((o) => o.trim());
  }
  return env.FRONTEND_URL || 'http://localhost:5173';
};
