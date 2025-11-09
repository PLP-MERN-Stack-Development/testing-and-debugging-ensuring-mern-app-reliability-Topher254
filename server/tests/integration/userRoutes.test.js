import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app.js';
import User from '../../src/models/User.js';

describe('User Routes Integration Tests', () => {
  let mongoServer;
  let authToken;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    
    // Create a test user and get auth token
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword123'
    });
    await user.save();

    // Login to get token (in a real app, you'd use your auth endpoint)
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'hashedPassword123'
      });
    
    authToken = loginResponse.body.token;
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(newUser.email);
    });

    it('should return 400 for invalid user data', async () => {
      const invalidUser = {
        name: 'A', // Too short
        email: 'invalid-email',
        password: '123' // Too weak
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user profile', async () => {
      const user = await User.findOne({ email: 'test@example.com' });
      
      const updates = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.user.name).toBe(updates.name);
    });
  });
});