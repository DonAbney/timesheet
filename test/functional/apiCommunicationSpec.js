var TimesheetApiWrapper = {
  saveTimesheet: function(timesheetId, hoursForTimesheetEntries) { throw "saveTimesheet() behavior not mocked"; },
  validateTimesheet: function(timesheetId) { throw "validateTimesheet() behavior not mocked"; },
  fetchTimesheetInfo: function(username, date) { throw "fetchTimesheetInfo() behavior not mocked"; }
};

describe('the generic communication wrapper', function() {
  var userInfo = {
    fullName: "Joe Cool",
    username: "jcool"
  };

  var fakeEnteredTime = { junk: "fake entered time" };
  var fakeHoursForTimesheetEntries = { junk: "fake hours for timesheet entries" };
  var fakeTimesheetInfo = { junk: "fake timesheet info", id: "fake id", startDate: "2016-05-09T04:00:00Z" };
  var fakeBundledErrorResponse = {jqXHR: {junk: "fake jqXHR"}, valueMap: {junk: "fake value map"}};

  var futureDate = (function() { var date = new Date(); date.setDate(date.getDate() + 1); return accurateToDayOfMonth(date); })();
  var pastDate = (function() { var date = new Date(); date.setDate(date.getDate() - 1); return accurateToDayOfMonth(date); })();
  var sevenDaysBeforeToday = (function() { var date = new Date(); date.setDate(date.getDate() - 7); return accurateToDayOfMonth(date); })();
  var currentDate = accurateToDayOfMonth(new Date());

  function accurateToDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  beforeEach(function() {
    spyOn(TimesheetView, 'clearOldInformation');
    spyOn(TimesheetView, 'updateUsername');
    spyOn(TimesheetView, 'displayTimesheetInfo');
    spyOn(TimesheetView, 'collectEnteredTime').and.returnValue(fakeEnteredTime);
    spyOn(TimesheetView, 'collectTimesheetInfo').and.returnValue(fakeTimesheetInfo);
    spyOn(TimesheetUtil, 'convertToTimeEntries').and.callFake(function(enteredTime) {
      return enteredTime === fakeEnteredTime ? fakeHoursForTimesheetEntries : undefined;
    });
    spyOn(TimesheetAuthentication, 'currentAuthenticatedUserInfo').and.returnValue(userInfo);
    spyOn(ResponseHandling, 'displayError');
    spyOn(ResponseHandling, 'displaySuccessMessage');
  });

  function createPromise(isSuccess, promisedValue) {
    var deferred = $.Deferred();
    if (isSuccess) {
      deferred.resolve(promisedValue);
    } else {
      deferred.reject(promisedValue);
    }
    return deferred.promise();
  }

  describe('fetchTimesheetInfo()', function() {
    it('clears out the old information', function() {
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValue(createPromise(true, {}));

      TimesheetCommunication.fetchTimesheetInfo("2016-05-09");

      expect(TimesheetView.clearOldInformation).toHaveBeenCalled();
    });

    it('should set the user name on the timesheet', function() {
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValue(createPromise(true, {}));

      TimesheetCommunication.fetchTimesheetInfo("2016-05-09");

      expect(TimesheetView.updateUsername).toHaveBeenCalledWith("Joe Cool");
    });

    it('should invoke the api wrapper to fetch the timesheet with the username for the user', function() {
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValue(createPromise(true, {}));

      TimesheetCommunication.fetchTimesheetInfo("2016-05-09");

      expect(TimesheetApiWrapper.fetchTimesheetInfo).toHaveBeenCalledWith("jcool", jasmine.any(String));
    });

    it('should invoke the api wrapper to fetch the timesheet with the target date', function() {
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValue(createPromise(true, {}));

      TimesheetCommunication.fetchTimesheetInfo("2016-05-09");

      expect(TimesheetApiWrapper.fetchTimesheetInfo).toHaveBeenCalledWith(jasmine.any(String), "2016-05-09");
    });

    it('should display the timesheet when successfully fetched with the appropriate user info', function() {
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValue(createPromise(true, fakeTimesheetInfo));

      TimesheetCommunication.fetchTimesheetInfo("2016-05-09");

      expect(TimesheetView.displayTimesheetInfo).toHaveBeenCalledWith(userInfo, jasmine.any(Object));
    });

    it('should display the timesheet when successfully fetched with the fetched timesheet info', function() {
      var fakeTimesheetInfo = {junk: "fake timesheet info"};
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValue(createPromise(true, fakeTimesheetInfo));

      TimesheetCommunication.fetchTimesheetInfo("2016-05-09");

      expect(TimesheetView.displayTimesheetInfo).toHaveBeenCalledWith(jasmine.any(Object), fakeTimesheetInfo);
    });

    it('should not display an error message when there was a failure to fetch a timesheet in the future', function() {
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValues(createPromise(false, fakeBundledErrorResponse), createPromise(true, fakeTimesheetInfo));

      TimesheetCommunication.fetchTimesheetInfo(futureDate);

      expect(ResponseHandling.displayError).not.toHaveBeenCalled();
    });

    it('should try to fetch the timesheet for the current date when there was a failure to fetch a timesheet in the future', function() {
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValues(createPromise(false, fakeBundledErrorResponse), createPromise(true, fakeTimesheetInfo));
      spyOn(TimesheetCommunication, 'fetchTimesheetInfo').and.callThrough();

      TimesheetCommunication.fetchTimesheetInfo(futureDate);

      expect(TimesheetCommunication.fetchTimesheetInfo).toHaveBeenCalledWith(currentDate, true);
    });

    it('should not display an error message when there was a failure to fetch a timesheet in the past and it was not a retry attempt', function() {
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValues(createPromise(false, fakeBundledErrorResponse), createPromise(true, fakeTimesheetInfo));

      TimesheetCommunication.fetchTimesheetInfo(pastDate);

      expect(ResponseHandling.displayError).not.toHaveBeenCalled();
    });

    it('should try to fetch the timesheet for the current date when there was a failure to fetch a timesheet in the past and it was not a retry attempt', function() {
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValues(createPromise(false, fakeBundledErrorResponse), createPromise(true, fakeTimesheetInfo));
      spyOn(TimesheetCommunication, 'fetchTimesheetInfo').and.callThrough();

      TimesheetCommunication.fetchTimesheetInfo(pastDate);

      expect(TimesheetCommunication.fetchTimesheetInfo).toHaveBeenCalledWith(currentDate, true);
    });

    it('should not display an error message when there was a failure to fetch a timesheet for the current date', function() {
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValues(createPromise(false, fakeBundledErrorResponse), createPromise(true, fakeTimesheetInfo));

      TimesheetCommunication.fetchTimesheetInfo(currentDate);

      expect(ResponseHandling.displayError).not.toHaveBeenCalled();
    });

    it('should try to fetch the timesheet for 7 days prior when there was a failure to fetch a timesheet for the current date', function() {
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValues(createPromise(false, fakeBundledErrorResponse), createPromise(true, fakeTimesheetInfo));
      spyOn(TimesheetCommunication, 'fetchTimesheetInfo').and.callThrough();

      TimesheetCommunication.fetchTimesheetInfo(currentDate);

      expect(TimesheetCommunication.fetchTimesheetInfo).toHaveBeenCalledWith(sevenDaysBeforeToday, true);
    });

    it('should display an error message with the bundled jqXHR information when fetching the timesheet info fails', function() {
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValue(createPromise(false, fakeBundledErrorResponse));

      TimesheetCommunication.fetchTimesheetInfo(sevenDaysBeforeToday);

      expect(ResponseHandling.displayError).toHaveBeenCalledWith(fakeBundledErrorResponse.jqXHR, jasmine.any(Object));
    });

    it('should display an error message with the bundled value map when fetching the timesheet info fails', function() {
      spyOn(TimesheetApiWrapper, 'fetchTimesheetInfo').and.returnValue(createPromise(false, fakeBundledErrorResponse));

      TimesheetCommunication.fetchTimesheetInfo(sevenDaysBeforeToday);

      expect(ResponseHandling.displayError).toHaveBeenCalledWith(jasmine.any(Object), fakeBundledErrorResponse.valueMap);
    });
  });

  describe('sendSaveTimesheet()', function() {
    beforeEach(function() {
      spyOn(TimesheetCommunication, 'fetchTimesheetInfo');
    });

    it('should invoke the api wrapper to save the timesheet with the id of the timesheet', function() {
      spyOn(TimesheetApiWrapper, 'saveTimesheet').and.returnValue(createPromise(true, {}));

      TimesheetCommunication.sendSaveTimesheet();

      expect(TimesheetApiWrapper.saveTimesheet).toHaveBeenCalledWith(fakeTimesheetInfo.id, jasmine.any(Object));
    });

    it('should invoke the api wrapper to save the timesheet with the hours for the timesheet entries', function() {
      spyOn(TimesheetApiWrapper, 'saveTimesheet').and.returnValue(createPromise(true, {}));

      TimesheetCommunication.sendSaveTimesheet();

      expect(TimesheetApiWrapper.saveTimesheet).toHaveBeenCalledWith(jasmine.any(String), fakeHoursForTimesheetEntries);
    });

    it('should display a success message when the timesheet was saved successfully', function() {
      spyOn(TimesheetApiWrapper, 'saveTimesheet').and.returnValue(createPromise(true, {}));

      TimesheetCommunication.sendSaveTimesheet();

      expect(ResponseHandling.displaySuccessMessage).toHaveBeenCalledWith("Changes saved");
    });

    it('should re-fetch the current timesheet to display the updated time information, based on the system of record', function() {
      spyOn(TimesheetApiWrapper, 'saveTimesheet').and.returnValue(createPromise(true, {}));

      TimesheetCommunication.sendSaveTimesheet();

      expect(TimesheetCommunication.fetchTimesheetInfo).toHaveBeenCalledWith("2016-05-09");
    });

    it('should display an error message with the bundled jqXHR information when saving the timesheet fails', function() {
      spyOn(TimesheetApiWrapper, 'saveTimesheet').and.returnValue(createPromise(false, fakeBundledErrorResponse));

      TimesheetCommunication.sendSaveTimesheet();

      expect(ResponseHandling.displayError).toHaveBeenCalledWith(fakeBundledErrorResponse.jqXHR, jasmine.any(Object));
    });

    it('should display an error message with the bundled value map when saving the timesheet fails', function() {
      spyOn(TimesheetApiWrapper, 'saveTimesheet').and.returnValue(createPromise(false, fakeBundledErrorResponse));

      TimesheetCommunication.sendSaveTimesheet();

      expect(ResponseHandling.displayError).toHaveBeenCalledWith(jasmine.any(Object), fakeBundledErrorResponse.valueMap);
    });
  });

  describe('sendValidateTimesheet()', function() {
    beforeEach(function() {
      spyOn(TimesheetCommunication, 'fetchTimesheetInfo');
    });

    it('should invoke the api wrapper to validate the timesheet with the id of the timesheet', function() {
      spyOn(TimesheetApiWrapper, 'validateTimesheet').and.returnValue(createPromise(true, {}));

      TimesheetCommunication.sendValidateTimesheet();

      expect(TimesheetApiWrapper.validateTimesheet).toHaveBeenCalledWith(fakeTimesheetInfo.id);
    });

    it('should display a success message when the timesheet was validated successfully', function() {
      spyOn(TimesheetApiWrapper, 'validateTimesheet').and.returnValue(createPromise(true, {}));

      TimesheetCommunication.sendValidateTimesheet();

      expect(ResponseHandling.displaySuccessMessage).toHaveBeenCalledWith("Timesheet validated");
    });

    it('should re-fetch the current timesheet to display the updated information, based on the system of record', function() {
      spyOn(TimesheetApiWrapper, 'validateTimesheet').and.returnValue(createPromise(true, {}));

      TimesheetCommunication.sendValidateTimesheet();

      expect(TimesheetCommunication.fetchTimesheetInfo).toHaveBeenCalledWith("2016-05-09");
    });

    it('should display an error message with the bundled jqXHR information when validating the timesheet fails', function() {
      spyOn(TimesheetApiWrapper, 'validateTimesheet').and.returnValue(createPromise(false, fakeBundledErrorResponse));

      TimesheetCommunication.sendValidateTimesheet();

      expect(ResponseHandling.displayError).toHaveBeenCalledWith(fakeBundledErrorResponse.jqXHR, jasmine.any(Object));
    });

    it('should display an error message with the bundled value map when validating the timesheet fails', function() {
      spyOn(TimesheetApiWrapper, 'validateTimesheet').and.returnValue(createPromise(false, fakeBundledErrorResponse));

      TimesheetCommunication.sendValidateTimesheet();

      expect(ResponseHandling.displayError).toHaveBeenCalledWith(jasmine.any(Object), fakeBundledErrorResponse.valueMap);
    });
  });
});
