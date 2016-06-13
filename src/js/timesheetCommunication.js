var TimesheetCommunication = (function() {
  var self = {
    requestHeaders: {
      'Application-Identifier': "github.com/donabney/timesheet"
    },
    protocol: "http",
    host: "private-696ecf-ddaugherfba.apiary-mock.com",
    api: {
      getTimesheetForUser: "/api/timesheet/{email_shortname}/{date}",
      saveTimesheet: "/api/timesheet/{id}",
      validateTimesheet: "/api/timesheet/{id}/validate"
    }
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

  self.fetchTimesheetInfo = function(username, date) {
    var valueMap = {
      "{email_shortname}": username,
      "{date}": TimesheetUtil.formatDateYYYYMMDD(date)
    };

    $.ajax({
      url: generateURL(self.api.getTimesheetForUser, valueMap),
      crossDomain: true,
      headers: self.requestHeaders
    }).done(function(data) {
      ResponseHandling.makeSuccessResponseVisible();
      TimesheetView.displayTimesheetInfo(username, data);
    }).fail(function(jqXHR) {
      ResponseHandling.makeErrorResponseVisible();
      ResponseHandling.displayError(jqXHR);
    });
  };

  self.saveTimesheet = function(timesheetId, hoursForTimesheetEntries) {
    var valueMap = {
      "{id}": timesheetId
    };

    $.ajax({
      url: generateURL(self.url.saveTimesheet, valueMap),
      method: 'POST',
      crossDomain: true,
      headers: self.requestHeaders
    }).done(function(data) {
      // do something
    }).fail(function(jqXHR) {
      ResponseHandling.makeErrorResponseVisible();
      ResponseHandling.displayError(jqXHR);
    });

    self.validateTimesheet = function(timesheetId) {
      var valueMap = {
        "{id}": timesheetId
      };

      $.ajax({
        url: generateURL(self.url.validateTimesheet, valueMap),
        method: 'POST',
        crossDomain: true,
        headers: self.requestHeaders
      }).done(function(data) {
        // do something
      }).fail(function(jqXHR) {
        ResponseHandling.makeErrorResponseVisible();
        ResponseHandling.displayError(jqXHR);
      });
    };
  }

  return self;
})();
