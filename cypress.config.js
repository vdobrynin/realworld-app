const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1440,
  viewportWidth: 2560,
  video: false,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json'
  },
  env: {
    username: "pwtest60@test.com",
    password: "",
    apiUrl: "https://conduit-api.bondaracademy.com",
  },
  retries: {
    runMode: 2,
    openMode: 0
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const username = process.env.DB_USERNAME
      const password = process.env.PASSWORD

      // if (!password) {
      //   throw new Error(`missing PASSWORD environment variable`)
      // }

      config.env = { username, password }
      return config
    },
    baseUrl: "https://conduit.bondaracademy.com",
    // baseUrl: "http://localhost:4200",
    specPattern: "cypress/integration/**/*.spec.{js,jsx,ts,tsx}",
    excludeSpecPattern: "**/examples/*",
  },
});
