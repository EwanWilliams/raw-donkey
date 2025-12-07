describe("browse_page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.clearCookies();
  });

  it('All Fields Render', () => {
    cy.wait(5000)
    cy.getByData("page-size-selector").should('exist').and('have.value', '6');
    cy.getByData('next-page-button').should('exist');
    cy.getByData('previous-page-button').should('exist');
    cy.getByData('current-page-display').should('exist').and('have.text', 'Page 1');
    cy.getByData("recipe-grid").should('exist');

  });

  it('Change Number of Recipes', function() {
    let selector = cy.getByData("page-size-selector");
    selector.select('9');
      assert(selector.should('have.value', '9'));
    selector.select('6');
      assert(selector.should('have.value', '6'));
    
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

