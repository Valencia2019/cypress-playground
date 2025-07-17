import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I visit the Contact List App site", () => {
    cy.visit("/");
});

When("I login to the Contact List App", () => {
    cy.fixture("contact-list-users").then((users) => {
      cy.get("#email").type(users[0].email);
      cy.get("#password").type(users[0].password);
      cy.get("#submit").click();
    });
});

Then("I should see the Contact List App header", () => {
    cy.get("h1").should("have.text", "Contact List App");
});

When("I click the add contact button", () => {
    cy.get("#add-contact").click();
});

Then("I should see the Add Contact header", () => {
    cy.get("h1").should("have.text", "Add Contact");
});

When("I enter contact {int} details", (contactIndex) => {
    const index = contactIndex - 1;
    cy.fixture("contact-list-contacts").then((contacts) => {
      cy.get("#firstName").type(contacts[index].firstName);
      cy.get("#lastName").type(contacts[index].lastName);
      cy.get("#email").type(contacts[index].email);
      cy.get("#phone").type(contacts[index].phone);
      cy.get("#street1").type(contacts[index].street1);
      cy.get("#street2").type(contacts[index].street2);
      cy.get("#city").type(contacts[index].city);
      cy.get("#stateProvince").type(contacts[index].stateProvince);
      cy.get("#postalCode").type(contacts[index].postalCode);
      cy.get("#country").type(contacts[index].country);
      cy.get("#submit").click();
    });
});

Then("I should see contact {int} contact details", (contactIndex) => {
    const index = contactIndex - 1;
    cy.fixture("contact-list-contacts").then((contacts) => {
      cy.get("#firstName").should("have.value", contacts[index].firstName);
      cy.get("#lastName").should("have.value", contacts[index].lastName);
      cy.get("#email").should("have.value", contacts[index].email);
      cy.get("#phone").should("have.value", contacts[index].phone);
      cy.get("#street1").should("have.value", contacts[index].street1);
      cy.get("#street2").should("have.value", contacts[index].street2);
      cy.get("#city").should("have.value", contacts[index].city);
      cy.get("#stateProvince").should("have.value", contacts[index].stateProvince);
      cy.get("#postalCode").should("have.value", contacts[index].postalCode);
      cy.get("#country").should("have.value", contacts[index].country);
    });
});
