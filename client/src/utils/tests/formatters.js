export const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return 'Invalid Date';
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const capitalizeFirst = (str) => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};