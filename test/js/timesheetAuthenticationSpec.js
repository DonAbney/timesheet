describe('TimesheetAuthentication', function() {
  describe('extractUsername()', function() {
    it('should return an empty string if the email was undefined', function() {
      var username = TimesheetAuthentication.extractUsername(undefined);

      expect(username).toEqual('');
    });

    it('should return an empty string if the email was null', function() {
      var username = TimesheetAuthentication.extractUsername(null);

      expect(username).toEqual('');
    });

    it('should return an empty string if the email was an empty string', function() {
      var username = TimesheetAuthentication.extractUsername('');

      expect(username).toEqual('');
    });

    it('should return an empty string if the email was not a Pillar Technology email address', function() {
      var username = TimesheetAuthentication.extractUsername('joe@noackexpected.com');

      expect(username).toEqual('');
    });

    it('should return the username from the email address', function() {
      var username = TimesheetAuthentication.extractUsername('joe@pillartechnology.com');

      expect(username).toEqual('joe');
    });
  });

  describe('extracting credentials from AWS STS XML response', function() {
    var sampleResponse = "" +
    "<AssumeRoleWithWebIdentityResponse xmlns=\"https://sts.amazonaws.com/doc/2011-06-15/\">" +
    "  <AssumeRoleWithWebIdentityResult>" +
    "    <Audience>EXAMPLE.apps.googleusercontent.com</Audience>" +
    "    <AssumedRoleUser>" +
    "      <Arn>arn:aws:sts::EXAMPLE:assumed-role/EXAMPLE/USERNAME</Arn>" +
    "      <AssumedRoleId>AROKHOZOSEXAMPLE:USERNAME</AssumedRoleId>" +
    "    </AssumedRoleUser>" +
    "    <Credentials>" +
    "      <AccessKeyId>AG624NSTQEXAMPLE</AccessKeyId>" +
    "      <SecretAccessKey>XFkF204gaUC3GEXAMPLE/</SecretAccessKey>" +
    "      <SessionToken>FQoDYXdzEIH//////////wEa=EXAMPLE</SessionToken>" +
    "      <Expiration>2016-07-05T01:01:10Z</Expiration>" +
    "      <EmptyCredentialForTesting></EmptyCredentialForTesting>" +
    "    </Credentials>" +
    "    <Provider>accounts.google.com</Provider>" +
    "    <SubjectFromWebIdentityToken>10808EXAMPLE</SubjectFromWebIdentityToken>" +
    "  </AssumeRoleWithWebIdentityResult>" +
    "  <ResponseMetadata>" +
    "    <RequestId>947a16d0-4243-1164EXAMPLE</RequestId>" +
    "  </ResponseMetadata>" +
    "</AssumeRoleWithWebIdentityResponse>";

    describe('extractCredentialFromStsResponse()', function() {
      it('should return an empty string if the response is undefined', function() {
        var credential = TimesheetAuthentication.extractCredentialFromStsResponse('SessionToken', undefined);

        expect(credential).toEqual('');
      });

      it('should return an empty string if the target credential was not in the response', function() {
        var credential = TimesheetAuthentication.extractCredentialFromStsResponse('JoeCool', sampleResponse);

        expect(credential).toEqual('');
      });

      it('should return an empty string if the target credential was empty', function() {
        var credential = TimesheetAuthentication.extractCredentialFromStsResponse('EmptyCredentialForTesting', sampleResponse);

        expect(credential).toEqual('');
      });

      it('should return the value of the credential', function() {
        var credential = TimesheetAuthentication.extractCredentialFromStsResponse('SessionToken', sampleResponse);

        expect(credential).toEqual('FQoDYXdzEIH//////////wEa=EXAMPLE');
      });
    });
  });
});
