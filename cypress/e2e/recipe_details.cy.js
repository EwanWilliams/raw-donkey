import { comment } from "postcss";

describe("details_page", () => {
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

        cy.get('#root a[href="/settings"]').click();
        
        cy.get('[data-test="settings-measure-section"] label:nth-child(2)').click();

        cy.wait(500);
        
        cy.get('[data-test="settings-metric-radio"]').check();

        cy.get('#root a[href="/browse"]').click();
        
        cy.get('[data-test="recipe-grid"] div:nth-child(2) > div.recipe-body > a.recipe-link').click();
        
        cy.getByData('ingredients-list').contains('400 g').should('exist')
        
        cy.get('#root a[href="/settings"]').click();

        cy.wait(500);
        
        cy.get('[data-test="settings-imperial-radio"]').check();
        
        cy.getByData('settings-save-button').click(); 
        
        cy.get('#root a[href="/browse"]').click();
        
        cy.get('[data-test="recipe-grid"] div:nth-child(2) > div.recipe-body > a.recipe-link').click();
        
        cy.getByData('ingredients-list').contains('14.1 oz').should('exist')
        
        cy.get('#root a[href="/settings"]').click();
        
        cy.get('[data-test="settings-measure-section"] label:nth-child(2)').click();

        cy.wait(500);
        
        cy.get('[data-test="settings-metric-radio"]').check();
        
        cy.getByData('settings-save-button').click();
    });

    it('Add Comment Works', () => {
        const newComment = {
            recipeId: '0123456789abcdef01234567',
            userId: 'abcdef0123456789abcdef01',
            username: 'test_user',
            commentText: 'This is a test comment.'
        };
        
        cy.intercept('POST', '/api/recipe/6911c04d5506244383ea9a09/comments', {
            statusCode: 201,
            body: {
                message: "Comment added successfully",
                comment: newComment      
            }
        }).as('createRecipe');
        
        
        cy.get('#root a.rd-btn-login').click();
                
        cy.getByData("username-input").click();
        
        cy.getByData("username-input").type('test_user');
        
        cy.getByData("password-input").click();
        
        cy.getByData("password-input").type('password1');
        
        cy.get('#root button.w-full').click();
        
        cy.get('[data-test="recipe-grid"] div:nth-child(2) > div.recipe-body > a.recipe-link').click();
        
        cy.get('#root textarea.comment-input').click();
        
        cy.get('#root textarea.comment-input').type('This is a test comment.');
        
        cy.getByData('comment-submit-button').click();
        cy.get('[data-test="comments-list"] div:nth-child(1) > p.comment-item-text').contains('This is a test comment.')
    });

});