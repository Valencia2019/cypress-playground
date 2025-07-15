Feature: Contact List App Contacts
    Scenario: Add a contact
        When I visit the Contact List App site
        Then I should see the Contact List App header
        When I click the login button
        Then I should see the Login header
        When I enter my username and password
        Then I should be logged in
        When I click the add contact button
        Then I should see the Add Contact header
        When I enter my contact details
        Then I should see my contact details

    Scenario: Delete a contact
        When I visit the Contact List App site
        Then I should see the Contact List App header
        When I click the login button
        Then I should see the Login header
        When I enter my username and password
        Then I should be logged in
        When I click the add contact button
        Then I should see the Add Contact header
        When I enter my contact details
        Then I should see my contact details
        When I click the delete contact button
        Then I should see the Contact List header