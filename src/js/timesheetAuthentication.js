var TimesheetAuthentication = (function() {
  var self = {};

  self.signOut = function() {
    var authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut().then(function() {
      TimesheetView.clearOldInformation();
      TimesheetView.showAuthenticationArea();
    });
  };

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
      var currentUser = authInstance.currentUser.get();
      var username = self.extractUsername(currentUser.getBasicProfile().getEmail());
      var token = currentUser.getAuthResponse().id_token;
      TimesheetApiWrapper.registerCredentials(token, username).done(function() {
        initializeForAuthenticatedUser(username);
      });
    }
  }

  function initializeForAuthenticatedUser(username) {
    TimesheetView.hideAuthenticationArea();
    TimesheetView.registerPageListeners();
    TimesheetCommunication.fetchTimesheetInfo(username, new Date());
  }

  return self;
})();
