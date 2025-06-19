// This tells VS Code to autocomplete cypress
/// <reference types="cypress" />

const { Not } = require("typeorm");
require("cypress-real-events");



const dragAndDrop = (dragLocator, dropLocator) => {
    cy.get(dragLocator)
        .realMouseDown({ button: 'left', position: 'center' })
        .realMouseMove(0, 10, { position: 'center' })
        .wait(200);
    cy.get(dropLocator)
        .realMouseMove(0, 0, { position: 'center' })
        .realMouseUp();
};

const bookmarksOnAllItemsView = "div[class='css-text-146c3p1 r-color-t7dgxc r-fontSize-bmb3av r-marginTop-1ifo620 r-paddingRight-19gegkz r-paddingTop-1c8ppcr r-userSelect-lrvibr']";
const bookmarkOnDetailedShelterView = "div[class='css-text-146c3p1 r-color-t7dgxc r-fontSize-3i2nvb r-userSelect-lrvibr']";

describe('User verifies the components of the landing page', () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    });


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

});

describe('User goes to sign in screen and then clicks \'Already have an account\'', () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    });


    before(() => {
        //iPhone 16 Pixel heights divided by 2 since the Cypress presets are generally divided by 2
        cy.viewport(590, 1278)

    });

    beforeEach(() => {
        cy.visit('http://localhost:8081/');
    });

    it('User goes to sign in screen and then clicks \'Already have an account\'', () => {
        cy.contains('Create Account').click();

        cy.contains("Sign Up");

        cy.contains("Already have an account?").click();

        cy.contains("Log In");
    });
});

describe('User Logs in successfully', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    });


    before(() => {
        //iPhone 16 Pixel heights divided by 2 since the Cypress presets are generally divided by 2
        cy.viewport(590, 1278)

    });

    beforeEach(() => {
        cy.visit('http://localhost:8081/');
    });

    it('User Logs in successfully', () => {
        cy.contains("Log In").click();
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("New to ShelterLink? ");
        cy.contains("Sign Up");
        cy.contains("Skip login for now");
        cy.get("input[placeholder=Email]").type("nie.sa132@northeastern.edu");
        cy.get("input[placeholder=Password]").type("pheHK$44Fs1^wJ$jAVkH");
        cy.get("div[tabindex=0] > div").eq(5).click();
        cy.contains("Search for shelters near you");
    });
});

describe('User skips log in and views profile, then logs in through profile', () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    });


    before(() => {
        //iPhone 16 Pixel heights divided by 2 since the Cypress presets are generally divided by 2
        cy.viewport(590, 1278)

    });

    beforeEach(() => {
        cy.visit('http://localhost:8081/');
    });

    it('User skips log in and views profile', () => {
        cy.contains("Log In").click();
        cy.contains("Skip login for now").click();
        cy.contains("Search for shelters near you");
        cy.contains("Map");
        cy.contains("Events");
        cy.contains("Profile").click();
        cy.contains("Log In");
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("New to ShelterLink? ");
        cy.contains("Sign Up");
        cy.contains("Skip login for now");
        cy.get("input[placeholder=Email]").eq(1).type("nie.sa132@northeastern.edu");
        cy.get("input[placeholder=Password]").eq(1).type("pheHK$44Fs1^wJ$jAVkH");
        //clicking Log in
        cy.get("input[placeholder=Email]").eq(1).parent().parent().nextAll().eq(0).find('div').click();
        cy.contains("Saved Shelters");
        cy.contains("Saved Events");
    });
});

describe('User skips Log in and Confirms no bookmark icon on shelters, events, and detailed shelter and events pages', () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    });


    before(() => {
        //iPhone 16 Pixel heights divided by 2 since the Cypress presets are generally divided by 2
        cy.viewport(590, 1278)

    });

    beforeEach(() => {
        cy.visit('http://localhost:8081/');
    });

    it('User skips Log in and Confirms no bookmark icon on shelters, events, and detailed shelter and events pages', () => {
        cy.contains("Log In").click();
        cy.contains("Skip login for now").click();
        cy.contains("Search for shelters near you");
        cy.contains("Map");
        cy.contains("Events");
        //User can view shelters
        cy.get("div[class='css-view-175oi2r']").get("div[tabindex=0]").should('exist');
        //Shelters on all shelters view page have no bookmarks
        cy.get(bookmarksOnAllItemsView).should("not.exist");
        dragAndDrop("div[aria-label='Bottom sheet handle']", "input[placeholder='Search']");
        //User navigates to detailed shelter view page
        cy.get("div[aria-label='Bottom Sheet']").children().eq(0).children().eq(0).children().eq(0).children().eq(0).click();
        //User confirms that there is no bookmark on the detailed shelter view page
        cy.get(bookmarkOnDetailedShelterView).should('not.exist');
        //User presses back button
        cy.get("a[href='/Main']").click();
        //And navigates to event page
        cy.contains("Events").click();
        //User conforms that there are no bookmarks on the all events view page
        cy.get(bookmarksOnAllItemsView).should("not.exist");
        //User navigates to detailed event view page
        cy.get("div[class='css-view-175oi2r r-alignItems-1awozwy r-paddingBottom-1ueupy0'] div[tabindex=0]:first").click();
        //User confirms that there is no bookmark on the detailed event view page
        cy.get(bookmarkOnDetailedShelterView).should('not.exist');
    });
});


