import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getCorsOrigins } from './config/env';
import { requestId } from './middlewares/requestId.middleware';
import { notFound } from './middlewares/notFound.middleware';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import { getHealth } from './controllers/health.controller';

export const createApp = () => {
  const app = express();

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  app.use(requestId);
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const allowed = getCorsOrigins();
        const matchesAllowed = Array.isArray(allowed) ? allowed.includes(origin) : allowed === origin;
        if (
          matchesAllowed ||
          origin.startsWith('http://localhost:') ||
          origin.endsWith('.vercel.app')
        ) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', getHealth);
  app.get('/health', getHealth);

  app.use('/api/auth', authRoutes);
  app.use('/api/leads', leadRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;
