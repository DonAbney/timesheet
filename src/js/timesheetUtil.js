var TimesheetUtil = (function() {
  var self = {};

  self.collateDays = function(timeEntryPositionInfo) {
    var daysEntries = {};

    function fetchDayEntry(date) {
      var dayEntry = daysEntries[date];
      if (dayEntry === undefined) {
        dayEntry = [];
        daysEntries[date] = dayEntry;
      }
      return dayEntry;
    }

    timeEntryPositionInfo.forEach(function(infoEntry) {
      infoEntry.timeEntries.forEach(function(timeEntry) {
        var dayEntry = fetchDayEntry(timeEntry.date);
        dayEntry.push({
          id: timeEntry.id,
          date: timeEntry.date,
          hours: timeEntry.hours,
          projectedHours: timeEntry.projectedHours,
          positionId: infoEntry.position.id,
          positionName: infoEntry.position.name,
          positionNote: infoEntry.position.note
        });
      });
    });
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

  self.formatDateYYYYMMDD = function(date) {
    var date = new Date(date);
    return date.toJSON().split("T")[0];
  }

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

  self.hasEnteredTimeChanged = function(enteredTimes) {
    var hasChanged = false;
    self.mapKeys(enteredTimes).forEach(function(key) {
      var entry = enteredTimes[key];
      if (entry.hours !== entry['last-saved-hours']) {
        hasChanged = true;
      }
    });
    return hasChanged;
  }

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
