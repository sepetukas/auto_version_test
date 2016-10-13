var argv = require("yargs").argv;
var chromedriver = require("chromedriver");

if (!chromedriver.path) {
    throw "error: chomedriver is not installed";
}

exports.config = {
    framework: "custom",

    frameworkPath: require.resolve("protractor-cucumber-framework"),

    /** use `npm run e2e` */
    specs: (argv.feature ? ["./e2e/**/" + argv.feature + ".feature"] : ["./e2e/**/*.feature"]),

    cucumberOpts: {
        require: [
            "./e2e/**/*.steps.js",
            "./e2e/support/report.hook.js",
            "./e2e/support/cleanUp.hook.js"
        ]
    },

    baseUrl: "http://localhost:8090",

    // use locally, only supported by chrome and firefox
    directConnect: true,

    capabilities: {
        "browserName": "chrome",
        "chromeOptions": {
            "args": ["show-fps-counter=true", "--disable-extensions"]
        }
    },

    // needed for seleniumServerJar
    chromeDriver: chromedriver.path,
};
