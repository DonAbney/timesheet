var TimesheetView = (function() {
  var self = {};

  var construct = {
    css: {
      classNames: {
        timesheetInfo: '',
        days: 'row small-up-1 medium-up-1 large-up-8',
        positions: 'column',
        position: '',
        day: 'column',
        dayHeader: '',
        dayTotal: '',
        timeEntries: '',
        timeEntry: '',
        positionLabel: '',
        timeEntryField: '',
        placeholderTimeEntryField: ''
      },
      styles: {
        timesheetInfo: {
          display: 'none'
        },
        timeEntries: {
          display: 'none'
        }
      }
    }
  };

  construct.css.classNamesForElement = function(elementName) {
    var otherClassNames = construct.css.classNames[elementName] ? (' ' + construct.css.classNames[elementName]) : '';
    return elementName + otherClassNames;
  };

  construct.configureElementStyle = function(elementName, element) {
    element.className = construct.css.classNamesForElement(elementName);
    if (construct.css.styles[elementName]) {
      for (styleName in construct.css.styles[elementName]) {
        element.style[styleName] = construct.css.styles[elementName][styleName];
      };
    }
  };

  self.displayTimesheetInfo = function(username, timesheetInfo) {
    clearOldInformation();
    self.updateUsername(username);
    constructTimesheetInfoEntry(username, timesheetInfo.timesheetInstance);
    var positions = TimesheetUtil.collatePositions(timesheetInfo.timeEntryPositionMapByDate);
    var daysEntries = TimesheetUtil.collateDays(timesheetInfo.timeEntryPositionMapByDate, positions);
    displayDaysAndPositions(daysEntries, positions);
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
    construct.configureElementStyle("day", dayElement);
    dayElement.setAttribute('data-date', date);
    return dayElement;
  }

  function constructDayHeader(date) {
    var dayHeader = document.createElement("div");
    construct.configureElementStyle("dayHeader", dayHeader);
    dayHeader.innerHTML = TimesheetUtil.formatDate(date) + "<span class='" + construct.css.classNamesForElement('dayTotal') + "' data-date='" + date + "'>0</span>";
    dayHeader.setAttribute('onclick', '$(this).siblings(".timeEntries").toggle()');
    return dayHeader;
  }

  function constructPositionLabel(entry) {
    var positionLabel = document.createElement("label");
    construct.configureElementStyle('positionLabel', positionLabel);
    var note = entry.position.note ? ": " + entry.position.note.trim() : "";
    positionLabel.setAttribute('for', entry.id);
    positionLabel.innerHTML = entry.position.name.trim() + note;
    return positionLabel;
  }

  function constructTimeEntryField(entry) {
    var field = document.createElement("input");
    field.id = entry.id;
    if (!$.isNumeric(entry.id) && entry.id.startsWith('placeholder')) {
      field.disabled = true;
      construct.configureElementStyle('placeholderTimeEntryField', field);
    } else {
      construct.configureElementStyle("timeEntryField", field);
    }
    field.setAttribute('data-date', entry.date);
    field.setAttribute('data-last-saved-value', entry.hours);
    field.setAttribute('type', 'number');
    field.value = entry.hours;
    setupUpdatePageOnStateChangeTrigger(field);
    return field;
  }

  function constructTimeEntry(entry) {
    var timeEntry = document.createElement("div");
    construct.configureElementStyle("timeEntry", timeEntry);
    timeEntry.setAttribute('data-date', entry.date);
    var positionLabel = constructPositionLabel(entry);
    var field = constructTimeEntryField(entry);
    timeEntry.insertAdjacentElement('afterbegin', positionLabel);
    timeEntry.insertAdjacentElement('beforeend', field);
    return timeEntry;
  }

  function constructTimeEntries(dayEntries, date) {
    var timeEntriesWrapper = document.createElement("div");
    construct.configureElementStyle("timeEntries", timeEntriesWrapper);
    timeEntriesWrapper.setAttribute('data-date', date);
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

  function constructPositionElement(position) {
    var positionElement = document.createElement('div');
    construct.configureElementStyle('position', positionElement);
    var note = position.note ? ": " + position.note.trim() : "";
    positionElement.innerHTML = position.name.trim() + note;
    return positionElement;
  }

  function constructPositionsElement(positions) {
    var positionsElement = document.createElement('div');
    construct.configureElementStyle("positions", positionsElement);
    positions.forEach(function(position) {
      positionsElement.insertAdjacentElement('beforeend', constructPositionElement(position));
    });
    return positionsElement;
  }

  function constructDaysElement(daysEntries, positions) {
    var daysElement = document.createElement('div');
    construct.configureElementStyle("days", daysElement);
    daysElement.insertAdjacentElement('afterbegin', constructPositionsElement(positions));
    var sortedDates = TimesheetUtil.sortDaysEntryDates(daysEntries);
    sortedDates.forEach(function(date) {
      daysElement.insertAdjacentElement('beforeend', constructDayElement(daysEntries[date], date));
    });
    return daysElement;
  }

  function displayDaysAndPositions(daysEntries, positions) {
    var generatedWrapper = $('.wrapper-generatedView');
    generatedWrapper.append(constructDaysElement(daysEntries, positions));
  }

  function constructTimesheetInfoEntry(username, timesheetInstance) {
    var generatedWrapper = $('.wrapper-generatedView');
    var timesheetInfoEntry = document.createElement('div');
    construct.configureElementStyle('timesheetInfo', timesheetInfoEntry);
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
