var TimesheetCommunication = (function() {
  var self = {
    // Update with prod URL
    url_getTimesheetForUser: "http://private-696ecf-ddaugherfba.apiary-mock.com/api/timesheet/tjones/2016-05-20"
  };

  self.fetchTimesheetInfo = function() {
    $.ajax({
      url: self.url_getTimesheetForUser,
      crossDomain: true
    }).then(function(data) {
      TimesheetView.displayTimesheetInfo(data);
    });
  };

  return self;
})();
