var TimesheetUtil = (function() {
  var self = {};

  self.collateDays = function(timeEntryPositionInfo, positionOrder) {
    var detectedDays = {};
    var timeEntryLookup = {};
    timeEntryPositionInfo.forEach(function(infoEntry) {
      timeEntryLookup[infoEntry.position.id] = infoEntry.timeEntries;
      infoEntry.timeEntries.forEach(function(timeEntry) {
        detectedDays[timeEntry.date] = 1;
      });
    });
    var allDays = self.mapKeys(detectedDays);

    var daysEntries = {};

    function fetchDayEntry(date) {
      var dayEntry = daysEntries[date];
      if (dayEntry === undefined) {
        dayEntry = [];
        daysEntries[date] = dayEntry;
      }
      return dayEntry;
    }

    positionOrder.forEach(function(positionInfo) {
      var allTimeEntries = timeEntryLookup[positionInfo.id];
      var processedDays = {};
      allTimeEntries.forEach(function(timeEntry) {
        processedDays[timeEntry.date] = 1;
        var dayEntry = fetchDayEntry(timeEntry.date);
        dayEntry.push({
          id: timeEntry.id,
          date: timeEntry.date,
          hours: timeEntry.hours,
          projectedHours: timeEntry.projectedHours,
          position: {
            id: positionInfo.id,
            name: positionInfo.name,
            note: positionInfo.note,
            projectName: positionInfo.projectName
          }
        });
      });
      allDays.forEach(function(day) {
        if (!processedDays[day]) {
          var dayEntry = fetchDayEntry(day);
          dayEntry.push({
            id: "placeholder_" + positionInfo.id + "_" + self.formatDateYYYYMMDD(day),
            date: day,
            hours: 0,
            projectedHours: 0,
            position: {
              id: positionInfo.id,
              name: positionInfo.name,
              note: positionInfo.note,
              projectName: positionInfo.projectName
            }
          });
        }
      });
      delete timeEntryLookup[positionInfo.id]; // remove processed time entries from lookup to facilitate placeholder processing
    });
    self.mapKeys(timeEntryLookup).forEach(function(positionId) {
      var timeEntries = timeEntryLookup[positionId];
      var processedDays = {};
      timeEntries.forEach(function(timeEntry) {
        processedDays[timeEntry.date] = 1;
        var dayEntry = fetchDayEntry(timeEntry.date);
        dayEntry.push({
          id: timeEntry.id,
          date: timeEntry.date,
          hours: timeEntry.hours,
          projectedHours: timeEntry.projectedHours,
          position: {
            id: positionId,
            name: "(unrecognized)",
            note: '',
            projectName: "(unrecognized)"
          }
        });
      });
      allDays.forEach(function(day) {
        if (!processedDays[day]) {
          var dayEntry = fetchDayEntry(day);
          dayEntry.push({
            id: "placeholder_" + positionId + "_" + self.formatDateYYYYMMDD(day),
            date: day,
            hours: 0,
            projectedHours: 0,
            position: {
              id: positionId,
              name: "(unrecognized)",
              note: '',
              projectName: "(unrecognized)"
            }
          });
        }
      });
    });

    return daysEntries;
  };

  self.collatePositions = function(timeEntryPositionInfo) {
    var positions = [];
    timeEntryPositionInfo.forEach(function(infoEntry) {
      var position = infoEntry.position ? infoEntry.position : {};
      var project = infoEntry.position.project ? infoEntry.position.project : {};
      positions.push({
        id: position.id,
        name: position.name,
        note: position.note,
        projectName: project.name
      });
    });
    positions.sort(positionComparator);
    return positions;
  };

  function positionComparator(a, b) {
    var sortOrder = ["projectName", "name", "note"];
    for (var i = 0; i < sortOrder.length; i++) {
      var result = a[sortOrder[i]].localeCompare(b[sortOrder[i]]);
      if (result) {
        return result;
      }
    }
    return 0;
  }

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

  self.formatDateMDDYY = function(date) {
    var date = new Date(date);
    var year = "" + date.getFullYear();
    year = year.substring(year.length - 2);
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + year;
  }

  self.formatDateYYYYMMDD = function(date) {
    var date = new Date(date);
    return "" + date.getFullYear() + "-" + pad(date.getMonth() + 1, 2) + "-" + pad(date.getDate(), 2);
  };

  function pad(number, minDigits) {
    var numberAsString = "" + number;
    return ("0000000000" + numberAsString).slice(-Math.max(numberAsString.length, minDigits));
  }

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
    var aggregatedTimes = {
      days: {},
      positions: {}
    };
    var totalTime = 0.0;
    self.mapKeys(enteredTimes).forEach(function(key) {
      var entry = enteredTimes[key];
      var aggregatedTimeForDay = aggregatedTimes.days[entry.date] ? aggregatedTimes.days[entry.date] : 0.0;
      aggregatedTimes.days[entry.date] = aggregatedTimeForDay + entry.hours;
      var aggregatedTimeForPosition = aggregatedTimes.positions[entry.position] ? aggregatedTimes.positions[entry.position] : 0.0;
      aggregatedTimes.positions[entry.position] = aggregatedTimeForPosition + entry.hours;
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
