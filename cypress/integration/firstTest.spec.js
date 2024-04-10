
describe('test with backend', () => {

  beforeEach('login to application', () => {

    cy.intercept({ method: 'GET', path: 'tags' }, { fixture: 'tags.json' })                                //lecture #40.1
    // cy.intercept('GET', '**/tags', { fixture: 'tags.json' })                                    //lecture #40
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', { fixture: 'tags.json' }) //lecture #39.0 tags.json object are stubbed bellow
    cy.loginToApplication()
  })

  // it('verify correct request and response', () => {
  //   //                    //-->put it before an action and verification & save in global variable as alias
  //   cy.intercept('POST', '**/articles').as('postArticles')                                         //lecture #40.0
  //   // cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/').as('postArticles') //lecture #39.0
  //   cy.contains('New Article').click()
  //   cy.get('[formcontrolname="title"]').type('This is a title')
  //   cy.get('[formcontrolname="description"]').type('This is a description')
  //   cy.get('[formcontrolname="body"]').type('This is a body of the article')
  //   cy.contains('Publish Article').click()

  //   cy.wait('@postArticles').then(xhr => {
  //     console.log(xhr)
  //     expect(xhr.response.statusCode).to.equal(201)
  //     expect(xhr.request.body.article.body).to.equal('This is a body of the article')   // validation
  //     expect(xhr.response.body.article.description).to.equal('This is a description') // validation
  //   })
  // })

  it('intercepting & modifying the request & response', () => { //-->copy from test above w/renaming & changes //lecture #40.2
    //                    //-->put it before an action and verification & save in global variable as alias
    // cy.intercept('POST', '**/articles', (req) => {
    //   req.body.article.description = 'This is a description 2'
    // }).as('postArticles')                                                                 //lecture #40.2

    cy.intercept('POST', '**/articles', (req) => {
      req.reply(res => {
        expect(res.body.article.description).to.equal('This is a description') // validation
        res.body.article.description = 'This is a description 2'
      })
    }).as('postArticles')                                                               //lecture #40.3

    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is a title')
    cy.get('[formcontrolname="description"]').type('This is a description')
    cy.get('[formcontrolname="body"]').type('This is a body of the article')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles')
    cy.get('@postArticles').then(xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('This is a body of the article')   // validation
      expect(xhr.response.body.article.description).to.equal('This is a description 2') // validation
    })

    cy.get('.article-actions').contains('Delete Article').click()// to delete 1st article (I added in #42)
  })

  it('verify popular tags are displayed with routing object', () => {
    // cy.log('we are log in')
    cy.get('.tag-list')
      .should('contain', 'cypress')
      .and('contain', 'automation')
      .and('contain', 'testing')      //--> validate tags
  })

  it('verify global feed likes counts', () => {

    cy.intercept('GET', '**/articles/feed*', { 'articles': [], 'articlesCount': 0 })      //#40
    cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })                     //#40
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', { 'articles': [], 'articlesCount': 0 }) //#39.1
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', { fixture: 'articles.json' }) // #39.1

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then(heartList => {
      expect(heartList[0]).to.contain('1')
      expect(heartList[1]).to.contain('5')
    })

    cy.fixture('articles').then(file => {
      const articleLink = file.articles[1].slug
      file.articles[1].favoritesCount = 6                                       //--> change from 5 to 6
      cy.intercept('POST', '**/articles/' + articleLink + '/favorite', file)                             // #40
      // cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/' + articleLink + '/favorite', file) // #39.1
    })

    cy.get('app-article-list button').eq(1).click().should('contain', '6')              // validation
  })

  // it('delete a new article in a global feed', () => {                       // #41

  //   const userCredentials = {
  //     "user": {
  //       "email": "pwtest60@test.com",
  //       "password": "vd12345"
  //     }
  //   }

  //   const bodyRequest = {
  //     "article": {
  //       "title": "Request from API",
  //       "description": "API testing is easy",
  //       "body": "Angular is cool",
  //       "tagList": []
  //     }
  //   }
  //   //                                                                                      // 1st request #41.1
  //   cy.request('POST', 'https://conduit-api.bondaracademy.com/api/users/login', userCredentials)
  //     .its('body').then(body => {
  //       const token = body.user.token

  //       cy.request({                                                                        // 2nd request #41.1
  //         url: 'https://conduit-api.bondaracademy.com/api/articles/',
  //         headers: { 'Authorization': 'Token ' + token },
  //         method: 'POST',
  //         body: bodyRequest
  //       }).then(response => {
  //         expect(response.status).to.equal(201)
  //       })

  //       cy.contains('Global Feed').click()                                                       // #41.2
  //       cy.get('.article-preview').first().contains('.preview-link', 'Request from API').click()
  //       cy.get('.article-actions').contains('Delete Article').click()  //use 2nd option to delete 2nd article

  //       cy.request({                                                                            // #41.2
  //         url: 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
  //         headers: { 'Authorization': 'Token ' + token },
  //         method: 'GET'
  //       }).its('body').then(body => {
  //         // console.log(body)
  //         expect(body.articles[0].title).not.to.equal('Request from API')
  //       })
  //     })
  // })

  it.only('delete a new article in a global feed', () => {                       // #42

    const bodyRequest = {
      "article": {
        "title": "Request from API",
        "description": "API testing is easy",
        "body": "Angular is cool",
        "tagList": []
      }
    }
    //                                                                                      // 1st request #41.1
    cy.get('@token').then(token => {

      cy.request({                                                                        // 2nd request #41.1
        url: Cypress.env('apiUrl') + '/api/articles/',
        headers: { 'Authorization': 'Token ' + token },
        method: 'POST',
        body: bodyRequest
      }).then(response => {
        expect(response.status).to.equal(201)
      })

      cy.wait(500)
      cy.contains('Global Feed').click()                                                       // #41.2
      cy.get('.article-preview').first().contains('.preview-link', 'Request from API').click()
      cy.get('.article-actions').contains('Delete Article').click()  //use 2nd option to delete 2nd article

      cy.request({                                                                            // #41.2
        url: Cypress.env('apiUrl') + '/api/articles?limit=10&offset=0',
        headers: { 'Authorization': 'Token ' + token },
        method: 'GET'
      }).its('body').then(body => {
        // console.log(body)
        expect(body.articles[0].title).not.to.equal('Request from API')
      })
    })
  })
})