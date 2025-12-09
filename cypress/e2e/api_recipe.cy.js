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
            body: { title: "New Recipe", ingredients: ({item: 'Test Ingredient', quantity: 1, unit: 'g'}), instructions: ["Test Instruction"] }
        }).then((res) => {
            expect(res.status).to.eq(201);
        });
    });

    it('Add Recipe Failure - No Values', () => {
        cy.request({
            method: 'POST',
            url: '/api/recipe/new',
            body: { title: "", ingredients: "", instructions: "" },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
        });
    });

});