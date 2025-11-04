describe('AUTH API Tests', () => {
    before(() => {
        cy.wait(10000);
    });
    beforeEach(() => {
        cy.visit("http://localhost:4173");
        cy.clearCookies();
    });
    it('correct login', () => {
        cy.request({
            method: 'POST',
            url: '/api/auth/login',
            body: { username: "test_user", password: "password1" }
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('message', 'logged in');
            expect(res.headers).to.have.property('set-cookie');
        });
    });
    it('incorrect login', () => {
        cy.request({
            method: 'POST',
            url: '/api/auth/login',
            body: { username: "test_user", password: "wrongpassword" },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body).to.have.property('error', 'Invalid username or password.');
            expect(res.headers).to.not.have.property('set-cookie');
        });
    });
});