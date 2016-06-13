describe('On a time entry hours change', function() {
  beforeEach(function() {
    var fixture = "<div id='fixture'><span class='weekTotal'>unmodified</span><div class='days wrapper-generatedView'></div></div>";
    document.body.insertAdjacentHTML('afterbegin', fixture);
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });

  describe('for the timesheet total', function() {
    it('should reflect the hours entered for a time entry', function() {
      TimesheetView.displayTimesheetInfo('tjones', generateTimesheetInfo());

      enterHours('te1', 2);

      expect($('.weekTotal').text()).toEqual("2");
    });

    it('should reflect the total sum across all time entries for a day', function() {
      TimesheetView.displayTimesheetInfo('tjones', generateTimesheetInfo());

      enterHours('te1', 6);
      enterHours('te2', 7);

      expect($('.weekTotal').text()).toEqual("13");
    });

    it('should reflect the total sum across all time entries for all days on the sheet', function() {
      TimesheetView.displayTimesheetInfo('tjones', generateTimesheetInfo());

      enterHours('te1', 3);
      enterHours('te2', 7);
      enterHours('te3', 5);
      enterHours('te4', 12);

      expect($('.weekTotal').text()).toEqual("27");
    });

    it('should reflect the total sum across all time entries for all days on the sheet before any modifications, based on pre-existing hours entered', function() {
      TimesheetView.displayTimesheetInfo('tjones', generateTimesheetInfoWithExistingHours());

      expect($('.weekTotal').text()).toEqual("11");
    });
  });

  describe('for the daily total', function() {
    it('should reflect the hours entered for a time entry', function() {
      TimesheetView.displayTimesheetInfo('tjones', generateTimesheetInfo());

      enterHours('te1', 2);

      expect($(".dayTotal[data-date='2016-05-31T04:00:00Z']").text()).toEqual("2");
    });

    it('should reflect the sum of all hours entered for all time entries for a day', function() {
      TimesheetView.displayTimesheetInfo('tjones', generateTimesheetInfo());

      enterHours('te2', 6);
      enterHours('te4', 13);

      expect($(".dayTotal[data-date='2016-05-30T04:00:00Z']").text()).toEqual("19");
    });

    it('should reflect the sum of all hours previously entered for all time entries for a day, before any modifications', function() {
      TimesheetView.displayTimesheetInfo('tjones', generateTimesheetInfoWithExistingHours());

      expect($(".dayTotal[data-date='2016-05-31T04:00:00Z']").text()).toEqual("4");
    });
  });
});
