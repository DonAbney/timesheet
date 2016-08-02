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
      ResponseHandling.displayError(jqXHR, valueMap);
      deferred.reject();
    });

    return deferred.promise();
  };

  function wrapRequest(targetAPICall, params, body) {
    var deferred = $.Deferred();
    targetAPICall(params, body).then(function(response) {
      deferred.resolve(response.data);
    }).catch(function(response) {
      ResponseHandling.displayError(bundleErrorResponseDataForDisplay(response), {});
      deferred.reject();
    });
    return deferred.promise();
  }

  self.saveTimesheet = function(timesheetId, hoursForTimesheetEntries) {
    return wrapRequest(
      TimesheetConfig.aws.apigClient.apiTimesheetIdPost,
      {
        'Application-Identifier': TimesheetConfig.requestHeaders['Application-Identifier'],
        'id': timesheetId
      },
      hoursForTimesheetEntries
    );
  };

  self.validateTimesheet = function(timesheetId) {
    return wrapRequest(
      TimesheetConfig.aws.apigClient.apiTimesheetIdValidatePost,
      {
        'Application-Identifier': TimesheetConfig.requestHeaders['Application-Identifier'],
        'id': timesheetId
      }
    );
  };

  self.fetchTimesheetInfo = function(username, date) {
    return wrapRequest(
      TimesheetConfig.aws.apigClient.apiTimesheetIdDateGet,
      {
        'Application-Identifier': TimesheetConfig.requestHeaders['Application-Identifier'],
        'date': TimesheetUtil.formatDateYYYYMMDD(date),
        'id': username
      }
    );
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
