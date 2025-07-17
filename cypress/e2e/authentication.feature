Feature: Contact List App Authentication
  Scenario: Sign up for the Contact List App
    When I visit the Contact List App site
    Then I should see the Contact List App header
    When I click the sign up button
    Then I should see the Add User header
    When I enter my details and click the submit button
    Then I should be logged in

  Scenario: Sign into and then sign out of the Contact List App
    When I visit the Contact List App site
    Then I should see the Contact List App header
    Then I should see the Login text
    When I enter my username and password and click the submit button
    Then I should be logged in
    When I click the logout button
    Then I should be logged out