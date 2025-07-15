import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I visit the Contact List App site", () => {
  cy.visit("/");
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

  When("I enter my details and click the submit button", () => {
    cy.get("#firstName").type("Valencia");
    cy.get("#lastName").type("Test");
    cy.get("#email").type("Valencia@fake.com");
    cy.get("#password").type("testtest");
    cy.get("#submit").click();
  });

  Then("I should be signed up", () => {
    cy.get("h1").should("have.text", "Contact List App");
  }); 