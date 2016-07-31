'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var tap = require('gulp-tap');
var util = require('gulp-util');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();
var aws = require('aws-sdk');
var awspublish = require('gulp-awspublish');
var rename = require('gulp-rename');
var md5 = require('gulp-md5-plus');
var del = require('del');
var eventStream = require('event-stream');

var DEST = 'build/';
var BASE_HTML_FILE = "timesheet.html";
var CSS_FILES = ['lib/css/*.css', 'src/css/*.css'];
var JS_FILES = ['lib/js/jquery-*.js', 'lib/js/foundation-*.js', 'src/js/*.js'];
var HTML_FILES = 'src/*.html';
var IMG_FILES = ['lib/images/*.png'];
var CONFIG_SPECIFIC_FILES = {
  dev: ['config/dev/*.js'],
  mock: ['config/mock/*.js', 'config/nonDev/*.js'],
  prod: ['config/prod/*.js', 'config/nonDev/*.js']
};
var API_GATEWAY_BASE = {
  mock: 'lib/env-specific/mock/apiGateway-js-sdk/',
  prod: 'lib/env-specific/prod/apiGateway-js-sdk/'
}
var API_GATEWAY_FILES = [
  "lib/axios/dist/axios.standalone.js",
  "lib/CryptoJS/rollups/hmac-sha256.js",
  "lib/CryptoJS/rollups/sha256.js",
  "lib/CryptoJS/components/hmac.js",
  "lib/CryptoJS/components/enc-base64.js",
  "lib/url-template/url-template.js",
  "lib/apiGatewayCore/sigV4Client.js",
  "lib/apiGatewayCore/apiGatewayClient.js",
  "lib/apiGatewayCore/simpleHttpClient.js",
  "lib/apiGatewayCore/utils.js",
  "apigClient.js"
];
var PROD_DEPLOYMENTS = ['mock', 'prod'];

var publisherHeadersCssJs = {
  // 'Cache-Control': 'max-age=315360000, public'
  'Cache-Control': 'no-cache'
};

var publishHeadersHtml = {
  'Cache-Control': 'no-cache'
};

var publishHeadersImg = {
  // 'Cache-Control': 'max-age=86400, public'
  'Cache-Control': 'no-cache'
};

var publisher = awspublish.create({
  region: 'us-east-1',
  params: {
    Bucket: 'pillartimesheet'
  },
  credentials: new aws.SharedIniFileCredentials({profile: 'pillarTimesheetDeploy'})
});

gulp.task('default', ['build']);

gulp.task('clean', ['cleanHtml', 'cleanCss', 'cleanJs', 'cleanImages']);

gulp.task('cleanHtml', function() {
  return del([resolveDestinationDirectory() + "**/*.html"]);
});

gulp.task('cleanCss', function() {
  return del([resolveDestinationDirectory() + "**/*.css"]);
});

gulp.task('cleanJs', function() {
  return del([resolveDestinationDirectory() + "**/*.js"]);
});

gulp.task('cleanImages', function() {
  return del([resolveDestinationDirectory() + "**/*.png", resolveDestinationDirectory() + "**/*.jpg"]);
});

gulp.task('build', ['minifyCss', 'minifyJs', 'copyHtml', 'copyImages']);

gulp.task('deploy', ['build'], function() {
  util.log(" * Deploying artifacts from " + DEST + resolveEnvironment() + "/*");
  var deployHtmlStream = constructDeployStream(DEST + resolveEnvironment() + "/**/*.html", publishHeadersHtml);
  var deployCssJsStream = constructDeployStream([DEST + resolveEnvironment() + "/**/*.css", DEST + resolveEnvironment() + "/**/*.js"], publisherHeadersCssJs);
  var deployImgStream = constructDeployStream([DEST + resolveEnvironment() + "/**/*.png", DEST + resolveEnvironment() + "/**/*.jpg"], publishHeadersImg);

  return eventStream.merge(deployHtmlStream, deployCssJsStream, deployImgStream)
    .pipe(publisher.sync("assets/" + resolveEnvironment()))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

function constructDeployStream(filePatterns, publishHeaders) {
  return gulp.src(filePatterns)
    .pipe(tap(function(file) {
      util.log(" - Deploying " + file.path);
    }))
    .pipe(rename(function(path) {
      path.dirname = "/assets/" + resolveEnvironment() + "/" + (path.dirname === '.' ? '' : path.dirname);
    }))
    .pipe(publisher.publish(publishHeaders));
}

gulp.task('minifyCss', ['copyHtml', 'cleanCss'], function() {
  return gulp.src(CSS_FILES)
    .pipe(tap(function(file) {
      util.log(" - Processing " + file.path);
    }))
    .pipe(cleanCSS())
    .pipe(concat('timesheet.min.css'))
    .pipe(md5(10, resolveDestinationDirectory() + BASE_HTML_FILE))
    .pipe(gulp.dest(resolveDestinationDirectory()))
    .pipe(browserSync.stream());
});

gulp.task('minifyJs', ['copyHtml', 'cleanJs'], function() {
  return gulp.src(resolveJsFiles())
    .pipe(tap(function(file) {
      util.log(" - Processing " + file.path);
    }))
    .pipe(uglify())
    .pipe(concat('timesheet.min.js'))
    .pipe(md5(10, resolveDestinationDirectory() + BASE_HTML_FILE))
    .pipe(gulp.dest(resolveDestinationDirectory()))
    .pipe(browserSync.stream());
});

gulp.task('copyHtml', ['cleanHtml'], function() {
  return gulp.src(HTML_FILES)
    .pipe(tap(function(file) {
      util.log(" - Processing " + file.path);
    }))
    .pipe(gulp.dest(resolveDestinationDirectory()))
    .pipe(browserSync.stream());
});

gulp.task('copyImages', ['cleanImages'], function() {
  return gulp.src(IMG_FILES)
    .pipe(tap(function(file) {
      util.log(" - Processing " + file.path);
    }))
    .pipe(gulp.dest(resolveDestinationDirectory() + "images/"))
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
  var files = JS_FILES.concat(CONFIG_SPECIFIC_FILES[resolveEnvironment()]);
  var baseApiGatewayPath = API_GATEWAY_BASE[resolveEnvironment()];
  if (baseApiGatewayPath) {
    API_GATEWAY_FILES.forEach(function(filename) {
      files.push(baseApiGatewayPath + filename);
    });
  }
  return files;
}
