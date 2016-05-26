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
});
