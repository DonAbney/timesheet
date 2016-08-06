describe('Collecting entered time', function() {
  beforeEach(function() {
    var fixture = "<div id='fixture' class='days wrapper-generatedView'></div>";
    document.body.insertAdjacentHTML('afterbegin', fixture);
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });

  var userInfo = { username: 'tjones' };

  it('should contain a map entry for each of the time entries in the timesheet', function() {
    TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfo());
    enterHours('te1', 5);
    enterHours('te2', 6);
    enterHours('te3', 7);
    enterHours('te4', 8);

    var collectedEnteredTime = TimesheetView.collectEnteredTime();

    var keys = TimesheetUtil.mapKeys(collectedEnteredTime);
    expect(keys).toContain('te1');
    expect(keys).toContain('te2');
    expect(keys).toContain('te3');
    expect(keys).toContain('te4');
  });

  it('should contain only map entries for time entries whose value has changed', function() {
    TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfo());
    enterHours('te1', 5);
    enterHours('te2', 6);
    enterHours('te4', 8);

    var collectedEnteredTime = TimesheetView.collectEnteredTime();

    var keys = TimesheetUtil.mapKeys(collectedEnteredTime);
    expect(keys).not.toContain('te3');
  });

  it('should contain map entries for time entries even if their value has not changed, when explicitly requested to do so', function() {
    TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfo());
    enterHours('te1', 5);
    enterHours('te2', 6);
    enterHours('te4', 8);

    var collectedEnteredTime = TimesheetView.collectEnteredTime(true);

    var keys = TimesheetUtil.mapKeys(collectedEnteredTime);
    expect(keys).toContain('te3');
  });

  it('should return the id of the time entry', function() {
    TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithOneTimeEntry());
    enterHours('te1', 5);

    var collectedEnteredTime = TimesheetView.collectEnteredTime();

    expect(collectedEnteredTime['te1'].id).toEqual('te1');
  });

  it('should return the date of the time entry', function() {
    TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithOneTimeEntry());
    enterHours('te1', 5);

    var collectedEnteredTime = TimesheetView.collectEnteredTime();

    expect(collectedEnteredTime['te1'].date).toEqual('2016-05-31T04:00:00Z');
  });

  it('should return the hours entered for the time entry', function() {
    TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithOneTimeEntryAndExistingHours());
    enterHours('te1', 5);

    var collectedEnteredTime = TimesheetView.collectEnteredTime();

    expect(collectedEnteredTime['te1'].hours).toEqual(5);
  });

  it('should return the last-saved hours for the time entry', function() {
    TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithOneTimeEntryAndExistingHours());
    enterHours('te1', 5);

    var collectedEnteredTime = TimesheetView.collectEnteredTime();

    expect(collectedEnteredTime['te1']['last-saved-hours']).toEqual(3);
  });

  it('should return the position for the time entry', function() {
    TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithOneTimeEntryAndExistingHours());
    enterHours('te1', 5);

    var collectedEnteredTime = TimesheetView.collectEnteredTime();

    expect(collectedEnteredTime['te1'].position).toEqual('p1');
  });
});
