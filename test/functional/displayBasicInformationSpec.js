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
      it('should update the username to the user id specified in the timesheet info', function() {
        var timesheetInfo = {
          "timesheetInstance": {
            "employee": {
              "id": 23
            }
          },
          "timeEntryPositionMapByDate": []
        };

        TimesheetView.displayTimesheetInfo(timesheetInfo);

        expect($('.username').text()).toEqual("23");
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

    function generateBasicTimesheetInstanceData() {
      return {
        "employee": {
          "id": 23
        }
      };
    };

    function generatePositionAndTimeEntryInfo(positionInfo, timeEntryInfo) {
      function generateTimeEntries(timeEntryInfo) {
        var entries = [];
        TimesheetUtil.mapKeys(timeEntryInfo).forEach(function(key) {
          var entry = {
            "id": key,
            "date": timeEntryInfo[key].date ? timeEntryInfo[key].date : "2015-05-03T04:00:00Z"
          };
          entries.push(entry);
        });
        return entries;
      };

      return {
        "position": {
          "id": positionInfo.id ? positionInfo.id : "001",
          "name": positionInfo.name ? positionInfo.name : "someName",
          "note": positionInfo.note ? positionInfo.note : "someNote"
        },
        "timeEntries": generateTimeEntries(timeEntryInfo)
      }
    };

    describe('via displayTimesheetInfo()', function() {
      it('should generate a day entry for a day represented in the timesheet information', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(timesheetInfo);

        expect($('.wrapper-generatedView').children().length).toEqual(1);
      });

      it('should generate a day entry for each day represented in the timesheet information', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}, "te2": {date: "2016-05-30T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(timesheetInfo);

        expect($('.wrapper-generatedView').children().length).toEqual(2);
      });
    });
  });
});
