describe('create recipe', () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/create");
    cy.clearCookies();
  })
  it('custom command works', () => {
    cy.getByData("recipe-title-input")
  })
})
