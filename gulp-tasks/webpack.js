module.exports = function () {
	var gulp = require('gulp'),
		webpackConfig = require("../webpack.config.js"),
		config = require('../gulp.config.js')(),
		stream = require('webpack-stream');

	return gulp.src(config.path.ALL)
		.pipe(stream(webpackConfig))
        .pipe(gulp.dest('dist/'));
};



