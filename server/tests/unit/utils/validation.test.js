import { describe, it, expect } from '@jest/globals';
import { validateUserInput, sanitizeInput } from '../../../src/utils/validation';

describe('Validation Utils', () => {
  describe('validateUserInput', () => {
    it('should validate correct user input', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!'
      };

      const result = validateUserInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid email', () => {
      const input = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password123!'
      };

      const result = validateUserInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    it('should reject weak password', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123'
      };

      const result = validateUserInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters');
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags from input', () => {
      const input = '<script>alert("xss")</script>Hello';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('Hello');
    });

    it('should trim whitespace', () => {
      const input = '  hello  ';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('hello');
    });
  });
});