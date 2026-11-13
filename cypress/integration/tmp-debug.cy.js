const OUT = '/private/var/folders/zf/dl2yt0pn7wv65mhm9ds3np5c0000gn/T/opencode/debug.json'

describe('debug likes 2 - real test shape', () => {
  const info = { lines: [], t0: Date.now() }
  const push = (m) => { info.lines.push(Math.round((Date.now() - info.t0) / 100) / 10 + 's ' + m) }
  const dump = () => cy.writeFile(OUT, JSON.stringify(info.lines, null, 2))

  beforeEach(() => {
    cy.intercept({ method: 'GET', path: 'tags' }, { fixture: 'tags.json' })
    cy.loginToApplication()
  })

  it('verify global feed likes counts', () => {
    cy.intercept('GET', '**/articles/feed*', { 'articles': [], 'articlesCount': 0 })
    cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then(heartList => {
      expect(heartList[0]).to.contain('1')
      expect(heartList[1]).to.contain('5')
      push('heartList n=' + heartList.length + ' :: ' + [...heartList].map(b => b.className + ' => [' + b.innerText.trim() + ']').join(' | '))
    })

    cy.fixture('articles').then(file => {
      const articleLink = file.articles[1].slug
      file.articles[1].favoritesCount = 6
      push('registering intercept POST **/articles/' + articleLink + '/favorite')
      cy.intercept('POST', '**/articles/' + articleLink + '/favorite', (req) => {
        push('FAVREQ ' + req.url)
        req.reply(res => { push('FAVREAL ' + res.statusCode); return res })
      }).as('fav')
      cy.intercept('POST', '**/articles/' + articleLink + '/favorite', file).as('fav2')
    })
    cy.get('app-article-list button').eq(1).as('btn').click()
    push('clicked')
    cy.wait(1500)
    cy.get('app-article-list button').then(list => {
      push('AFTER n=' + list.length + ' :: ' + [...list].map(b => b.className + ' => [' + b.innerText.trim() + ']').join(' | '))
    })
    cy.get('@btn').then(b => {
      push('SUBJ n=' + b.length + ' :: ' + [...b].map(x => x.className + ' => [' + x.innerText.trim() + ']').join(' | '))
    })
    dump()
  })

  afterEach(() => dump())
})
