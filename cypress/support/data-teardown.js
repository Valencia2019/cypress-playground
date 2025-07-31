const axios = require('axios');
const fs = require('fs');

/**
 * Deletes all test users who have a token set
 */
const deleteUsers = async (users) => {
  for (const [index, user] of users.entries()) {
    if (user.token) {
      try {
        console.log(`🗑️ Deleting user ${user.firstName} ${user.lastName}`);
        const response = await axios.delete('https://thinking-tester-contact-list.herokuapp.com/users/me', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (response.status === 200) {
          console.log(`✅ Deleted user ${user.firstName} ${user.lastName}`);
        } else {
          console.log(`⚠️ Unexpected status for ${user.email}: ${response.status}`);
        }
      } catch (err) {
        const status = err.response?.status;
        if ([400, 401, 404].includes(status)) {
          console.log(`ℹ️ User ${user.email} already deleted or unauthorized (${status})`);
        } else {
          console.error(`❌ Error deleting user ${user.email}: ${err.message}`);
        }
      }

      // Clear token and update the file
      users[index].token = "";
    }
  }

  fs.writeFileSync('cypress/fixtures/contact-list-users.json', JSON.stringify(users, null, 2));
};

/**
 * Deletes all but the first contact for the primary user
 */
const cleanupPrimaryUserContacts = async () => {
  const primaryUser = JSON.parse(fs.readFileSync('cypress/fixtures/primary-user.json', 'utf8'));

  if (!primaryUser || !primaryUser.token) {
    console.warn('⚠️ No primary user or token found. Skipping contact cleanup.');
    return;
  }

  try {
    const response = await axios.get('https://thinking-tester-contact-list.herokuapp.com/contacts', {
      headers: { Authorization: `Bearer ${primaryUser.token}` },
    });

    const contacts = response.data;

    if (contacts.length <= 1) {
      console.log('📇 Only one or no contacts found. Nothing to delete.');
      return;
    }

    const contactsToDelete = contacts.slice(1); // keep the first one

    for (const contact of contactsToDelete) {
      try {
        await axios.delete(
          `https://thinking-tester-contact-list.herokuapp.com/contacts/${contact._id}`,
          {
            headers: { Authorization: `Bearer ${primaryUser.token}` },
          }
        );
        console.log(`🗑️ Deleted contact ${contact.firstName} ${contact.lastName}`);
      } catch (error) {
        console.error(`❌ Failed to delete contact ${contact._id}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('❌ Failed to fetch primary user contacts:', error.message);
  }
};

/**
 * Full teardown routine
 */
const dataTeardown = async () => {
  const testUsersPath = 'cypress/fixtures/contact-list-users.json';
  const users = JSON.parse(fs.readFileSync(testUsersPath, 'utf8'));

  console.log('⚙️ Starting data teardown...');
  await deleteUsers(users);
  await cleanupPrimaryUserContacts();
  console.log('✅ Teardown complete.');
};

module.exports = dataTeardown;