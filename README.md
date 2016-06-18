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

## Testing
The karma test runner (installed via npm dependencies) is used to run the tests.  Simply run either:
* `karma start test.conf.js` or
* `npm test`

If this doesn't work for you, it may be because you don't have the karma cli tools installed.  Those can be installed via:
* `npm install -g karma-cli`
