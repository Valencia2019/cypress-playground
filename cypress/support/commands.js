Cypress.Commands.add('addUser', (firstName, lastName, email, password) => { 
        cy.log("addUser command")
        // create the user first in the DB
        cy.request({
          url: 'https://thinking-tester-contact-list.herokuapp.com/users',
          method: 'POST',
          body: {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "password": password
        },
        })
          .its('body')
          .then((body) => {
            cy.fixture('contact-list-api-user').then((contact) => {
              contact.token = body.token
              contact.user.id = body._id
            cy.writeFile('cypress/fixtures/contact-list-user.json', contact)
            })
          })

 })
 Cypress.Commands.add('generatePassword', () => {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 8;
    var pw = "";
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      pw += chars.substring(randomNumber, randomNumber +1);
    }
    return pw;
 })
 Cypress.Commands.add('deleteUser', (token) => { 
    // create the user first in the DB
    cy.request({
      url: 'https://thinking-tester-contact-list.herokuapp.com/users/me',
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token }
    })
})
Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
  if (options && options.sensitive) {
    // turn off original log
    options.log = false
    // create our own log with masked message
    Cypress.log({
      $el: element,
      name: 'type',
      message: '*'.repeat(text.length),
    })
  }

  return originalFn(element, text, options)
})