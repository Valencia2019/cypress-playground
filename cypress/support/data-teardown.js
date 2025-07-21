const axios = require('axios');
const fs = require('fs');
const { generatePassword } = require('./utils');

/**
 * Deletes all users with a token
 * @param {array} users - array of users with tokens
 */
const deleteUsers = (users) => {
  users.forEach((user, index) => {
    if (user.token) {
      console.log(`Deleting user ${user.firstName} ${user.lastName}`);
      axios.delete('https://thinking-tester-contact-list.herokuapp.com/users/me', {
        headers: { Authorization: `Bearer ${user.token}` }
      }).then((response) => {
        if (response.status === 200) {
          console.log(`Deleted user ${user.firstName} ${user.lastName}`);
          users[index].token = "";
          fs.writeFileSync('cypress/fixtures/contact-list-users.json', JSON.stringify(users));
        } else if (response.status === 401 || response.status === 404 || response.status === 400) {
          console.log(`User ${user.firstName} ${user.lastName} already deleted`);
          users[index].token = "";
          fs.writeFileSync('cypress/fixtures/contact-list-users.json', JSON.stringify(users));
        } else {
          console.log(`Failed to delete user ${user.firstName} ${user.lastName}`);
        }
      });
    }
  });
}


/**
 * Sets up the test data by deleting all users, creating a new user, and adding a contact for that user.
 * Ensures the system is in a known state before tests.
 */
const dataTeardown = () => {
  const userFilePath = 'cypress/fixtures/contact-list-users.json';
  
  const users = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));

  //deleteUsers(users);
  console.log("skipping delete for now...");
  
  return null;
}

module.exports = dataTeardown;