import { generatePassword } from '../support/utils';

 // log the accessibility violations
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

// add a user via the API 
 Cypress.Commands.add('addUser', (user) => { 
        cy.log("addUser command")
   // create the user first in the DB
   const password = generatePassword();
        cy.request({
          url: 'https://thinking-tester-contact-list.herokuapp.com/users',
          method: 'POST',
          body: {
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "password": password
        },
        })
          .its('body')
          .then((body) => {
            cy.writeFile('cypress/fixtures/contact-list-users.json', body)
          })

 })

 // delete the user via the API
 Cypress.Commands.add('deleteUser', (token) => { 
    // delete the user
    cy.request({
      url: 'https://thinking-tester-contact-list.herokuapp.com/users/me',
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token }
    })
 })


// Add a contact for the user
Cypress.Commands.add('addContact', (token, contact) => {
    cy.request({
      url: 'https://thinking-tester-contact-list.herokuapp.com/contacts',
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
      body: {
        "firstName": contact.firstName,
        "lastName": contact.lastName,
        "birthdate": contact.birthdate,
        "email": contact.email,
        "phone": contact.phone,
        "street1": contact.street1,
        "street2": contact.street2,
        "city": contact.city,
        "stateProvince": contact.stateProvince,
        "postalCode": contact.postalCode,
        "country": contact.country
    },
    }).its('body')
    .then((body) => {
      cy.writeFile('cypress/fixtures/contact-list-contacts.json', body)
    })
  })