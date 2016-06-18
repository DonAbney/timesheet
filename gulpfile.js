'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');

var DEST = 'build/';

gulp.task('default', function() {
  minifyCss();
  minifyJs();
  copyHtml();
});

function minifyCss() {
  return gulp.src('src/css/*.css')
    .pipe(concatCss('timesheet.min.css'))
    .pipe(gulp.dest(DEST));
};

function minifyJs() {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(concat('timesheet.min.js'))
    .pipe(gulp.dest(DEST));
};

function copyHtml() {
  return gulp.src('src/timesheet.html')
    .pipe(gulp.dest(DEST));
};
