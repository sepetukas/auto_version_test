module.exports = function (done) {
    var gulp = require('gulp'),
        runSequence = require('run-sequence'),
        config = require('../gulp.config.js')();

    runSequence('image-optimization',
        'create-svg-sprite',
        'compile-scss',
        done);
};


