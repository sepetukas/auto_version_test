var gulp = require('gulp'),
    config = require('./gulp.config.js')(),
    execSync = require('child_process').execSync,
    exec = require("child_process").exec,
    spawnSync = require('child_process').spawnSync,
    through2 = require('through2'),

    fs = require("fs");


var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('check-deps', function () {
    require('check-dependencies')({
        install: true,
        verbose: false
    });
});

gulp.task('develop', ['clear-image-cache', 'watch-scss', 'watch-svg', /*'watch-webpack',*/ 'watch-images-optimize']);
gulp.task('default', ['prepare-assets']);

// Load all tasks from gulp-tasks folder
require('gulp-task-loader')();

// Load watcher tasks from gulp-tasks folder, watchers subdirectory
require('gulp-task-loader')('gulp-tasks/watchers');
require('gulp-task-loader')('gulp-tasks/auto-versioning');

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', function () {
    var msg = 'Bumping versions';
    var type = args.type;
    var version = args.ver;
    var options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);

    return gulp
        .src(config.packages)
        .pipe($.print())
        .pipe($.bump(options))
        .pipe(gulp.dest(config.root));
});

function releaseVersion(options) {

    let uncommittedChanges, version = null;
    let runTest = false;

    function tests(command) {
        return through2.obj(function (chunk, enc, callback) {
            if (runTest) {
                let output = exec(command);
                output.stdout.on("data", function (data) {
                    $.util.log($.util.colors.white("stdout: " + data));
                });

                output.on("close", (code)=> {
                    if (code == 1) {
                        throw "Test failed";
                    }
                    this.push(chunk);
                    callback();
                });
            } else {
                this.push(chunk);
                callback();
            }
        });

    }

    function lint() {
        return through2.obj(function (chunk, enc, callback) {
            log("Running lint...");
            let output = exec("npm run lint");
            output.stdout.on("data", function (data) {
                $.util.log($.util.colors.white("stdout: " + data));
            });

            output.on("close", (code)=> {
                if (code == 1) {
                    throw "Lint failed";
                }
                log("Running lint...Close");
                this.push(chunk);
                callback();
            });

        });

    }

    return gulp
        .src(config.packages)
        .pipe($.print())
        .pipe($.confirm({
            question: function () {
                return $.util.colors.blue(`Now next command will be performed:\n git checkout develop\n git commit\n git push origin develop\n git push origin staging\n Continue?`);
            },
            input: "_key:y"
        }))
        .pipe(through2.obj(function (chunk, enc, callback) {
            let localStagigRef=execSync("git rev-parse staging").toString();
            let remoteStagigRef=execSync("git rev-parse origin/staging").toString();
            if(localStagigRef != remoteStagigRef){
                throw "Your local staging branch is ahead/behind remote one. Please fix it.";
            }
            this.push(chunk);
            callback();
        }))
        .pipe(through2.obj(function (chunk, enc, callback) {
            execSync("git checkout develop", {stdio: [0, 1, 2]});
            let localRef=execSync("git rev-parse develop").toString();
            let remoteRef=execSync("git rev-parse origin/develop").toString();
            if(localRef != remoteRef){
                throw "Your local develop branch is ahead/behind remote one. Please fix it.";
            }
            let output = spawnSync("git", ["status", "-s", "--untracked-files=no"]);
            if (output.stdout.toString().trim().length) {
                uncommittedChanges = true;
            }
            this.push(chunk);
            callback();

        }))
        // .pipe(lint())
        .pipe($.confirm({
            question: function () {
                return uncommittedChanges ? $.util.colors.blue("You have uncommitted changes continue? (All changes will be committed)?:") : false;
            },
            input: "_key:y"
        }))
        .pipe($.confirm({
            question: $.util.colors.blue("Run tests?"),
            proceed: function (answer) {
                if (answer.toUpperCase() === "Y") {
                    runTest = true;
                } else {
                    runTest = false;
                }
                return true;
            },
            input: "_key"
        }))
        .pipe(tests("npm run test"))
        .pipe(tests("npm run e2e"))
        .pipe($.bump(options))
        .pipe($.tap(function (file) {
            var json = JSON.parse(file.contents.toString());
            version = json.version;
        }))
        .pipe(gulp.dest(config.root))
        .pipe(through2.obj(function (chunk, enc, callback) {
            execSync("git commit -a -m \"Bumped version number to " + version + "\"" +
                " && git checkout staging" +
                " && git merge --no-ff develop" +
                " && git tag -a v" + version + " -m \"version " + version + "\"" +
                " && git push origin develop --tags" +
                " && git push origin staging --tags" +
                " && git checkout develop", {stdio: [0, 1, 2]});
            callback();
        }));

}

gulp.task("release-patch-version", function (callback) {
    let options = {};
    options.type = "patch";

    let stream = releaseVersion(options);
    stream.on("end", function () {
        callback();
    });
});

gulp.task("release-minor-version", function (callback) {
    var options = {};
    options.type = "minor";

    let stream = releaseVersion(options);
    stream.on("end", function () {
        callback();
    });
});

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

