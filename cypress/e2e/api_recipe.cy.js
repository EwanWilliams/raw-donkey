describe('Recipe API Tests', () => {

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
            body: { title: "New Test Recipe", ingredients: [{item: 'Test Ingredient', quantity: 1, unit: 'g'}], instructions: ["Test Instruction"] }
        }).then((res) => {
            expect(res.status).to.eq(201);
        });
        cy.request({
            method: 'DELETE',
            url: '/api/recipe/deletetestrecipe'
        }).then((res) => {
            expect(res.status).to.eq(204);
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

    it('Get Liked Recipes - Not Logged In', () => {
        cy.request({
            method: 'GET',
            url: '/api/recipe/liked',
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(401);
            expect(res.body).to.have.property('error', 'Authentication required');
        });
    });

    it('Get Liked Recipes - Logged In', () => {
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
            url: '/api/recipe/liked'
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.be.an('array');
        });
    });

    it('Like Recipe - Not Logged In', () => {
        cy.request({
            method: 'POST',
            url: '/api/recipe/12345/like',
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(401);
            expect(res.body).to.have.property('error', 'Authentication required');
        });
    });

    it('Like Recipe - Logged In', () => {
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
            method: 'POST',
            url: '/api/recipe/6911c04d5506244383ea9a09/like'
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('liked', true);
        });
    });

    it('Get Recipe from ID', () => {
        cy.request({
            method: 'GET',
            url: '/api/recipe/6911c04d5506244383ea9a09'
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.be.an('array')
        });
    });

    it('Get Comments for Recipe', () => {
        cy.request({
            method: 'GET',
            url: '/api/recipe/6911c04d5506244383ea9a09/comments'
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.be.an('array')
        });
    });

    it('Add Comment to Recipe', () => {
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
            method: 'POST',
            url: '/api/recipe/6911c04d5506244383ea9a09/comments',
            body: { commentText: "This is a test comment." }
        }).then((res) => {
            expect(res.status).to.eq(201);
            expect(res.body).to.have.property('comment');
        });
    });

});