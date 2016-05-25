var TimesheetUtil = (function() {
  var self = {};

  self.collateDays = function(timeEntryPositionInfo) {
    var daysEntries = {};
    //
    // function fetchDayEntry(date) {
    //   var dayEntry = daysEntries[date];
    //   if (!dayEntry) {
    //     dayEntry = [];
    //     daysEntries[date] = dayEntry;
    //   }
    //   return dayEntry;
    // }
    //
    // timeEntryProjectInfo.forEach(function(projectInfo) {
    //   var positionName = projectInfo.position.name;
    //   var positionNote = projectInfo.position.note;
    //   projectInfo.timeEntries.forEach(function(timeEntry) {
    //     var date = timeEntry.date;
    //     var dayEntry = fetchDayEntry(date);
    //     dayEntry.push({
    //       id: timeEntry.id,
    //       date: date,
    //       hours: timeEntry.hours,
    //       projectedHours: timeEntry.projectedHours,
    //       positionName: positionName,
    //       positionNote: positionNote,
    //       positionId: timeEntry.position.id
    //     });
    //   });
    // });
    return daysEntries;
  };

  self.sortDaysEntryDates = function(daysEntries) {
    var dates = self.mapKeys(daysEntries);
    dates.sort();
    return dates;
  };

  var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  self.formatDate = function(dateString) {
    var date = new Date(dateString);
    return daysOfWeek[date.getDay()] + " " + (date.getMonth() + 1) + "/" + date.getDate();
  };

  self.aggregateTime = function(enteredTimes) {
    var aggregatedTimes = {};
    var totalTime = 0.0;
    self.mapKeys(enteredTimes).forEach(function(key) {
      var entry = enteredTimes[key];
      var aggregatedTime = aggregatedTimes[entry.date] ? aggregatedTimes[entry.date] : 0.0;
      aggregatedTimes[entry.date] = aggregatedTime + entry.hours;
      totalTime += entry.hours;
    });
    aggregatedTimes.totalTime = totalTime;
    return aggregatedTimes;
  };

  self.mapKeys = function(map) {
    var keys = [];
    for (key in map) {
      if (map.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys;
  }

  return self;
})();
