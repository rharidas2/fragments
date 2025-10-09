const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send('test data');
    
    console.log('Unauthenticated response:', {
      statusCode: res.statusCode,
      headers: res.headers,
      body: res.body,
      text: res.text
    });
    
    expect(res.statusCode).toBe(401);
    // Check if there's any response body at all
    if (res.body && Object.keys(res.body).length > 0) {
      expect(res.body.status === 'error' || res.body.error).toBeTruthy();
    }
    // If no body, that's also acceptable for a 401
  });

  test('authenticated users can create a plain text fragment', async () => {
    const testData = 'This is text data'; // Exact 15 characters
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(testData);
  
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toBeDefined();
    
    // Check fragment properties
    expect(res.body.fragment.ownerId).toBeDefined();
    expect(res.body.fragment.id).toBeDefined();
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.body.fragment.size).toBe(testData.length);
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
  });

  test('response includes Location header with URL to get the fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('test data');

    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toBeDefined();
    expect(res.headers.location).toMatch(/\/v1\/fragments\/[a-f0-9-]+$/);
  });

  test('creating fragment with unsupported type returns 415', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('{"key": "value"}');

    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toContain('Unsupported type');
  });

  test('creating fragment with invalid Content-Type returns 415', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'invalid/type')
      .send('test data');

    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });

  test('fragment size matches the data length', async () => {
    const testData = 'This is a longer piece of text data for testing size';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(testData);

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.size).toBe(testData.length);
  });

  test('fragment can be retrieved after creation', async () => {
    const testData = 'Data to be stored and retrieved';
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(testData);

    expect(postRes.statusCode).toBe(201);
    
    const fragmentId = postRes.body.fragment.id;
    
    // Try to retrieve the fragment
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
  });

  test('supports text/plain with charset', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain; charset=utf-8')
      .send('text with charset');

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('text/plain; charset=utf-8');
  });

  test('empty body creates fragment with size 0', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('');

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.size).toBe(0);
  });

  test('large text data up to 5MB is supported', async () => {
    const largeData = 'x'.repeat(5 * 1024 * 1024); // 5MB of text
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(largeData);

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.size).toBe(5 * 1024 * 1024);
  });
});
