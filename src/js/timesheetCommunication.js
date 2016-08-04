var TimesheetCommunication = (function() {
  var self = {};

  var futureDate = (function() { var date = new Date(); date.setDate(date.getDate() + 1); return accurateToDayOfMonth(date); })();
  var sevenDaysBeforeToday = (function() { var date = new Date(); date.setDate(date.getDate() - 7); return accurateToDayOfMonth(date); })();
  var currentDate = accurateToDayOfMonth(new Date());

  self.fetchTimesheetInfo = function(date, isRetryAttempt) {
    TimesheetView.clearOldInformation();
    var userInfo = TimesheetAuthentication.currentAuthenticatedUserInfo();
    TimesheetView.updateUsername(userInfo.fullName);
    TimesheetApiWrapper.fetchTimesheetInfo(userInfo.username, date).done(function(data) {
      TimesheetView.displayTimesheetInfo(TimesheetAuthentication.currentAuthenticatedUserInfo(), data);
    }).fail(function(bundledResponse) {
      if (isFutureDate(date) || (isPastDate(date) && !isRetryAttempt)) {
        self.fetchTimesheetInfo(currentDate, true);
      } else if (isToday(date)) {
        self.fetchTimesheetInfo(sevenDaysBeforeToday, true);
      } else {
        ResponseHandling.displayError(bundledResponse.jqXHR, bundledResponse.valueMap);
      }
    });
  };

  function isFutureDate(date) {
    var testDate = accurateToDayOfMonth(new Date(date));
    return isDateBefore(currentDate, testDate);
  }

  function isPastDate(date) {
    var testDate = accurateToDayOfMonth(new Date(date));
    return isDateBefore(testDate, currentDate);
  }

  function isToday(date) {
    var testDate = accurateToDayOfMonth(new Date(date));
    return accurateToDayOfMonth(testDate).getTime() === currentDate.getTime();
  }

  function isDateBefore(date1, date2) {
    return date1.getTime() < date2.getTime();
  }

  function accurateToDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  self.sendSaveTimesheet = function() {
    var hoursForTimesheetEntries = TimesheetUtil.convertToTimeEntries(TimesheetView.collectEnteredTime());
    var timesheetInfo = TimesheetView.collectTimesheetInfo();
    TimesheetApiWrapper.saveTimesheet(timesheetInfo.id, hoursForTimesheetEntries).done(function() {
      ResponseHandling.displaySuccessMessage('Changes saved');
      self.fetchTimesheetInfo(TimesheetUtil.formatDateYYYYMMDD(timesheetInfo.startDate));
    }).fail(function(bundledResponse) {
      ResponseHandling.displayError(bundledResponse.jqXHR, bundledResponse.valueMap);
    });
  };

  self.sendValidateTimesheet = function() {
    var timesheetInfo = TimesheetView.collectTimesheetInfo();
    TimesheetApiWrapper.validateTimesheet(timesheetInfo.id).done(function() {
      ResponseHandling.displaySuccessMessage('Timesheet validated');
      self.fetchTimesheetInfo(TimesheetUtil.formatDateYYYYMMDD(timesheetInfo.startDate));
    }).fail(function(bundledResponse) {
      ResponseHandling.displayError(bundledResponse.jqXHR, bundledResponse.valueMap);
    });
  };

  return self;
})();
