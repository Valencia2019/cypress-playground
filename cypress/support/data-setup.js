const axios = require('axios');
const fs = require('fs');
const { generatePassword } = require('./utils');

/**
 * Checks if the users are valid and logs them in
 * Then stores each user's token
 * @param {array} users - array of users
 */

const checkValidUsers = (users) => {
  users.forEach((user, index) => {
      console.log(`Logging in user ${user.firstName} ${user.lastName}`);
      axios.post('https://thinking-tester-contact-list.herokuapp.com/users/login', { "email": user.email, "password": user.password })
        .then((response) => {
          if (response.data.token) {
            console.log(`Logged in user ${user.firstName} ${user.lastName}`);
            users[index].token = response.data.token;
            fs.writeFileSync('cypress/fixtures/contact-list-users.json', JSON.stringify(users));
          } else {
            throw new Error(`Failed to login user. Status code ${response.status}`);
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            console.log('Failed to login user. Bad request');
          } else {
            console.log(`an error occurred while logging in user: ${error}`);
          }
        });
    
  });
}

/**
 * Generates passwords for all users without tokens
 * @param {array} users - array of users
 */
const generatePasswords = (users) => {
  users.forEach((user) => {
    if (!user.token) {
      user.password = generatePassword();
    console.log(`Generated new password for ${user.firstName} ${user.lastName}`);
    }
  });
  return Promise.resolve();
}

/**
 * Creates a new user and adds a contact
 * @param {array} users - array of users
 * @param {array} contacts - array of contacts
 */
const createUserAndAddContact = (users, contacts) => {
  console.log('Creating user');
  const data = JSON.stringify({ "firstName": users[0].firstName, "lastName": users[0].lastName, "email": users[0].email, "password": users[0].password });
  axios.post('https://thinking-tester-contact-list.herokuapp.com/users', data)
    .then((response) => {
      if (response.token) {
        console.log(`Created user ${users[0].firstName} ${users[0].lastName}`);
        users[0].token = response.data.token;
        fs.writeFileSync('cypress/fixtures/contact-list-users.json', JSON.stringify(users));
      } else {
        throw new Error(`Failed to create user. Status code ${response.status}`);
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        console.log('Failed to create user. Bad request');
      } else {
        console.log(`an error occurred while creating user: ${error}`);
      }
    })
    .then(() => {
      console.log('Adding contact');
      axios.post('https://thinking-tester-contact-list.herokuapp.com/contacts', contacts[0], {
        headers: { Authorization: `Bearer ${users[0].token}` }
      })
        .then((response) => {
          if (response.status === 200) {
            console.log(`Added contact ${contacts[0].firstName} ${contacts[0].lastName}`);
            contacts[0] = response.data;
            fs.writeFileSync('cypress/fixtures/contact-list-contacts.json', JSON.stringify(contacts));
          } else {
            throw new Error(`Failed to add contact. Status code ${response.status}`);
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            console.log('Failed to add contact. Unauthorized');
          } else if (error.response.status === 400) {
            console.log('Failed to add contact. Bad request');
          } else {
            console.log(`an error occurred while adding contact: ${error}`);
          }
        });
    });
}

/**
 * Sets up the test data by deleting all users, creating a new user, and adding a contact for that user.
 * Ensures the system is in a known state before tests.
 */
const dataSetup = () => {
  const userFilePath = 'cypress/fixtures/contact-list-users.json';
  const contactFilePath = 'cypress/fixtures/contact-list-contacts.json';
  
  const users = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
  const contacts = JSON.parse(fs.readFileSync(contactFilePath, 'utf8'));

  checkValidUsers(users);
  generatePasswords(users).then(() => {
    //update the user file
    fs.writeFileSync(userFilePath, JSON.stringify(users));
  });
  //API documentation says that to Add a User, there must be a token passed in the header
  //The issue with that is that the token is not being generated until the user is created
  //so I will need to create a different type of work-around or just have a user that already exists
  //createUserAndAddContact(users, contacts);
  
  return null;
}

module.exports = dataSetup;