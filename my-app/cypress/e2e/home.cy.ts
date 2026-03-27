describe('Utilisateurs E2E', () => {

  it('ajoute un utilisateur', () => {
    const email = `julie${Date.now()}@test.com`;

    cy.visit('/');

    cy.contains('Aller au formulaire').click();

    cy.get('[data-testid="firstName-input"]').type('Julie');
    cy.get('[data-testid="lastName-input"]').type('Lechartier');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birth-input"]').type('1995-01-01');
    cy.get('[data-testid="postalCode-input"]').type('01000');
    cy.get('[data-testid="ville-input"]').type('Lyon');

    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="success-toast"]').should('exist');

    cy.url().should('include', '/');

    cy.contains('Julie Lechartier');
  });

  it('refuse un email déjà utilisé', () => {
    const email = `test${Date.now()}@test.com`;

    cy.request('POST', 'http://localhost:8000/users', {
      firstName: 'Julie',
      lastName: 'Lechartier',
      email
    });

    cy.visit('/register');

    cy.get('[data-testid="firstName-input"]').type('Julie');
    cy.get('[data-testid="lastName-input"]').type('Lechartier');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birth-input"]').type('1995-01-01');
    cy.get('[data-testid="postalCode-input"]').type('01000');
    cy.get('[data-testid="ville-input"]').type('Lyon');

    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="email-error"]').should('contain.text', 'Email déjà pris');
  });

});