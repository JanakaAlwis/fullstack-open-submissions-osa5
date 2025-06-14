describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpass'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('/')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpass')
      cy.get('#login-button').click()
      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrongpass')
      cy.get('#login-button').click()
      cy.get('.notification').should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testuser', password: 'testpass' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('Test Blog Title')
      cy.get('#author').type('Author McAuthorface')
      cy.get('#url').type('http://example.com')
      cy.get('#create-button').click()
      cy.contains('Test Blog Title Author McAuthorface')
    })

    it('Users can like a blog', function () {
      cy.createBlog({ title: 'Like Me', author: 'Liker', url: 'http://like.com' })
      cy.contains('Like Me').contains('view').click()
      cy.contains('like').click()
      cy.contains('likes 1')
    })

    it('User who created a blog can delete it', function () {
      cy.createBlog({ title: 'Delete Me', author: 'Deleter', url: 'http://delete.com' })
      cy.contains('Delete Me').contains('view').click()
      cy.contains('remove').click()
      cy.on('window:confirm', () => true)
      cy.should('not.contain', 'Delete Me')
    })

    it('Only the creator sees delete button', function () {
      cy.createBlog({ title: 'Secure Delete', author: 'Creator', url: 'http://secure.com' })
      cy.contains('logout').click()

      const secondUser = {
        name: 'Another User',
        username: 'another',
        password: 'pass'
      }
      cy.request('POST', 'http://localhost:3001/api/users', secondUser)
      cy.login({ username: 'another', password: 'pass' })

      cy.contains('Secure Delete').contains('view').click()
      cy.contains('remove').should('not.exist')
    })

    it('Blogs are ordered by likes', function () {
      cy.createBlog({ title: 'Least Likes', author: 'A', url: '#', likes: 1 })
      cy.createBlog({ title: 'Most Likes', author: 'B', url: '#', likes: 99 })
      cy.createBlog({ title: 'Medium Likes', author: 'C', url: '#', likes: 50 })

      cy.get('.blog').then(blogs => {
        cy.wrap(blogs[0]).should('contain', 'Most Likes')
        cy.wrap(blogs[1]).should('contain', 'Medium Likes')
        cy.wrap(blogs[2]).should('contain', 'Least Likes')
      })
    })
  })
})
