describe('ow-frontend', () => {
  beforeEach(() => cy.visit('/'));

  it('should load the application', () => {
    cy.get('[data-cypress=main-app]').should('be.visible');
  });

  it('should be able to select a title from the side bar', () => {
    cy.get('body').should('be.visible').tab().tab().click();
  });
});
