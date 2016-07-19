/* File: gulpfile.js */

var config = require('./config.json').build;
var gulpMocha = require('gulp-mocha');

// grab our packages
var gulp   = require('gulp'),
    jshint = require('gulp-jshint');

// define the default task and add the watch task to it
gulp.task('default', ['lint']);


gulp.task('lint', function () {
    return gulp.src(config.allfiles)
        .pipe(jshint({
            lookup: true
        }))
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }));
});

gulp.task('test', function () {
    return gulp.src(config.testfiles)
        .pipe(gulpMocha({
            timeout: '5000',
            reporter: 'spec',
            assertion: 'expect',
            ui: 'tdd'
        })).once('end', function () {
            process.exit();
        });
});