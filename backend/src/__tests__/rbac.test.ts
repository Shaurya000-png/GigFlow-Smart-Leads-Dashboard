import request from 'supertest';
import { getTestApp } from './setup';
import { requireRole } from '../middlewares/role.middleware';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

describe('RBAC middleware', () => {
  it('allows matching role', () => {
    const middleware = requireRole('admin');
    const req = { user: { role: 'admin' } } as AuthRequest;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('blocks non-matching role', () => {
    const middleware = requireRole('admin');
    const req = { user: { role: 'sales' } } as AuthRequest;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});

describe('RBAC API rules', () => {
  it('blocks sales from CSV export', async () => {
    const app = getTestApp();
    const register = await request(app).post('/api/auth/register').send({
      name: 'Sales User',
      email: `sales-${Date.now()}@test.com`,
      password: 'password123',
      role: 'sales',
    });

    const res = await request(app)
      .get('/api/leads/export/csv')
      .set('Authorization', `Bearer ${register.body.data.token}`);

    expect(res.status).toBe(403);
  });
});
