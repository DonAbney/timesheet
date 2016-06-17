var TimesheetView = (function() {
  var self = {};

  self.displayTimesheetInfo = function(username, timesheetInfo) {
    clearOldInformation();
    self.updateUsername(username);
    constructTimesheetInfoEntry(username, timesheetInfo.timesheetInstance);
    var daysEntries = TimesheetUtil.collateDays(timesheetInfo.timeEntryPositionMapByDate);
    displayDays(daysEntries);
    adjustValidatedIndicator(timesheetInfo.timesheetInstance.validated);
    updatePageOnStateChange();
  };

  self.updateUsername = function(name) {
    $(".username").text(name);
  };

  self.collectEnteredTime = function() {
    var collectedEnteredTime = {};
    $(".timeEntryField").each(function(index, element) {
      var enteredHours = $(element).val();
      var lastSavedHours = element.getAttribute('data-last-saved-value');
      collectedEnteredTime[element.id] = {
        id: element.id,
        date: element.getAttribute('data-date'),
        'last-saved-hours': lastSavedHours ? parseFloat(lastSavedHours) : 0.0,
        hours: enteredHours ? parseFloat(enteredHours) : 0.0
      };
    });
    return collectedEnteredTime;
  };

  self.collectTimesheetInfo = function() {
    var stringTimesheetId = $('.timesheetInfo').attr('data-timesheetId');
    var username = $('.timesheetInfo').attr('data-username');
    var startDate = $('.timesheetInfo').attr('data-startDate');
    return {
      'id': stringTimesheetId ? parseFloat(stringTimesheetId) : 0.0,
      'username': username ? username : "",
      'startDate': startDate ? startDate : ""
    };
  }

  function adjustValidatedIndicator(state) {
    if (state) {
      $('.validatedIndicator').show();
      $('.timeEntryField').prop('disabled', true);
      $('.saveChanges').prop('disabled', true);
      $('.validateTimesheet').prop('disabled', true);
    } else {
      $('.validatedIndicator').hide();
      $('.timeEntryField').prop('disabled', false);
      $('.saveChanges').prop('disabled', false);
      $('.validateTimesheet').prop('disabled', false);
    }
  }

  function updatePageOnStateChange() {
    var collectedEnteredTime = self.collectEnteredTime();
    recalculateTotals(collectedEnteredTime);
    var hasEnteredTimeChanged = TimesheetUtil.hasEnteredTimeChanged(collectedEnteredTime);
    adjustStateChangeIndicator(hasEnteredTimeChanged);
    adjustSaveChangesButton(hasEnteredTimeChanged);
    adjustValidateTimesheetButton(hasEnteredTimeChanged);
  };

  function recalculateTotals(collectedEnteredTime) {
    var aggregatedTimes = TimesheetUtil.aggregateTime(collectedEnteredTime);
    TimesheetUtil.mapKeys(aggregatedTimes).forEach(function(key) {
      if (key === "totalTime") {
        $(".weekTotal").text(aggregatedTimes.totalTime);
      } else {
        $(".dayTotal[data-date='" + key + "']").text(aggregatedTimes[key]);
      }
    });
  }

  function adjustStateChangeIndicator(hasEnteredTimeChanged) {
    if (hasEnteredTimeChanged) {
      $('.stateChangeIndicator').show();
    } else {
      $('.stateChangeIndicator').hide();
    }
  }

  function adjustSaveChangesButton(hasEnteredTimeChanged) {
    if (hasEnteredTimeChanged) {
      $('.saveChanges').show();
    } else {
      $('.saveChanges').hide();
    }
  }

  function adjustValidateTimesheetButton(hasEnteredTimeChanged) {
    if (hasEnteredTimeChanged) {
      $('.validateTimesheet').hide();
    } else {
      $('.validateTimesheet').show();
    }
  }

  function setupUpdatePageOnStateChangeTrigger(element) {
    $(element).change(updatePageOnStateChange);
  }

  function constructDayWrapper(date) {
    var dayElement = document.createElement("div");
    dayElement.className = "day";
    dayElement.setAttribute('data-date', date);
    return dayElement;
  }

  function constructDayHeader(date) {
    var dayHeader = document.createElement("h2");
    dayHeader.innerHTML = TimesheetUtil.formatDate(date) + " (<span class='dayTotal' data-date='" + date + "'>0</span> hrs)";
    dayHeader.setAttribute('onclick', '$(this).siblings(".timeEntries").toggle()');
    return dayHeader;
  }

  function constructPositionLabel(entry) {
    var positionLabel = document.createElement("label");
    var note = entry.positionNote ? ": " + entry.positionNote.trim() : "";
    positionLabel.setAttribute('for', entry.id);
    positionLabel.innerHTML = entry.positionName.trim() + note;
    return positionLabel;
  }

  function constructTimeEntryField(entry) {
    var field = document.createElement("input");
    field.id = entry.id;
    field.className = "timeEntryField";
    field.setAttribute('data-date', entry.date);
    field.setAttribute('data-last-saved-value', entry.hours);
    field.setAttribute('type', 'number');
    field.value = entry.hours;
    setupUpdatePageOnStateChangeTrigger(field);
    return field;
  }

  function constructTimeEntry(entry) {
    var timeEntry = document.createElement("div");
    timeEntry.className = "timeEntry";
    timeEntry.setAttribute('data-date', entry.date);
    var positionLabel = constructPositionLabel(entry);
    var field = constructTimeEntryField(entry);
    timeEntry.insertAdjacentElement('afterbegin', positionLabel);
    timeEntry.insertAdjacentElement('beforeend', field);
    return timeEntry;
  }

  function constructTimeEntries(dayEntries, date) {
    var timeEntriesWrapper = document.createElement("div");
    timeEntriesWrapper.className = "timeEntries";
    timeEntriesWrapper.setAttribute('data-date', date);
    timeEntriesWrapper.style.display = 'none';
    dayEntries.forEach(function(entry) {
      timeEntriesWrapper.insertAdjacentElement('beforeend', constructTimeEntry(entry));
    });
    return timeEntriesWrapper;
  }

  function constructDayElement(dayEntries, date) {
    var dayElement = constructDayWrapper(date);
    dayElement.insertAdjacentElement('afterbegin', constructDayHeader(date));
    dayElement.insertAdjacentElement('beforeend', constructTimeEntries(dayEntries, date));
    return dayElement;
  }

  function constructDaysElement(daysEntries) {
    var daysElement = document.createElement('div');
    daysElement.className = "days";
    var sortedDates = TimesheetUtil.sortDaysEntryDates(daysEntries);
    sortedDates.forEach(function(date) {
      daysElement.insertAdjacentElement('beforeend', constructDayElement(daysEntries[date], date));
    });
    return daysElement;
  }

  function displayDays(daysEntries) {
    var generatedWrapper = $('.wrapper-generatedView');
    generatedWrapper.append(constructDaysElement(daysEntries));
  }

  function constructTimesheetInfoEntry(username, timesheetInstance) {
    var generatedWrapper = $('.wrapper-generatedView');
    var timesheetInfoEntry = document.createElement('div');
    timesheetInfoEntry.className = 'timesheetInfo';
    timesheetInfoEntry.setAttribute('data-timesheetId', timesheetInstance.id);
    timesheetInfoEntry.setAttribute('data-username', username);
    timesheetInfoEntry.setAttribute('data-startDate', timesheetInstance.startDate);
    timesheetInfoEntry.setAttribute('data-validated', timesheetInstance.validated);
    generatedWrapper.append(timesheetInfoEntry);
  }

  function clearOldInformation() {
    var generatedWrapper = $('.wrapper-generatedView');
    generatedWrapper.empty();
  }

  return self;
})();
