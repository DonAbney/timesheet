var TimesheetCommunication = (function() {
  var self = {
    requestHeaders: {
      'Application-Identifier': "github.com/donabney/timesheet"
    },
    url_getTimesheetForUser: "http://private-696ecf-ddaugherfba.apiary-mock.com/api/timesheet" // Update with prod URL
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
