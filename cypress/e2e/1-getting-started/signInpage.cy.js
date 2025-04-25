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

describe('Sign inPage', () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit('http://localhost:3000/sign-in')
    })
  
    it('displays siginpage', () => {
      // We use the `cy.get()` command to get all elements that match the selector.
      // Then, we use `should` to assert that there are two matched items,
      // which are the two default items.
      cy.get('.bg-gradient-to-br').should('be.visible')
      cy.get('.p-8').should('be.visible')  
  
    })
  
    it('sign in form', () => {
      // We'll store our item text in a variable so we can reuse it
      cy.get('#email').should('be.visible') 
      cy.get('#password').should('be.visible') 
      cy.get('#sign-in-btn').should('be.visible') 
      cy.get('#forgot-pass').should('be.visible') 
      cy.get('#sign-up-link').should('be.visible') 
    })
  
    it('Sign up link works', () => {
      cy.get('#sign-up-link').should('be.visible') 
      cy.get('#sign-up-link').click()
      cy.location('pathname').should('include', 'sign-up')
    })

    it('Forgot password link', () => {
      cy.get('#forgot-pass').should('be.visible')
      cy.get('#forgot-pass').should('be.visible').click()
      cy.location('pathname').should('include', 'forgot-password')
    })

    it.only('can fill form', () => {
      // We'll store our item text in a variable so we can reuse it
      const newEmail = 'admin@example.com'
      const newPass = 'password'
      cy.get('#email').type(`${newEmail}{enter}`)
      cy.get('#password').type(`${newPass}`)
      cy.get('#sign-in-btn').click()
      .should('have.text','Submitting..')
  
      // Now that we've typed our new item, let's check that it actually was added to the list.
      // Since it's the newest item, it should exist as the last element in the list.
      // In addition, with the two default items, we should have a total of 3 elements in the list.
      // Since assertions yield the element that was asserted on,
      // we can chain both of these assertions together into a single statement.
      // cy.get('.todo-list li')
      //   .should('have.length', 3)
      //   .last()
      //   .should('have.text', newItem)
    })
  })
  