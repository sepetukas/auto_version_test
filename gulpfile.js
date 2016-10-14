var gulp = require('gulp'),
	config = require('./gulp.config.js')();

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
