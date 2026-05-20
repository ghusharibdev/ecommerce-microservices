const request = require('supertest');
const app = require('../index');
test('POST /orders requires productId', async () => {
  const res = await request(app).post('/orders').send({ userId: 1 });
  expect(res.statusCode).toBe(400);
});
