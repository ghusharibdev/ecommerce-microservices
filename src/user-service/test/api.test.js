const request = require('supertest');
const app = require('../index');
describe('User Service', () => {
  test('POST /register creates user', async () => {
    const res = await request(app).post('/register').send({ email: 'test@ex.com', password: '123' });
    expect(res.statusCode).toBe(201);
  });
  test('POST /login returns token', async () => {
    await request(app).post('/register').send({ email: 'a@b.com', password: 'x' });
    const res = await request(app).post('/login').send({ email: 'a@b.com', password: 'x' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
