/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('Landing Page', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:3000')
  })

  it('displays landing page', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.get('.flex-auto > .justify-between').should('be.visible')
    cy.get('#start-cta').should('be.visible')  

    // We can go even further and check that the default todos each contain
    // the correct text. We use the `first` and `last` functions
    // to get just the first and last matched elements individually,
    // and then perform an assertion with `should`.
    cy.get('.text-5xl').should('be.visible') 
    cy.get('.text-5xl').should('have.text', 'Transforming Wastefor a greener future')
    cy.get('.max-w-3xl > .text-lg').should('be.visible') 
  })

  it('explore solutions', () => {
    // We'll store our item text in a variable so we can reuse it
    cy.get('#explore-cta').click()
    cy.location('pathname').should('include', 'sign-in')
  })

  it('displays stats', () => {
    cy.get('.container.py-12').should('be.visible')
  })
})
