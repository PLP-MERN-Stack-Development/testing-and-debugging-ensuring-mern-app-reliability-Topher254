describe('CRUD Operations', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/items');
  });

  it('should create a new item', () => {
    const itemName = `Test Item ${Date.now()}`;

    cy.intercept('POST', '/api/items').as('createItem');

    cy.get('[data-testid="create-item-button"]').click();
    cy.get('[data-testid="item-name-input"]').type(itemName);
    cy.get('[data-testid="item-description-input"]').type('Test description');
    cy.get('[data-testid="save-item-button"]').click();

    cy.wait('@createItem').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
    });

    cy.get('[data-testid="items-list"]').should('contain', itemName);
  });

  it('should read and display items', () => {
    cy.intercept('GET', '/api/items').as('getItems');

    cy.wait('@getItems').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="items-list"]').should('be.visible');
    cy.get('[data-testid="item-card"]').should('have.length.greaterThan', 0);
  });

  it('should update an existing item', () => {
    const updatedName = `Updated Item ${Date.now()}`;

    cy.intercept('PUT', '/api/items/*').as('updateItem');

    cy.get('[data-testid="item-edit-button"]').first().click();
    cy.get('[data-testid="item-name-input"]').clear().type(updatedName);
    cy.get('[data-testid="save-item-button"]').click();

    cy.wait('@updateItem').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="items-list"]').should('contain', updatedName);
  });

  it('should delete an item', () => {
    cy.intercept('DELETE', '/api/items/*').as('deleteItem');

    cy.get('[data-testid="item-delete-button"]').first().click();
    cy.get('[data-testid="confirm-delete-button"]').click();

    cy.wait('@deleteItem').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});