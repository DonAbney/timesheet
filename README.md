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

### Amazon AWS API Gateway Usage
There are environment-specific generated JavaScript files for the AWS API Gateway.  These are used to facilitate use of authentication restrictions on the timesheet API endpoints.  They are located in the `lib/env-specific/<environment>/apiGateway-js-sdk/` directory and are automatically bundled, by the gulp task, into the minified timesheet javascript file for the environment.

There is not yet a gulp task for working with AWS to automatically generate a new copy of the apiGateway-js-sdk and update the version in the lib directory, but that is on the TODO list.

## Current Authentication Workflow
The current authentication workflow combines Google OpenID authentication along with Amazon IAM roles.

1. Two IAM roles are defined:
  * An "unauthenticated" role
    * This provides access to the basic artifacts (html, css, js) that are stored in S3, using the Amazon API Gateway as a proxy to control access, allowing the initial page to load (see link in references for "Using Amazon API Gateway as a proxy to S3")
  * An "authenticated" role
    * This provides access to the Timesheet API endpoints on the AWS API Gateway
2. Upon initiating the sign-in process (e.g. clicking the sign-in button), the user is redirected through Google OpenID authentication (see link in references for "Setting up Google OpenID Authentication")
3. Once the successful authentication via OpenID is detected, the authentication information is sent to AWS, with the request to assume the "authenticated" role (STS AssumeRoleWithWebIdentity) (see link in references for "Assuming an AWS IAM Role via a web identity")
4. Once the "authenticated" role has been assumed, the user can interact with the Timesheet API endpoints on the AWS API Gateway

*Note: The current authentication workflow is not "bulletproof".  No application that does all of its authentication on the client side will ever be "bulletproof", as the source code that is being executed is already in the hands of the end-user, who has access to browser tools to change the behavior on-the-fly.  On the TODO list for the future are enhancements that will shift portions of the validation and such of the authentication to server-side AWS Lambda functions, granting additional enhancements to the security and authentication process.*

## Amazon AWS Configuration

### AWS IAM Configuration: Roles and Policies
Several roles and policies were defined in AWS to assist with the authentication:

#### Role: PillarTimesheetUser (unauthenticated)
* Attached policies:
  * PillarTimesheetGetObject
* Trust Relationship: (this allows any user accessing the API Gateway to assume this role)
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### Role: PillarTimesheetAuthenticatedUser
* Attached policies:
  * PillarTimesheetAPIValidateTimesheetInfo
  * PillarTimesheetAPIGetTimesheetInfo
  * PillarTimesheetAPISaveTimesheetInfo
* Trust Relationship:  (the value for accounts.google.com:aud is the google app ID that was generated as part of registration for OpenID authentication)
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "accounts.google.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "accounts.google.com:aud": "500EXAMPLE.apps.googleusercontent.com"
        }
      }
    }
  ]
}
```

#### Policy: PillarTimesheetGetObject
 * This provides access to the static assets (html, css, js) used by the UI
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::pillartimesheet/assets/*"
        }
    ]
}
```

#### Policy: PillarTimesheetAPIGetTimesheetInfo
  * Provides granular access to the API endpoint to get timesheet information
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "execute-api:Invoke",
            "Effect": "Allow",
            "Resource": "arn:aws:execute-api:us-east-1:<account-id>:<api-id>/*/GET/api/timesheet/*/*"
        }
    ]
}
```

#### Policy: PillarTimesheetAPISaveTimesheetInfo
  * Provides granular access to the API endpoint to save timesheet information
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "execute-api:Invoke",
            "Effect": "Allow",
            "Resource": "arn:aws:execute-api:us-east-1:<account-id>:<api-id>/*/POST/api/timesheet/*"
        }
    ]
}
```

#### Policy: PillarTimesheetAPIValidateTimesheetInfo
  * Provides granular access to the API endpoint to validate the timesheet
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "execute-api:Invoke",
            "Effect": "Allow",
            "Resource": "arn:aws:execute-api:us-east-1:<account-id>:<api-id>/*/POST/api/timesheet/*/validate"
        }
    ]
}
```

#### Policy: PillarTimesheetDeploy
  * Provides access to publish assets to S3.  This is the policy assigned to users that allows them to push assets to S3 during the `gulp deploy` task (see the link in resources for "Amazon AWS Policy Required by gulp-awspublish")
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::pillartimesheet"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:GetObjectAcl",
                "s3:DeleteObject",
                "s3:ListMultipartUploadParts",
                "s3:AbortMultipartUpload"
            ],
            "Resource": [
                "arn:aws:s3:::pillartimesheet/*"
            ]
        }
    ]
}
```

