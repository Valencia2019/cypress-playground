describe('Contact List App Users API checks', () => {
    before(() => {
      cy.fixture('contact-list-api-user').then((contact) => {
        //generate a password for the api user we're creating
        cy.generatePassword().then((pw) => {
            //set user password in the fixture to access in tests later
            contact.user.password = pw;
            cy.writeFile('cypress/fixtures/contact-list-api-user.json', contact)
        })
      })
    })

    it('Contact List Add User API Test', () => {
      cy.fixture('contact-list-api-user').then((contact) => {
        cy.addUser(contact.user.firstName, contact.user.lastName, contact.user.email, contact.user.password)
      })
       
    })
    
    it('Contact List Delete User API Test', () => {
        cy.fixture('contact-list-api-user').then((contact) => {
          cy.deleteUser(contact.token)
      })
         
    })

})