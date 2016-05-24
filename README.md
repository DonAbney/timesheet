timesheet
--

For development, use apiary endpoints.  Those endpoints will eventually be proxies to the prod endpoints, so the apiary urls can remain in the code.
* http://docs.ddaugherfba.apiary.io

## Dependencies
Dependencies are currently being configured using npm.  To resolve and install all needed dependencies, simply run `npm install`

## Testing
The karma test runner (installed via npm dependencies) is used to run the tests.  Simply run either `karma start test.conf.js` or `npm test`

If this doesn't work for you, it may be because you don't have the karma cli tools installed.  Those can be installed via `npm install -g karma-cli`
