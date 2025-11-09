import './commands';

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  console.error('Uncaught exception:', err);
  return false;
});