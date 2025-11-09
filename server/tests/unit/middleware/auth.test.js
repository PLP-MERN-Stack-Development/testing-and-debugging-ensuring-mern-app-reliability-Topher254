import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { authenticateToken } from '../../../src/middleware/auth';
import jwt from 'jsonwebtoken';

describe('Authentication Middleware', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should return 401 if no token provided', () => {
    authenticateToken(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Access token required'
    });
  });

  it('should return 403 if token is invalid', () => {
    mockRequest.headers.authorization = 'Bearer invalid-token';

    authenticateToken(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid token'
    });
  });

  it('should call next if token is valid', () => {
    const user = { id: '123', email: 'test@example.com' };
    const token = jwt.sign(user, process.env.JWT_SECRET || 'test-secret');
    
    mockRequest.headers.authorization = `Bearer ${token}`;
    
    // Mock jwt.verify
    jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
      callback(null, user);
    });

    authenticateToken(mockRequest, mockResponse, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toEqual(user);
  });
});