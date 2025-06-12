// This tells VS Code to autocomplete cypress
/// <reference types="cypress" />


describe('Validating content of the landing page', () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    })


    before(() => {
        //iPhone 16 Pixel heights divided by 2 since the Cypress presets are generally divided by 2
        cy.viewport(590, 1278)

    });

    beforeEach(() => {
        cy.visit('http://localhost:8081/');
    });


    it('should display the ShelterLink heading', () => {
        cy.contains('ShelterLink')
    });

    it('should display the description text', () => {
        cy.contains('Connecting LGBTQ+ individuals with safe shelters throughout Boston');
    });

    it('should display the Create Account text', () => {
        cy.contains('Create Account');
    });

    it('should display the Log In text', () => {
        cy.contains('Log In');
    });

    it('should display the Continue as Guest text', () => {
        cy.contains('Continue as Guest');
    });

})