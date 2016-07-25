var TimesheetUiWiring = (function() {
  var self = {};

  self.initializeFoundationPlugins = function() {
    $(document).foundation();
  };

  self.initializeDatePicker = function() {
    $('#dateSelection').fdatepicker({
  		initialDate: TimesheetUtil.formatDateMDDYY(new Date()),
  		format: 'm/dd/yy',
      weekStart: 6,
  		disableDblClickSelection: true
  	}).on('changeDate', function(ev) {
      var selectedDate = $('#dateSelection').data('date');
      TimesheetCommunication.fetchTimesheetInfo(selectedDate);
      $('#dateSelection').fdatepicker('hide');
    });
  };

  return self;
})();