describe('User logs in and saves shelters and events and verifies presence in profile', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    });

    before(() => {
        //iPhone 16 Pixel heights divided by 2 since the Cypress presets are generally divided by 2
        cy.viewport(590, 1278)

    });

    beforeEach(() => {
        cy.visit('http://localhost:8081/');
    });

    it('User logs in and saves shelters and events and verifies presence in profile', () => {
        cy.contains("Log In").click();
        cy.contains("Username");
        cy.contains("Password");
        cy.get("input[placeholder=Email]").type("nie.sa132@northeastern.edu");
        cy.get("input[placeholder=Password]").type("pheHK$44Fs1^wJ$jAVkH");
        cy.get("div[tabindex=0] > div").eq(5).click();
        //User is navigated to all shelter views page
        cy.contains("Search for shelters near you");
        //All shelters have bookmark icon
        cy.wait(5000);
        //Bookmarks should display on detailed shelter view
        cy.get(bookmarksOnAllItemsView).should("exist");
        dragAndDrop("div[aria-label='Bottom sheet handle']", "input[placeholder='Search']");
        //User navigates to detailed shelter view page and confirms all shelters have bookmarks
        cy.get("div[aria-label='Bottom Sheet']").children().eq(0).children().eq(0).children().eq(0).children().its('length').then(length => {
            cy.get(bookmarksOnAllItemsView).should('have.length', length)
        })
        //user clicks on bookmark on all shelter view page 
        cy.get(bookmarksOnAllItemsView).eq(0).click();
        let expectedList = {};
        //user saves shelter name
        cy.get(bookmarksOnAllItemsView).eq(0).parent().parent().next().invoke('text')
            .then(text => {
                expectedList[0] = text;
                //User clicks on detailed shelter view
                cy.get("div[aria-label='Bottom Sheet']").children().eq(0).children().eq(0).children().eq(0).children().eq(1).click();
                //User clicks on bookmark icon on detailed shelter view
                cy.get(bookmarkOnDetailedShelterView).click();
                //User saves shelter name
                cy.get(bookmarkOnDetailedShelterView).parent().parent().children().eq(0).invoke('text').then(text => {
                    expectedList[1] = text;
                    //User presses back button
                    cy.get("a[href='/Main']").click();
                    //And navigates to event page
                    cy.contains("Events").click();
                    cy.wait(5000);
                    //User confirms that all events have bookmark icons
                    cy.get("div[class='css-view-175oi2r r-alignItems-1awozwy r-paddingBottom-1ueupy0'] > div[tabindex=0]").its('length').then(len => {
                        cy.get("div[class='css-view-175oi2r r-alignItems-1awozwy r-paddingBottom-1ueupy0'] > div[tabindex=0] " + bookmarksOnAllItemsView).should('have.length', len)
                    });
                    //And clicks on bookmark in the events view
                    cy.get("div[class='css-view-175oi2r r-alignItems-1awozwy r-paddingBottom-1ueupy0'] > div[tabindex=0] " + bookmarksOnAllItemsView).eq(0).click();
                    //User saves the name of the event
                    cy.get("div[class='css-view-175oi2r r-alignItems-1awozwy r-paddingBottom-1ueupy0'] > div[tabindex=0]").children().eq(1).invoke('text').then(text => {
                        expectedList[2] = text;
                        //User navigates to detailed event view page 
                        cy.get("div[class='css-view-175oi2r r-alignItems-1awozwy r-paddingBottom-1ueupy0'] > div[tabindex=0]").eq(1).click();
                        //User clicks on bookmark icon
                        cy.get(bookmarkOnDetailedShelterView).click();
                        //User saves Event name
                        cy.get(bookmarkOnDetailedShelterView).parent().parent().children().eq(0).invoke('text').then(text => {
                            expectedList[3] = text;
                            //User presses back button
                            cy.get("a[href='/Main/Events/All%20Events%20View']").click();
                            //User clicks on Profile
                            cy.contains("Profile").click();
                            //User confirms saved shelter names are as expected
                            cy.contains('Saved Shelters').parent().parent().next().children().eq(0).children().eq(0).children().eq(0).children().eq(1).should('have.text', expectedList[0]);
                            cy.contains('Saved Shelters').parent().parent().next().children().eq(0).children().eq(1).children().eq(0).children().eq(1).should('have.text', expectedList[1]);
                            //User navigates to saved Events
                            cy.contains('Saved Events').click();
                            //User confirms saved events are as expected
                            cy.contains('Saved Events').parent().parent().next().children().eq(0).children().eq(0).children().eq(0).children().eq(1).should('have.text', expectedList[2]);
                            cy.contains('Saved Events').parent().parent().next().children().eq(0).children().eq(1).children().eq(0).children().eq(1).should('have.text', expectedList[3]);

                        });
                    });

                });
            });

    });
});

