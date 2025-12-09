describe('User API Tests', () => {

    before(() => {
    });

    beforeEach(() => {
        cy.visit("http://localhost:5173");
        cy.clearCookies();
    });

    it('Change User Settings - Not Logged In', () => {
        cy.request({
            method: 'PUT',
            url: '/api/user/settings',
            body: { unit_pref: "imperial" },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(401);
            expect(res.body).to.have.property('error', 'user not logged in');
        });
    });

    it('Change User Profile Image and Measurements - Logged In', () => {
        cy.request({
            method: 'POST',
            url: '/api/auth/login',
            body: { username: "test_user", password: "password1" }
        }).then((loginRes) => {
            expect(loginRes.status).to.eq(200);
            const cookies = loginRes.headers['set-cookie'];
            const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));
            expect(jwtCookie).to.exist;
        });
        cy.request({
            method: 'PUT',
            url: '/api/user/settings',
            body: { unit: "imperial", img: "" }
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('message', 'units updated');
        });
    });

    it('Get User Details - Logged In', () => {
        cy.request({
            method: 'POST',
            url: '/api/auth/login',
            body: { username: "test_user", password: "password1" }
        }).then((loginRes) => {
            expect(loginRes.status).to.eq(200);
            const cookies = loginRes.headers['set-cookie'];
            const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));
            expect(jwtCookie).to.exist;
        });
        cy.request({
            method: 'GET',
            url: '/api/user/details'
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('username', 'test_user');
            expect(res.body).to.have.property('unit_pref');
            expect(res.body).to.have.property('profile_img');
        });
    });

    it('Get User Details - Not Logged In', () => {
        cy.request({
            method: 'GET',
            url: '/api/user/details',
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(401);
            expect(res.body).to.have.property('error', 'user not logged in');
        });
    });

    it('Get User Likes - Logged In', () => {
        cy.request({
            method: 'POST',
            url: '/api/auth/login',
            body: { username: "test_user", password: "password1" }
        }).then((loginRes) => {
            expect(loginRes.status).to.eq(200);
            const cookies = loginRes.headers['set-cookie'];
            const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));
            expect(jwtCookie).to.exist;
        });
        cy.request({
            method: 'GET',
            url: '/api/user/likes'
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('likes');
        });
    });

    it('Get User Likes - Not Logged In', () => {
        cy.request({
            method: 'GET',
            url: '/api/user/likes',
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(401);
            expect(res.body).to.have.property('error', 'user not logged in');
        });
    });

});