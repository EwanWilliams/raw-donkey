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

    it('Create Recipe Successfully', () => {
        cy.intercept('POST', '/api/recipe/new', {
            statusCode: 201,
            body: {
                message: "Recipe added successfully",
                recipeId: "64a7b2f5c25e4b6f8d0e4b2a"
            }
        }).as('createRecipe');
        
        cy.get('#root a.rd-btn-login').click();
        
        cy.getByData("username-input").click();
        
        cy.getByData("username-input").type('test_user');
        
        cy.getByData("password-input").click();
        
        cy.getByData("password-input").type('password1');
        
        cy.get('#root button.w-full').click();
        
        cy.get('#root a[href="/create"]').click();
        
        
        cy.getByData("recipe-title-input").click();
        
        cy.getByData("recipe-title-input").type('Test Recipe Title');
        
        cy.getByData("recipe-image-input").selectFile('cypress/fixtures/test_image.jpg', { force: true });
        
        cy.getByData("ingredient-item-input").click();
        
        cy.getByData("ingredient-item-input").type('Test Ingredient');
        
        cy.getByData("ingredient-amount-input").click();
        
        cy.getByData("ingredient-amount-input").type('2');
        
        cy.getByData("ingredient-unit-select").select('oz');
        
        
        cy.getByData("instruction-text-input").click();
        
        cy.getByData("instruction-text-input").type('Test instruction step 1.');
        
        
        cy.getByData("recipe-submit-button").click();
        
        cy.wait('@createRecipe').its('response.statusCode').should('eq', 201);
        
        cy.on('window:alert', (str) => {
            expect(str).to.equal(`Recipe uploaded successfully!`);
        });
    });

    it('Successfully Add and Remove new Ingredients and Recipes', () => {
        cy.get('#root a.rd-btn-login').click();
        
        cy.getByData("username-input").click();
        
        cy.getByData("username-input").type('test_user');
        
        cy.getByData("password-input").click();
        
        cy.getByData("password-input").type('password1');
        
        cy.get('#root button.w-full').click();
        
        cy.get('#root a[href="/create"]').click();
        
        
        cy.getByData("ingredient-add-button").click();        
                
        cy.get('div:nth-child(4) [data-test="ingredient-remove-button"]').click();
        
        cy.getByData("instruction-add-button").click();
        
        cy.get('div:nth-child(7) [data-test="instruction-remove-button"]').click();
    });

    it('Each Input Incorrect', () => {
        cy.get('#root a.rd-btn-login').click();
        
        cy.getByData("username-input").click();
        
        cy.getByData("username-input").type('test_user');
        
        cy.getByData("password-input").click();
        
        cy.getByData("password-input").type('password1');
        
        cy.get('#root button.w-full').click();
        
        cy.get('#root a[href="/create"]').click();
        
        cy.getByData("recipe-image-input").selectFile('cypress/fixtures/test_text.txt', { force: true });
        
        assert(cy.getByData("settings-popup").should('exist'));
        cy.getByData("settings-popup-ok-button").click();
        cy.get('[data-test="popup-overlay"]').should('not.exist');

        cy.getByData("recipe-submit-button").click();
        
        cy.getByData("recipe-title-input").click();
        
        cy.getByData("recipe-title-input").type('A');
        
        cy.getByData("recipe-submit-button").click();
        
        cy.getByData("ingredient-item-input").type('A');
        
        cy.getByData("recipe-submit-button").click();
        
        cy.getByData("ingredient-amount-input").type('1');
        
        cy.getByData("recipe-submit-button").click();
        
        cy.getByData("instruction-text-input").type('B');
        
        cy.getByData("recipe-submit-button").click();

        cy.getByData("recipe-image-input").selectFile('cypress/fixtures/large_test_image.png', { force: true });

        assert(cy.getByData("settings-popup").should('exist'));
        
        cy.getByData("settings-popup-ok-button").click();
        
        cy.get('#root button.rd-btn-logout').click();
    });
});