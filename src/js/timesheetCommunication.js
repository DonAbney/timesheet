var TimesheetCommunication = (function() {
  var self = {};

  self.fetchTimesheetInfo = function(date) {
    var username = TimesheetAuthentication.currentAuthenticatedUsername();
    TimesheetApiWrapper.fetchTimesheetInfo(username, date).done(function(data) {
      TimesheetView.displayTimesheetInfo(TimesheetAuthentication.currentAuthenticatedUserInfo(), data);
    });
  };

  self.sendSaveTimesheet = function() {
    var hoursForTimesheetEntries = TimesheetUtil.convertToTimeEntries(TimesheetView.collectEnteredTime());
    var timesheetInfo = TimesheetView.collectTimesheetInfo();
    TimesheetApiWrapper.saveTimesheet(timesheetInfo.id, hoursForTimesheetEntries).done(function() {
      self.fetchTimesheetInfo(TimesheetUtil.formatDateYYYYMMDD(timesheetInfo.startDate));
    });
  };

  self.sendValidateTimesheet = function() {
    var timesheetInfo = TimesheetView.collectTimesheetInfo();
    TimesheetApiWrapper.validateTimesheet(timesheetInfo.id).done(function() {
      self.fetchTimesheetInfo(TimesheetUtil.formatDateYYYYMMDD(timesheetInfo.startDate));
    });
  };

  return self;
})();
