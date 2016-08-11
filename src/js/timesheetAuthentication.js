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
  };

  self.onError = function(error) {
    ResponseHandling.displayErrorMessage(JSON.stringify(error, undefined, 2));
  };

  self.listenForAuthentication = function() {
    gapi.load('auth2', function() {
      var authInstance = gapi.auth2.init({});
      authInstance.attachClickHandler(document.getElementById('customGoogleButton'), {prompt: 'select_account'}, self.onSignIn, self.onError);
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

  self.extractUserInfo = function(basicProfile) {
    return {
      username: self.extractUsername(basicProfile.getEmail()),
      emailAddress: basicProfile.getEmail(),
      fullName: basicProfile.getName(),
      givenName: basicProfile.getGivenName(),
      familyName: basicProfile.getFamilyName(),
      imageUrl: basicProfile.getImageUrl()
    };
  };

  self.currentAuthenticatedUserInfo = function() {
    var authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      var basicProfile = authInstance.currentUser.get().getBasicProfile();
      return self.extractUserInfo(basicProfile);
    } else {
      return {};
    }
  };

  self.currentAuthenticatedUsername = function() {
    var authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      var basicProfile = authInstance.currentUser.get().getBasicProfile();
      return self.extractUsername(basicProfile.getEmail());
    } else {
      return '';
    }
  };

  function authenticationListener(isLoggingIn) {
    if (isLoggingIn) {
      registerAuthentication();
    } else {
      self.signOut();
    }
  }

  function registerAuthentication() {
    var authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      var currentUser = authInstance.currentUser.get();
      var userInfo = self.extractUserInfo(currentUser.getBasicProfile());
      var token = currentUser.getAuthResponse().id_token;
      TimesheetApiWrapper.registerCredentials(token, userInfo.username).done(function() {
        initializeForAuthenticatedUser(userInfo);
      }).fail(function(bundledResponse) {
        ResponseHandling.displayError(bundledResponse.jqXHR, bundledResponse.valueMap);
        self.signOut();
      });
    }
  }

  function initializeForAuthenticatedUser(userInfo) {
    TimesheetView.hideAuthenticationArea();
    TimesheetView.registerPageListeners();
    TimesheetView.updateUsername(userInfo.fullName);
    TimesheetCommunication.fetchTimesheetInfo(new Date());
  }

  return self;
})();
