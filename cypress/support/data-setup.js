const axios = require('axios');
const fs = require('fs');
const { generatePassword } = require('./utils');
const loginAndAddContact = require('./login-and-add-contact');

/**
 * Checks if the users are valid and logs them in
 * Then stores each user's token
 * @param {array} users - array of users
 */

const checkValidUsers = async (users) => {
  for (let user of users) {
    try {
      console.log(`Attempting login for ${user.firstName} ${user.lastName}`);
      const response = await axios.post(
        'https://thinking-tester-contact-list.herokuapp.com/users/login',
        {
          email: user.email,
          password: user.password,
        }
      );

      if (response.data.token) {
        user.token = response.data.token;
        console.log(`✅ Logged in: ${user.firstName} ${user.lastName}`);
      } else {
        user.token = '';
        console.log(`❌ No token returned for ${user.email}`);
      }
    } catch (error) {
      user.token = '';
      if (error.response && error.response.status === 400) {
        console.log(`❌ Invalid credentials for ${user.email}`);
      } else {
        console.error(`⚠️ Error logging in ${user.email}:`, error.message);
      }
    }
  }

  // Save updated users list once all are processed
  fs.writeFileSync('cypress/fixtures/contact-list-users.json', JSON.stringify(users, null, 2));
};


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
};

/**
 * Sets up the test data by deleting all users, creating a new user, and adding a contact for that user.
 * Ensures the system is in a known state before tests.
 */
const dataSetup = async () => {
  const testUsersPath = 'cypress/fixtures/contact-list-users.json';
  
  const users = JSON.parse(fs.readFileSync(testUsersPath, 'utf8'));

  await checkValidUsers(users);
  await generatePasswords(users);

  // Save again in case generatePasswords modified anything
  fs.writeFileSync(testUsersPath, JSON.stringify(users, null, 2));

  await loginAndAddContact();
  return null;
};

module.exports = dataSetup;
