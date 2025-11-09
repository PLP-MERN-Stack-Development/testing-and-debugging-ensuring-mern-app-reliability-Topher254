describe('Authentication Flows', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/register').as('registerRequest');
    cy.intercept('POST', '/api/auth/login').as('loginRequest');
  });

  it('should register a new user', () => {
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'Password123!'
    };

    cy.register(userData);

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
    });

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', userData.name);
  });

  it('should login with valid credentials', () => {
    cy.login('test@example.com', 'password123');

    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-profile"]').should('be.visible');
  });

  it('should show error with invalid credentials', () => {
    cy.login('wrong@example.com', 'wrongpassword');

    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(401);
    });

    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should logout successfully', () => {
    cy.login();
    cy.logout();
    cy.url().should('include', '/login');
  });
});