import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response<ApiResponse<null>>,
  _next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Server Error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found';
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized, invalid token';
  }

  logger.error(message, {
    requestId: req.requestId,
    statusCode,
    path: req.originalUrl,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });

  res.status(statusCode).json({
    success: false,
    message,
  });
};
