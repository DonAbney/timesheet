describe('TimesheetUtil', function() {
  describe('mapKeys()', function() {
    function setupTargetMap() {
      return {
        "joe": 123,
        "sam": 234
      };
    }

    it('should return a known key for the object in the returned array of keys', function() {
      var targetMap = setupTargetMap();

      var keys = TimesheetUtil.mapKeys(targetMap);

      expect(keys).toContain("joe");
    });

    it('should return all keys specified in the map', function() {
      var targetMap = setupTargetMap();

      var keys = TimesheetUtil.mapKeys(targetMap);

      expect(keys).toContain("joe");
      expect(keys).toContain("sam");
    });

    it('should not contain any inherited keys', function() {
      var inheritedMap = {
        "tom": 999
      };
      var targetMap = Object.create(inheritedMap);
      targetMap["joe"] = 123;
      targetMap["sam"] = 234;

      var keys = TimesheetUtil.mapKeys(targetMap);

      expect(keys.length).toEqual(2);
    });
  });

  describe('aggregateTime()', function() {
    function setupEnteredTime(date, hours) {
      return {
        "date": date,
        "hours": hours
      }
    }

    it('should return zero total time if no time entries are provided', function() {
      var enteredTimes = {};

      var aggregatedTime = TimesheetUtil.aggregateTime(enteredTimes);

      expect(aggregatedTime.totalTime).toEqual(0);
    });

    it('should sum all entered times when calculating the total time', function() {
      var enteredTimes = {
        "1": setupEnteredTime("2016-02-02", 5),
        "2": setupEnteredTime("2016-02-03", 1)
      };

      var aggregatedTime = TimesheetUtil.aggregateTime(enteredTimes);

      expect(aggregatedTime.totalTime).toEqual(6);
    });

    it('should include aggregated times for each date in the entered times', function() {
      var enteredTimes = {
        "1": setupEnteredTime("2016-02-02", 5),
        "2": setupEnteredTime("2016-02-03", 1)
      };

      var aggregatedTime = TimesheetUtil.aggregateTime(enteredTimes);

      expect(aggregatedTime["2016-02-02"]).toEqual(5);
      expect(aggregatedTime["2016-02-03"]).toEqual(1);
    });

    it('should sum times for each date in the entered times and aggregate under that date', function() {
      var enteredTimes = {
        "1": setupEnteredTime("2016-02-02", 5),
        "2": setupEnteredTime("2016-02-02", 1)
      };

      var aggregatedTime = TimesheetUtil.aggregateTime(enteredTimes);

      expect(aggregatedTime["2016-02-02"]).toEqual(6);
    });
  });

  describe('formatDate()', function() {
    it('should reformat a string date into <weekday> MM/DD', function() {
      var targetDate = "2016-05-24T04:00:00Z";

      expect(TimesheetUtil.formatDate(targetDate)).toEqual("Tuesday 5/24");
    });
  });
});
