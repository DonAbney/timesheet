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
    var daysEntries = collateDays(timesheetInfo.timeEntryPositionMapByDate);
    displayDays(daysEntries);
  }

  function collateDays(timeEntryProjectInfo) {
    var daysEntries = {};
    timeEntryProjectInfo.forEach(function(projectInfo) {
      var projectName = projectInfo.position.name;
      var projectNote = projectInfo.position.note;
      projectInfo.timeEntries.forEach(function(timeEntry) {
        console.log(timeEntry.id);
      });
    });
  }

  function displayDays(daysEntries) {
    var daysElement = $(".days");
    $.each(function(daysEntries) {

    });
    var dayElement = document.createElement("div");
    dayElement.className = "day";
    daysElement.append(dayElement);
  }
});
