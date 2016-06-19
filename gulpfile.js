'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var tap = require('gulp-tap');
var util = require('gulp-util');
var cleanCSS = require('gulp-clean-css');

var DEST = 'build/';

gulp.task('default', function() {
  minifyCss();
  minifyJs();
  copyHtml();
});

function minifyCss() {
  util.log("Minifying css...")
  return gulp.src(['lib/css/*.css', 'src/css/*.css'])
    .pipe(tap(function(file) {
      util.log(" - Processing " + file.path);
    }))
    .pipe(cleanCSS())
    .pipe(concat('timesheet.min.css'))
    .pipe(gulp.dest(DEST));
};

function minifyJs() {
  util.log("Minifying js...")
  return gulp.src(['lib/js/jquery-*.js', 'lib/js/foundation-*.js', 'src/js/*.js'])
    .pipe(tap(function(file) {
      util.log(" - Processing " + file.path);
    }))
    .pipe(uglify())
    .pipe(concat('timesheet.min.js'))
    .pipe(gulp.dest(DEST));
};

function copyHtml() {
  util.log("Copying HTML...")
  return gulp.src('src/*.html')
    .pipe(tap(function(file) {
      util.log(" - Processing " + file.path);
    }))
    .pipe(gulp.dest(DEST));
};
