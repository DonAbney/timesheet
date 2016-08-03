var TimesheetCommunication = (function() {
  var self = {};

  self.fetchTimesheetInfo = function(date) {
    TimesheetView.clearOldInformation();
    var userInfo = TimesheetAuthentication.currentAuthenticatedUserInfo();
    TimesheetView.updateUsername(userInfo.fullName);
    TimesheetApiWrapper.fetchTimesheetInfo(userInfo.username, date).done(function(data) {
      TimesheetView.displayTimesheetInfo(TimesheetAuthentication.currentAuthenticatedUserInfo(), data);
    });
  };

  self.sendSaveTimesheet = function() {
    var hoursForTimesheetEntries = TimesheetUtil.convertToTimeEntries(TimesheetView.collectEnteredTime());
    var timesheetInfo = TimesheetView.collectTimesheetInfo();
    TimesheetApiWrapper.saveTimesheet(timesheetInfo.id, hoursForTimesheetEntries).done(function() {
      ResponseHandling.displaySuccessMessage('Changes saved');
      self.fetchTimesheetInfo(TimesheetUtil.formatDateYYYYMMDD(timesheetInfo.startDate));
    });
  };

  self.sendValidateTimesheet = function() {
    var timesheetInfo = TimesheetView.collectTimesheetInfo();
    TimesheetApiWrapper.validateTimesheet(timesheetInfo.id).done(function() {
      ResponseHandling.displaySuccessMessage('Timesheet validated');
      self.fetchTimesheetInfo(TimesheetUtil.formatDateYYYYMMDD(timesheetInfo.startDate));
    });
  };

  return self;
})();
