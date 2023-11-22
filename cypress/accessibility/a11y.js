
describe('Accessibility checks of the Contact List App', () => {
    beforeEach(() => {
      cy.visit('https://thinking-tester-contact-list.herokuapp.com/')
    })
  
      //
    it('A11y check of the Login Page', () => {
      cy.injectAxe()
      cy.checkA11y()
    })
    it('A11y check of the Signup Page', () => {
      cy.get("#signup").click()
      cy.injectAxe()
      cy.checkA11y()
    })
  })