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

    it('should map to the names of the days of the week correctly', function() {
      expect(TimesheetUtil.formatDate("2016-05-22T04:00:00Z")).toEqual("Sunday 5/22");
      expect(TimesheetUtil.formatDate("2016-05-23T04:00:00Z")).toEqual("Monday 5/23");
      expect(TimesheetUtil.formatDate("2016-05-24T04:00:00Z")).toEqual("Tuesday 5/24");
      expect(TimesheetUtil.formatDate("2016-05-25T04:00:00Z")).toEqual("Wednesday 5/25");
      expect(TimesheetUtil.formatDate("2016-05-26T04:00:00Z")).toEqual("Thursday 5/26");
      expect(TimesheetUtil.formatDate("2016-05-27T04:00:00Z")).toEqual("Friday 5/27");
      expect(TimesheetUtil.formatDate("2016-05-28T04:00:00Z")).toEqual("Saturday 5/28");
    });
  });

  describe('sortDaysEntryDates()', function() {
    it('should not contain any inherited keys', function() {
      var inheritedMap = {
        "2016-05-22T04:00:00Z": {"junk":123}
      };
      var targetMap = Object.create(inheritedMap);
      targetMap["2016-02-22T04:00:00Z"] = {"junk":123};
      targetMap["2016-06-22T04:00:00Z"] = {"junk":123};

      expect(TimesheetUtil.sortDaysEntryDates(targetMap)).not.toContain("2016-05-22T04:00:00Z");
    });

    it('should return an empty array if there were no keys inherent to the map (not inherited)', function() {
      expect(TimesheetUtil.sortDaysEntryDates({})).toEqual([]);
    });

    it('should contain all keys inherent to the map (not inherited)', function() {
      var targetMap = {
        "2016-05-22T04:00:00Z": {"junk":123},
        "2015-05-22T04:00:00Z": {"junk":123}
      };

      var sortedDates = TimesheetUtil.sortDaysEntryDates(targetMap);

      expect(sortedDates).toContain("2016-05-22T04:00:00Z");
      expect(sortedDates).toContain("2015-05-22T04:00:00Z");
      expect(sortedDates.length).toEqual(2);
    });

    it('should sort the keys inherent to the map (not inherited)', function() {
      var targetMap = {
        "2016-05-22T04:00:00Z": {"junk":123},
        "2016-02-22T04:00:00Z": {"junk":123},
        "2016-06-22T04:00:00Z": {"junk":123},
        "2015-05-22T04:00:00Z": {"junk":123}
      };

      var sortedDates = TimesheetUtil.sortDaysEntryDates(targetMap);

      expect(sortedDates[0]).toEqual("2015-05-22T04:00:00Z");
      expect(sortedDates[1]).toEqual("2016-02-22T04:00:00Z");
      expect(sortedDates[2]).toEqual("2016-05-22T04:00:00Z");
      expect(sortedDates[3]).toEqual("2016-06-22T04:00:00Z");
    });
  });

  describe('collateDays()', function() {
    it('should return an empty collation if there is no position info', function() {
      var targetPositionInfo = {};

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo);

      expect(TimesheetUtil.mapKeys(collatedInfo).length).toEqual(0);
    });
  });
});
