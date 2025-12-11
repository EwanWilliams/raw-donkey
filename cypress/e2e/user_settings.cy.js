describe("settings_page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.clearCookies();
  });

  it('All Fields Render', () => {

cy.get('#root a.rd-btn-login').click();


cy.getByData("username-input").click();


cy.getByData("username-input").type('test_user');


cy.getByData("password-input").click();


cy.getByData("password-input").type('password1');


cy.get('#root button.w-full').click();


cy.get('#root a[href="/settings"]').click();


cy.getByData("settings-page").should('exist');

cy.getByData("settings-card").should('exist');

cy.getByData("settings-title").should('exist');

cy.getByData("settings-file-input").should('exist');

cy.getByData("settings-change-picture-button").should('exist');

cy.getByData("settings-measure-section").should('exist');

cy.getByData("settings-measure-title").should('exist');

cy.getByData("settings-metric-radio").should('exist');

cy.getByData("settings-imperial-radio").should('exist');

cy.getByData("settings-save-button").should('exist');


  });

  it('Change Measurements Successfully', () => {
    cy.get('#root a.rd-btn-login').click();
    
    cy.getByData("username-input").click();
    
    cy.getByData("username-input").type('test_user');
    
    cy.getByData("password-input").click();
    
    cy.getByData("password-input").type('password1');
    
    cy.get('#root button.w-full').click();
    
    cy.get('#root a[href="/settings"]').click();
    
    cy.getByData("settings-imperial-radio").check();
    
    cy.getByData("settings-save-button").click();
    
    cy.getByData('settings-error-popup-ok-button').click();
    
    cy.getByData("settings-metric-radio").check();
    
    cy.wait(500)
    
    cy.getByData("settings-save-button").click();
  });

  it('Change Picture Successfully', () => {
    cy.get('#root a.rd-btn-login').click();
    
    cy.getByData("username-input").click();
    
    cy.getByData("username-input").type('test_user');
    
    cy.getByData("password-input").click();
    
    cy.getByData("password-input").type('password1');
    
    cy.get('#root button.w-full').click();
    
    cy.get('#root a[href="/settings"]').click();
    
    cy.get('input[type=file]').selectFile('cypress/fixtures/test_image.jpg', { force: true });
    
    cy.getByData("settings-save-button").click();
    
    cy.wait(500)
    
    cy.getByData("settings-error-popup-ok-button").click();
    
    cy.get('#root a[href="/browse"]').click();
    
    cy.get('#root a[href="/settings"]').click();
    
    cy.getByData("settings-avatar-img").should('have.attr', 'src').and('include', 'data:image/jpeg;base64');
    
    cy.get('input[type=file]').selectFile('cypress/fixtures/large_test_image.png', { force: true });
    
    cy.get('[data-test="settings-error-popup"] p.settings-popup-message').should('exist');
    
    cy.getByData("settings-error-popup-ok-button").click();
  });

  it('User with no Profile Picture', () => {
    cy.get('#root a.rd-btn-login').click();
    
    cy.getByData("username-input").click();
    
    cy.getByData("username-input").type('test_user_blank');
    
    cy.getByData("password-input").click();
    
    cy.getByData("password-input").type('password2');
    
    cy.get('#root button.w-full').click();
    
    cy.get('#root a[href="/settings"]').click();

    cy.get('[data-test="settings-card"] div.settings-avatar-wrapper').should('be.visible');
  });

  it('Handles Invalid File Type', () => {
    cy.get('#root a.rd-btn-login').click();
    
    cy.getByData("username-input").click();
    
    cy.getByData("username-input").type('test_user');
    
    cy.getByData("password-input").click();
    
    cy.getByData("password-input").type('password1');
    
    cy.get('#root button.w-full').click();
    
    cy.get('#root a[href="/settings"]').click();
    
    cy.get('input[type=file]').selectFile('cypress/fixtures/test_text.txt', { force: true });
    
    cy.getByData("settings-error-popup-ok-button").click();
    
    
  });

})

