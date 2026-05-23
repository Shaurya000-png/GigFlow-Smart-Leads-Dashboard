import mongoose from 'mongoose';
import { getEnv } from './env';
import { logger } from '../utils/logger';

export const connectDB = async () => {
  try {
    const { MONGODB_URI } = getEnv();
    const conn = await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB connected', { host: conn.connection.host });
  } catch (error) {
    logger.error('MongoDB connection failed', { error: String(error) });
    process.exit(1);
  }
};
