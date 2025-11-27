describe("browse_page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.clearCookies();
  });

  it('Change Number of Recipes', function() {
    let selector = cy.getByData("page-size-selector");
    selector.select('9');
      assert(selector.should('have.value', '9'));
    selector.select('6');
      assert(selector.should('have.value', '6'));
    selector.select('3');
      assert(selector.should('have.value', '3'));
    
    let count = true
    
    cy.getByData('next-page-button').should('exist');
  });



  it('View Page', function() {
    let link = cy.get('#root div:nth-child(1) > div.recipe-body > a.recipe-link');
    link.invoke('attr', 'href').then(href => {
      cy
          .request(href)
          .its('status')
          .should('eq', 200);
    });
  });
})

