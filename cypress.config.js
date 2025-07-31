const { defineConfig } = require("cypress");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const webpack = require("@cypress/webpack-preprocessor");
const fs = require("fs");
const path = require("path");
const dataSetup = require("./cypress/support/data-setup");
const dataTeardown = require("./cypress/support/data-teardown");

async function setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    webpack({
      webpackOptions: {
        resolve: {
          extensions: [".js"],
        },
        module: {
          rules: [
            {
              test: /\.feature$/,
              use: [
                {
                  loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                  options: config,
                },
              ],
            },
          ],
        },
      },
    })
  );

  on("before:run", async () => {
    console.log("Running data setup before all tests");
    await dataSetup();
  });

  on("after:spec", (spec, results) => {
    if (results && results.reporterStats) {
      const isA11y = spec.relative.includes("accessibility");
      const targetDir = isA11y
        ? "cypress/reports/axe"
        : "cypress/reports/e2e";

      const tmpFiles = fs
        .readdirSync("cypress/reports/tmp")
        .filter((f) => f.endsWith(".json"));

      tmpFiles.forEach((file) => {
        const srcPath = path.join("cypress/reports/tmp", file);
        const destPath = path.join(targetDir, file);

        fs.mkdirSync(targetDir, { recursive: true });
        fs.renameSync(srcPath, destPath);
      });
    }
  });

  on("after:run", async () => {
    const tmpPath = "cypress/reports/tmp";
    if (fs.existsSync(tmpPath)) {
      fs.rmSync(tmpPath, { recursive: true, force: true });
    }
    
    await dataTeardown();
  });

  return config;
}

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://thinking-tester-contact-list.herokuapp.com/",
    specPattern: ["**/*.feature", "**/accessibility/*.js"],
    setupNodeEvents,
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports/tmp",
      overwrite: false,
      html: false,
      json: true,
      timestamp: "mmddyyyy_HHMMss",
    },
  },
});
