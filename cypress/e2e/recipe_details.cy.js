describe("browse_page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.clearCookies();
  });
    it('All Fields Render', () => {
        cy.get('[data-test="recipe-grid"] div:nth-child(1) > div.recipe-body > a.recipe-link').click();
      
        cy.getByData('recipe-details-header').should('exist')
      
        cy.getByData('recipe-image').should('exist')

        cy.getByData('ingredients-panel').should('exist')

        cy.getByData('ingredients-list').should('exist')

        cy.getByData('details-panel').should('exist')

        cy.getByData('instructions-list').should('exist')
    });

});