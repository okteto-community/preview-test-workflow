// Custom commands for URL shortener testing

Cypress.Commands.add('shortenUrl', (url) => {
  cy.get('[data-testid="url-input"]').clear().type(url);
  cy.get('[data-testid="shorten-button"]').click();
});

Cypress.Commands.add('waitForShortUrl', () => {
  cy.get('[data-testid="result-card"]', { timeout: 10000 }).should('be.visible');
  cy.get('[data-testid="short-url"]').should('be.visible');
});

Cypress.Commands.add('copyShortUrl', () => {
  cy.get('[data-testid="copy-button"]').click();
});