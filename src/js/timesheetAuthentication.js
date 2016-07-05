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

  self.extractCredentialFromStsResponse = function(credentialName, stsResponse) {
    var expression = "<" + credentialName + ">(.*)</" + credentialName + ">";
    var regex = new RegExp(expression);
    var matches = regex.exec(stsResponse);
    if (matches) {
      return matches[1];
    }
    return '';
  }

  function authenticationListener(state) {
    var authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      var currentUser = authInstance.currentUser.get();
      var username = self.extractUsername(currentUser.getBasicProfile().getEmail());
      registerAwsRoleCredentials(currentUser.getAuthResponse().id_token, username).done(function() {
        initializeForAuthenticatedUser(username);
      });
    }
  }

  function initializeForAuthenticatedUser(username) {
    TimesheetView.hideAuthenticationArea();
    TimesheetView.registerPageListeners();
    TimesheetCommunication.fetchTimesheetInfo(username, new Date());
  }

  function registerAwsRoleCredentials(token, username) {
    var deferred = $.Deferred();

    $.ajax({
      url: "https://sts.amazonaws.com/",
      crossDomain: true,
      data: {
        Action: 'AssumeRoleWithWebIdentity',
        RoleSessionName: username,
        RoleArn: 'arn:aws:iam::158167676023:role/PillarTimeSheetAuthenticatedUser',
        WebIdentityToken: token,
        Version: '2011-06-15'
      }
    }).done(function(data) {
      deferred.resolve();
    }).fail(function(jqXHR) {
      ResponseHandling.makeErrorResponseVisible();
      ResponseHandling.displayError(jqXHR, valueMap);
      deferred.reject();
    });

    return deferred.promise();
  }

  return self;
})();
