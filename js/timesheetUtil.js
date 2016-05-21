var TimesheetUtil = (function() {
  var self = {};

  self.collateDays = function(timeEntryProjectInfo) {
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
  };

  self.sortDaysEntryDates = function(daysEntries) {
    var dates = [];
    for (date in daysEntries) {
      if (daysEntries.hasOwnProperty(date)) {
        dates.push(date);
      }
    }
    dates.sort();
    return dates;
  };

  self.formatDate = function(dateString) {
    return dateString.split("T")[0];
  };

  self.aggregateTime = function(enteredTimes) {
    var aggregatedTime = {};

    return aggregatedTime;
  };

  return self;
})();
