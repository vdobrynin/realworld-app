describe('test with backend', () => {
  beforeEach('login to application', () => {
    //  //                                         //lecture #39 tags.json object are stubbed bellow
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', { fixture: 'tags.json' }) // #39 
    // cy.intercept('GET', '**/tags', { fixture: 'tags.json' })               //#40
    cy.intercept({ method: 'GET', path: 'tags' }, { fixture: 'tags.json' })   //#40.1
    cy.loginToApplication()                  //lecture #37
  })
  // it('first', () => {  // #37
  //   cy.log('Yaaay we logged in')
  // })
  it('verify correct request and response', () => {
    //                    //-->put it before an action and verification & save in global variable as alias
    //cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/').as('postArticles') // #38
    cy.intercept('POST', '**/articles').as('postArticles')                            // #40

    cy.contains('New Article').click()                            // #38
    cy.get('[formcontrolname="title"]').type('This is a title')
    cy.get('[formcontrolname="description"]').type('This is a description')
    cy.get('[formcontrolname="body"]').type('This is a body of the article')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles').then(xhr => {                        // #38
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body)
        .to.equal('This is a body of the article')  // validation
      expect(xhr.response.body.article.description)
        .to.equal('This is a description') // validation
    })
    
    cy.get('.article-actions')
      .contains(' Delete Article ')
      .click()                      // delete
  })

  it('verify popular tags are displayed with routing object', () => { // #39
    // cy.log('we are log in')
    cy.get('.tag-list')
      .should('contain', 'cypress')
      .and('contain', 'automation')
      .and('contain', 'testing')      //--> validate tags
  })

  it('verify global feed likes counts', () => {                 //lecture #39.1
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', { 'articles': [], 'articlesCount': 0 })//#39.1
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', { fixture: 'articles.json' })//#39.1
    cy.intercept('GET', '**/articles/feed*', { 'articles': [], 'articlesCount': 0 })      //#40.1
    cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })                     //#40.1

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then(heartList => {
      expect(heartList[0])
        .to.contain('1')
      expect(heartList[1])
        .to.contain('5') //#39.1
    })

    cy.fixture('articles').then(file => { //#39.1
      const articleLink = file.articles[1].slug
      file.articles[1].favoritesCount = 6                            //--> change from 5 to 6
      // cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/' + articleLink + '/favorite', file)//#39.1
      cy.intercept('POST', '**/articles/' + articleLink + '/favorite', file)           //#39.2
    })
    cy.get('app-article-list button')
      .eq(1)
      .click()
      .should('contain', '6')        // validation
  })

  it('intercepting & modifying the request & response', () => {
    //                     //-->copy from test above w/renaming & changes   // #40.1
    //-->put it before an action and verification & save in global variable as alias
    // cy.intercept('POST', '**/articles', (req) => {
    //   req.body.article.description = 'This is a description 2'
    // }).as('postArticles')                                                  // #40.2

    cy.intercept('POST', '**/articles', (req) => {
      req.reply(res => {
        expect(res.body.article.description)
          .to.equal('This is a description') // validation
        res.body.article.description = 'This is a description 2'              // --> reply & modify request
      })
    }).as('postArticles')                                                   // #40.3

    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is a title')
    cy.get('[formcontrolname="description"]').type('This is a description')
    cy.get('[formcontrolname="body"]').type('This is a body of the article')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles')
    cy.get('@postArticles').then(xhr => {
      // console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body)
        .to.equal('This is a body of the article')    // validation
      expect(xhr.response.body.article.description)
        .to.equal('This is a description 2')        // validation
    })
    cy.get('.article-actions')
      .contains(' Delete Article ')
      .click()              // to delete 1st article (I added for #40.2 & #40.3)
  })

  it('delete a new article in a global feed', () => {                       // #41
    // const userCredentials = {                                //we do no need it in #42
    //   "user": {
    //     "email": "pwtest60@test.com",
    //     "password": "vd12345"
    //   }
    // }
    const bodyRequest = {
      "article": {
        "title": "Request from API",
        "description": "API testing is easy",
        "body": "Angular is cool",
        "tagList": []
      }
    }
    //                                                      // 1st request #41.1
    // cy.request('POST', 'https://conduit-api.bondaracademy.com/api/users/login', userCredentials)
    //   .its('body').then(body => {
    cy.get('@token').then(token => {                           // 1st request change in #42
      // const token = body.user.token                      //we do no need it in #42
      cy.request({                                                    // 2nd request #41.1 & #42
        url: Cypress.env('apiUrl') + '/api/articles/',           // #45.2
        // url: 'https://conduit-api.bondaracademy.com/api/articles/',
        headers: { 'Authorization': 'Token ' + token },
        method: 'POST',
        body: bodyRequest
      }).then(response => {
        expect(response.status).to.equal(201)
      })

      cy.get('img').click('topRight', { force: true }) // change at #47
      // cy.contains('Global Feed').dblclick() // delete article through UI // #41.2
      cy.get('.article-preview')
        .contains('.preview-link', 'Request from API')
        .click()
      cy.get('.article-actions')
        .contains('[class="btn btn-sm btn-outline-danger"]', ' Delete Article ')
        .click()            //using 2nd option to delete 2nd article 

      cy.request({                                                       // #41.3
        url: Cypress.env('apiUrl') + '/api/articles?limit=10&offset=0',       // #45.2
        // url: 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
        headers: { 'Authorization': 'Token ' + token },
        method: 'GET'
      }).its('body').then(body => {
        // console.log(body)
        expect(body.articles[0].title)
          .not.to.equal('Request from API')
      })
    })
  })
})