import request from 'supertest';
import { getTestApp } from './setup';

const registerAndLogin = async () => {
  const app = getTestApp();
  const email = `sales-${Date.now()}@test.com`;
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Lead Tester', email, password: 'password123' });
  return { token: res.body.data.token as string };
};

describe('Leads API', () => {
  it('creates and lists leads with pagination', async () => {
    const app = getTestApp();
    const { token } = await registerAndLogin();

    await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Lead One',
        email: 'lead1@test.com',
        status: 'New',
        source: 'Website',
      })
      .expect(201);

    const list = await request(app)
      .get('/api/leads?page=1&limit=5')
      .set('Authorization', `Bearer ${token}`);

    expect(list.status).toBe(200);
    expect(list.body.data.length).toBeGreaterThan(0);
    expect(list.body.pagination).toMatchObject({ page: 1, limit: 5 });
  });

  it('filters leads by search query', async () => {
    const app = getTestApp();
    const { token } = await registerAndLogin();

    await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Unique Rahul', email: 'rahul@test.com', status: 'New', source: 'Referral' });

    const res = await request(app)
      .get('/api/leads?search=rahul')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.some((l: { name: string }) => l.name.includes('Rahul'))).toBe(true);
  });

  it('updates lead and blocks sales delete', async () => {
    const app = getTestApp();
    const { token } = await registerAndLogin();

    const created = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Update Me', email: 'update@test.com', status: 'New', source: 'Website' });

    const id = created.body.data._id;

    const updated = await request(app)
      .put(`/api/leads/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Qualified' });

    expect(updated.body.data.status).toBe('Qualified');

    await request(app)
      .delete(`/api/leads/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
