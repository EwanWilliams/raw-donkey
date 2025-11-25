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

    it('shows client-side validation when required fields are missing', () => {
        // Try submitting without filling required fields
        cy.get('[data-cy=submit], button[type="submit"]').click();

        // Expect validation messages for common required fields
        cy.contains(/title is required|please enter a title|title required/i).should('exist').or(() => {
            // fallback: check for invalid inputs with :invalid (HTML5)
            find('title').then(($el) => {
                if ($el.prop('validationMessage')) {
                    expect($el[0].checkValidity()).to.be.false;
                }
            });
        });

        // Fill title but leave others empty and re-submit to see other validations
        find('title').clear().type('My Test Recipe');
        cy.get('[data-cy=submit], button[type="submit"]').click();
        cy.contains(/ingredients is required|please add ingredients/i).should('exist').or(() => {
            find('ingredients').then(($el) => {
                if ($el.prop('validationMessage')) {
                    expect($el[0].checkValidity()).to.be.false;
                }
            });
        });
    });

    it('submits the form and navigates to the created recipe on success', () => {
        // Stub the API create endpoint
        cy.intercept('POST', '/api/recipes', (req) => {
            // echo back body with an id to simulate creation
            req.reply({
                statusCode: 201,
                body: { id: 'abc123', ...req.body },
            });
        }).as('createRecipe');

        // Fill form fields
        find('title').clear().type('Cypress Test Recipe');
        find('description').clear().type('This is a description created during a cypress test.');
        find('ingredients').clear().type('1 cup flour\n2 eggs\n1 tsp salt');
        find('steps').clear().type('Mix ingredients\nBake for 20 minutes');

        // If there's a file input and a test fixture, you could attach a file here
        // (requires cypress-file-upload plugin). This test simply asserts input exists.
        cy.get('input[type="file"], [data-cy="image"]').then(($input) => {
            if ($input.length) {
                // ensure the control is present; do not require upload plugin here
                cy.wrap($input).should('exist');
            }
        });

        // Submit and wait for the API call
        cy.get('[data-cy=submit], button[type="submit"]').click();
        cy.wait('@createRecipe').its('request.body').should((body) => {
            expect(body).to.have.property('title', 'Cypress Test Recipe');
            expect(body).to.have.property('description');
        });

        // Expect redirect to the new recipe page (adjust path if your app differs)
        cy.location('pathname', { timeout: 5000 }).should((path) => {
            expect(path).to.match(/\/recipes\/abc123$/);
        });
    });

    it('shows server error when API returns failure', () => {
        // Simulate server error
        cy.intercept('POST', '/api/recipes', {
            statusCode: 400,
            body: { message: 'Invalid recipe data' },
        }).as('createRecipeError');

        find('title').clear().type('Bad Recipe');
        find('description').clear().type('Bad data');
        find('ingredients').clear().type('x');
        find('steps').clear().type('y');

        cy.get('[data-cy=submit], button[type="submit"]').click();
        cy.wait('@createRecipeError');

        // Expect an error message shown in the UI
        cy.contains(/invalid recipe data|error/i).should('exist');
    });

    it('Login', function() {});
});