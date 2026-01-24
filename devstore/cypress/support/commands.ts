/// <reference types="cypress" />

export {};

Cypress.Commands.add("searchByQuery", (query: string) => {
  cy.visit("http://localhost:3000");
  cy.get("input[name=q]").type(query).parent("form").submit();
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * @example cy.searchByQuery('cypress')
       */
      searchByQuery(query: string): Chainable<void>;
    }
  }
}
