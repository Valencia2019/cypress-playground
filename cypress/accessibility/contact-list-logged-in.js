//This only tests the contact list pages that are available without being logged in
var email, password;

describe('Contact List App Accessibility checks Logged in', () => {
  before(() => {
    cy.fixture('contact-list-users').then((users) => {
      email = users[2].email
      password = users[2].password
    })
  })
    beforeEach(() => {
      cy.visit('/')
    })
  
    it('A11y check of the Contact List Page', () => {
      cy.get("#email").type(email)
      cy.get("#password").type(password)
      cy.get("#submit").click()
      cy.injectAxe()
      cy.checkA11y(null, null, null, true)
    })
    
    it('A11y check of the Add Contact Page', () => {
      cy.get("#email").type(email)
      cy.get("#password").type(password)
      cy.get("#submit").click()
      cy.get("#add-contact").click()
      cy.injectAxe()
      cy.checkA11y(null, null, null, true)
    })

//this function would delete the contact that is created, but I deleted
//that and commented out this after hook. Will work on this in another branch.
/*     after(() => {
      cy.fixture('contact-list-users').then((contact) => {
        cy.deleteUser(contact.token)
      })
    }) */
  })