Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', { username, password })
    .then(({ body }) => {
      localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
      cy.visit('/')
    })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes = 0 }) => {
  const token = JSON.parse(localStorage.getItem('loggedBlogappUser')).token
  cy.request({
    method: 'POST',
    url: 'http://localhost:3001/api/blogs',
    body: { title, author, url, likes },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  cy.visit('/')
})
