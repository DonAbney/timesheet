'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var tap = require('gulp-tap');
var util = require('gulp-util');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();

var DEST = 'build/';
var CSS_FILES = ['lib/css/*.css', 'src/css/*.css'];
var JS_FILES = ['lib/js/jquery-*.js', 'lib/js/foundation-*.js', 'src/js/*.js'];
var HTML_FILES = 'src/*.html';

gulp.task('default', ['minifyCss', 'minifyJs', 'copyHtml']);

gulp.task('minifyCss', function() {
  return gulp.src(CSS_FILES)
    .pipe(tap(function(file) {
      util.log(" - Processing " + file.path);
    }))
    .pipe(cleanCSS())
    .pipe(concat('timesheet.min.css'))
    .pipe(gulp.dest(DEST))
    .pipe(browserSync.stream());
});

gulp.task('minifyJs', function() {
  return gulp.src(JS_FILES)
    .pipe(tap(function(file) {
      util.log(" - Processing " + file.path);
    }))
    .pipe(uglify())
    .pipe(concat('timesheet.min.js'))
    .pipe(gulp.dest(DEST))
    .pipe(browserSync.stream());
});

gulp.task('copyHtml', function() {
  return gulp.src(HTML_FILES)
    .pipe(tap(function(file) {
      util.log(" - Processing " + file.path);
    }))
    .pipe(gulp.dest(DEST))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['default'], function() {
  browserSync.init({
    server: {
      baseDir: './build',
      index: 'timesheet.html'
    }
  });

  gulp.watch(CSS_FILES, ['minifyCss']);
  gulp.watch(JS_FILES, ['minifyJs']);
  gulp.watch(HTML_FILES, ['copyHtml']);
});
