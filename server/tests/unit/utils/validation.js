export const validateUserInput = (input) => {
  const errors = [];

  // Name validation
  if (!input.name || input.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  if (!input.password || input.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(input.password)) {
    errors.push('Password must contain at least one lowercase letter, one uppercase letter, and one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, ''); // Remove remaining < and >
};