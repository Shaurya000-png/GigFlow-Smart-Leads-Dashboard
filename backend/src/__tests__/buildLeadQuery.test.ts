import { buildLeadQuery, parsePagination } from '../utils/buildLeadQuery';
import { AuthRequest } from '../types';

describe('buildLeadQuery', () => {
  it('scopes sales users to their own leads', () => {
    const req = {
      user: { _id: 'user1', role: 'sales' },
      query: {},
    } as unknown as AuthRequest;

    expect(buildLeadQuery(req)).toEqual({ createdBy: 'user1' });
  });

  it('does not scope admin users', () => {
    const req = {
      user: { _id: 'admin1', role: 'admin' },
      query: { status: 'New', source: 'Website', search: 'rahul' },
    } as unknown as AuthRequest;

    expect(buildLeadQuery(req)).toEqual({
      status: 'New',
      source: 'Website',
      $or: [
        { name: { $regex: 'rahul', $options: 'i' } },
        { email: { $regex: 'rahul', $options: 'i' } },
      ],
    });
  });

  it('ignores All filter values', () => {
    const req = {
      user: { _id: 'admin1', role: 'admin' },
      query: { status: 'All', source: 'All' },
    } as unknown as AuthRequest;

    expect(buildLeadQuery(req)).toEqual({});
  });
});

describe('parsePagination', () => {
  it('returns defaults', () => {
    const result = parsePagination({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.skip).toBe(0);
  });

  it('caps limit at 100', () => {
    const result = parsePagination({ page: 2, limit: 500 });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(100);
    expect(result.skip).toBe(100);
  });
});
