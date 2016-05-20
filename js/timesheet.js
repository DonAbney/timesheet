$(document).ready(function() {
  fetchTimesheetInfo();

  function fetchTimesheetInfo() {
    $.ajax({
      // Update IP
      url: "http://private-dbebc-timesheet9.apiary-mock.com/timesheets",
      crossDomain: true
    }).then(function(data) {
      // var timesheetInfo = $.parseJSON(data);
      displayTimesheetInfo(data);
    });
  }

  function displayTimesheetInfo(timesheetInfo) {
    console.log(timesheetInfo);
    
  }
});
