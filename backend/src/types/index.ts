import { Request } from 'express';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'sales';
  createdAt: Date;
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: string; // user _id ref
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: number;
  limit?: number;
}

export interface AuthRequest extends Request {
  user?: IUser;
}
