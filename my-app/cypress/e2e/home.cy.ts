describe('User registration E2E', () => {

  const validUser = { id: 1, name: "Julie", email: "julie@test.com" };
  const invalidUser = { id: 2, name: "", email: "invalid@test.com" }; // exemple erreur : nom vide

  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      }
    });
  });

  it('Ajout d’un nouvel utilisateur sans erreur', () => {
    cy.contains('0 user(s) already registered').should('be.visible');

    cy.get('a[href="/register"]').click();

    cy.get('input[name="name"]').type(validUser.name);
    cy.get('input[name="email"]').type(validUser.email);
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');

    cy.contains('1 user(s) already registered').should('be.visible');
  });

  it('Ajout d’un nouvel utilisateur avec erreur', () => {
    cy.window().then(win => {
      win.localStorage.setItem('users', JSON.stringify([validUser]));
    });
    cy.reload();

    cy.contains('1 user(s) already registered').should('be.visible');

    cy.get('a[href="/register"]').click();

    cy.get('input[name="name"]').type(invalidUser.name);
    cy.get('input[name="email"]').type(invalidUser.email);
    cy.get('button[type="submit"]').click();

    // Ici on vérifie qu'une erreur s'affiche
    cy.contains('Please enter a valid name').should('be.visible');

    cy.visit('/');

    cy.contains('1 user(s) already registered').should('be.visible');
  });

});
