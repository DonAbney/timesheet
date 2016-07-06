var TimesheetCommunication = (function() {
  var self = {};

  self.fetchTimesheetInfo = function(username, date) {
    TimesheetApiWrapper.fetchTimesheetInfo(username, date).done(function(data) {
      ResponseHandling.makeSuccessResponseVisible();
      TimesheetView.displayTimesheetInfo(username, data);
    });
  };

  self.sendSaveTimesheet = function() {
    var hoursForTimesheetEntries = TimesheetUtil.convertToTimeEntries(TimesheetView.collectEnteredTime());
    var timesheetInfo = TimesheetView.collectTimesheetInfo();
    TimesheetApiWrapper.saveTimesheet(timesheetInfo.id, hoursForTimesheetEntries).done(function() {
      self.fetchTimesheetInfo(timesheetInfo.username, TimesheetUtil.formatDateYYYYMMDD(timesheetInfo.startDate));
    });
  };

  self.sendValidateTimesheet = function() {
    var timesheetInfo = TimesheetView.collectTimesheetInfo();
    TimesheetApiWrapper.validateTimesheet(timesheetInfo.id).done(function() {
      self.fetchTimesheetInfo(timesheetInfo.username, TimesheetUtil.formatDateYYYYMMDD(timesheetInfo.startDate));
    });
  };

  return self;
})();
