import request from 'supertest';
import { getTestApp } from './setup';

describe('Health API', () => {
  const app = () => getTestApp();

  it('GET /api/health returns status payload', async () => {
    const res = await request(app()).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      database: 'connected',
    });
    expect(typeof res.body.uptime).toBe('number');
    expect(new Date(res.body.timestamp).toString()).not.toBe('Invalid Date');
  });
});
