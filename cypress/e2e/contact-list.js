const { When, Then } = require("@badeball/cypress-cucumber-preprocessor");

When("I visit the Contact List App site", () => {
  cy.visit("https://thinking-tester-contact-list.herokuapp.com/");
});

Then("I should see the Contact List App header", () => {
  cy.get("h1").should("have.text", "Contact List App");
});

When("I click the sign up button", () => {
    cy.get("#signup").click();
  });

  Then("I should see the Add User header", () => {
    cy.get("h1").should("have.text", "Add User");
  });