describe('login tests', () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.clearCookies();
  })
  it('correct login', () => {
    // @ Callum started for you, check it's worked
    // cy.getByData("username-input").type("test_user");
    // cy.getByData("password-input").type("password1");
    // cy.getByData("login-button").click();
  })
})