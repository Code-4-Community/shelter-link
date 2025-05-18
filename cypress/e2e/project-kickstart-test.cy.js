// This tells VS Code to autocomplete cypress
/// <reference types="cypress" />


describe('My First Test', () => {

    beforeEach(() => {

        cy.visit('http://localhost:3000/');
      })


    it('Verify Text', () => {

        cy.get("div[id='root']").should('have.text', 'React Native testing with Cypress');

    });

})