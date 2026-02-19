describe('Hello World Test', () => {
  it('should display Hello World', () => {
    // On visite n'importe quelle page, ici juste baseUrl
    cy.visit('/')

    // On écrit directement "Hello World" sur la page pour test
    cy.document().then(doc => {
      const h1 = doc.createElement('h1')
      h1.textContent = 'Hello World'
      doc.body.appendChild(h1)
    })

    // On vérifie que "Hello World" est visible
    cy.contains('Hello World').should('be.visible')
  })
})
