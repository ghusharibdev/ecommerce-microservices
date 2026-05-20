const request = require('supertest');
const app = require('../index');
test('GET /products returns array', async () => {
  const res = await request(app).get('/products');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});
