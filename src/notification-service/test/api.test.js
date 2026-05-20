const request = require('supertest');
const app = require('../index');
test('POST /notify returns 200', async () => {
  const res = await request(app).post('/notify').send({ message: 'test' });
  expect(res.statusCode).toBe(200);
});
