describe('AUTH API Tests', () => {

    before(() => {
        cy.wait(10000);
    });

    beforeEach(() => {
        cy.visit("http://localhost:4173");
        cy.clearCookies();
    });


    it('login: correct login', () => {
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


    it('login: incorrect password', () => {
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


    it('login: incorrect username', () => {
        cy.request({
            method: 'POST',
            url: '/api/auth/login',
            body: { username: "wrong_user", password: "password1" },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body).to.have.property('error', 'Invalid username or password.');
            expect(res.headers).to.not.have.property('set-cookie');
        });
    });


    it('register: username already taken', () => {
        cy.request({
            method: 'POST',
            url: 'api/auth/register',
            body: { username: "test_user", password: "password1" },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body).to.have.property('error', 'username already in use');
            expect(res.headers).to.not.have.property('set-cookie');
        });
    });


    it('register: password empty', () => {
        cy.request({
            method: 'POST',
            url: 'api/auth/register',
            body: { username: "new_user", password: "" },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body).to.have.property('error', "password can't be empty");
            expect(res.headers).to.not.have.property('set-cookie');
        });
    });
});