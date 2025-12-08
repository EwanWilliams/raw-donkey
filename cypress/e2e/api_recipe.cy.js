describe('AUTH API Tests', () => {

    before(() => {
    });

    beforeEach(() => {
        cy.visit("http://localhost:5173");
        cy.clearCookies();
    });

    it('Add Recipe Successfully', () => {
        cy.request({
            method: 'POST',
            url: '/api/recipe/new',
            body: { title: "New Recipe", ingredients: ({item: 'Test Ingredient', amount: 1, unit: 'g'}), instructions: ["Test Instruction"] }
        }).then((res) => {
            expect(res.status).to.eq(201);
            expect(res.body.data).to.have.property('title', 'New Recipe');
            expect(res.body).to.have.property('message', 'Recipe added successfully.');
        });
    });

});