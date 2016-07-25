var TimesheetUiWiring = (function() {
  var self = {};

  self.initializeFoundationPlugins = function() {
    $(document).foundation();
  };

  self.initializeDatePicker = function() {
    $('#dateSelection').fdatepicker({
  		initialDate: TimesheetUtil.formatDateMDDYY(TimesheetView.collectTimesheetInfo().startDate),
  		format: 'm/dd/yy',
      weekStart: 6,
  		disableDblClickSelection: true
  	}).on('changeDate', function(ev) {
      var timesheetInfo = TimesheetView.collectTimesheetInfo();
      var selectedDate = $('#dateSelection').data('date');
      TimesheetCommunication.fetchTimesheetInfo(timesheetInfo.userInfo, selectedDate);
      $('#dateSelection').fdatepicker('hide');
    });
  };

  return self;
})();