describe('User tests button navigations', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    });

    beforeEach(() => {
        cy.viewport(590, 1278)
        cy.visit('http://localhost:8081/');
    });

    it('User Clicks on Learn More for a Shelter', () => {
        cy.contains("Log In").click();
        cy.contains("Skip login for now").click();
        cy.contains("Search for shelters near you");
        cy.contains("Map");
        cy.contains("Events");
        //User can view all shelters
        cy.get("div[class='css-view-175oi2r']").get("div[tabindex=0]").should('exist');
        //User clicks on Learn More
        cy.contains("Learn More").click();
        //User is navigated to detailed shelter view page (confirmed through presence of back button)
        cy.get("a[href='/Main']").should('exist');
    });

    it('User clicks on Learn More for an Event', () => {
        cy.contains("Log In").click();
        cy.contains("Skip login for now").click();
        cy.contains("Search for shelters near you");
        cy.contains("Map");
        cy.contains("Events").click();
        //User can view all events
        cy.get("div[class='css-view-175oi2r']").get("div[tabindex=0]").should('exist');
        //User clicks on Learn More
        cy.get("div[class='css-view-175oi2r r-alignItems-1awozwy r-paddingBottom-1ueupy0'] div[tabindex=0]:first").contains("Learn More").click();
        //User is navigated to detailed shelter view page (confirmed through presence of back button)
        cy.get("a[href='/Main/Events/All%20Events%20View']").should('exist');
    });
});

