var TimesheetCommunication = (function() {
  var self = {
    requestHeaders: {
      'Application-Identifier': "github.com/donabney/timesheet"
    },
    protocol: "http",
    host: "private-696ecf-ddaugherfba.apiary-mock.com",
    api: {
      getTimesheetForUser: "/fba/api/timesheet/{email_shortname}/{date}",
      saveTimesheet: "/fba/api/timesheet/{id}",
      validateTimesheet: "/fba/api/timesheet/{id}/validate"
    },
    crossDomain: true
  };

  // self.requestHeaders.Prefer = "status=404"  // This is for mocked error responses with apiary to assist with manual testing

  function replaceAll(targetString, replacementMapping){
      var regex = new RegExp(Object.keys(replacementMapping).join("|"), "g");

      return targetString.replace(regex, function(matched) {
          return replacementMapping[matched];
      });
  };

  function generateURL(api, valueMap) {
    return self.protocol + "://" + self.host + replaceAll(api, valueMap);
  };

  function saveTimesheet(timesheetId, hoursForTimesheetEntries) {
    var deferred = $.Deferred();
    var valueMap = {
      "{id}": timesheetId
    };

    $.ajax({
      url: generateURL(self.api.saveTimesheet, valueMap),
      method: 'POST',
      crossDomain: self.crossDomain,
      headers: self.requestHeaders,
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify(hoursForTimesheetEntries)
    }).done(function(data) {
      // do something
      deferred.resolve();
    }).fail(function(jqXHR) {
      ResponseHandling.makeErrorResponseVisible();
      valueMap["{requestBody}"] = hoursForTimesheetEntries;
      ResponseHandling.displayError(jqXHR, valueMap);
      deferred.reject();
    });

    return deferred.promise();
  };

  function validateTimesheet(timesheetId) {
    var deferred = $.Deferred();
    var valueMap = {
      "{id}": timesheetId
    };

    $.ajax({
      url: generateURL(self.api.validateTimesheet, valueMap),
      method: 'POST',
      crossDomain: self.crossDomain,
      headers: self.requestHeaders
    }).done(function(data) {
      // do something
      deferred.resolve();
    }).fail(function(jqXHR) {
      ResponseHandling.makeErrorResponseVisible();
      ResponseHandling.displayError(jqXHR, valueMap);
      deferred.reject();
    });

    return deferred.promise();
  };

  self.fetchTimesheetInfo = function(username, date) {
    var deferred = $.Deferred();
    var valueMap = {
      "{email_shortname}": username,
      "{date}": TimesheetUtil.formatDateYYYYMMDD(date)
    };

    $.ajax({
      url: generateURL(self.api.getTimesheetForUser, valueMap),
      crossDomain: self.crossDomain,
      headers: self.requestHeaders
    }).done(function(data) {
      ResponseHandling.makeSuccessResponseVisible();
      TimesheetView.displayTimesheetInfo(username, data);
      deferred.resolve();
    }).fail(function(jqXHR) {
      ResponseHandling.makeErrorResponseVisible();
      ResponseHandling.displayError(jqXHR, valueMap);
      deferred.reject();
    });

    return deferred.promise();
  };

  self.sendSaveTimesheet = function() {
    var hoursForTimesheetEntries = TimesheetUtil.convertToTimeEntries(TimesheetView.collectEnteredTime());
    var timesheetInfo = TimesheetView.collectTimesheetInfo();
    saveTimesheet(timesheetInfo.id, hoursForTimesheetEntries).done(function() {
      self.fetchTimesheetInfo(timesheetInfo.username, TimesheetUtil.formatDateYYYYMMDD(timesheetInfo.startDate));
    });
  };

  self.sendValidateTimesheet = function() {
    var timesheetInfo = TimesheetView.collectTimesheetInfo();
    validateTimesheet(timesheetInfo.id).done(function() {
      self.fetchTimesheetInfo(timesheetInfo.username, TimesheetUtil.formatDateYYYYMMDD(timesheetInfo.startDate));
    });
  };

  return self;
})();
