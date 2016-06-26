var TimesheetAuthentication = (function() {
  var self = {};

  self.onSignIn = function(googleUser) {
    initializeForAuthenticatedUser(googleUser);
  };

  self.onError = function(error) {
    ResponseHandling.makeErrorResponseVisible();
    ResponseHandling.displayErrorMessage(JSON.stringify(error, undefined, 2));
  };

  self.listenForAuthentication = function() {
    gapi.load('auth2', function() {
      var authInstance = gapi.auth2.init({});
      authInstance.isSignedIn.listen(authenticationListener);
    });
  };

  self.extractUsername = function(emailAddress) {
    if (emailAddress) {
      var regex = /^(.+)@pillartechnology.com$/i;
      var matches = regex.exec(emailAddress);
      if (matches) {
        return matches[1];
      }
    }
    return '';
  };

  function authenticationListener(state) {
    var authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      initializeForAuthenticatedUser(authInstance.currentUser.get());
    }
  }

  function initializeForAuthenticatedUser(googleUser) {
    var profile = googleUser.getBasicProfile();
    $('#authentication').hide();
    $('.saveChanges').click(TimesheetCommunication.sendSaveTimesheet);
    $('.validateTimesheet').click(TimesheetCommunication.sendValidateTimesheet);
    $(window).resize(TimesheetView.windowSizeChanged);
    TimesheetCommunication.fetchTimesheetInfo(self.extractUsername(profile.getEmail()), new Date());
  }

  return self;
})();
