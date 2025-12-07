describe("browse_page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.clearCookies();
  });
    it('All Fields Render', () => {
        cy.get('[data-test="recipe-grid"] div:nth-child(2) > div.recipe-body > a.recipe-link').click();
              
        cy.getByData('recipe-details-header').should('exist')
              
        cy.getByData('recipe-image').should('exist')
        
        cy.getByData('ingredients-panel').should('exist')
        
        cy.getByData('ingredients-list').should('exist')
        
        cy.getByData('details-panel').should('exist')
        
        cy.getByData('instructions-list').should('exist')
        
        cy.getByData('comments-list').should('exist')
    });

    it('Lists have items', () => {
        cy.get('[data-test="recipe-grid"] div:nth-child(2) > div.recipe-body > a.recipe-link').click();
        
        cy.getByData('recipe-image').should('exist')
        
        cy.getByData('ingredients-list').children().its('length').should('be.gte', 1)
        
        cy.getByData('instructions-list').children().its('length').should('be.gte', 1)
        
        cy.getByData('comments-list').children().its('length').should('be.gte', 1)
    });

    it('Different Units Work', () => {
        cy.get('#root a.rd-btn-login').click();
                
        cy.getByData("username-input").click();
                
        cy.getByData("username-input").type('test_user');
                
        cy.getByData("password-input").click();
                
        cy.getByData("password-input").type('password1');
                
        cy.get('#root button.w-full').click();
        
        cy.get('[data-test="recipe-grid"] div:nth-child(2) > div.recipe-body > a.recipe-link').click();
        
        cy.getByData('ingredients-list').contains('400 g').should('exist')
        
        cy.get('#root a[href="/settings"]').click();
        
        cy.get('[data-test="settings-measure-section"] label:nth-child(2)').click();
        
        cy.getByData('settings-imperial-radio').check();
        
        cy.getByData('settings-save-button').click(); 
        
        cy.get('#root a[href="/browse"]').click();
        
        cy.get('[data-test="recipe-grid"] div:nth-child(2) > div.recipe-body > a.recipe-link').click();
        
        cy.getByData('ingredients-list').contains('14.1 oz').should('exist')
        
        cy.get('#root a[href="/settings"]').click();
        
        cy.get('[data-test="settings-measure-section"] label:nth-child(2)').click();
        
        cy.getByData('settings-metric-radio').check();
        
        cy.getByData('settings-save-button').click();
    });

});