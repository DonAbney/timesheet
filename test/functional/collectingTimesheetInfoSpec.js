describe('Collecting timesheet information', function() {
  beforeEach(function() {
    var fixture = "<div id='fixture' class='timesheetInfo' data-startDate='2016-05-14T04:00:00Z' data-username='tjones' data-timesheetId='789' data-fullName='Tom Jones' data-givenName='Tom' data-familyName='Jones' data-emailAddress='tjones@example.com' data-imageUrl='http://some.url.com/images/myImage.jpg'></div>";
    document.body.insertAdjacentHTML('afterbegin', fixture);
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });

  describe('via collectTimesheetInfo()', function() {
    it('should return the timesheet ID as a number', function() {
      var timesheetInfo = TimesheetView.collectTimesheetInfo();

      expect(timesheetInfo.id).toEqual(789);
    });

    it('should return the username', function() {
      var timesheetInfo = TimesheetView.collectTimesheetInfo();

      expect(timesheetInfo.userInfo.username).toEqual('tjones');
    });

    it('should return the full name', function() {
      var timesheetInfo = TimesheetView.collectTimesheetInfo();

      expect(timesheetInfo.userInfo.fullName).toEqual('Tom Jones');
    });

    it('should return the given name', function() {
      var timesheetInfo = TimesheetView.collectTimesheetInfo();

      expect(timesheetInfo.userInfo.givenName).toEqual('Tom');
    });

    it('should return the family name', function() {
      var timesheetInfo = TimesheetView.collectTimesheetInfo();

      expect(timesheetInfo.userInfo.familyName).toEqual('Jones');
    });

    it('should return the email address', function() {
      var timesheetInfo = TimesheetView.collectTimesheetInfo();

      expect(timesheetInfo.userInfo.emailAddress).toEqual('tjones@example.com');
    });

    it('should return the image url', function() {
      var timesheetInfo = TimesheetView.collectTimesheetInfo();

      expect(timesheetInfo.userInfo.imageUrl).toEqual('http://some.url.com/images/myImage.jpg');
    });

    it('should return the date for the timesheet', function() {
      var timesheetInfo = TimesheetView.collectTimesheetInfo();

      expect(timesheetInfo.startDate).toEqual('2016-05-14T04:00:00Z');
    });
  });
});
