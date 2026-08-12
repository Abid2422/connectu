const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const app = require('../src/app');

test('POST /api/auth/signup rejects non-NYU email', async () => {
  const res = await request(app)
    .post('/api/auth/signup')
    .send({ nyuEmail: 'student@gmail.com' });

  assert.strictEqual(res.status, 400);
});

test('POST /api/auth/signup rejects missing email', async () => {
  const res = await request(app).post('/api/auth/signup').send({});

  assert.strictEqual(res.status, 400);
});

test('GET /health returns ok', async () => {
  const res = await request(app).get('/health');

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'ok');
});
