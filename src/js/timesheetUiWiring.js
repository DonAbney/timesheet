var TimesheetUiWiring = (function() {
  var self = {};

  self.initializeFoundationPlugins = function() {
    $(document).foundation();
  };

  self.initializeDatePicker = function() {
    $('#datepicker').datepicker();
    $('#dateSelection').on('click', function() {
      $('#datepicker').datepicker('show');
    });
    $('#datepicker').datepicker('option', 'onSelect', function(dateText, instance) {
      if (dateText) {
        TimesheetCommunication.fetchTimesheetInfo(dateText);
        $('#datepicker').datepicker('hide');
      }
    });
  };

  return self;
})();
