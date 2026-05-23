import dotenv from 'dotenv';
import { getEnv } from './config/env';
import { connectDB } from './config/db';
import { logger } from './utils/logger';
import createApp from './app';

dotenv.config();

export const startServer = async () => {
  const env = getEnv();
  const app = createApp();

  await connectDB();

  return app.listen(env.PORT, () => {
    logger.info(`GigFlow API running`, {
      port: env.PORT,
      env: env.NODE_ENV,
    });
  });
};

if (require.main === module) {
  startServer().catch((err) => {
    logger.error('Failed to start server', { error: String(err) });
    process.exit(1);
  });
}
