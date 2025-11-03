describe('AUTH API Tests', () => {
    const url = "http://localhost:4173";
  beforeEach(() => {
    cy.visit(url);
    cy.clearCookies();
  });
  it('correct login', () => {
    cy.request('POST', `${url}/api/auth/login`, {
        username: "test_user",
        password: "password1"
    }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('message', 'logged in');
        expect(res.headers).to.have.property('set-cookie');
    });
  });
});