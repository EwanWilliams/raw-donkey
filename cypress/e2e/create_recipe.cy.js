describe('create_page', () => {
    beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.clearCookies();
  });

    it('All Fields Render', () => {

        cy.get('#root a.rd-btn-login').click();

        cy.getByData("username-input").click();

        cy.getByData("username-input").type('test_user');

        cy.getByData("password-input").click();

        cy.getByData("password-input").type('password1');

        cy.get('#root button.w-full').click();

        cy.get('#root a[href="/create"]').click();


        cy.getByData("recipe-title-input").should('exist');

        cy.getByData("recipe-image-input").should('exist');

        cy.getByData("ingredient-item-input").should('exist');

        cy.getByData("ingredient-amount-input").should('exist');

        cy.getByData("ingredient-unit-select").should('exist');

        cy.getByData("ingredient-add-button").should('exist');

        cy.getByData("instruction-text-input").should('exist');

        cy.getByData("instruction-add-button").should('exist');

        cy.getByData("recipe-submit-button").should('exist').and('not.be.disabled');
    });

    it('No Submission when Fields are Empty', () => {
        
        cy.get('#root a.rd-btn-login').click();
        
        
        cy.getByData("username-input").click();
        
        
        cy.getByData("username-input").type('test_user');
        
        
        cy.getByData("password-input").click();
        
        
        cy.getByData("password-input").type('password1');
        
        
        cy.get('#root button.w-full').click();
        
        
        cy.get('#root a[href="/create"]').click();
        
        
        cy.intercept('localhost:5173/api/recipe/new').as('api');


        cy.getByData("recipe-submit-button").click();
        
        
        cy.get("@api.all").should("have.length", 0);
    });

    it('submits the form and navigates to the created recipe on success', () => {
        cy.get('#root a.rd-btn-login').click();
        
        
        cy.getByData("username-input").click();
        
        
        cy.getByData("username-input").type('test_user');
        
        
        cy.getByData("password-input").click();
        
        
        cy.getByData("password-input").type('password1');
        
        
        cy.get('#root button.w-full').click();
        
        
        cy.get('#root a[href="/create"]').click();
        
        
        cy.intercept('localhost:5173/api/recipe/new').as('api');
        
        
        cy.getByData("recipe-title-input").click();
        
        cy.getByData("recipe-title-input").type('Test Recipe Title');
        
        
        cy.getByData("ingredient-item-input").click();
        
        cy.getByData("ingredient-item-input").type('Test Ingredient');
        
        cy.getByData("ingredient-amount-input").click();
        
        cy.getByData("ingredient-amount-input").type('2');
        
        cy.getByData("ingredient-unit-select").select('oz');
        
        
        cy.getByData("instruction-text-input").click();
        
        cy.getByData("instruction-text-input").type('Test instruction step 1.');
        
        
        cy.getByData("recipe-submit-button").click();

        
        
    });

});