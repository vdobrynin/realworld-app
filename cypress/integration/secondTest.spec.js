
describe('Test log out', () => {

    beforeEach('login to the app', () => {
        cy.loginToApplication()
    })

    it('verify use can log out successfully', { retries: 2 }, () => {  // #46
        // it('verify use can log out successfully', () => {
        cy.contains('Settings').click()
        cy.contains('Or click here to logout').click()
        cy.get('.navbar-nav').should('contain', 'Sign up')
        // cy.get('.navbar-nav').should('contain', 'Sign up2') // #46 for check how many retries
    })
})
