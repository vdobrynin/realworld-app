/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('loginToApplication', () => {                                          
    // cy.visit('/login')     // --> we modified login below     // #37 during review
    // cy.get('[placeholder="Email"]').type('pwtest60@test.com')
    // cy.get('[placeholder="Password"]').type('vd12345')
    // cy.get('form').submit()
    const userCredentials = {   // headless authorization #42
        "user": {
            // "email": "pwtest60@test.com",              // #42
            // "password": "vd12345"                      // #45.1                     
            "email": Cypress.env("username"),        // #45.1
            "password": Cypress.env("password")      // #45.1
        }
    }
    cy.request('POST', Cypress.env('apiUrl') + '/api/users/login', userCredentials) // #45
        .its('body').then(body => {
            const token = body.user.token
            cy.wrap(token).as('token')          // save in #42
            cy.visit('/', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('jwtToken', token)
                }
            })
        })
})