describe('User confirms multiple shelter view', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    });

    beforeEach(() => {
        cy.viewport(590, 1278)
        cy.visit('http://localhost:8081/');
    });
    /*
    Shelters have ratings
    Shelters have addresses
    Shelters have Directions
    Shelters have Learn More buttons
    */
    it('Shelters should have ratings', () => {
        cy.contains("Log In").click();
        cy.contains("Skip login for now").click();
        cy.contains("Search for shelters near you");
        //User pulls up Bottom sheet
        dragAndDrop("div[aria-label='Bottom sheet handle']", "input[placeholder='Search']");
        //Star icons are visible
        cy.get("img[src$='starIcon.png']").should('exist');
        //Ratings are visible
        cy.get("div[style='height: 10px;']")
            .next()
            .invoke('text')
            .should('match', /[1-5]/)
            .and('include', '.');
        //User navigates to detailed shelter view page
        cy.contains("Learn More").click();
        //User validates rating present on detailed shelter view page
        cy.get("div[class='css-view-175oi2r r-alignItems-1awozwy r-flexDirection-18u37iz'] > div[dir=auto]").invoke('text').should('match', /[1-5]/).and('include', '.');
        //User validates star icon is visible on detailed shelter view page
        cy.get("div[class='css-view-175oi2r r-alignItems-1awozwy r-flexDirection-18u37iz'] img[src$='star-solid.png']").should('exist');
    });

    it('shelters should have hours', () => {
        cy.contains("Log In").click();
        cy.contains("Skip login for now").click();
        cy.contains("Search for shelters near you");
        //User pulls up Bottom sheet
        dragAndDrop("div[aria-label='Bottom sheet handle']", "input[placeholder='Search']");
        //User navigates to detailed shelter view page
        cy.contains("Learn More").click();
        //User opens the Hours dropdown
        cy.contains("Hours").click();
        //User validates that all days of the week are visible and have (approximately) valid text
        //Time regex taken from https://stackoverflow.com/questions/7536755/regular-expression-for-matching-hhmm-time-format
        cy.contains("Sunday").should('be.visible').invoke('text').should('match', /((?:[01]?\d|2[0-3])(?::[0-5]\d){1,2} \b(?:PM|AM)\b)|\b(Closed)\b/);
        cy.contains("Monday").should('be.visible').invoke('text').should('match', /((?:[01]?\d|2[0-3])(?::[0-5]\d){1,2} \b(?:PM|AM)\b)|\b(Closed)\b/);
        cy.contains("Tuesday").should('be.visible').invoke('text').should('match', /((?:[01]?\d|2[0-3])(?::[0-5]\d){1,2} \b(?:PM|AM)\b)|\b(Closed)\b/);
        cy.contains("Wednesday").should('be.visible').invoke('text').should('match', /((?:[01]?\d|2[0-3])(?::[0-5]\d){1,2} \b(?:PM|AM)\b)|\b(Closed)\b/);
        cy.contains("Thursday").should('be.visible').invoke('text').should('match', /((?:[01]?\d|2[0-3])(?::[0-5]\d){1,2} \b(?:PM|AM)\b)|\b(Closed)\b/);
        cy.contains("Friday").should('be.visible').invoke('text').should('match', /((?:[01]?\d|2[0-3])(?::[0-5]\d){1,2} \b(?:PM|AM)\b)|\b(Closed)\b/);
        cy.contains("Saturday").should('be.visible').invoke('text').should('match', /((?:[01]?\d|2[0-3])(?::[0-5]\d){1,2} \b(?:PM|AM)\b)|\b(Closed)\b/);
    });

    it('user can filter ratings greater than 3.5', () => {
        cy.contains("Log In").click();
        cy.contains("Skip login for now").click();
        cy.contains("Search for shelters near you");
        //User pulls up Bottom sheet
        dragAndDrop("div[aria-label='Bottom sheet handle']", "input[placeholder='Search']");
        cy.contains("Filters").click();
        cy.wait(500);
        cy.contains("3.5+").click();
        cy.wait(250);
        cy.get("div[style='height: 10px;']")
            .next()
            .filter(':visible')
            .invoke('text').then(parseFloat).should('be.gt', 3.5);
    });

    it('user can filter ratings greater than 4.0', () => {
        cy.contains("Log In").click();
        cy.contains("Skip login for now").click();
        cy.contains("Search for shelters near you");
        //User pulls up Bottom sheet
        dragAndDrop("div[aria-label='Bottom sheet handle']", "input[placeholder='Search']");
        cy.contains("Filters").click();
        cy.wait(500);
        cy.contains("4.0+").click();
        cy.wait(250);
        cy.get("div[style='height: 10px;']")
            .next()
            .filter(':visible')
            .invoke('text').then(parseFloat).should('be.gt', 4.0);
    });

    it('user can filter ratings greater than 4.5', () => {
        cy.contains("Log In").click();
        cy.contains("Skip login for now").click();
        cy.contains("Search for shelters near you");
        //User pulls up Bottom sheet
        dragAndDrop("div[aria-label='Bottom sheet handle']", "input[placeholder='Search']");
        cy.contains("Filters").click();
        cy.wait(500);
        cy.contains("4.5+").click();
        cy.wait(250);
        cy.get("div[style='height: 10px;']")
            .next()
            .filter(':visible')
            .invoke('text').then(parseFloat).should('be.gt', 4.5);
    });

});

describe('User confirms multiple event view', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    });

    beforeEach(() => {
        cy.viewport(590, 1278)
        cy.visit('http://localhost:8081/');
    });

    it('Events have dates and times', () => {
        cy.contains("Log In").click();
        cy.contains("Skip login for now").click();
        cy.contains("Search for shelters near you");
        cy.contains("Events").click();
        cy.get("div[class='css-view-175oi2r r-alignItems-1awozwy r-paddingBottom-1ueupy0'] > div").children().eq(2).invoke('text').should('include', 'at').and('match', /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/).and('include', ':').and('match', /\b(?:PM|AM)\b/).and('match', /[2000-3000]/).and('match', /[1-31]/);
        cy.get("div[class='css-view-175oi2r r-alignItems-1awozwy r-paddingBottom-1ueupy0'] > div[tabindex=0]").eq(0).click();
        cy.wait(2000);
        cy.get("div[class='css-text-146c3p1 r-color-cqee49 r-fontFamily-otzu27 r-fontSize-192ika5 r-fontWeight-16dba41']").invoke('text').should('include', 'at').and('match', /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/).and('include', ':').and('match', /\b(?:PM|AM)\b/).and('match', /[2000-3000]/).and('match', /[1-31]/);
    });
});