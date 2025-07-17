//This only tests the contact list pages that are available without being logged in
describe('Contact List App Accessibility checks Not Logged in', () => {
    beforeEach(() => {
      cy.visit('/')
    })
  
    it('A11y check of the Login Page', () => {
      cy.injectAxe()
      cy.checkA11y(null, null, null, true)
    })
    
    it('A11y check of the Signup Page', () => {
      cy.get("#signup").click()
      cy.injectAxe()
      cy.checkA11y(null, null, null, true)
    })
  })