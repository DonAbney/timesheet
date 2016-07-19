var TimesheetCommunication = (function() {
  var self = {};

  self.fetchTimesheetInfo = function(userInfo, date) {
    TimesheetApiWrapper.fetchTimesheetInfo(userInfo.username, date).done(function(data) {
      ResponseHandling.makeSuccessResponseVisible();
      TimesheetView.displayTimesheetInfo(userInfo, data);
    });
  };

  self.sendSaveTimesheet = function() {
    var hoursForTimesheetEntries = TimesheetUtil.convertToTimeEntries(TimesheetView.collectEnteredTime());
    var timesheetInfo = TimesheetView.collectTimesheetInfo();
    TimesheetApiWrapper.saveTimesheet(timesheetInfo.id, hoursForTimesheetEntries).done(function() {
      self.fetchTimesheetInfo(timesheetInfo.userInfo, TimesheetUtil.formatDateYYYYMMDD(timesheetInfo.startDate));
    });
  };

  self.sendValidateTimesheet = function() {
    var timesheetInfo = TimesheetView.collectTimesheetInfo();
    TimesheetApiWrapper.validateTimesheet(timesheetInfo.id).done(function() {
      self.fetchTimesheetInfo(timesheetInfo.userInfo, TimesheetUtil.formatDateYYYYMMDD(timesheetInfo.startDate));
    });
  };

  return self;
})();
