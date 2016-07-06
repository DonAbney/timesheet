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
});
