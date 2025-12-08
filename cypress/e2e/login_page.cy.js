describe('login_page', () => {
    beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.clearCookies();
  });

    it('All Fields Render', () => {
        cy.get('#root a.rd-btn-login').click();
        
        cy.getByData("username-input").should('exist');
        
        cy.getByData("password-input").should('exist');
        
        cy.getByData("login-submit-button").should('exist');
        
        cy.getByData("login-submit-button").contains('Login')
        
        cy.getByData("toggle-register").should('exist');
        
        cy.getByData("toggle-register").click();
        
        cy.getByData("login-submit-button").contains('Register');
    });

    it('No Submission when Fields are Empty', () => {
        cy.get('#root a.rd-btn-login').click();
        
        cy.intercept('localhost:5173/api/auth/login').as('api');
        
        cy.getByData("login-submit-button").click();
        
        cy.get("@api.all").should("have.length", 0);
    });

    it('Successful Login Redirects to Browse', () => {
        cy.get('#root a.rd-btn-login').click();
        
        cy.getByData("username-input").click();
        
        cy.getByData("username-input").type('test_user');
        
        cy.getByData("password-input").click();
        
        cy.getByData("password-input").type('password1');
        
        cy.getByData("login-submit-button").click();
        
        cy.url().should('eq', 'http://localhost:5173/browse');
        
        cy.visit("http://localhost:5173/login");
        
        cy.get('#root a.rd-btn-login').contains('Login');
    });

    it('Successful Registration Redirects to Browse', () => {
        cy.intercept('POST', '/api/auth/register', {
            statusCode: 201,
            body: {
                message: "user created successfully"
            }
        }).as('createRecipe');

        cy.get('#root a.rd-btn-login').click();
        
        cy.getByData("toggle-register").click();
        
        cy.getByData("username-input").click();
        
        cy.getByData("username-input").type('new_user');
        
        cy.getByData("password-input").click();
        
        cy.getByData("password-input").type('new_password1');
        
        cy.getByData("login-submit-button").click();
        
        cy.url().should('eq', 'http://localhost:5173/browse');
    });

});