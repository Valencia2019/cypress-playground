//This only tests the contact list pages that are available without being logged in
var email, password;

describe('Contact List App Accessibility checks Logged in', () => {
  before(() => {
    cy.fixture('contact-list-user').then((contact) => {
      email = contact.user.email
      password = contact.user.password
    })
  })
    beforeEach(() => {
      cy.visit('https://thinking-tester-contact-list.herokuapp.com/')
    })
  
    it('A11y check of the Contact List Page', () => {
      cy.get("#email").type(email)
      cy.get("#password").type(password, { sensitive: true })
      cy.get("#submit").click()
      cy.injectAxe()
      cy.checkA11y(null, null, null, true)
    })
    
    it('A11y check of the Add Contact Page', () => {
      cy.get("#email").type(email)
      cy.get("#password").type(password, { sensitive: true })
      cy.get("#submit").click()
      cy.get("#add-contact").click()
      cy.injectAxe()
      cy.checkA11y(null, null, null, true)
    })
  })