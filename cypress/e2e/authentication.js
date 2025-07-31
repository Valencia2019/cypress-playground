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
  cy.fixture("contact-list-users").then((users) => {
    // Fill out the form
    cy.get("#firstName").type(users[0].firstName);
    cy.get("#lastName").type(users[0].lastName);
    cy.get("#email").type(users[0].email);
    cy.get("#password").type(users[0].password);
    cy.get("#submit").click();

    // Wait for successful navigation
    cy.url().should("include", "/contactList");

    // Read the auth token from cookie and write it back to the fixture file
    cy.getCookie("token").then((cookie) => {
      if (cookie && cookie.value) {
        users[0].token = cookie.value;
        cy.writeFile("cypress/fixtures/contact-list-users.json", users);
        cy.log("✅ Token saved to fixture.");
      } else {
        cy.log("⚠️ No token found after signup.");
      }
    });
  });
});



  Then("I should be signed up", () => {
    cy.get("h1").should("have.text", "Contact List App");

  });

  Then("I should see the Login text and fields", () => {
    cy.get("div.main-content").should("be.visible").and("contain", "Log In:");
    cy.get("#email").should("be.visible");
    cy.get("#password").should("be.visible");
    cy.get("#submit").should("be.visible");
  });

When("I enter a valid username and password and click the submit button", () => {
    cy.fixture("primary-user").then((user) => {
      cy.get("#email").type(user.email);
      cy.get("#password").type(user.password);
      cy.get("#submit").click();
    });
  });

Then("I should be logged in", () => {
  cy.url().should("include", "contactList");
    cy.get("h1").should("have.text", "Contact List");
    cy.get("#logout").should("be.visible");
});

When("I click the logout button", () => {
    cy.get("#logout").click();
  });

Then("I should be logged out", () => {
  cy.get("h1").should("have.text", "Contact List App");
  cy.get(".welcome-message").should("be.visible");
});