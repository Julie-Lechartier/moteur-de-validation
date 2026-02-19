import "cypress-localstorage-commands";

describe('Navigation SPA et gestion utilisateurs', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('Scénario nominal', () => {
    cy.visit('/');
    cy.contains('0 utilisateur(s) inscrit(s)');
    cy.get('[data-testid="user-list"]').should('be.empty');

    cy.contains('Aller au formulaire').click();
    cy.url().should('include', '/register');

    // Remplir le formulaire
    cy.get('[data-testid="firstName-input"]').type('Julie');
    cy.get('[data-testid="lastName-input"]').type('Lechartier');
    cy.get('[data-testid="email-input"]').type('julie@test.com');
    cy.get('[data-testid="birth-input"]').type('1995-01-01');
    cy.get('[data-testid="postalCode-input"]').type('01000');
    cy.get('[data-testid="ville-input"]').type('Lyon');

    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="success-toast"]').should('exist');

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('1 utilisateur(s) inscrit(s)');
    cy.get('[data-testid="user-list"]').contains('Julie Lechartier');
  });

  it('Scénario d\'erreur', () => {
    cy.setLocalStorage('inscriptionList', JSON.stringify([{ firstName: 'Julie', lastName: 'Lechartier', email: 'julie@test.com' }]));

    cy.visit('/register');
    cy.get('[data-testid="email-input"]').type('julie@test.com');
    cy.get('[data-testid="submit-button"]').click();
    cy.contains('Email déjà pris');

    cy.visit('/');
    cy.contains('1 utilisateur(s) inscrit(s)');
    cy.get('[data-testid="user-list"]').contains('Julie Lechartier');
  });
});
