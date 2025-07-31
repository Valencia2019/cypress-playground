const axios = require('axios');
const fs = require('fs');

const loginAndAddContact = async () => {
  const primaryUserFilePath = 'cypress/fixtures/primary-user.json';
  const contactFilePath = 'cypress/fixtures/contact-list-contacts.json';

  const primaryUser = JSON.parse(fs.readFileSync(primaryUserFilePath, 'utf8'));
  const contacts = JSON.parse(fs.readFileSync(contactFilePath, 'utf8'));

  if (!primaryUser) {
    console.error('❌ Primary user not found.');
    return;
  }

  try {
    console.log(`🔐 Logging in as ${primaryUser.email}`);
    const loginResponse = await axios.post(
      'https://thinking-tester-contact-list.herokuapp.com/users/login',
      {
        email: primaryUser.email,
        password: primaryUser.password,
      }
    );

    const token = loginResponse.data.token;
    if (!token) throw new Error('No token received after login.');

    primaryUser.token = token;
    fs.writeFileSync(primaryUserFilePath, JSON.stringify(primaryUser, null, 2));
    console.log('✅ Login successful. Token saved.');

    console.log(`📇 Fetching existing contacts for ${primaryUser.email}`);
    const existingContactsResponse = await axios.get(
      'https://thinking-tester-contact-list.herokuapp.com/contacts',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const existingContacts = existingContactsResponse.data;

    const updatedContacts = [];

    for (let i = 0; i < Math.min(2, contacts.length); i++) {
      const contactToAdd = contacts[i];

      const duplicate = existingContacts.find(
        (c) => c.email === contactToAdd.email
      );

      if (duplicate) {
        console.log(`⚠️ Contact ${contactToAdd.email} already exists. Skipping.`);
        updatedContacts.push(duplicate);
        continue;
      }

      const addContactResponse = await axios.post(
        'https://thinking-tester-contact-list.herokuapp.com/contacts',
        contactToAdd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (addContactResponse.status === 200 || addContactResponse.status === 201) {
        updatedContacts.push(addContactResponse.data);
        console.log(`✅ Contact ${contactToAdd.firstName} added successfully.`);
      } else {
        console.error(`⚠️ Unexpected status code: ${addContactResponse.status}`);
      }
    }

    // Write updated contact list to file
    fs.writeFileSync(contactFilePath, JSON.stringify(updatedContacts, null, 2));
  } catch (error) {
    console.error('❌ Error during login or contact creation:', error.message);
  }
};

module.exports = loginAndAddContact;
