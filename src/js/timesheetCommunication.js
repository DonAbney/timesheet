var TimesheetCommunication = (function() {
  var self = {
    requestHeaders: {
      'Application-Identifier': "github.com/donabney/timesheet"
    },
    url_getTimesheetForUser: "http://private-696ecf-ddaugherfba.apiary-mock.com/api/timesheet" // Update with prod URL

    // Mocked error endpoints for manual testing of error responses
    // url_getTimesheetForUser: "http://private-f9346-errorstates.apiary-mock.com/404"
    // url_getTimesheetForUser: "http://private-f9346-errorstates.apiary-mock.com/500"
  };

  self.fetchTimesheetInfo = function(username, date) {
    $.ajax({
      url: self.url_getTimesheetForUser + '/' + username + '/' + TimesheetUtil.formatDateYYYYMMDD(date),
      crossDomain: true,
      headers: self.requestHeaders
    }).then(function(data) {
      TimesheetView.displayTimesheetInfo(username, data);
    });
  };

  return self;
})();
