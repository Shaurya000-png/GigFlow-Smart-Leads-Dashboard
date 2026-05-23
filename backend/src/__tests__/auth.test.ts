import request from 'supertest';
import { getTestApp } from './setup';

describe('Auth API', () => {
  const app = () => getTestApp();

  it('registers a sales user', async () => {
    const res = await request(app()).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe('sales');
    expect(res.body.data.token).toBeDefined();
  });

  it('rejects duplicate registration', async () => {
    await request(app()).post('/api/auth/register').send({
      name: 'Dup User',
      email: 'dup@example.com',
      password: 'password123',
    });

    const res = await request(app()).post('/api/auth/register').send({
      name: 'Dup User 2',
      email: 'dup@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('logs in with valid credentials', async () => {
    await request(app()).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'password123',
    });

    const res = await request(app()).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('rejects invalid login', async () => {
    const res = await request(app()).post('/api/auth/login').send({
      email: 'missing@example.com',
      password: 'wrongpass',
    });

    expect(res.status).toBe(401);
  });

  it('returns profile for authenticated user', async () => {
    const register = await request(app()).post('/api/auth/register').send({
      name: 'Me User',
      email: 'me@example.com',
      password: 'password123',
    });

    const res = await request(app())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${register.body.data.token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('me@example.com');
  });
});
