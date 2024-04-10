const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1440,
  viewportWidth: 2560,
  video: true,             // 'false' for do not run
  // videoCompression: 32,    // slower
  env: {
    username: 'pwtest60@test.com',
    password: 'vd12345',
    apiUrl: 'https://conduit-api.bondaracademy.com'
  }
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://conduit.bondaracademy.com/",
    specPattern: "cypress/integration/**/*.spec.{js,jsx,ts,tsx}",
    excludeSpecPattern: [
      "**/1-getting-started/*", "**/2-advanced-examples/*", '**/examples/*'
  }
});
