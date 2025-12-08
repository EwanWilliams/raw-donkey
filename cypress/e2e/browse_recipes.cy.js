describe("browse_page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.clearCookies();
  });

  it('All Fields Render', () => {
    cy.wait(500)

    cy.getByData("page-size-selector").should('exist').and('have.value', '6');

    cy.getByData('next-page-button').should('exist');

    cy.getByData('previous-page-button').should('exist');

    cy.getByData('current-page-display').should('exist').and('have.text', 'Page 1');

    cy.getByData("recipe-grid").should('exist');

  });

  it('Change Number of Recipes', () => {
    let selector = cy.getByData("page-size-selector");
    selector.select('9');
      assert(selector.should('have.value', '9'));
    selector.select('6');
      assert(selector.should('have.value', '6'));
    
    let count = true
    
    cy.getByData('next-page-button').should('exist');
  });

  it('View Page', () => {
    let link = cy.get('#root div:nth-child(1) > div.recipe-body > a.recipe-link');
    link.invoke('attr', 'href').then(href => {
      cy
          .request(href)
          .its('status')
          .should('eq', 200);
    });
  });

  it('Next Page', () => {
    cy.getByData('next-page-button').click();
    
    cy.getByData('current-page-display').should('have.text', 'Page 2');
    
    cy.getByData('previous-page-button').click();
    
    cy.getByData('current-page-display').should('have.text', 'Page 1');
    
    cy.get('#root button.rd-btn-theme-toggle').click();
    
    cy.get('#root button.rd-btn-theme-toggle').click();
  })

  it('Like Recipe', () => {
    cy.get('#root a.rd-btn-login').click();
    
    cy.getByData("username-input").click();
    
    cy.getByData("username-input").type('test_user');
    
    cy.getByData("password-input").click();
    
    cy.getByData("password-input").type('password1');
    
    cy.get('#root button.w-full').click();
    
    cy.get('[data-test="recipe-grid"] div:nth-child(2) > div.recipe-body > button.like-button').then(($btn) => {
    
          if ($btn.text().includes('Liked')) {
               cy.get('[data-test="recipe-grid"] div:nth-child(2) > div.recipe-body > button.like-button').click();
          }
    });
    
    cy.get('[data-test="recipe-grid"] div:nth-child(2) > div.recipe-body > button.like-button').click();
    
    cy.wait(500);
    
    cy.get('[data-test="recipe-grid"] div:nth-child(2) > div.recipe-body > button.like-button').contains('Liked');
    
    cy.get('#root button.liked-toggle-button').click();
    
    cy.getByData('recipe-grid').children().should('exist');
    
    cy.get('#root button.liked-toggle-button').click();
    
    cy.get('[data-test="recipe-grid"] div:nth-child(2) > div.recipe-body > button.like-button').click();
  });
})

