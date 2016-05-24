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
  });
});
