timesheet
--

## Development
For development, use apiary endpoints.  They should be replaced with the actual prod endpoints when deployed.  The apiary endpoints will remain pointing to the mock services for development and testing purposes.
* http://docs.ddaugherfba.apiary.io

## Dependencies
Dependencies are currently being configured using npm.  To resolve and install all needed dependencies, simply run:
* `npm install`

## Testing
The karma test runner (installed via npm dependencies) is used to run the tests.  Simply run either:
* `karma start test.conf.js` or
* `npm test`

If this doesn't work for you, it may be because you don't have the karma cli tools installed.  Those can be installed via:
* `npm install -g karma-cli`
