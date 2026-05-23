import { AuthRequest, LeadFilters } from '../types';

export const buildLeadQuery = (req: AuthRequest): Record<string, unknown> => {
  const { status, source, search } = req.query as LeadFilters;
  const query: Record<string, unknown> = {};

  if (req.user?.role === 'sales') {
    query.createdBy = req.user._id;
  }

  if (status && status !== 'All') {
    query.status = status;
  }

  if (source && source !== 'All') {
    query.source = source;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  return query;
};

export const parsePagination = (query: LeadFilters) => {
  const page = Math.max(parseInt(String(query.page || 1), 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(String(query.limit || 10), 10) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const sort = query.sort === 'oldest' ? { createdAt: 1 as const } : { createdAt: -1 as const };
  return { page, limit, skip, sort };
};
