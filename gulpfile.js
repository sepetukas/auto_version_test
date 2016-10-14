var gulp = require('gulp'),
	config = require('./gulp.config.js')();
var execSync = require('child_process').execSync;

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
    execSync('git checkout develop', {stdio: [0, 1, 2]});

    log('Bumping versions for a patch');

    var version = null;

    return gulp
        .src(config.packages)
        .pipe($.print())
        .pipe($.bump(options))
        .pipe($.tap(function (file) {
            var json = JSON.parse(file.contents.toString());
            version = json.version;
        }))
        .pipe(gulp.dest(config.root))
        .on('end', function () {
            execSync('git commit -a -m "Bumped version number to ' + version + '"' +
                ' && git checkout staging' +
                ' && git merge --no-ff develop' +
                ' && git tag -a v' + version + '-dev -m "version ' + version + '"' +
                ' && git push origin develop --tags' +
                ' && git push origin staging --tags' +
                ' && git checkout develop', {stdio: [0, 1, 2]});
        });
}

gulp.task('release-patch-version', function () {
    var options = {};
    options.type = 'patch';

    releaseVersion(options);
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

