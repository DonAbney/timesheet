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

By default, the `dev` artifacts will be built.  If you want to build the `prod` artifacts, pass `--prod` to `gulp`:
* `gulp --prod`

If you want to build prod-like artifacts that call the mock API, pass `--mock` to `gulp`:
* `gulp --mock`

If this doesn't work for you, it may be because you don't have the gulp cli tools installed.  Those can be installed via:
* `npm install --global gulp-cli`

Three artifacts should be created in the `build/<environment>` folder for the requested environment:
* `timesheet.html`
  * This should be the html page that you should load in your browser (or serve from the prod server)
* `timesheet.min.css`
  * This is all the necessary css concatenated into a single file. It is loaded from `timesheet.html` and should be served from the same directory on the prod server as `timesheet.html`.
* `timesheet.min.js`
  * This is all the necessary javascript concatenated into a single file.  It is loaded from `timesheet.html` and should be served from the same directory on the prod server as `timesheet.html`.

## Starting a Development "Server"
The development "server" is handled by `browser-sync`.  To start it up, run:
* `gulp serve`

It will watch any changes to "source" css, js, or html files, will re-minify/etc. them, copy it to the build folder, and reload the view of the page in the browser.  The development "server" uses the files in the `build/<environment>` folder (`build/dev` by default), so that any issues with the concatenation or minification of css or js can be seen.

## Testing
The karma test runner (installed via npm dependencies) is used to run the tests.  Simply run either:
* `karma start test.conf.js` or
* `npm test`

If this doesn't work for you, it may be because you don't have the karma cli tools installed.  Those can be installed via:
* `npm install -g karma-cli`

### A Note About Testing
A conscious decision has been made to make a distinction between "Look & Feel" and "Functionality".  "Functionality" is being tested at effectively the "unit" level, with some rendering to fixtures within Jasmine tests.  "Look & Feel" is not being tested.  So, it may be completely possible to hose up the "Look & Feel" of the page without breaking any tests, but the functionality of the page should still be intact.  Breaking any of the functionality should break some of the tests.  This means that while the page might not look nice or be easy to use after a change to the code or styling, it should at least still be functional.

The current exception to this is the Google Authentication, which I haven't yet taken the time to mock out for testing purposes.

## Deploying Artifacts
Artifacts can be deployed to Amazon AWS S3 via gulp if you have AWS credentials to push to the S3 bucket from which the timesheet artifacts are served.  They will be rebuilt for the specified environment and then copied out to S3.  Simply run:
* `gulp deploy --prod` (or `--mock`)

### Amazon AWS S3 Credentials
If you feel that you need credentials to push timesheet artifacts to S3, ask Mike to generate you access keys.

Once you have credentials, you will need to create the AWS credentials INI file `~/.aws/credentials` with the following format:
```
[pillarTimesheetDeploy]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```
(replacing the values for the two keys with the keys that you are provided)

Because they are credentials, it is suggested that you make both the `~/.aws` directory and the `credentials` file read/write for the owner only.  You can do this by:
* `chmod -R go-rwx ~/.aws`

### Amazon AWS API Gateway
There are environment-specific generated JavaScript files for the AWS API Gateway.  These are used to facilitate use of authentication restrictions on the timesheet API endpoints.  They are located in the `lib/env-specific/<environment>/apiGateway-js-sdk/` directory and are automatically bundled, by the gulp task, into the minified timesheet javascript file for the environment.

There is not yet a gulp task for working with AWS to automatically generate a new copy of the apiGateway-js-sdk and update the version in the lib directory, but that is on the TODO list.

## Resources
Some resources that will facilitate in deployment configuration:
* [Setting up Authentication](https://developers.google.com/identity/sign-in/web/)
* [Using Amazon API Gateway as a proxy to S3](http://docs.aws.amazon.com/apigateway/latest/developerguide/integrating-api-with-aws-services-s3.html)
* [Setting up Amazon AWS Credentials](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
* [Generating Amazon AWS Access Keys](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-set-up.html)
* [Amazon AWS Policy Required by gulp-awspublish](https://www.npmjs.com/package/gulp-awspublish)
* [Assuming an AWS IAM Role via a web identity](http://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html)
* [Generating a custom JavaScript SDK for the defined endpoints in the AWS API Gateway](http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-generate-sdk.html)
* [Passing AWS IAM tokens from a REST client](http://stackoverflow.com/questions/32833331/api-gateway-how-to-pass-aws-iam-authorization-from-rest-client)
