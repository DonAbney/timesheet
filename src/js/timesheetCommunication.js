var TimesheetCommunication = (function() {
  var self = {
    requestHeaders: {
      'Application-Identifier': "github.com/donabney/timesheet"
    }
  };

  // Apiary mock URLs
  self.url = {
    getTimesheetForUser: "http://private-696ecf-ddaugherfba.apiary-mock.com/api/timesheet"
  };
  // self.requestHeaders.Prefer = "status=404"  // This is for mocked error responses with apiary to assist with manual testing


  // Prod URLs
  // self.url = {
  //   getTimesheetForUser: ""
  // };

  self.fetchTimesheetInfo = function(username, date) {
    $.ajax({
      url: self.url.getTimesheetForUser + '/' + username + '/' + TimesheetUtil.formatDateYYYYMMDD(date),
      crossDomain: true,
      headers: self.requestHeaders
    }).done(function(data) {
      ErrorHandling.makeSuccessResponseVisible();
      TimesheetView.displayTimesheetInfo(username, data);
    }).fail(function(jqXHR) {
      ErrorHandling.makeErrorResponseVisible();
      ErrorHandling.displayError(jqXHR);
    });
  };

  return self;
})();
