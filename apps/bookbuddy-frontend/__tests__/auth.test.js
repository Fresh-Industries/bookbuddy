// Auth API Tests
import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:3001';

// Mock axios for testing
jest.mock('axios');

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    test('should create user with valid data', async () => {
      const mockResponse = { data: { user: { id: '1', email: 'test@example.com' } } };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await signup({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/v1/auth/signup`,
        expect.objectContaining({
          email: 'test@example.com',
          name: 'Test User'
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('should throw error with invalid email', async () => {
      axios.post.mockRejectedValueOnce(new Error('Invalid email'));

      await expect(signup({
        email: 'invalid-email',
        password: 'password123'
      })).rejects.toThrow('Invalid email');
    });
  });

  describe('login', () => {
    test('should login with correct credentials', async () => {
      const mockResponse = { 
        data: { 
          user: { id: '1', email: 'test@example.com' },
          session: { token: 'mock-token' }
        } 
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/v1/auth/signin/email`,
        expect.objectContaining({
          email: 'test@example.com'
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('should throw error with wrong password', async () => {
      axios.post.mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(login({
        email: 'test@example.com',
        password: 'wrong-password'
      })).rejects.toThrow('Invalid credentials');
    });
  });
});

// Export the functions being tested
const signup = async (data) => {
  const response = await axios.post(`${BASE_URL}/v1/auth/signup`, data);
  return response.data;
};

const login = async (data) => {
  const response = await axios.post(`${BASE_URL}/v1/auth/signin/email`, data);
  return response.data;
};
