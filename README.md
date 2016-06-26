timesheet
--

## Development
For development, use apiary endpoints.  They should be replaced with the actual prod endpoints when deployed.  The apiary endpoints will remain pointing to the mock services for development and testing purposes.
* http://docs.ddaugherfba.apiary.io

## Dependencies
Dependencies are currently being configured using npm.  To resolve and install all needed dependencies, simply run:
* `npm install`

## Building Artifacts
Artifacts are created using gulp.  To build the artifacts, simply run:
* `gulp`

If this doesn't work for you, it may be because you don't have the gulp cli tools installed.  Those can be installed via:
* `npm install --global gulp-cli`

Three artifacts should be created in the build folder:
* `timesheet.html`
  * This should be the html page that you should load in your browser (or serve from the prod server)
* `timesheet.min.css`
  * This is all the necessary css concatenated into a single file. It is loaded from `timesheet.html` and should be served from the same directory on the prod server as `timesheet.html`.
* `timesheet.min.js`
  * This is all the necessary javascript concatenated into a single file.  It is loaded from `timesheet.html` and should be served from the same directory on the prod server as `timesheet.html`.

## Starting a Development "Server"
The development "server" is handled by `browser-sync`.  To start it up, run:
* `gulp serve`

It will watch any changes to "source" css, js, or html files, will re-minify/etc. them, copy it to the build folder, and reload the view of the page in the browser.  The development "server" uses the files in the `build` folder, so that any issues with the concatenation or minification of css or js can be seen.

## Testing
The karma test runner (installed via npm dependencies) is used to run the tests.  Simply run either:
* `karma start test.conf.js` or
* `npm test`

If this doesn't work for you, it may be because you don't have the karma cli tools installed.  Those can be installed via:
* `npm install -g karma-cli`

### A Note About Testing
A conscious decision has been made to make a distinction between "Look & Feel" and "Functionality".  "Functionality" is being tested at effectively the "unit" level, with some rendering to fixtures within Jasmine tests.  "Look & Feel" is not being tested.  So, it may be completely possible to hose up the "Look & Feel" of the page without breaking any tests, but the functionality of the page should still be intact.  Breaking any of the functionality should break some of the tests.  This means that while the page might not look nice or be easy to use after a change to the code or styling, it should at least still be functional.

## Resources
Some resources that will facilitate in deployment configuration:
* [Setting up Authentication](https://developers.google.com/identity/sign-in/web/)
* [Using Amazon API Gateway as a proxy to S3](http://docs.aws.amazon.com/apigateway/latest/developerguide/integrating-api-with-aws-services-s3.html)