### AWS S3 Configuration: Bucket Structure
The AWS S3 Bucket contains the static assets that are part of the UI.  They are all "private".  No special configuration for sharing or permissions is required.  "Static Website Hosting" should not be enabled, as access to the assets is controlled via the API Gateway and assuming the role of the "unauthenticated" user.  The structure of the assets within the bucket is:
* pillartimesheet (this is the bucket)
 * assets
  * mock
  * prod

Any additional "environments" should be added under `assets`.

### AWS API Gateway Configuration: Resources, Methods, and Stages
The API Gateway is where most of the magic happens to make things "look" and "feel" like a normal website interaction.  It's also one of the simplest (but most tedious) parts to configure.  You define your "API" by defining the tree of "resources" within the API and then configuring zero or more "methods" (HTTP Verbs) on them that describe the action to take, any required authentication, transformations of headers/body of the request/response, etc.  The current configuration looks something like this:
* `/` (GET)
  * `index.html` (GET)
  * `timesheet.min.js` (GET)
  * `timesheet.min.css` (GET)
  * `api`
    * `timesheet`
      * `{id}` (POST)
        * `validate` (POST)
        * `{date}` (GET)

#### Stage: mock
This stage uses the API Gateway and authentication, but hits the apiary API endpoints instead of the real Timesheet API endpoints.

Stage Variables:

|Name|Value|
|----|-----|
|`configuration`|`mock`|
|`indexHtml`|`/mock/index.html`|
|`timesheetHost`|*host.name.for.apiary.api*|

#### Stage: timesheet
This stage is the "prod" stage.  It uses the API Gateway, authentication, and hits the real Timesheet API endpoints.

Stage Variables:

|Name|Value|
|----|-----|
|`configuration`|`prod`|
|`indexHtml`|`/timesheet/index.html`|
|`timesheetHost`|*host.name.for.real.api*|


#### / (GET)
Redirects to `/index.html`.
* Authorization: None (automatically assumes role: PillarTimesheetUser)
* API Key Required: false
* Integration type: Mock Integration
* Integration response:

|HTTP Status Regex|Method Response Status|Default Mapping|Response Header|
|-----------------|----------------------|---------------|---------------|
| |302|Yes|Location: `stageVariables.indexHtml`|

#### /index.html (GET)
Fetches `timesheet.html` from the correct asset directory within the S3 bucket and returns it to the client.
* Authorization: None (automatically assumes role: PillarTimesheetUser)
* API Key Required: false
* Integration type: AWS Service Proxy
  * Region: us-east-1
  * AWS Service: S3
  * HTTP Method: GET
  * Path Override: `/pillartimesheet/assets/${stageVariables.configuration}/timesheet.html`
  * Execution role: `arn:aws:iam::<account-id>:role/PillarTimesheetUser`
* Integration Response:

|HTTP Status Regex|Method Response Status|Default Mapping|Response Header|
|-----------------|----------------------|---------------|---------------|
| |200|Yes| |

* Method Response: 200, Content Type: text/html, Models: empty

#### /timesheet.min.css (GET)
Fetches `timesheet.min.css` from the correct asset directory within the S3 bucket and returns it to the client.
* Authorization: None (automatically assumes role: PillarTimesheetUser)
* API Key Required: false
* Integration type: AWS Service Proxy
  * Region: us-east-1
  * AWS Service: S3
  * HTTP Method: GET
  * Path Override: `/pillartimesheet/assets/${stageVariables.configuration}/timesheet.min.css`
  * Execution role: `arn:aws:iam::<account-id>:role/PillarTimesheetUser`
* Integration Response:

|HTTP Status Regex|Method Response Status|Default Mapping|Response Header|
|-----------------|----------------------|---------------|---------------|
| |200|Yes| |

* Method Response: 200, Content Type: text/css, Models: empty

#### /timesheet.min.js (GET)
Fetches `timesheet.min.css` from the correct asset directory within the S3 bucket and returns it to the client.
* Authorization: None (automatically assumes role: PillarTimesheetUser)
* API Key Required: false
* Integration type: AWS Service Proxy
  * Region: us-east-1
  * AWS Service: S3
  * HTTP Method: GET
  * Path Override: `/pillartimesheet/assets/${stageVariables.configuration}/timesheet.min.js`
  * Execution role: `arn:aws:iam::<account-id>:role/PillarTimesheetUser`
* Integration Response:

|HTTP Status Regex|Method Response Status|Default Mapping|Response Header|
|-----------------|----------------------|---------------|---------------|
| |200|Yes| |

* Method Response: 200, Content Type: application/x-javascript, Models: empty

