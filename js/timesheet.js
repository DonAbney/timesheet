$(document).ready(function() {
  fetchTimesheetInfo();

  function fetchTimesheetInfo() {
    $.ajax({
      // Update with prod URL
      url: "http://private-dbebc-timesheet9.apiary-mock.com/timesheets",
      crossDomain: true
    }).then(function(data) {
      TimesheetView.displayTimesheetInfo(data);
    });
  }
});
