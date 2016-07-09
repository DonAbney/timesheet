var TimesheetUtil = (function() {
  var self = {};

  function addPlaceholdersForMissingPositions(dayEntries, positionOrder) {
    var positionIndex = 0;
    var newDayEntries = [];
    dayEntries.forEach(function(dayEntry) {
      if (dayEntry.position.id === positionOrder[positionIndex].id) {
        newDayEntries.push(dayEntry);
        positionIndex += 1;
      } else {
        while (dayEntry.position.id !== positionOrder[positionIndex].id) {
          newDayEntries.push({
            id: "placeholder_" + positionOrder[positionIndex].id + "_" + self.formatDateYYYYMMDD(dayEntry.date),
            date: dayEntry.date,
            hours: 0,
            projectedHours: 0,
            position: {
              id: positionOrder[positionIndex].id,
              name: positionOrder[positionIndex].name,
              note: positionOrder[positionIndex].note
            }
          });
          positionIndex += 1;
        }
      }
    });
    return newDayEntries;
  }

  self.collateDays = function(timeEntryPositionInfo, positionOrder) {
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
          position: {
            id: infoEntry.position.id,
            name: infoEntry.position.name,
            note: infoEntry.position.note
          }
        });
      });
    });

    self.mapKeys(daysEntries).forEach(function(date) {
      daysEntries[date] = addPlaceholdersForMissingPositions(daysEntries[date], positionOrder);
    });

    return daysEntries;
  };

  self.collatePositions = function(timeEntryPositionInfo) {
    var positions = [];
    timeEntryPositionInfo.forEach(function(infoEntry) {
      var position = infoEntry.position;
      positions.push({
        id: position.id,
        name: position.name,
        note: position.note
      });
    });
    return positions;
  };

  self.sortDaysEntryDates = function(daysEntries) {
    var dates = self.mapKeys(daysEntries);
    dates.sort();
    return dates;
  };

  var daysOfWeek = [
    {
      name: 'Sunday',
      abbreviation: 'Sun',
      shortAbbreviation: 'Su'
    },
    {
      name: 'Monday',
      abbreviation: 'Mon',
      shortAbbreviation: 'M'
    },
    {
      name: 'Tuesday',
      abbreviation: 'Tues',
      shortAbbreviation: 'T'
    },
    {
      name: 'Wednesday',
      abbreviation: 'Wed',
      shortAbbreviation: 'W'
    },
    {
      name: 'Thursday',
      abbreviation: 'Thurs',
      shortAbbreviation: 'R'
    },
    {
      name: 'Friday',
      abbreviation: 'Fri',
      shortAbbreviation: 'F'
    },
    {
      name: 'Saturday',
      abbreviation: 'Sat',
      shortAbbreviation: 'Sa'
    }
  ];

  self.formatDate = function(dateString) {
    var date = new Date(dateString);
    return daysOfWeek[date.getDay()].name + " " + (date.getMonth() + 1) + "/" + date.getDate();
  };

  self.formatDateMDD = function(date) {
    var date = new Date(date);
    return (date.getMonth() + 1) + "/" + date.getDate();
  };

  self.formatDateYYYYMMDD = function(date) {
    var date = new Date(date);
    return date.toJSON().split("T")[0];
  };

  self.weekdayForDate = function(date) {
    var date = new Date(date);
    return daysOfWeek[date.getDay()].name;
  };

  self.weekdayAbbreviationForDate = function(date) {
    var date = new Date(date);
    return daysOfWeek[date.getDay()].abbreviation;
  };

  self.weekdayShortAbbreviationForDate = function(date) {
    var date = new Date(date);
    return daysOfWeek[date.getDay()].shortAbbreviation;
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

  self.convertToTimeEntries = function(enteredTimes) {
    var timeEntries = [];
    self.mapKeys(enteredTimes).forEach(function(key) {
      timeEntries.push({
        timeEntryId: parseFloat(key),
        hours: enteredTimes[key].hours
      });
    });
    return timeEntries;
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
