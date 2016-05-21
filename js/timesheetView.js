var TimesheetView = (function() {
  var self = {};

  self.displayTimesheetInfo = function(timesheetInfo) {
    // TODO replace with actual user's name instead of ID
    var username = timesheetInfo.timesheetInstance.employee.id;
    self.updateUsername(username);
    var daysEntries = TimesheetUtil.collateDays(timesheetInfo.timeEntryPositionMapByDate);
    displayDays(daysEntries);
  }

  self.updateUsername = function(name) {
    $(".username").text(name);
  }

  function displayDays(daysEntries) {
    function constructDayElement(dayEntries, date) {
      function constructDayWrapper() {
        var dayElement = document.createElement("div");
        dayElement.className = "day";
        return dayElement;
      }

      function formatDate(date) {
        return date.split("T")[0];
      }

      function constructDayHeader(date) {
        var dayHeader = document.createElement("h2");
        dayHeader.innerHTML = formatDate(date) + " (<span class='dayTotal'>0</span> hrs)";
        dayHeader.setAttribute('onclick', '$(this).siblings(".timeEntries").toggle()');
        return dayHeader;
      }

      function constructPositionLabel(entry) {
        var positionLabel = document.createElement("label");
        var note = entry.positionNote ? ": " + entry.positionNote.trim() : "";
        positionLabel.innerHTML = entry.positionName.trim() + note;
        return positionLabel;
      }

      function constructTimeEntryField(entry) {
        var field = document.createElement("input");
        field.id = entry.id;
        field.setAttribute('type', 'number');
        return field;
      }

      function constructTimeEntry(entry) {
        var timeEntry = document.createElement("div");
        timeEntry.className = "timeEntry";
        var positionLabel = constructPositionLabel(entry);
        var field = constructTimeEntryField(entry);
        positionLabel.insertAdjacentElement('beforeEnd', field);
        timeEntry.insertAdjacentElement('afterbegin', positionLabel);
        return timeEntry;
      }

      function constructTimeEntries(dayEntries) {
        var timeEntriesWrapper = document.createElement("div");
        timeEntriesWrapper.className = "timeEntries";
        timeEntriesWrapper.style.display = 'none';
        dayEntries.forEach(function(entry) {
          timeEntriesWrapper.insertAdjacentElement('beforeend', constructTimeEntry(entry));
        });
        return timeEntriesWrapper;
      }

      var dayElement = constructDayWrapper();
      dayElement.insertAdjacentElement('afterbegin', constructDayHeader(date));
      dayElement.insertAdjacentElement('beforeend', constructTimeEntries(dayEntries));
      return dayElement;
    }

    var daysElement = $(".days");
    var sortedDates = TimesheetUtil.sortDaysEntryDates(daysEntries);
    sortedDates.forEach(function(date) {
      daysElement.append(constructDayElement(daysEntries[date], date));
    });
  }

  return self;
})();