#### /api/timesheet/{id} (POST)
Posts changed time entry information for a timesheet back to the Timesheet API (i.e. save changes to timesheet).
* Authorization: AWS_IAM (assumes role based on web identity: PillarTimesheetAuthenticatedUser)
* API Key Required: false
* Request Path: `id`
* HTTP Request Headers:  `Application-Identifier`
* Integration type: HTTP Proxy
  * HTTP Method: POST
  * Endpoint URL: `http://${stageVariables.timesheetHost}/fba/api/timesheet/{id}`
  * URL Path Parameters: `id`, Mapped from: `method.request.path.id`
  * HTTP Headers: `Application-Identifier`, Mapped from: `method.request.header.Application-Identifier`
* Integration Response:

|HTTP Status Regex|Method Response Status|Default Mapping|Response Header|
|-----------------|----------------------|---------------|---------------|
| |500|Yes| |
|404|404|No| |
|200|200|No| |

* Method Response:
  * 500, Content Type: application/json, Models: empty
  * 200, Content Type: application/json, Models: empty
  * 404, Content Type: application/json, Models: empty

#### /api/timesheet/{id}/validate (POST)
Posts a validation request for a timesheet back to the Timesheet API (i.e. validate timesheet).
* Authorization: AWS_IAM (assumes role based on web identity: PillarTimesheetAuthenticatedUser)
* API Key Required: false
* Request Path: `id`
* HTTP Request Headers:  `Application-Identifier`
* Integration type: HTTP Proxy
  * HTTP Method: POST
  * Endpoint URL: `http://${stageVariables.timesheetHost}/fba/api/timesheet/{id}/validate`
  * URL Path Parameters: `id`, Mapped from: `method.request.path.id`
  * HTTP Headers: `Application-Identifier`, Mapped from: `method.request.header.Application-Identifier`
* Integration Response:

|HTTP Status Regex|Method Response Status|Default Mapping|Response Header|
|-----------------|----------------------|---------------|---------------|
| |500|Yes| |
|404|404|No| |
|200|200|No| |

* Method Response:
  * 500, Content Type: application/json, Models: empty
  * 200, Content Type: application/json, Models: empty
  * 404, Content Type: application/json, Models: empty

#### /api/timesheet/{id}/{date} (GET)
Requests timesheet information for the specified user for the specified date.
* Authorization: AWS_IAM (assumes role based on web identity: PillarTimesheetAuthenticatedUser)
* API Key Required: false
* Request Path: `id`, `date`
* HTTP Request Headers:  `Application-Identifier`
* Integration type: HTTP Proxy
  * HTTP Method: GET
  * Endpoint URL: `http://${stageVariables.timesheetHost}/fba/api/timesheet/{id}/{date}`
  * URL Path Parameters:
    * `id`, Mapped from: `method.request.path.id`
    * `date`, Mapped from: `method.request.path.date`
  * HTTP Headers: `Application-Identifier`, Mapped from: `method.request.header.Application-Identifier`
* Integration Response:

|HTTP Status Regex|Method Response Status|Default Mapping|Response Header|
|-----------------|----------------------|---------------|---------------|
| |500|Yes| |
|404|404|No| |
|200|200|No| |

* Method Response:
  * 500, Content Type: application/json, Models: empty
  * 200, Content Type: application/json, Models: empty
  * 404, Content Type: application/json, Models: empty

