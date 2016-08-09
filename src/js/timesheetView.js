var TimesheetView = (function() {
  var self = {};

  var construct = {
    css: {
      classNames: {
        timesheetInfo: '',
        tableArea: 'row expanded',
        positions: 'large-3 columns',
        positionHeader: '',
        position: '',
        positionFooter: '',
        daysArea: 'small-12 large-8 columns',
        days: 'row expanded small-up-1 medium-up-1 large-up-7 collapse',
        day: 'column',
        dayHeader: '',
        dayName: '',
        dayAbbreviation: '',
        dayShortAbbreviation: '',
        dayAndMonth: '',
        dayTotal: '',
        dayFooter: '',
        timeEntries: '',
        timeEntry: '',
        positionLabel: '',
        timeEntryField: '',
        placeholderTimeEntryField: '',
        positionTotals: 'large-1 columns',
        positionTotalsHeader: '',
        positionTotal: '',
        positionTotalsFooter: '',
        weekTotal: '',
        buttonArea: 'row expanded',
        saveChanges: 'small-12 large-4 columns',
        validateTimesheet: 'small-12 large-4 columns'
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

  construct.css.classNamesForElement = function(elementName, extraClasses) {
    var otherClassNames = construct.css.classNames[elementName] ? (' ' + construct.css.classNames[elementName]) : '';
    if (extraClasses) {
      extraClasses.forEach(function(extraClass) { otherClassNames += ' ' + extraClass; });
    }
    return elementName + otherClassNames;
  };

  construct.configureElementStyle = function(elementName, element, extraClasses) {
    element.className = construct.css.classNamesForElement(elementName, extraClasses);
    if (construct.css.styles[elementName]) {
      for (styleName in construct.css.styles[elementName]) {
        element.style[styleName] = construct.css.styles[elementName][styleName];
      };
    }
  };

  self.displayTimesheetInfo = function(userInfo, timesheetInfo) {
    self.clearOldInformation();
    self.updateUsername(userInfo.fullName);
    updateDisplayedStartDate(timesheetInfo.timesheetInstance.startDate);
    updateDisplayedEndDate(timesheetInfo.timesheetInstance.endDate);
    constructTimesheetInfoEntry(userInfo, timesheetInfo.timesheetInstance);
    var positions = TimesheetUtil.collatePositions(timesheetInfo.timeEntryPositionMapByDate);
    var daysEntries = TimesheetUtil.collateDays(timesheetInfo.timeEntryPositionMapByDate, positions);
    displayDaysAndPositions(daysEntries, positions);
    displayButtonArea();
    adjustValidatedIndicator(timesheetInfo.timesheetInstance.validated);
    updatePageOnStateChange();
    self.windowSizeChanged();
  };

  self.updateUsername = function(name) {
    $(".username").text(name);
  };

  function updateDisplayedStartDate(date) {
    $('.timesheet-startDate').text(TimesheetUtil.formatDateMDDYY(date));
  }

  function updateDisplayedEndDate(date) {
    $('.timesheet-endDate').text(TimesheetUtil.formatDateMDDYY(date));
  }

  function floatValueChanged(f1, f2) {
    return (Math.abs(f1 - f2) > 0.001);
  }

  function parseFloatOrElse(stringValue, defaultValue) {
    return stringValue ? parseFloat(stringValue) : defaultValue;
  }

  self.collectEnteredTime = function(shouldCollectAllTime) {
    var collectedEnteredTime = {};
    $(".timeEntryField").each(function(index, element) {
      var enteredHours = parseFloatOrElse($(element).val(), 0.0);
      var lastSavedHours = parseFloatOrElse(element.getAttribute('data-last-saved-value'), 0.0);
      if (shouldCollectAllTime || floatValueChanged(enteredHours, lastSavedHours)) {
        collectedEnteredTime[element.id] = {
          id: element.id,
          date: element.getAttribute('data-date'),
          'last-saved-hours': lastSavedHours,
          hours: enteredHours,
          position: element.getAttribute('data-position')
        };
      }
    });
    return collectedEnteredTime;
  };

  self.collectTimesheetInfo = function() {
    var timesheetInfoElement = $('.timesheetInfo');
    var stringTimesheetId = timesheetInfoElement.attr('data-timesheetId');
    var username = timesheetInfoElement.attr('data-username');
    var startDate = timesheetInfoElement.attr('data-startDate');
    var endDate = timesheetInfoElement.attr('data-endDate');
    var fullName = timesheetInfoElement.attr('data-fullName');
    var givenName = timesheetInfoElement.attr('data-givenName');
    var familyName = timesheetInfoElement.attr('data-familyName');
    var emailAddress = timesheetInfoElement.attr('data-emailAddress');
    var imageUrl = timesheetInfoElement.attr('data-imageUrl');
    return {
      'id': stringTimesheetId ? parseFloat(stringTimesheetId) : 0.0,
      'startDate': startDate ? startDate : "",
      'endDate': endDate ? endDate : "",
      'userInfo': {
        'username': username ? username : "",
        'fullName': fullName ? fullName : "",
        'givenName': givenName ? givenName : "",
        'familyName': familyName ? familyName : "",
        'emailAddress': emailAddress ? emailAddress : "",
        'imageUrl': imageUrl ? imageUrl : ""
      }
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
    var collectedEnteredTime = self.collectEnteredTime(true);
    recalculateTotals(collectedEnteredTime);
    var hasEnteredTimeChanged = TimesheetUtil.hasEnteredTimeChanged(collectedEnteredTime);
    adjustStateChangeIndicator(hasEnteredTimeChanged);
    adjustSaveChangesButton(hasEnteredTimeChanged);
    adjustValidateTimesheetButton(hasEnteredTimeChanged);
  };

  function recalculateTotals(collectedEnteredTime) {
    var aggregatedTimes = TimesheetUtil.aggregateTime(collectedEnteredTime);
    $(".weekTotal").text(aggregatedTimes.totalTime);
    TimesheetUtil.mapKeys(aggregatedTimes.days).forEach(function(key) {
      $(".dayTotal[data-date='" + key + "']").text(aggregatedTimes.days[key]);
    });
    TimesheetUtil.mapKeys(aggregatedTimes.positions).forEach(function(key) {
      $(".positionTotal[data-position='" + key + "']").text(aggregatedTimes.positions[key]);
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

  function updatePositionHeaderHeight() {
    $('.positionHeader').height($('.dayHeader:eq(0)').height());
  }

  self.windowSizeChanged = function() {
    updatePositionHeaderHeight();
  }

  function cssClassForDayOfWeek(date) {
    return TimesheetUtil.weekdayForDate(date).toLowerCase();
  }

  function constructDayWrapper(date) {
    var dayElement = document.createElement("div");
    construct.configureElementStyle("day", dayElement, [cssClassForDayOfWeek(date)]);
    dayElement.setAttribute('data-date', date);
    return dayElement;
  }

  function constructDayName(date) {
    var dayName = document.createElement('div');
    construct.configureElementStyle('dayName', dayName);
    dayName.innerHTML = TimesheetUtil.weekdayForDate(date);
    return dayName;
  }

  function constructDayAbbreviation(date) {
    var dayAbbreviation = document.createElement('div');
    construct.configureElementStyle('dayAbbreviation', dayAbbreviation);
    dayAbbreviation.innerHTML = TimesheetUtil.weekdayAbbreviationForDate(date);
    return dayAbbreviation;
  }

  function constructDayShortAbbreviation(date) {
    var dayShortAbbreviation = document.createElement('div');
    construct.configureElementStyle('dayShortAbbreviation', dayShortAbbreviation);
    dayShortAbbreviation.innerHTML = TimesheetUtil.weekdayShortAbbreviationForDate(date);
    return dayShortAbbreviation;
  }

  function constructDayAndMonth(date) {
    var dayAndMonth = document.createElement('div');
    construct.configureElementStyle('dayAndMonth', dayAndMonth);
    dayAndMonth.innerHTML = TimesheetUtil.formatDateMDD(date);
    return dayAndMonth;
  }

  function constructDayTotal(date) {
    var dayTotal = document.createElement('div');
    construct.configureElementStyle('dayTotal', dayTotal);
    dayTotal.innerHTML = '0';
    dayTotal.setAttribute('data-date', date);
    return dayTotal;
  }

  function constructDayHeader(date) {
    var dayHeader = document.createElement("div");
    construct.configureElementStyle("dayHeader", dayHeader, [cssClassForDayOfWeek(date)]);
    dayHeader.insertAdjacentElement('beforeend', constructDayName(date));
    dayHeader.insertAdjacentElement('beforeend', constructDayAbbreviation(date));
    dayHeader.insertAdjacentElement('beforeend', constructDayShortAbbreviation(date));
    dayHeader.insertAdjacentElement('beforeend', constructDayAndMonth(date));
    dayHeader.insertAdjacentElement('beforeend', constructDayTotal(date));
    dayHeader.setAttribute('onclick', '$(this).siblings(".timeEntries").toggle()');
    return dayHeader;
  }

  function constructDayFooter(date) {
    var dayFooter = document.createElement('div');
    construct.configureElementStyle('dayFooter', dayFooter, [cssClassForDayOfWeek(date)]);
    dayFooter.insertAdjacentElement('beforeEnd', constructDayTotal(date));
    return dayFooter;
  }

  function constructPositionLabel(entry, position) {
    var positionLabel = document.createElement("label");
    construct.configureElementStyle('positionLabel', positionLabel, [cssClassForDayOfWeek(entry.date)]);
    positionLabel.setAttribute('for', entry.id);
    positionLabel.innerHTML = position.projectName.trim();
    return positionLabel;
  }

  function constructTimeEntryField(entry) {
    var field = document.createElement("input");
    field.id = entry.id;
    if (!$.isNumeric(entry.id) && entry.id.startsWith('placeholder')) {
      field.disabled = true;
      construct.configureElementStyle('placeholderTimeEntryField', field, [cssClassForDayOfWeek(entry.date)]);
    } else {
      construct.configureElementStyle("timeEntryField", field, [cssClassForDayOfWeek(entry.date)]);
    }
    field.setAttribute('data-date', entry.date);
    field.setAttribute('data-last-saved-value', entry.hours);
    field.setAttribute('data-position', entry.position.id);
    field.setAttribute('type', 'number');
    field.value = entry.hours;
    setupUpdatePageOnStateChangeTrigger(field);
    return field;
  }

  function constructTimeEntry(entry, position) {
    var timeEntry = document.createElement("div");
    construct.configureElementStyle("timeEntry", timeEntry, [cssClassForDayOfWeek(entry.date)]);
    timeEntry.setAttribute('data-date', entry.date);
    var positionLabel = constructPositionLabel(entry, position);
    var field = constructTimeEntryField(entry);
    timeEntry.insertAdjacentElement('afterbegin', positionLabel);
    timeEntry.insertAdjacentElement('beforeend', field);
    return timeEntry;
  }

  function constructTimeEntries(dayEntries, date, positions) {
    var timeEntriesWrapper = document.createElement("div");
    construct.configureElementStyle("timeEntries", timeEntriesWrapper, [cssClassForDayOfWeek(date)]);
    timeEntriesWrapper.setAttribute('data-date', date);

    var positionInfoLookup = {};
    positions.forEach(function(info) {
      positionInfoLookup[info.id] = info;
    });

    function fetchPositionInfo(positionId) {
      var unrecognizedValue = {
        "id": positionId,
        "name": "(unrecognized)",
        "projectName": "(unrecognized)"
      };
      return positionInfoLookup[positionId] ? positionInfoLookup[positionId] : unrecognizedValue;
    }

    dayEntries.forEach(function(entry) {
      timeEntriesWrapper.insertAdjacentElement('beforeend', constructTimeEntry(entry, fetchPositionInfo(entry.position.id)));
    });
    return timeEntriesWrapper;
  }

  function constructDayElement(dayEntries, date, positions) {
    var dayElement = constructDayWrapper(date);
    dayElement.insertAdjacentElement('afterbegin', constructDayHeader(date));
    dayElement.insertAdjacentElement('beforeend', constructTimeEntries(dayEntries, date, positions));
    dayElement.insertAdjacentElement('beforeend', constructDayFooter(date));
    return dayElement;
  }

  function constructPositionTotalElement(position) {
    var positionTotal = document.createElement('div');
    construct.configureElementStyle('positionTotal', positionTotal);
    positionTotal.setAttribute('data-position', position.id);
    return positionTotal;
  }

  function constructPositionTotalsHeaderElement() {
    var positionTotalsHeader = document.createElement('div');
    construct.configureElementStyle('positionTotalsHeader', positionTotalsHeader);
    positionTotalsHeader.innerHTML = "Totals";
    return positionTotalsHeader;
  }

  function constructWeekTotalElement() {
    var weeklyTotal = document.createElement('div');
    construct.configureElementStyle('weekTotal', weeklyTotal);
    return weeklyTotal;
  }

  function constructPositionTotalsFooterElement() {
    var positionTotalsFooter = document.createElement('div');
    construct.configureElementStyle('positionTotalsFooter', positionTotalsFooter);
    positionTotalsFooter.insertAdjacentElement('beforeend', constructWeekTotalElement());
    return positionTotalsFooter;
  }

  function constructPositionTotalsElement(positions) {
    var positionTotals = document.createElement('div');
    construct.configureElementStyle('positionTotals', positionTotals);
    positionTotals.insertAdjacentElement('afterbegin', constructPositionTotalsHeaderElement());
    positions.forEach(function(position) {
      positionTotals.insertAdjacentElement('beforeend', constructPositionTotalElement(position));
    });
    positionTotals.insertAdjacentElement('beforeend', constructPositionTotalsFooterElement());
    return positionTotals;
  }

  function constructPositionElement(position) {
    var positionElement = document.createElement('div');
    construct.configureElementStyle('position', positionElement);
    positionElement.innerHTML = position.projectName.trim();
    return positionElement;
  }

  function constructPositionHeaderElement() {
    var positionHeaderElement = document.createElement('div');
    construct.configureElementStyle('positionHeader', positionHeaderElement);
    return positionHeaderElement;
  }

  function constructPositionFooterElement() {
    var positionFooterElement = document.createElement('div');
    construct.configureElementStyle('positionFooter', positionFooterElement);
    positionFooterElement.innerHTML = "Totals";
    return positionFooterElement;
  }

  function constructPositionsElement(positions) {
    var positionsElement = document.createElement('div');
    construct.configureElementStyle("positions", positionsElement);
    positionsElement.insertAdjacentElement('afterbegin', constructPositionHeaderElement());
    positions.forEach(function(position) {
      positionsElement.insertAdjacentElement('beforeend', constructPositionElement(position));
    });
    positionsElement.insertAdjacentElement('beforeend', constructPositionFooterElement());
    return positionsElement;
  }

  function constructDaysElement(daysEntries, positions) {
    var daysElement = document.createElement('div');
    construct.configureElementStyle("days", daysElement);
    var sortedDates = TimesheetUtil.sortDaysEntryDates(daysEntries);
    sortedDates.forEach(function(date) {
      daysElement.insertAdjacentElement('beforeend', constructDayElement(daysEntries[date], date, positions));
    });
    return daysElement;
  }

  function constructDaysArea(daysEntries, positions) {
    var daysArea = document.createElement('div');
    construct.configureElementStyle('daysArea', daysArea);
    daysArea.insertAdjacentElement('beforeend', constructDaysElement(daysEntries, positions));
    return daysArea;
  }

  function constructTableArea(daysEntries, positions) {
    var tableAreaElement = document.createElement('div');
    construct.configureElementStyle('tableArea', tableAreaElement);
    tableAreaElement.insertAdjacentElement('beforeend', constructPositionsElement(positions));
    tableAreaElement.insertAdjacentElement('beforeend', constructDaysArea(daysEntries, positions));
    tableAreaElement.insertAdjacentElement('beforeend', constructPositionTotalsElement(positions));
    return tableAreaElement;
  }

  function displayDaysAndPositions(daysEntries, positions) {
    var generatedWrapper = $('.wrapper-generatedView');
    generatedWrapper.append(constructTableArea(daysEntries, positions));
  }

  function constructTimesheetInfoEntry(userInfo, timesheetInstance) {
    var generatedWrapper = $('.wrapper-generatedView');
    var timesheetInfoEntry = document.createElement('div');
    construct.configureElementStyle('timesheetInfo', timesheetInfoEntry);
    timesheetInfoEntry.setAttribute('data-timesheetId', timesheetInstance.id);
    timesheetInfoEntry.setAttribute('data-username', userInfo.username);
    timesheetInfoEntry.setAttribute('data-fullName', userInfo.fullName);
    timesheetInfoEntry.setAttribute('data-givenName', userInfo.givenName);
    timesheetInfoEntry.setAttribute('data-familyName', userInfo.familyName);
    timesheetInfoEntry.setAttribute('data-emailAddress', userInfo.emailAddress);
    timesheetInfoEntry.setAttribute('data-imageUrl', userInfo.imageUrl);
    timesheetInfoEntry.setAttribute('data-startDate', timesheetInstance.startDate);
    timesheetInfoEntry.setAttribute('data-endDate', timesheetInstance.endDate);
    timesheetInfoEntry.setAttribute('data-validated', timesheetInstance.validated);
    generatedWrapper.append(timesheetInfoEntry);
  }

  function constructSaveChangesButton() {
    var button = document.createElement('button');
    construct.configureElementStyle('saveChanges', button);
    button.setAttribute('type', 'button');
    button.innerHTML = "Save Changes";
    return button;
  }

  function constructValidateTimesheetButton() {
    var button = document.createElement('button');
    construct.configureElementStyle('validateTimesheet', button);
    button.setAttribute('type', 'button');
    button.innerHTML = "Validate Timesheet";
    return button;
  }

  function displayButtonArea() {
    var generatedWrapper = $('.wrapper-generatedView');
    var buttonArea = document.createElement('div');
    construct.configureElementStyle('buttonArea', buttonArea);
    buttonArea.insertAdjacentElement('beforeend', constructSaveChangesButton());
    buttonArea.insertAdjacentElement('beforeend', constructValidateTimesheetButton());
    generatedWrapper.append(buttonArea);
    $('.saveChanges').click(TimesheetCommunication.sendSaveTimesheet);
    $('.validateTimesheet').click(TimesheetCommunication.sendValidateTimesheet);
  }

  self.clearOldInformation = function() {
    var generatedWrapper = $('.wrapper-generatedView');
    generatedWrapper.empty();
    $('.stateChangeIndicator').hide();
    $('.validatedIndicator').hide();
    $('.username').text('not signed in');
    $('.weekTotal').text('0');
    $('.timesheet-startDate').text('no timesheet selected');
    $('.timesheet-endDate').text('');
  }

  self.showAuthenticationArea = function() {
    $('#authentication').show();
    $('#authenticated').hide();
    $('#dateSelection').hide();
    $('.summaryStatus').hide();
    $('#watermark').show();
  }

  self.hideAuthenticationArea = function() {
    $('#authentication').hide();
    $('#authenticated').show();
    $('#dateSelection').show();
    $('.summaryStatus').show();
    $('#watermark').hide();
  }

  self.registerPageListeners = function() {
    $(window).resize(TimesheetView.windowSizeChanged);
  }

  return self;
})();
