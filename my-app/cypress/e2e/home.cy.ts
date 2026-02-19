describe("User registration E2E", () => {
  beforeEach(() => {
    cy.visit("/moteur-de-validation");
    cy.clearLocalStorage();
  });

  it("Ajout d’un nouvel utilisateur sans erreur", () => {
    cy.get('[data-testid="firstName-input"]').type("Julie");
    cy.get('[data-testid="lastName-input"]').type("Lechartier");
    cy.get('[data-testid="email-input"]').type("julie@example.com");
    cy.get('[data-testid="birth-input"]').type("1990-01-01");
    cy.get('[data-testid="postalCode-input"]').type("01000");
    cy.get('[data-testid="ville-input"]').type("Lyon");

    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="success-toast"]').should("exist");

    cy.window().then((win) => {
      const stored = JSON.parse(win.localStorage.getItem("inscription") || "{}");
      expect(stored.firstName).to.equal("Julie");
      expect(stored.lastName).to.equal("Lechartier");
      expect(stored.email).to.equal("julie@example.com");
    });
  });

  it("Ajout d’un utilisateur avec erreur", () => {
    cy.get('[data-testid="firstName-input"]').type("Julie");
    cy.get('[data-testid="lastName-input"]').type("Lechartier");

    cy.get('[data-testid="submit-button"]').should("be.disabled");
  });
});
