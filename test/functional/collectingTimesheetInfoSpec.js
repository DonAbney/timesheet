describe('Collecting timesheet information', function() {
  beforeEach(function() {
    var fixture = "<div id='fixture' class='days wrapper-generatedView'></div>";
    document.body.insertAdjacentHTML('afterbegin', fixture);
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });

  describe('via collectTimesheetId()', function() {
    it('should return the timesheet ID as a number', function() {
      TimesheetView.displayTimesheetInfo('tjones', generateTimesheetInfo());

      var timesheetId = TimesheetView.collectTimesheetId();

      expect(timesheetId).toEqual(789);
    });
  });
});
