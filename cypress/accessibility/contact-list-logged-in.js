//This only tests the contact list pages that are available without being logged in
var email, password;

describe('Contact List App Accessibility checks Logged in', () => {
  before(() => {
    cy.fixture('primary-user').then((user) => {
      email = user.email
      password = user.password
    })
  })
    beforeEach(() => {
      cy.visit('/')
    })
  
    it('A11y check of the Contact List Page', () => {
      cy.get("#email").type(email)
      cy.get("#password").type(password)
      cy.get("#submit").click()
      cy.url().should('include', 'contactList')
      cy.injectAxe()
      cy.checkA11y(null, null, null, true)
    })
    
    it('A11y check of the Add Contact Page', () => {
      cy.get("#email").type(email)
      cy.get("#password").type(password)
      cy.get("#submit").click()
      cy.get("#add-contact").click()
      cy.url().should('include', 'addContact')
      cy.injectAxe()
      cy.checkA11y(null, null, null, true)
    })

  })