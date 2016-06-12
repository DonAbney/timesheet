var TimesheetCommunication = (function() {
  var self = {
    requestHeaders: {
      // Prefer:status=404,  // This is for mocked error responses with apiary to assist with manual testing
      'Application-Identifier': "github.com/donabney/timesheet"
    },
    url_getTimesheetForUser: "http://private-696ecf-ddaugherfba.apiary-mock.com/api/timesheet" // apiary mock response url
    // url_getTimesheetForUser: "" // prod url
  };

  self.fetchTimesheetInfo = function(username, date) {
    $.ajax({
      url: self.url_getTimesheetForUser + '/' + username + '/' + TimesheetUtil.formatDateYYYYMMDD(date),
      crossDomain: true,
      headers: self.requestHeaders
    }).done(function(data) {
      ErrorHandling.makeSuccessResponseVisible();
      TimesheetView.displayTimesheetInfo(username, data);
    }).fail(function(jqXHR, statusText, errorThrown) {
      ErrorHandling.makeErrorResponseVisible();
      ErrorHandling.displayError("[" + jqXHR.status + "] " + jqXHR.statusText, JSON.parse(jqXHR.responseText).message);
    });
  };

  return self;
})();
