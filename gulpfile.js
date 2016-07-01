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
var CONFIG_FILES = {
  dev: 'config/timesheetConfig-dev.js',
  mock: 'config/timesheetConfig-mock.js',
  prod: 'config/timesheetConfig-prod.js'
};

gulp.task('default', ['minifyCss', 'minifyJs', 'copyHtml']);

gulp.task('deploy', [], function() {
  util.log("Need to do something if we want to deploy...");
});

gulp.task('minifyCss', function() {
  return gulp.src(CSS_FILES)
    .pipe(tap(function(file) {
      util.log(" - Processing " + file.path);
    }))
    .pipe(cleanCSS())
    .pipe(concat('timesheet.min.css'))
    .pipe(gulp.dest(resolveDestinationDirectory()))
    .pipe(browserSync.stream());
});

gulp.task('minifyJs', function() {
  return gulp.src(resolveJsFiles())
    .pipe(tap(function(file) {
      util.log(" - Processing " + file.path);
    }))
    .pipe(uglify())
    .pipe(concat('timesheet.min.js'))
    .pipe(gulp.dest(resolveDestinationDirectory()))
    .pipe(browserSync.stream());
});

gulp.task('copyHtml', function() {
  return gulp.src(HTML_FILES)
    .pipe(tap(function(file) {
      util.log(" - Processing " + file.path);
    }))
    .pipe(gulp.dest(resolveDestinationDirectory()))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['default'], function() {
  browserSync.init({
    server: {
      baseDir: './' + resolveDestinationDirectory(),
      index: 'timesheet.html'
    }
  });

  gulp.watch(CSS_FILES, ['minifyCss']);
  gulp.watch(resolveJsFiles(), ['minifyJs']);
  gulp.watch(HTML_FILES, ['copyHtml']);
});

function resolveEnvironment() {
  return util.env.prod ? 'prod' : (util.env.mock ? 'mock' : 'dev');
}

function resolveDestinationDirectory() {
  return DEST + resolveEnvironment() + "/";
}

function resolveJsFiles() {
  var jsFilesForEnvironment = JS_FILES.slice(0);
  jsFilesForEnvironment.push(CONFIG_FILES[resolveEnvironment()]);
  return jsFilesForEnvironment;
}
