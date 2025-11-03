describe('AUTH API Tests', () => {
    before(() => {
        cy.wait(10000);
    });
    beforeEach(() => {
        cy.visit("http://localhost:4173");
        cy.clearCookies();
    });
    it('correct login', () => {
        cy.request('POST', '/api/auth/login', {
            username: "test_user",
            password: "password1"
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('message', 'logged in');
            expect(res.headers).to.have.property('set-cookie');
        });
    });
});