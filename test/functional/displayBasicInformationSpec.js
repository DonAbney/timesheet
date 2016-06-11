describe('Displaying basic information', function() {
  describe('in the header', function() {
    beforeEach(function() {
      var fixture = "<span id='fixture' class='username'>unmodified</span>";
      document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {
      document.body.removeChild(document.getElementById('fixture'));
    });

    describe('via updateUsername()', function() {
      it('should update the username to the specified string', function() {
        TimesheetView.updateUsername("this was updated");

        expect($('.username').text()).toEqual("this was updated");
      });
    });

    describe('via displayTimesheetInfo()', function() {
      it('should update the username to the provided user name', function() {
        var timesheetInfo = {
          "timesheetInstance": {
            "employee": {
              "id": 23
            }
          },
          "timeEntryPositionMapByDate": []
        };

        TimesheetView.displayTimesheetInfo("tjones", timesheetInfo);

        expect($('.username').text()).toEqual("tjones");
      });
    });
  });

  describe('for the days', function() {
    beforeEach(function() {
      var fixture = "<div id='fixture' class='days wrapper-generatedView'></div>";
      document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {
      document.body.removeChild(document.getElementById('fixture'));
    });

    describe('via displayTimesheetInfo()', function() {
      it('should generate a day entry for a day represented in the timesheet information', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo('tjones', timesheetInfo);

        expect($('.wrapper-generatedView').children().length).toEqual(1);
      });

      it('should generate a time entry within the day for the position with name and no note when no note is present', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1", "name": "targetName", "note": null}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo('tjones', timesheetInfo);

        expect($('.wrapper-generatedView .day:first .timeEntries .timeEntry:first label').text()).toEqual("targetName");
      });

      it('should generate a time entry within the day for the position with name and note', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1", "name": "targetName", "note": "targetNote"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo('tjones', timesheetInfo);

        expect($('.wrapper-generatedView .day:first .timeEntries .timeEntry:first label').text()).toEqual("targetName: targetNote");
      });

      it('should generate a day entry for each day represented in the timesheet information', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}, "te2": {date: "2016-05-30T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo('tjones', timesheetInfo);

        expect($('.wrapper-generatedView').children().length).toEqual(2);
      });

      it('should generate time entries for each position and its time entry for a day represented in the timesheet information', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}}),
            generatePositionAndTimeEntryInfo({"id": "p2"}, {"te2": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo('tjones', timesheetInfo);

        expect($('.wrapper-generatedView .day:first .timeEntries').children().length).toEqual(2);
      });

      it('should generate a total sum of hours worked element for the day', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo('tjones', timesheetInfo);

        expect($('.wrapper-generatedView .day:first .dayTotal').length).not.toEqual(0);
      });

      it('should generate a total sum of hours worked element for other days', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}, "te2": {date: "2016-06-01T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo('tjones', timesheetInfo);

        expect($('.wrapper-generatedView .day:eq(1) .dayTotal').length).not.toEqual(0);
      });
    });
  });
});
