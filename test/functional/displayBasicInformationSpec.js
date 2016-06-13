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

        expect($('.wrapper-generatedView .timeEntry[data-date="2016-05-31T04:00:00Z"]:first label').text()).toEqual("targetName");
      });

      it('should generate a time entry within the day for the position with name and note', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1", "name": "targetName", "note": "targetNote"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo('tjones', timesheetInfo);

        expect($('.wrapper-generatedView .timeEntry[data-date="2016-05-31T04:00:00Z"]:first label').text()).toEqual("targetName: targetNote");
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

        expect($('.wrapper-generatedView .timeEntries[data-date="2016-05-31T04:00:00Z"]').children().length).toEqual(2);
      });

      function doesElementExist(selector) {
        return $(selector).length !== 0
      }

      it('should generate a total sum of hours worked element for the day', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo('tjones', timesheetInfo);

        expect(doesElementExist('.wrapper-generatedView .dayTotal[data-date="2016-05-31T04:00:00Z"]')).toEqual(true);
      });

      it('should generate a total sum of hours worked element for other days', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}, "te2": {date: "2016-06-01T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo('tjones', timesheetInfo);

        expect(doesElementExist('.wrapper-generatedView .dayTotal[data-date="2016-06-01T04:00:00Z"]')).toEqual(true);
      });

      it('should populate any pre-existing hours already entered for a time entry', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z", hours: 1}, "te2": {date: "2016-05-30T04:00:00Z", hours: 2}}),
            generatePositionAndTimeEntryInfo({"id": "p2"}, {"te3": {date: "2016-05-31T04:00:00Z", hours: 3}, "te4": {date: "2016-05-30T04:00:00Z", hours: 5}})
          ]
        };

        TimesheetView.displayTimesheetInfo('tjones', timesheetInfo);

        expect($('#te1').val()).toEqual('1');
        expect($('#te2').val()).toEqual('2');
        expect($('#te3').val()).toEqual('3');
        expect($('#te4').val()).toEqual('5');
      });

      it('should mark the last-saved hours for each time entry', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z", hours: 1}, "te2": {date: "2016-05-30T04:00:00Z", hours: 2}}),
            generatePositionAndTimeEntryInfo({"id": "p2"}, {"te3": {date: "2016-05-31T04:00:00Z", hours: 3}, "te4": {date: "2016-05-30T04:00:00Z", hours: 5}})
          ]
        };

        TimesheetView.displayTimesheetInfo('tjones', timesheetInfo);

        expect($('#te1').attr('data-last-saved-value')).toEqual('1');
        expect($('#te2').attr('data-last-saved-value')).toEqual('2');
        expect($('#te3').attr('data-last-saved-value')).toEqual('3');
        expect($('#te4').attr('data-last-saved-value')).toEqual('5');
      });
    });
  });
});
