describe("browse_page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.clearCookies();
  });

  it("test", () => {
    
  })

  it('Change Number of Recipes', function() {
    cy.get('[data-test="page-size-selector"]').select('9');
      assert(cy.get('[data-test="page-size-selector"]').should('have.value', '9'));
    cy.get('[data-test="page-size-selector"]').select('6');
      assert(cy.get('[data-test="page-size-selector"]').should('have.value', '6'));
    cy.get('[data-test="page-size-selector"]').select('3');
      assert(cy.get('[data-test="page-size-selector"]').should('have.value', '3'));
  });

  it('View Page', function() {
    cy.get('#root div:nth-child(1) > div.recipe-body > a.recipe-link').click();
    
    cy.get('#root a.nav-link').click();
    
    cy.get('#root div:nth-child(6) a.recipe-link').click();
    cy.get('#root a.nav-link').click();
  });
})
