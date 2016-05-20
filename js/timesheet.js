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

    function fetchDayEntry(date) {
      var dayEntry = daysEntries[date];
      if (!dayEntry) {
        dayEntry = [];
        daysEntries[date] = dayEntry;
      }
      return dayEntry;
    }

    timeEntryProjectInfo.forEach(function(projectInfo) {
      var positionName = projectInfo.position.name;
      var positionNote = projectInfo.position.note;
      projectInfo.timeEntries.forEach(function(timeEntry) {
        var date = timeEntry.date;
        var dayEntry = fetchDayEntry(date);
        dayEntry.push({
          id: timeEntry.id,
          date: date,
          hours: timeEntry.hours,
          projectedHours: timeEntry.projectedHours,
          positionName: positionName,
          positionNote: positionNote,
          positionId: timeEntry.position.id
        });
      });
    });
    return daysEntries;
  }

  function displayDays(daysEntries) {
    var daysElement = $(".days");
    console.log(daysEntries);
    $.each(function(daysEntries) {

    });
    var dayElement = document.createElement("div");
    dayElement.className = "day";
    daysElement.append(dayElement);
  }
});
