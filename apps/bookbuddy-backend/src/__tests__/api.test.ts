import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';
const prisma = new PrismaClient();

describe('Health Check', () => {
  test('GET /health should return 200', async () => {
    const response = await request(BASE_URL).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
  });

  test('GET / should return API running message', async () => {
    const response = await request(BASE_URL).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('BookBuddy');
  });
});

describe('Auth API', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'testPassword123!',
    name: 'Test User',
  };

  afterAll(async () => {
    // Clean up test user
    try {
      await prisma.user.delete({
        where: { email: testUser.email },
      });
    } catch (e) {
      // User might not exist
    }
  });

  test('POST /v1/auth/signup should create a new user', async () => {
    const response = await request(BASE_URL)
      .post('/v1/auth/signup')
      .send(testUser);

    // Better Auth might return different status codes
    expect([200, 201, 302]).toContain(response.status);
  });

  test('POST /v1/auth/signup should reject invalid email', async () => {
    const response = await request(BASE_URL)
      .post('/v1/auth/signup')
      .send({
        email: 'not-an-email',
        password: 'password123',
      });

    expect([400, 422]).toContain(response.status);
  });

  test('POST /v1/auth/signup should reject weak password', async () => {
    const response = await request(BASE_URL)
      .post('/v1/auth/signup')
      .send({
        email: 'test@example.com',
        password: '123', // Too short
      });

    expect([400, 422]).toContain(response.status);
  });
});

describe('AI API', () => {
  test('POST /v1/ai/summary should generate a summary', async () => {
    const response = await request(BASE_URL)
      .post('/v1/ai/summary')
      .send({
        title: 'The Great Gatsby',
        description: 'A novel about the American Dream',
      });

    // Might need auth - check for 200 or 401
    expect([200, 401]).toContain(response.status);
  });

  test('POST /v1/ai/chat should handle chat request', async () => {
    const response = await request(BASE_URL)
      .post('/v1/ai/chat')
      .send({
        messages: [
          { role: 'user', content: 'What is the book The Great Gatsby about?' }
        ],
      });

    expect([200, 401]).toContain(response.status);
  });

  test('POST /v1/ai/recommendations should work', async () => {
    const response = await request(BASE_URL)
      .post('/v1/ai/recommendations')
      .send({
        books: [
          { title: '1984', author: 'George Orwell' },
          { title: 'Brave New World', author: 'Aldous Huxley' },
        ],
      });

    expect([200, 401]).toContain(response.status);
  });
});
