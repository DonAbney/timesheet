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

  describe('extractUserInfo()', function() {
    var basicProfile = {
      getEmail: function() { return 'tjones@pillartechnology.com'; },
      getName: function() { return 'Tom Jones'; },
      getGivenName: function() { return 'Tom'; },
      getFamilyName: function() { return 'Jones'; },
      getImageUrl: function() { return 'http://some.url.com/images/myImage.gif'; },
    }

    it('should extract the username from the email address', function() {
      var userInfo = TimesheetAuthentication.extractUserInfo(basicProfile);

      expect(userInfo.username).toEqual('tjones');
    });

    it('should save the email address', function() {
      var userInfo = TimesheetAuthentication.extractUserInfo(basicProfile);

      expect(userInfo.emailAddress).toEqual('tjones@pillartechnology.com');
    });

    it('should save the full name', function() {
      var userInfo = TimesheetAuthentication.extractUserInfo(basicProfile);

      expect(userInfo.fullName).toEqual('Tom Jones');
    });

    it('should save the given name', function() {
      var userInfo = TimesheetAuthentication.extractUserInfo(basicProfile);

      expect(userInfo.givenName).toEqual('Tom');
    });

    it('should save the family name', function() {
      var userInfo = TimesheetAuthentication.extractUserInfo(basicProfile);

      expect(userInfo.familyName).toEqual('Jones');
    });

    it('should save the image url', function() {
      var userInfo = TimesheetAuthentication.extractUserInfo(basicProfile);

      expect(userInfo.imageUrl).toEqual('http://some.url.com/images/myImage.gif');
    });
  });
});
