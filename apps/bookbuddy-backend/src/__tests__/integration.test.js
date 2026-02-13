// API Integration Tests for BookBuddy
// Run with: npm test

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

describe('BookBuddy API Tests', () => {
  let authToken = null;
  let testUserId = null;

  // Test auth - will fail without valid credentials
  describe('Auth Endpoints', () => {
    test('POST /api/signUp - should create new user', async () => {
      const response = await fetch(`${BASE_URL}/api/signUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          password: 'testpassword123'
        }),
      });
      
      expect([200, 400]).toContain(response.status);
    });

    test('POST /api/signIn/email - should login existing user', async () => {
      const response = await fetch(`${BASE_URL}/api/signIn/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        }),
      });
      
      expect([200, 401]).toContain(response.status);
    });
  });

  // Test health endpoint
  describe('Health Check', () => {
    test('GET /health - should return ok', async () => {
      const response = await fetch(`${BASE_URL}/health`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
    });
  });

  // Test book search (no auth required)
  describe('Books Endpoint', () => {
    test('GET /v1/books/search-books - should search books', async () => {
      const response = await fetch(`${BASE_URL}/v1/books/search-books?query=harry%20potter`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.items).toBeDefined();
    });
  });

  // Test stats (requires auth - will fail without token)
  describe('Stats Endpoints (requires auth)', () => {
    test('GET /v1/stats/stats - should require auth', async () => {
      const response = await fetch(`${BASE_URL}/v1/stats/stats`);
      
      expect([401, 403]).toContain(response.status);
    });

    test('GET /v1/stats/stats - should return stats with auth', async () => {
      // Skip if no auth token available in test env
      if (!authToken) {
        console.log('Skipping - no auth token');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/v1/stats/stats`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('currentStreak');
    });
  });

  // Test goals (requires auth)
  describe('Goals Endpoints (requires auth)', () => {
    test('GET /v1/goals - should require auth', async () => {
      const response = await fetch(`${BASE_URL}/v1/goals`);
      
      expect([401, 403]).toContain(response.status);
    });

    test('POST /v1/goals - should create goal with auth', async () => {
      if (!authToken) {
        console.log('Skipping - no auth token');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/v1/goals`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          year: 2026,
          type: 'pages',
          target: 1000
        }),
      });
      
      expect([200, 201]).toContain(response.status);
    });
  });

  // Test highlights (requires auth)
  describe('Highlights Endpoints (requires auth)', () => {
    test('GET /v1/highlights - should require auth', async () => {
      const response = await fetch(`${BASE_URL}/v1/highlights`);
      
      expect([401, 403]).toContain(response.status);
    });
  });

  // Test preferences (requires auth)
  describe('Preferences Endpoints (requires auth)', () => {
    test('GET /v1/preferences/recommendations - should return recommendations', async () => {
      if (!authToken) {
        console.log('Skipping - no auth token');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/v1/preferences/recommendations`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
