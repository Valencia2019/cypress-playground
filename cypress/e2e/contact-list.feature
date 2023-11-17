Feature: Contact List UI e2e
  Scenario: Sign up for the Contact List App
    When I visit the Contact List App site
    Then I should see the Contact List App header
    When I click the sign up button
    Then I should see the Add User header