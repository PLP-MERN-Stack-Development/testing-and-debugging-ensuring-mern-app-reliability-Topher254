describe('User Profile Management', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/profile');
  });

  it('should display user profile information', () => {
    cy.get('[data-testid="user-name"]').should('be.visible');
    cy.get('[data-testid="user-email"]').should('be.visible');
    cy.get('[data-testid="user-avatar"]').should('be.visible');
  });

  it('should update user profile', () => {
    const newName = 'Updated Name';

    cy.intercept('PUT', '/api/users/*').as('updateProfile');

    cy.get('[data-testid="edit-profile-button"]').click();
    cy.get('[data-testid="name-input"]').clear().type(newName);
    cy.get('[data-testid="save-profile-button"]').click();

    cy.wait('@updateProfile').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="user-name"]').should('contain', newName);
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should show validation errors for invalid input', () => {
    cy.get('[data-testid="edit-profile-button"]').click();
    cy.get('[data-testid="name-input"]').clear();
    cy.get('[data-testid="save-profile-button"]').click();

    cy.get('[data-testid="error-message"]').should('be.visible');
  });
});