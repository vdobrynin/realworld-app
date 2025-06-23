// Cypress.Commands.add('loginWithOkta', () => {             // #49
//   // Cypress.Commands.add('loginOkta', () => {
//   const optionsSessionToken = {
//     method: 'POST',
//     url: 'https://--OKTA_AUTH_URL--/api/v1/auth',         // put my own url 
//     //   url: Cypress.env('session_token_url'),
//     body: {
//       username: Cypress.env('username'),
//       password: Cypress.env('password'),
//       options: {
//         warnBeforePasswordExpired: 'true'
//       }
//     }
//   };

//   cy.request(optionsSessionToken).then(response => {
//     const sessionToken = response.body.sessionToken;          // save session token
//     const qs = {                                              // query string with parameters
//       client_id: '--client-id--',
//       // client_id: Cypress.env('client_id'),
//       // code_challenge: Cypress.env('code_challenge'),
//       state: '--state-token--',
//       // state: Cypress.env('state'),
//       nonce: '--nonce-token--',
//       // nonce: Cypress.env('nonce'),
//       redirect_uri: 'http://localhost:4200/implicit/callback', // if diff port then change it
//       // redirect_uri: Cypress.env('redirect_uri'),
//       // code_challenge_method: 'S256',
//       response_mode: 'fragment',
//       // response_mode: 'fragment',
//       response_type: 'id_token token',
//       // response_type: 'code',
//       scope: ['some', 'scome', 'of', 'your', 'application'],
//       // scope: ['openid', 'profile', 'email', 'your', 'application'],
//       sessionToken
//       // sessionToken: sessionToken
//     };

//     cy.request({
//       method: 'GET',
//       url: 'https://--OKTA-AUTHORIZATION-URL---/oauth2/default/v1/authorize?',
//       // url: Cypress.env('auth_token_url'),
//       form: true,
//       followRedirect: false,
//       qs
//       // qs: qs
//     }).then(responseWithToken => {
//       const redirectUrl = responseWithToken.redirectedToUrl;

//       const accessToken = redirectUrl                      // we need this later
//         .substring(redirectUrl.indexOf('access_token'))
//         .split('=')[1]
//         .split('&')[0];

//       cy.wrap(accessToken).as('accessToken');

//       cy.visit(redirectUrl).then(() => {
//         cy.visit('/');
//       });
//     });
//   });
// });