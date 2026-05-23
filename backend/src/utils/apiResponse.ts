import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
  pagination?: PaginationMeta
) => {
  const body: ApiResponse<T> = { success: true, message };
  if (data !== undefined) body.data = data;
  if (pagination) body.pagination = pagination;
  res.status(statusCode).json(body);
};

export const sendError = (res: Response, message: string, statusCode = 500) => {
  res.status(statusCode).json({ success: false, message });
};
