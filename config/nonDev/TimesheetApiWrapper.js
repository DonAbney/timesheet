var TimesheetApiWrapper = (function(){
  var self = {};

  self.registerCredentials = function(token, username) {
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
      },
      dataType: 'xml'
    }).done(function(data) {
      TimesheetConfig.aws.apigClient = apigClientFactory.newClient({
        accessKey: extractCredentialFromStsResponse('AccessKeyId', data),
        secretKey: extractCredentialFromStsResponse('SecretAccessKey', data),
        sessionToken: extractCredentialFromStsResponse('SessionToken', data),
        region: 'us-east-1'
      });
      deferred.resolve();
    }).fail(function(jqXHR) {
      ResponseHandling.makeErrorResponseVisible();
      ResponseHandling.displayError(jqXHR, valueMap);
      deferred.reject();
    });

    return deferred.promise();
  };

  self.saveTimesheet = function(timesheetId, hoursForTimesheetEntries) {
    var deferred = $.Deferred();
    deferred.resolve();
    return deferred.promise();
  };

  self.validateTimesheet = function(timesheetId) {
    var deferred = $.Deferred();
    deferred.resolve();
    return deferred.promise();
  };

  self.fetchTimesheetInfo = function(username, date) {
    var deferred = $.Deferred();
    TimesheetConfig.aws.apigClient.apiTimesheetIdDateGet({
      'Application-Identifier': TimesheetConfig.requestHeaders['Application-Identifier'],
      'date': TimesheetUtil.formatDateYYYYMMDD(date),
      'id': username
    }).then(function(response) {
      deferred.resolve(response.data);
    }).catch(function(response) {
      ResponseHandling.makeErrorResponseVisible();
      ResponseHandling.displayError(bundleErrorResponseDataForDisplay(response), {});
      deferred.reject();
    });
    return deferred.promise();
  };

  function bundleErrorResponseDataForDisplay(response) {
    return {
      status: response.status,
      statusText: response.statusText,
      responseText: JSON.stringify({message: extractErrorMessageFromVariousFormsOfErrorResponses(response)})
    };
  }

  function extractErrorMessageFromVariousFormsOfErrorResponses(response) {
    var message = response.message;
    if (response.data) {
      if (response.data.Message) {
        message = response.data.Message;
      } else {
        message = response.data.message;
      }
    }
    return message;
  }

  function extractCredentialFromStsResponse(credentialName, stsResponse) {
    return $(stsResponse).find(credentialName).text();
  }

  return self;
})();
