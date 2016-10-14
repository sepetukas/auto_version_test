module.exports = {

    inc: function (importance) {
        var gulp = require('gulp'),
            git = require('gulp-git'),
            bump = require('gulp-bump'),
            filter = require('gulp-filter'),
            print = require('gulp-print'),
            confirm = require('gulp-confirm'),
            fs = require("fs"),
            through = require('through2'),
            tag_version = require('gulp-tag-version');
        return gulp.src(['./package.json'])
            .pipe(confirm({
                question: function () {
                    var files = fs.readFileSync("./package.json");
                    var json = JSON.parse(files.toString());
                    version = json["version"];

                    return `Current version is ${version}. Set it to ??? `;
                },
                input: '_key:y'
            }))

            // bump the version number in those files
            //     .pipe(bump({type: importance}))
            // save it back to filesystem
            // .pipe(gulp.dest('./'))
            // commit the changed version number
            .pipe(through.obj(function (chunk, enc, callback) {
                let self = this;
                git.status({}, (err, std)=> {
                    console.log(std);
                    self.push(chunk);
                    callback();
                });


            }))
            .pipe(print())
            // read only one file to get the version number
            .pipe(filter('package.json'))
            // **tag it in the repository**
            // .pipe(tag_version())
            .pipe(print());
    }
};
