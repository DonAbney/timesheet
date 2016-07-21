describe('Displaying basic information', function() {
  var userInfo = {
    username: 'tjones',
    fullName: 'Tom Jones',
    givenName: 'Tom',
    familyName: 'Jones',
    emailAddress: 'tjones@example.com',
    imageUrl: 'http://some.url.com/images/myImage.png'
  };

  describe('in the header', function() {
    beforeEach(function() {
      var fixture = "<div id='fixture'><span class='username'>unmodified</span><span class='validatedIndicator'>*</span><span class='timesheet-startDate'>unmodified</span><span class='timesheet-endDate'>unmodified</span></div>";
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
      it('should update the username to the provided full name for the user', function() {
        var timesheetInfo = {
          "timesheetInstance": {
            "employee": {
              "id": 23
            }
          },
          "timeEntryPositionMapByDate": []
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.username').text()).toEqual("Tom Jones");
      });

      it('should update the displayed start date to the start date of the timesheet', function() {
        var timesheetInfo = {
          "timesheetInstance": {
            "startDate": "2015-05-22T04:00:00Z",
            "employee": {
              "id": 23
            }
          },
          "timeEntryPositionMapByDate": []
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.timesheet-startDate').text()).toEqual("5/22");
      });

      it('should update the displayed end date to the end date of the timesheet', function() {
        var timesheetInfo = {
          "timesheetInstance": {
            "endDate": "2015-05-24T04:00:00Z",
            "employee": {
              "id": 23
            }
          },
          "timeEntryPositionMapByDate": []
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.timesheet-endDate').text()).toEqual("5/24");
      });

      it('should hide the validated state indicator if the timesheet is not in a validated state', function() {
        var timesheetInfo = generateTimesheetInfo();

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.validatedIndicator').is(':visible')).toEqual(false);
      });

      it('should show the validated state indicator if the timesheet is in a validated state', function() {
        var timesheetInfo = generateValidatedTimesheetInfo();

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.validatedIndicator').is(':visible')).toEqual(true);
      });
    });
  });

  describe('clearing old information', function() {
    beforeEach(function() {
      var fixture = "<div id='fixture'><div class='username'>joe</div><div class='stateChangeIndicator'></div><div class='validatedIndicator'></div><div class='weekTotal'>23</div><div class='timesheet-startDate'>someDate</div><div class='timesheet-endDate'>someDate</div></div>";
      document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {
      document.body.removeChild(document.getElementById('fixture'));
    });

    it('should hide the state change indicator', function() {
      TimesheetView.clearOldInformation();

      expect($('.stateChangeIndicator').is(':visible')).toEqual(false);
    });

    it('should hide the validated indicator', function() {
      TimesheetView.clearOldInformation();

      expect($('.validatedIndicator').is(':visible')).toEqual(false);
    });

    it('should reset the username to "not signed in"', function() {
      TimesheetView.clearOldInformation();

      expect($('.username').text()).toEqual('not signed in');
    });

    it('should reset the total hours for the week to 0', function() {
      TimesheetView.clearOldInformation();

      expect($('.weekTotal').text()).toEqual('0');
    });

    it('should reset the displayed start date for the timesheet to "no timesheet selected"', function() {
      TimesheetView.clearOldInformation();

      expect($('.timesheet-startDate').text()).toEqual('no timesheet selected');
    });

    it('should clear the displayed end date for the timesheet', function() {
      TimesheetView.clearOldInformation();

      expect($('.timesheet-endDate').text()).toEqual('');
    });
  });

  describe('before adding new time entry information', function() {
    beforeEach(function() {
      var fixture = "<div id='fixture' class='wrapper-generatedView'><div id='unwanted-old-element'>old junk</div></div>";
      document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {
      document.body.removeChild(document.getElementById('fixture'));
    });

    it('should remove any existing information in the wrapper for the generated view', function() {
      var timesheetInfo = {
        "timesheetInstance": generateBasicTimesheetInstanceData(),
        "timeEntryPositionMapByDate": [
          generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
        ]
      };

      TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

      expect($('#unwanted-old-element').length === 0).toEqual(true);
    });
  });

  describe('for the action buttons', function() {
    beforeEach(function() {
      var fixture = "<div id='fixture'><div class='wrapper-generatedView'></div><button class='saveChanges' type='button'></button><button class='validateTimesheet' type='button'></button></div>";
      document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {
      document.body.removeChild(document.getElementById('fixture'));
    });

    describe('via displayTimesheetInfo()', function() {
      it('should disable the save changes button if the timesheet has already been validated, so that additional changes cannot be attempted', function() {
        var timesheetInfo = generateValidatedTimesheetInfo();

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.saveChanges').prop('disabled')).toEqual(true);
      });

      it('should enable the save changes button if the timesheet has not yet been validated, so that additional changes can be attempted', function() {
        var timesheetInfo = generateTimesheetInfo();

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.saveChanges').prop('disabled')).toEqual(false);
      });

      it('should disable the validate timesheet button if the timesheet has already been validated, so that additional validation cannot be attempted', function() {
        var timesheetInfo = generateValidatedTimesheetInfo();

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.validateTimesheet').prop('disabled')).toEqual(true);
      });

      it('should enable the validate timesheet button if the timesheet has not yet been validated, so that additional validation can be attempted', function() {
        var timesheetInfo = generateTimesheetInfo();

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.validateTimesheet').prop('disabled')).toEqual(false);
      });
    });
  });

  describe('for the positions', function() {
    beforeEach(function() {
      var fixture = "<div id='fixture' class='wrapper-generatedView'></div>";
      document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {
      document.body.removeChild(document.getElementById('fixture'));
    });

    describe('via displayTimesheetInfo()', function() {
      it('should generate a position entry with the name (and no note if it is null) of the position', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1", "name": "targetName", "note": null}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .position:first').text()).toEqual("targetName");
      });

      it('should generate a position entry with the name and note of the position', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1", "name": "targetName", "note": "targetNote"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .position:first').text()).toEqual("targetName: targetNote");
      });

      it('should generate a position entry for each of the positions', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}}),
            generatePositionAndTimeEntryInfo({"id": "p2"}, {"te2": {date: "2016-05-31T04:00:00Z"}}),
            generatePositionAndTimeEntryInfo({"id": "p3"}, {"te3": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .position').length).toEqual(3);
      });
    });
  });

  describe('for the days', function() {
    beforeEach(function() {
      var fixture = "<div id='fixture' class='wrapper-generatedView'></div>";
      document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {
      document.body.removeChild(document.getElementById('fixture'));
    });

    describe('via displayTimesheetInfo()', function() {
      it('should generate a timesheet element that contains the timesheet id', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timesheetInfo').attr('data-timesheetId')).toEqual('789');
      });

      it('should generate a timesheet element that contains the username', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timesheetInfo').attr('data-username')).toEqual('tjones');
      });

      it('should generate a timesheet element that contains the full name', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timesheetInfo').attr('data-fullName')).toEqual('Tom Jones');
      });

      it('should generate a timesheet element that contains the given name', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timesheetInfo').attr('data-givenName')).toEqual('Tom');
      });

      it('should generate a timesheet element that contains the family name', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timesheetInfo').attr('data-familyName')).toEqual('Jones');
      });

      it('should generate a timesheet element that contains the email address', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timesheetInfo').attr('data-emailAddress')).toEqual('tjones@example.com');
      });

      it('should generate a timesheet element that contains the image url', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timesheetInfo').attr('data-imageUrl')).toEqual('http://some.url.com/images/myImage.png');
      });

      it('should generate a timesheet element that contains the start date for the timesheet', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timesheetInfo').attr('data-startDate')).toEqual('2016-05-14T04:00:00Z');
      });

      it('should generate a timesheet element that contains the end date for the timesheet', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timesheetInfo').attr('data-endDate')).toEqual('2016-05-21T04:00:00Z');
      });

      it('should generate a timesheet element that contains the validation state for the timesheet', function() {
        var timesheetInfo = generateValidatedTimesheetInfo();

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timesheetInfo').attr('data-validated')).toEqual('true');
      });

      it('should generate a day entry for a day represented in the timesheet information', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .day').length).toEqual(1);
      });

      it('should generate a time entry within the day for the position with name and no note when no note is present', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1", "name": "targetName", "note": null}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timeEntry[data-date="2016-05-31T04:00:00Z"]:first label').text()).toEqual("targetName");
      });

      it('should generate a time entry within the day for the position with name and note', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1", "name": "targetName", "note": "targetNote"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timeEntry[data-date="2016-05-31T04:00:00Z"]:first label').text()).toEqual("targetName: targetNote");
      });

      it('should generate the time entries for a day in the same order as the positions', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}}),
            generatePositionAndTimeEntryInfo({"id": "p2"}, {"te2": {date: "2016-05-31T04:00:00Z"}}),
            generatePositionAndTimeEntryInfo({"id": "p3"}, {"te3": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timeEntry[data-date="2016-05-31T04:00:00Z"] input:eq(0)').prop('id')).toEqual("te1");
        expect($('.wrapper-generatedView .timeEntry[data-date="2016-05-31T04:00:00Z"] input:eq(1)').prop('id')).toEqual("te2");
        expect($('.wrapper-generatedView .timeEntry[data-date="2016-05-31T04:00:00Z"] input:eq(2)').prop('id')).toEqual("te3");
      });

      it('should generate an empty, uneditable time entry for a position if that day had no time entry for the position', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}}),
            generatePositionAndTimeEntryInfo({"id": "p2"}, {"te2": {date: "2016-05-30T04:00:00Z"}}),
            generatePositionAndTimeEntryInfo({"id": "p3"}, {"te3": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .timeEntry[data-date="2016-05-31T04:00:00Z"] input:eq(1)').prop('id')).toEqual("placeholder_p2_2016-05-31");
        expect($('.wrapper-generatedView .timeEntry[data-date="2016-05-31T04:00:00Z"] input:eq(1)').prop('disabled')).toEqual(true);
        expect($('.wrapper-generatedView .timeEntry[data-date="2016-05-31T04:00:00Z"] input:eq(1)').attr('class')).toEqual('placeholderTimeEntryField');
      });

      it('should generate a day entry for each day represented in the timesheet information', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}, "te2": {date: "2016-05-30T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('.wrapper-generatedView .day').length).toEqual(2);
      });

      it('should generate time entries for each position and its time entry for a day represented in the timesheet information', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}}),
            generatePositionAndTimeEntryInfo({"id": "p2"}, {"te2": {date: "2016-05-31T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

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

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect(doesElementExist('.wrapper-generatedView .dayTotal[data-date="2016-05-31T04:00:00Z"]')).toEqual(true);
      });

      it('should generate a total sum of hours worked element for other days', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}, "te2": {date: "2016-06-01T04:00:00Z"}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

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

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

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

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('#te1').attr('data-last-saved-value')).toEqual('1');
        expect($('#te2').attr('data-last-saved-value')).toEqual('2');
        expect($('#te3').attr('data-last-saved-value')).toEqual('3');
        expect($('#te4').attr('data-last-saved-value')).toEqual('5');
      });

      it('should disable the time entry field if the timesheet is already validated so that changes are not permitted', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicValidatedTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z", hours: 1}, "te2": {date: "2016-05-30T04:00:00Z", hours: 2}})
          ]
        };

        TimesheetView.displayTimesheetInfo(userInfo, timesheetInfo);

        expect($('#te1').prop('disabled')).toEqual(true);
        expect($('#te2').prop('disabled')).toEqual(true);
      });

      it('should enable the time entry field if the timesheet is not yet validated so that changes are permitted', function() {
        var timesheetInfo = {
          "timesheetInstance": generateBasicTimesheetInstanceData(),
          "timeEntryPositionMapByDate": [
            generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z", hours: 1}, "te2": {date: "2016-05-30T04:00:00Z", hours: 2}})
          ]
        };

        TimesheetView.displayTimesheetInfo('tjones', timesheetInfo);

        expect($('#te1').prop('disabled')).toEqual(false);
        expect($('#te2').prop('disabled')).toEqual(false);
      });
    });
  });

  describe('showing the authentication area', function() {
    beforeEach(function() {
      var fixture = "<div id='fixture'><div id='authentication'></div><div id='errorResponse'></div><div id='successfulResponse'></div><div id='authenticated'></div></div>";
      document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {
      document.body.removeChild(document.getElementById('fixture'));
    });

    it('should show the authentication area', function() {
      $('#authentication').hide();

      TimesheetView.showAuthenticationArea();

      expect($('#authentication').is(':visible')).toEqual(true);
    });

    it('should hide the error response area', function() {
      TimesheetView.showAuthenticationArea();

      expect($('#errorResponse').is(':visible')).toEqual(false);
    });

    it('should hide the successful response area', function() {
      TimesheetView.showAuthenticationArea();

      expect($('#successfulResponse').is(':visible')).toEqual(false);
    });

    it('should hide the authenticated area', function() {
      TimesheetView.showAuthenticationArea();

      expect($('#authenticated').is(':visible')).toEqual(false);
    });
  });

  describe('hiding the authentication area', function() {
    beforeEach(function() {
      var fixture = "<div id='fixture'><div id='authentication'></div><<div id='authenticated'></div></div>";
      document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {
      document.body.removeChild(document.getElementById('fixture'));
    });

    it('should hide the authentication area', function() {
      TimesheetView.hideAuthenticationArea();

      expect($('#authentication').is(':visible')).toEqual(false);
    });

    it('should show the authenticated area', function() {
      $('#authenticated').hide();

      TimesheetView.hideAuthenticationArea();

      expect($('#authenticated').is(':visible')).toEqual(true);
    });
  });
});
