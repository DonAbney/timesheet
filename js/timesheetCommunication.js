var TimesheetCommunication = (function() {
  var self = {
    // Update with prod URL
    url_getTimesheetForUser: "http://private-dbebc-timesheet9.apiary-mock.com/timesheets"
  };

  self.fetchTimesheetInfo = function() {
    $.ajax({
      url: self.url_getTimesheetForUser,
      crossDomain: true
    }).then(function(data) {
      TimesheetView.displayTimesheetInfo(data);
    });
  }

  return self;
})();
