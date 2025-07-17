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
      cy.get("#firstName").type(users[0].firstName);
      cy.get("#lastName").type(users[0].lastName);
      cy.get("#email").type(users[0].email);
      cy.get("#password").type(users[0].password);
      cy.get("#submit").click();
    });
    //intercept page call to contacts and then copy the token from the cookie
      cy.intercept("GET", "https://thinking-tester-contact-list.herokuapp.com/contacts").as("contacts");
      cy.wait("@contacts");
      cy.getCookie("token").should("exist");
      //write the token to to the user object in the fixture
      cy.fixture("contact-list-users").then((users) => {
        users[0].token = cy.getCookie("token");
        cy.writeFile("cypress/fixtures/contact-list-users.json", users);
      });
  });

  Then("I should be signed up", () => {
    cy.get("h1").should("have.text", "Contact List App");

  });

  Then("I should see the Login text", () => {
    cy.get("p").should("include", "Log In");
  });

When("I enter my username and password and click the submit button", () => {
    cy.fixture("contact-list-users").then((users) => {
      cy.get("#email").type(users[0].email);
      cy.get("#password").type(users[0].password);
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