## Getting SSL with a Custom Domain working with AWS API Gateway
Amazon offers SSL certificates for your domains through ACM (AWS Certificate Manager).  Unfortunately, you cannot yet use them with their API Gateway ([See this forum post](https://forums.aws.amazon.com/thread.jspa?messageID=700646)).

The API Gateway currently requires that you be able to provide the private key that the cert was encrypted with, the public cert itself, and the entire chain.  That's not accessible through ACM, which means that if you want to use a custom domain, you'll need to obtain your SSL cert from another source.  Because of strong support from various entities that I respect, I decided to go with [Let's Encrypt](https://letsencrypt.org), which offers free SSL certs.  They do their validation that you own the domain through the use of a file that you host on a webservice at the target domain.  Since the API Gateway only allows https access (which will require you to set up a SSL cert in order to redirect requests to one of your staged APIs), you end up with a bit of a chicken and egg problem.  Here's the workaround that I ended up using to do the initial registration:

* Set up an ACM SSL Certificate for your target domain.
  * This will only be used temporarily with AWS CloudFront for the validation process with Let's Encrypt.
    * You can keep the cert, because at some point API Gateway will allow use of the ACM SSL Certs and you can switch to using that one instead of the Let's Encrypt signed cert.
* Set up a new S3 bucket
  * Configure the following directory structure: `/.well-known/acme-challenge/`
  * Add a temporary test file to the acme-challenge directory, so you can ensure that the CloudFront configuration is set up properly.
    * You will need to adjust the permissions on the file in S3 to allow Everyone access to Read the file.
* Set up a AWS CloudFront distribution.
  * You're only going to use this to do the initial registration, so don't worry too much about configuration.
  * You'll want to make sure that you use the ACM SSL cert that you set up and tell CloudFront to use your target domain.
  * You'll want to point your distribution at the S3 bucket that you set up.
* Once you get the CloudFront domain name for your distribution, modify your CNAME entry for your target domain to point to the CloudFront domain name.
  * I'd advise setting it up for a very short TTL (like 30 min), because you'll be changing this again after you do the validation for your new cert.
* Try to access the temporary file that you put in the S3 bucket through your target domain name:  `http://<your.domain.com>/.well-known/acme-challenge/test.txt`
  * It can sometimes take a while for the CloudFront domain to resolve.  Once you can access your file, then move on to the next step.
* Use Certbot (recommended by Let's Encrypt) with its `manual` plugin in order to register the cert for your domain.
  * The last step will ask you to make a file available with particular contents.
    * Create and upload the specified file contents with the required name to your S3 bucket and adjust the permissions so that everyone has read access to the file.
    * After uploading the file to your S3 bucket, it will take a little while for the file to propagate out to the edge nodes in CloudFront, so wait until you can access the file before hitting enter to let Certbot know that it should check for the file at your domain's URL.
* After Certbot successfully validates that the file it expects is available at the target location, it will generate your cert, private key, and chain, placing the files in /etc/letsencrypt/live/<domainName>
* You must now disable your CloudFront distribution.
  * AWS won't let you have both a CloudFront and API Gateway using the same target domain name (you'll get an error message if your CloudFront domain isn't disabled).
  * You can also delete the temporary S3 bucket if you want.
* Go to API Gateway and choose "Custom Domain Names" and click the "Create" button.
  * You'll need to copy and paste the values of your private key (privkey.pem), cert (cert.pem), and chain (chain.pem) into the appropriate text areas.
    * If you make a mistake, AWS attempts to validate the information in the fields and will not let you finish the creation process.
* After you finish the creation process, you'll be brought to a screen that shows your "distribution domain name".  This will be a cloudfront.net domain.  As with the previous creation of a CloudFront domain, it can take a while for the CloudFront domain to resolve.
  * Modify your CNAME entry for your target domain to point to this new cloudfront.net domain.  I'd also suggest lengthening the TTL (1 hour is fine).
* On the API Gateway configuration screen for your new custom domain, you'll want to add an "API Mapping":
  * Base Path: (leave blank)
  * API: Pillar Timesheet (i.e. the name of the API you created in API Gateway)
  * Stage: timesheet (i.e. prod)
  * This will point your target domain to the prod stage for the API, meaning that `https://<your.domain.com>/` will then resolve to your prod stage.

This is, unfortunately, not quite the end, as you'll need to adjust a few things (like enabling CORS and setting up another API endpoint for the .well-known/acme-challenge so you have it ready when you need to renew your SSL cert).

## References
Some references that will facilitate in deployment configuration:
* [Setting up Google OpenID Authentication](https://developers.google.com/identity/sign-in/web/)
* [Using Amazon API Gateway as a proxy to S3](http://docs.aws.amazon.com/apigateway/latest/developerguide/integrating-api-with-aws-services-s3.html)
* [Setting up Amazon AWS Credentials](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
* [Generating Amazon AWS Access Keys](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-set-up.html)
* [Amazon AWS Policy Required by gulp-awspublish](https://www.npmjs.com/package/gulp-awspublish)
* [Assuming an AWS IAM Role via a web identity](http://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html)
* [Generating a custom JavaScript SDK for the defined endpoints in the AWS API Gateway](http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-generate-sdk.html)
* [Passing AWS IAM tokens from a REST client](http://stackoverflow.com/questions/32833331/api-gateway-how-to-pass-aws-iam-authorization-from-rest-client)

Some references for SSL certs and custom domain configuration:
* [Another person who tried to set up a custom domain with API Gateway, but with a different SSL cert authority](http://www.davekonopka.com/2016/api-gateway-domain.html)
* [Let's Encrypt](https://letsencrypt.org)
* [Certbot](https://certbot.eff.org)
* [Certbot - manual plugin information](https://certbot.eff.org/docs/using.html#manual)
* [Amazon docs for API Gateway with Custom Domains](http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-custom-domains.html)
* [Amazon Certificate Manager docs](https://aws.amazon.com/certificate-manager/)
* [Setting up secure connections and custom domains with CloudFront](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/SecureConnections.html#CNAMEsAndHTTPS)
* [Setting up custom SSL domains with CloudFront](https://aws.amazon.com/cloudfront/custom-ssl-domains/)
