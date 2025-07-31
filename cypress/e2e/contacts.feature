Feature: Contact List App Contacts
    Scenario: Add a contact
        When I visit the Contact List App site
        When I login to the Contact List App
        Then I should see the Contact List header
        When I click the add contact button
        Then I should see the Add Contact header
        When I enter contact 1 contact details
        Then I should see contact 1 contact details

    Scenario: Delete a contact
        When I visit the Contact List App site
        When I login to the Contact List App
        Then I should see the Contact List header