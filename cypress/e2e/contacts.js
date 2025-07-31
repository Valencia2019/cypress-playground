import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I visit the Contact List App site", () => {
    cy.visit("/");
});

When("I login to the Contact List App", () => {
    cy.fixture("primary-user").then((user) => {
      cy.get("#email").type(user.email);
      cy.get("#password").type(user.password);
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

When("I enter contact {int} contact details", (contactIndex) => {
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
    cy.fixture("contact-list-contacts").then((contacts) => {
        const contact = contacts[contactIndex - 1];
        cy.get("#myTable").find("tr").contains("td", contact._id).parent("tr").within(() => {
            cy.get("td").eq(1).should("have.text", `${contact.firstName} ${contact.lastName}`);
            cy.get("td").eq(2).should("have.text", contact.birthdate);
            cy.get("td").eq(3).should("have.text", contact.email);
            cy.get("td").eq(4).should("have.text", contact.phone);
            cy.get("td").eq(5).should("have.text", `${contact.street1} ${contact.street2}`);
            cy.get("td").eq(6).should("have.text", `${contact.city} ${contact.stateProvince} ${contact.postalCode}`);
            cy.get("td").eq(7).should("have.text", contact.country);
        });
    });
});
