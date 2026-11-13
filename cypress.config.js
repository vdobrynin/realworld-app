const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportHeight: 1200, //900,
  viewportWidth: 1920, //1440,
  video: false,
  experimentalWebKitSupport: true,
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporter-config.json",
  },
  env: {                              // #45 sensitive values only - read with cy.env()
    username: "pwtest60@test.com",
    password: "",                       // #45.3 remove password
  },
  expose: {                           // public config readable via Cypress.expose() (Cypress 15+)
    apiUrl: "https://conduit-api.bondaracademy.com",
  },
  retries: {
    runMode: 2,
    openMode: 0
  },
  e2e: {
    // experimentalStudio removed in Cypress 15.4 - Studio is now available to all users
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // Cypress' bundled build toolchain ships its own stale caniuse-lite snapshot;
      // this suppresses the "browsers data is X months old" notice on every run
      process.env.BROWSERSLIST_IGNORE_OLD_DATA = "1";
      // #45.3 shell credentials (DB_USERNAME/PASSWORD) override config/cypress.env.json values
      const username = process.env.DB_USERNAME
      const password = process.env.PASSWORD
      // if (!password) {                                   // #45.3 created & // #46 commented
      //   throw new Error(`missing PASSWORD environment variable`)
      // }
      if (username) config.env.username = username
      if (password) config.env.password = password
      return config
    },
    baseUrl: "https://conduit.bondaracademy.com",  // to run USE THIS
    // baseUrl: "http://localhost:4200",
    // baseUrl: "http://host.docker.internal:4200",
    specPattern: "cypress/integration/**/*.cy.{js,jsx,ts,tsx}",
    excludeSpecPattern: "**/examples/*",
    requestTimeout: 10000,
  },
  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },
});
