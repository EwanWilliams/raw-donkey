describe('create recipe', () => {
  beforeEach(() => {
    cy.visit("http://localhost:4173/create")
  })
  it('custom command works', () => {
    cy.getByData("recipe-title-input")
  })
})
