/** Reference: http://karma-runner.github.io/0.12/config/configuration-file.html */
module.exports = function karmaConfig(config) {
    config.set({
        logLevel: config.LOG_INFO, /** Log our errors */

        client: {
            captureConsole: true
        },

        frameworks: [
            /**
             * Reference: https://github.com/karma-runner/karma-mocha
             * Set test runner mocha
             */
            "mocha",

            /**
             * Reference: https://github.com/xdissent/karma-chai
             * Set assertion library chai
             */
            "chai",

            /**
             * Reference: https://github.com/yanoosh/karma-sinon
             * Set spy and mock library sinon
             */
            "sinon"
        ],

        reporters: [
            /**
             * Reference: https://github.com/mlex/karma-spec-reporter
             * Set reporter to print detailed results to console
             */
            "progress",

            /**
             * Reference: https://github.com/karma-runner/karma-coverage
             * Output code coverage files
             */
            "coverage"
        ],

        files: [
            /** Grab all files in the app folder that contain .spec. */
            "./src/app/tests.js"
            /** each file acts as entry point for the webpack configuration */
        ],

        preprocessors: {
            /**
             * Reference: http://webpack.github.io/docs/testing.html
             * Reference: https://github.com/webpack/karma-webpack
             * Convert files with webpack and load sourcemaps
             */
            "./src/app/tests.js": ["webpack", "sourcemap"]
        },

        browsers: [
            /** Run tests using PhantomJS */
            "PhantomJS"
        ],

        singleRun: true,

        /** Configure code coverage reporter */
        coverageReporter: {
            dir: "reports/coverage/",
            reporters: [
                {type: "text-summary"},
                {type: "html", subdir: "report-html"}
            ],
            watermarks: {
                statements: [50, 80],
                functions: [50, 80],
                branches: [50, 80],
                lines: [50, 80]
            }
            // Enable this if you need to enforce coverage threshold
            //check: {
            //    global: {
            //        statements: 80,
            //        branches: 80,
            //        functions: 80,
            //        lines: 80
            //    },
            //    each: {
            //        statements: 80,
            //        branches: 80,
            //        functions: 80,
            //        lines: 80
            //    }
            //}
        },

        webpack: require("./webpack.config"),

        /** Hide webpack build information from output */
        webpackMiddleware: {
            noInfo: "errors-only"
        }
    });
};
