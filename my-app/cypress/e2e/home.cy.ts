import "cypress-localstorage-commands";

describe('Navigation SPA et gestion utilisateurs', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('Scénario nominal', () => {

    cy.intercept("GET", "**/users", {
      statusCode: 200,
      body: []
    }).as("getUsers");

    cy.visit('/');
    cy.wait("@getUsers");

    cy.contains('0 utilisateur(s) inscrit(s)');
    cy.get('[data-testid="user-list"]').should('be.empty');

    cy.contains('Aller au formulaire').click();

    cy.intercept("POST", "**/users", {
      statusCode: 201,
      body: {
        id: 101,
        firstName: 'Julie',
        lastName: 'Lechartier',
        email: 'julie@test.com'
      }
    }).as("createUser");

    // Remplissage
    cy.get('[data-testid="firstName-input"]').type('Julie');
    cy.get('[data-testid="lastName-input"]').type('Lechartier');
    cy.get('[data-testid="email-input"]').type('julie@test.com');
    cy.get('[data-testid="birth-input"]').type('1995-01-01');
    cy.get('[data-testid="postalCode-input"]').type('01000');
    cy.get('[data-testid="ville-input"]').type('Lyon');

    cy.get('[data-testid="submit-button"]').click();

    cy.wait("@createUser");

    cy.get('[data-testid="success-toast"]').should('exist');

    cy.url().should('eq', Cypress.config().baseUrl + '/');

    cy.contains('1 utilisateur(s) inscrit(s)');
    cy.get('[data-testid="user-list"]').contains('Julie Lechartier');
  });

  it("Scénario email déjà pris", () => {

    cy.intercept("GET", "**/users", {
      statusCode: 200,
      body: [
        {
          id: 1,
          firstName: 'Julie',
          lastName: 'Lechartier',
          email: 'julie@test.com'
        }
      ]
    }).as("getUsers");

    cy.visit('/register');
    cy.wait("@getUsers");

    cy.get('[data-testid="firstName-input"]').type('Julie');
    cy.get('[data-testid="lastName-input"]').type('Lechartier');
    cy.get('[data-testid="email-input"]').type('julie@test.com'); // déjà pris
    cy.get('[data-testid="birth-input"]').type('1995-01-01');
    cy.get('[data-testid="postalCode-input"]').type('01000');
    cy.get('[data-testid="ville-input"]').type('Lyon');

    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="email-error"]')
      .should('contain.text', 'Email déjà pris');
  });
  it("Scénario erreur API à l'ajout", () => {

    cy.intercept("GET", "**/users", {
      statusCode: 200,
      body: []
    });

    cy.intercept("POST", "**/users", {
      statusCode: 500
    }).as("createUserError");

    cy.visit('/register');

    cy.get('[data-testid="firstName-input"]').type('Julie');
    cy.get('[data-testid="lastName-input"]').type('Lechartier');
    cy.get('[data-testid="email-input"]').type('julie@test.com');
    cy.get('[data-testid="birth-input"]').type('1995-01-01');
    cy.get('[data-testid="postalCode-input"]').type('01000');
    cy.get('[data-testid="ville-input"]').type('Lyon');

    cy.get('[data-testid="submit-button"]').click();

    cy.wait("@createUserError");

    cy.contains("Erreur lors de l'ajout").should("exist");
  });
});
