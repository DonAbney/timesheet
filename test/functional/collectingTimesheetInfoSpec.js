describe('Collecting timesheet information', function() {
  beforeEach(function() {
    var fixture = "<div id='fixture' class='days wrapper-generatedView'></div>";
    document.body.insertAdjacentHTML('afterbegin', fixture);
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });

  describe('via collectTimesheetInfo()', function() {
    it('should return the timesheet ID as a number', function() {
      TimesheetView.displayTimesheetInfo('tjones', generateTimesheetInfo());

      var timesheetInfo = TimesheetView.collectTimesheetInfo();

      expect(timesheetInfo.id).toEqual(789);
    });

    it('should return the username', function() {
      TimesheetView.displayTimesheetInfo('tjones', generateTimesheetInfo());

      var timesheetInfo = TimesheetView.collectTimesheetInfo();

      expect(timesheetInfo.username).toEqual('tjones');
    });

    it('should return the date for the timesheet', function() {
      TimesheetView.displayTimesheetInfo('tjones', generateTimesheetInfo());

      var timesheetInfo = TimesheetView.collectTimesheetInfo();

      expect(timesheetInfo.startDate).toEqual('2016-05-14T04:00:00Z');
    });
  });
});
