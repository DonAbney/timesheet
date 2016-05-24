describe('TimesheetUtil', function() {
  describe('mapKeys()', function() {
    it('should return a known key for the object in the returned array of keys', function() {
      var targetMap = {
        "joe": 123,
        "sam": 234
      };

      var keys = TimesheetUtil.mapKeys(targetMap);

      expect(keys).toContain("joe");
    });

    it('should return all keys specified in the map', function() {
      var targetMap = {
        "joe": 123,
        "sam": 234
      };

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
});
