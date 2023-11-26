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
            cy.writeFile('cypress/fixtures/contact-list-user.json', body)
          })

 })
 Cypress.Commands.add('generatePassword', () => {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 8;
    var password = "";
 for (var i = 0; i <= passwordLength; i++) {
   var randomNumber = Math.floor(Math.random() * chars.length);
   password += chars.substring(randomNumber, randomNumber +1);
  }
  return password;
 })
 Cypress.Commands.add('deleteUser', (token) => { 
    // create the user first in the DB
    cy.request({
      url: 'https://thinking-tester-contact-list.herokuapp.com/users/me',
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token }
    })
})
Cypress.Commands.add('terminalLog', (violations) => {
    cy.task(
      'log',
      `${violations.length} accessibility violation${
        violations.length === 1 ? '' : 's'
      } ${violations.length === 1 ? 'was' : 'were'} detected`
    )
    // pluck specific keys to keep the table readable
    const violationData = violations.map(
      ({ id, impact, description, nodes }) => ({
        id,
        impact,
        description,
        nodes: nodes.length
      })
    )
  
    cy.task('table', violationData)
  }

)