module.exports = function () {
	var scsslint = require('gulp-scss-lint'),
		gulp = require('gulp'),
		gulpif = require('gulp-if'),
		argv = require('yargs').argv,
		config = require('../gulp.config.js')();

	return gulp.src(['./src/scss/**/*.scss', '!./src/scss/**/*_scsslint_tmp*.scss', '!./src/scss/vendor/**/*.scss', '!./src/scss/base/_svg-sprite-map.scss', '!./src/scss/base/_svg-sprite-template.scss'])
		.pipe(gulpif(!argv.nolint, scsslint()));
};


