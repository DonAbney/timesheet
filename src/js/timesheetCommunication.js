var TimesheetCommunication = (function() {
  var self = {
    // Update with prod URL
    url_getTimesheetForUser: "http://private-696ecf-ddaugherfba.apiary-mock.com/api/timesheet"
  };

  self.fetchTimesheetInfo = function(username, date) {
    $.ajax({
      url: self.url_getTimesheetForUser + '/' + username + '/' + TimesheetUtil.formatDateYYYYMMDD(date),
      crossDomain: true
    }).then(function(data) {
      TimesheetView.displayTimesheetInfo(username, data);
    });
  };

  return self;
})();
