describe('Summing entered hours', function() {
  beforeEach(function() {
    var fixture = "<div id='fixture'><span class='weekTotal'>unmodified</span><div class='days wrapper-generatedView'></div></div>";
    document.body.insertAdjacentHTML('afterbegin', fixture);

    TimesheetView.displayTimesheetInfo('tjones', generateTimesheetInfo());
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });

  function generateTimesheetInfo() {
    return {
      "timesheetInstance": generateBasicTimesheetInstanceData(),
      "timeEntryPositionMapByDate": [
        generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}, "te2": {date: "2016-05-30T04:00:00Z"}}),
        generatePositionAndTimeEntryInfo({"id": "p2"}, {"te3": {date: "2016-05-31T04:00:00Z"}, "te4": {date: "2016-05-30T04:00:00Z"}})
      ]
    };
  };

  function enterHours(timeEntryId, numHours) {
    $('#' + timeEntryId).val("" + numHours);
    $('#' + timeEntryId).blur();
  };

  describe('for the timesheet total', function() {
    it('should reflect the hours entered for a time entry', function() {
      enterHours('te1', 2);

      expect($('.weekTotal').text()).toEqual("2");
    });

    it('should reflect the total sum across all time entries for a day', function() {
      enterHours('te1', 6);
      enterHours('te2', 7);

      expect($('.weekTotal').text()).toEqual("13");
    });

    it('should reflect the total sum across all time entries for all days on the sheet', function() {
      enterHours('te1', 3);
      enterHours('te2', 7);
      enterHours('te3', 5);
      enterHours('te4', 12);

      expect($('.weekTotal').text()).toEqual("27");
    });
  });

  describe('for the daily total', function() {
    it('should reflect the hours entered for a time entry', function() {
      enterHours('te1', 2);

      expect($(".dayTotal[data-date='2016-05-31T04:00:00Z']").text()).toEqual("2");
    });

    it('should reflect the sum of all hours entered for all time entries for a day', function() {
      enterHours('te2', 6);
      enterHours('te4', 13);

      expect($(".dayTotal[data-date='2016-05-30T04:00:00Z']").text()).toEqual("19");
    });
  });
});
