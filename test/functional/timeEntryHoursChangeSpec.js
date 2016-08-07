describe('On a time entry hours change', function() {
  beforeEach(function() {
    var fixture = "<div id='fixture'><span class='weekTotal'>unmodified</span><span class='stateChangeIndicator'>*</span><div class='days wrapper-generatedView'></div><div class='saveChanges'></div><div class='validateTimesheet'></div></div>";
    document.body.insertAdjacentHTML('afterbegin', fixture);
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });

  var userInfo = {
    username: 'tjones'
  };

  describe('for the timesheet total', function() {
    it('should reflect the hours entered for a time entry', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfo());

      enterHours('te1', 2);

      expect($('#fixture>.weekTotal').text()).toEqual("2");
    });

    it('should reflect the total sum across all time entries for a day', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfo());

      enterHours('te1', 6);
      enterHours('te2', 7);

      expect($('#fixture>.weekTotal').text()).toEqual("13");
    });

    it('should reflect the total sum across all time entries for all days on the sheet', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfo());

      enterHours('te1', 3);
      enterHours('te2', 7);
      enterHours('te3', 5);
      enterHours('te4', 12);

      expect($('#fixture>.weekTotal').text()).toEqual("27");
    });

    it('should reflect the total sum across all time entries for all days on the sheet before any modifications, based on pre-existing hours entered', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());

      expect($('#fixture>.weekTotal').text()).toEqual("11");
    });
  });

  describe('for the daily total', function() {
    it('should reflect the hours entered for a time entry', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfo());

      enterHours('te1', 2);

      expect($(".dayHeader .dayTotal[data-date='2016-05-31T04:00:00Z']").text()).toEqual("2");
    });

    it('should reflect the sum of all hours entered for all time entries for a day', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfo());

      enterHours('te2', 6);
      enterHours('te4', 13);

      expect($(".dayHeader .dayTotal[data-date='2016-05-30T04:00:00Z']").text()).toEqual("19");
    });

    it('should reflect the sum of all hours entered for all time entries for a day, but should not include time for other days', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfo());

      enterHours('te2', 6);
      enterHours('te3', 13);
      enterHours('te4', 5);

      expect($(".dayHeader .dayTotal[data-date='2016-05-30T04:00:00Z']").text()).toEqual("11");
    });

    it('should reflect the sum of all hours previously entered for all time entries for a day, before any modifications', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());

      expect($(".dayHeader .dayTotal[data-date='2016-05-31T04:00:00Z']").text()).toEqual("4");
    });
  });

  describe('for the position total', function() {
    it('should reflect the hours entered for a time entry', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfo());

      enterHours('te1', 7);

      expect($(".positionTotal[data-position='p1']").text()).toEqual("7")
    });

    it('should reflect the sum of all hours entered for all time entries for a position', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfo());

      enterHours('te1', 7);
      enterHours('te2', 11);

      expect($(".positionTotal[data-position='p1']").text()).toEqual("18");
    });

    it('should reflect the sum of all hours entered for all time entries for a position, but should not include time for other positions', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfo());

      enterHours('te1', 7);
      enterHours('te2', 11);
      enterHours('te3', 5);

      expect($(".positionTotal[data-position='p1']").text()).toEqual("18");
    });

    it('should reflect the sum of all hours previously entered for all the time entries for a position, before any modifications', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());

      expect($(".positionTotal[data-position='p2']").text()).toEqual("8");
    });
  });

  describe('for making visible a detected state change', function() {
    function isStateChangeIndicatorVisible() {
      return $('.stateChangeIndicator').is(':visible');
    }

    function setupStateChangeIndicatorVisible() {
      $('.stateChangeIndicator').show();
    }

    function setupStateChangeIndicatorNotVisible() {
      $('.stateChangeIndicator').hide();
    }

    it('should hide the state change indicator if there are no changes from the last-saved state and the state change indicator was currently visible', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());
      setupStateChangeIndicatorVisible();

      enterHours('te1', 1);

      expect(isStateChangeIndicatorVisible()).toEqual(false);
    });

    it('should continue to hide the state change indicator if there are no changes from the last-saved state and the state change indicator was currently hidden', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());
      setupStateChangeIndicatorNotVisible();

      enterHours('te1', 1);

      expect(isStateChangeIndicatorVisible()).toEqual(false);
    });

    it('should show the state change indicator if there are detected changes from the last-saved state and the state change indicator was currently hidden', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());
      setupStateChangeIndicatorNotVisible();

      enterHours('te3', 1);

      expect(isStateChangeIndicatorVisible()).toEqual(true);
    });

    it('should continue to show the state change indicator if there are detected chnages from the last-saved state and the state change indicator was currently visible', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());
      setupStateChangeIndicatorVisible();

      enterHours('te3', 1);

      expect(isStateChangeIndicatorVisible()).toEqual(true);
    });
  });

  describe('for adjusting visibility of action buttons', function() {
    function isSaveChangesButtonVisible() {
      return $('.saveChanges').is(':visible');
    }

    function setupSaveChangesButtonVisible() {
      $('.saveChanges').show();
    }

    function setupSaveChangesButtonNotVisible() {
      $('.saveChanges').hide();
    }

    function isValidateTimesheetButtonVisible() {
      return $('.validateTimesheet').is(':visible');
    }

    function setupValidateTimesheetButtonVisible() {
      $('.validateTimesheet').show();
    }

    function setupValidateTimesheetButtonNotVisible() {
      $('.validateTimesheet').hide();
    }

    it('should hide the save changes button if there are no changes from the last-saved state and the save changes button was currently visible', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());
      setupSaveChangesButtonVisible();

      enterHours('te1', 1);

      expect(isSaveChangesButtonVisible()).toEqual(false);
    });

    it('should continue to hide the save changes button if there are no changes from the last-saved state and the save changes buton was currently hidden', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());
      setupSaveChangesButtonNotVisible();

      enterHours('te1', 1);

      expect(isSaveChangesButtonVisible()).toEqual(false);
    });

    it('should show the save changes button if there are changes from the last-saved state and the save changes button was currently hidden', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());
      setupSaveChangesButtonNotVisible();

      enterHours('te3', 1);

      expect(isSaveChangesButtonVisible()).toEqual(true);
    });

    it('should continue to show the save changes button if there are changes from the last-saved state and the save changes button was currently visible', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());
      setupSaveChangesButtonVisible();

      enterHours('te3', 1);

      expect(isSaveChangesButtonVisible()).toEqual(true);
    });

    it('should hide the validate timesheet button if there are changes from the last-saved state and the validate timesheet button was currently visible', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());
      setupValidateTimesheetButtonVisible();

      enterHours('te3', 1);

      expect(isValidateTimesheetButtonVisible()).toEqual(false);
    });

    it('should continue to hide the validate timesheet button if there are changes from the last-saved state and the validate timesheet button was currently hidden', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());
      setupValidateTimesheetButtonNotVisible();

      enterHours('te3', 1);

      expect(isValidateTimesheetButtonVisible()).toEqual(false);
    });

    it('should show the validate timesheet button if there are no changes from the last-saved state and the validate timesheet button was currently hidden', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());
      setupValidateTimesheetButtonNotVisible();

      enterHours('te1', 1);

      expect(isValidateTimesheetButtonVisible()).toEqual(true);
    });

    it('should continue to show the validate timesheet button if there are no changes from the last-saved state and the validate timesheet button was currently visible', function() {
      TimesheetView.displayTimesheetInfo(userInfo, generateTimesheetInfoWithExistingHours());
      setupValidateTimesheetButtonVisible();

      enterHours('te1', 1);

      expect(isValidateTimesheetButtonVisible()).toEqual(true);
    });
  });
});
