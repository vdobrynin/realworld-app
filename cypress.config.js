const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1440,
  viewportWidth: 2560,
  video: true,
  videoCompression: 32,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://conduit.bondaracademy.com/",
    specPattern: "cypress/integration/**/*.spec.{js,jsx,ts,tsx}", //,
    // excludeSpecPattern: [
    //   "**/1-getting-started/*", "**/2-advanced-examples/*"
  }
});
