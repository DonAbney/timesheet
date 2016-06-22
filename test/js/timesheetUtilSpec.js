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

  describe('hasEnteredTimeChanged()', function() {
    function setupEnteredTime(hours, lastSavedHours) {
      return {
        "hours": hours,
        "last-saved-hours": lastSavedHours
      }
    }

    it('should return false if no time entry information was provided', function() {
      expect(TimesheetUtil.hasEnteredTimeChanged({})).toEqual(false);
    });

    it('should return false if no time entry information has changed', function() {
      var enteredTimes = {
        "1": setupEnteredTime(2, 2),
        "2": setupEnteredTime(5, 5)
      };

      expect(TimesheetUtil.hasEnteredTimeChanged(enteredTimes)).toEqual(false);
    });

    it('should return true if time entred for an entry has changed', function() {
      var enteredTimes = {
        "1": setupEnteredTime(3, 5),
        "2": setupEnteredTime(2, 2)
      };

      expect(TimesheetUtil.hasEnteredTimeChanged(enteredTimes)).toEqual(true);
    });

    it('should return true if time entred for multiple entries has changed', function() {
      var enteredTimes = {
        "1": setupEnteredTime(3, 5),
        "2": setupEnteredTime(1, 4)
      };

      expect(TimesheetUtil.hasEnteredTimeChanged(enteredTimes)).toEqual(true);
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

  describe('formatDateYYYYMMDD()', function() {
    it('should reformat a string date into YYYY-MM-DD', function() {
      var targetDate = '05/22/2016';

      expect(TimesheetUtil.formatDateYYYYMMDD(targetDate)).toEqual("2016-05-22");
    });

    it('should work even if a date object is passed in', function() {
      var targetDate = new Date(2016, 4, 22);

      expect(TimesheetUtil.formatDateYYYYMMDD(targetDate)).toEqual("2016-05-22");
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
      var targetPositionInfo = [];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, []);

      expect(TimesheetUtil.mapKeys(collatedInfo).length).toEqual(0);
    });

    it('should return an empty collation if there is position info with no time entry info', function() {
      var targetPositionInfo = [
        {
          "position": {},
          "timeEntries": []
        },
        {
          "position": {},
          "timeEntries": []
        }
      ];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, []);

      expect(TimesheetUtil.mapKeys(collatedInfo).length).toEqual(0);
    });

    it('should return a time entry for a day if one is provided in the position info', function() {
      var targetPositionInfo = [
        {
          "position": {
            id: 32
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z"
            }
          ]
        },
        {
          "position": {
            id: 12
          },
          "timeEntries": []
        }
      ];
      var targetPositions = [
        { id: 32 },
        { id: 12 }
      ];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, targetPositions);

      expect(TimesheetUtil.mapKeys(collatedInfo)).toContain("2016-06-22T04:00:00Z");
    });

    it('should return time entries for each day provided in any position info', function() {
      var targetPositionInfo = [
        {
          "position": {
            id: 32
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z"
            }
          ]
        },
        {
          "position": {
            id: 12
          },
          "timeEntries": [
            {
              "date": "2016-05-22T04:00:00Z"
            },
            {
              "date": "2016-04-22T04:00:00Z"
            }
          ]
        }
      ];
      var targetPositions = [
        { id: 32 },
        { id: 12 }
      ];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, targetPositions);

      expect(TimesheetUtil.mapKeys(collatedInfo)).toContain("2016-06-22T04:00:00Z");
      expect(TimesheetUtil.mapKeys(collatedInfo)).toContain("2016-05-22T04:00:00Z");
      expect(TimesheetUtil.mapKeys(collatedInfo)).toContain("2016-04-22T04:00:00Z");
    });

    it('should include the position name in the collated info', function() {
      var targetPositionInfo = [
        {
          "position": {
            id: 32,
            "name": "some position name"
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z"
            }
          ]
        }
      ];
      var targetPositions = [
        { id: 32 }
      ];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, targetPositions);

      expect(collatedInfo["2016-06-22T04:00:00Z"][0].position.name).toEqual("some position name");
    });

    it('should include the position note in the collated info', function() {
      var targetPositionInfo = [
        {
          "position": {
            id: 32,
            "note": "some position note"
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z"
            }
          ]
        }
      ];
      var targetPositions = [
        {id: 32 }
      ];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, targetPositions);

      expect(collatedInfo["2016-06-22T04:00:00Z"][0].position.note).toEqual("some position note");
    });

    it('should include the date in the collated info', function() {
      var targetPositionInfo = [
        {
          "position": {
            id: 32
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z"
            }
          ]
        }
      ];
      var targetPositions = [
        {id: 32 }
      ];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, targetPositions);

      expect(collatedInfo["2016-06-22T04:00:00Z"][0].date).toEqual("2016-06-22T04:00:00Z");
    });

    it('should include the time entry id in the collated info', function() {
      var targetPositionInfo = [
        {
          "position": {
            id: 32
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z",
              "id": 123
            }
          ]
        }
      ];
      var targetPositions = [
        {id: 32 }
      ];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, targetPositions);

      expect(collatedInfo["2016-06-22T04:00:00Z"][0].id).toEqual(123);
    });

    it('should include the number of hours in the collated info', function() {
      var targetPositionInfo = [
        {
          "position": {
            id: 32
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z",
              "hours": 5
            }
          ]
        }
      ];
      var targetPositions = [
        {id: 32 }
      ];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, targetPositions);

      expect(collatedInfo["2016-06-22T04:00:00Z"][0].hours).toEqual(5);
    });

    it('should include the number of projected hours in the collated info', function() {
      var targetPositionInfo = [
        {
          "position": {
            id: 32
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z",
              "projectedHours": 8.5
            }
          ]
        }
      ];
      var targetPositions = [
        {id: 32 }
      ];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, targetPositions);

      expect(collatedInfo["2016-06-22T04:00:00Z"][0].projectedHours).toEqual(8.5);
    });

    it('should include the position id in the collated info', function() {
      var targetPositionInfo = [
        {
          "position": {
            "id": 32
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z"
            }
          ]
        }
      ];
      var targetPositions = [
        {id: 32 }
      ];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, targetPositions);

      expect(collatedInfo["2016-06-22T04:00:00Z"][0].position.id).toEqual(32);
    });

    it('should accumulate all time entries for a given date across positions', function() {
      var targetPositionInfo = [
        {
          "position": {
            "id": 32
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z",
              "id": 12
            }
          ]
        },
        {
          "position": {
            "id": 11
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z",
              "id": 21
            }
          ]
        }
      ];
      var targetPositions = [
        {id: 32 },
        {id: 11 }
      ];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, targetPositions);

      expect(collatedInfo["2016-06-22T04:00:00Z"].length).toEqual(2);
      expect(collatedInfo["2016-06-22T04:00:00Z"]).toContain(jasmine.objectContaining({position: jasmine.objectContaining({id: 32}), id: 12}));
      expect(collatedInfo["2016-06-22T04:00:00Z"]).toContain(jasmine.objectContaining({position: jasmine.objectContaining({id: 11}), id: 21}));
    });

    it('should arrange the time entries in the same order as the positions within the day', function() {
      var targetPositionInfo = [
        {
          "position": {
            "id": 32
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z",
              "id": 12
            }
          ]
        },
        {
          "position": {
            "id": 11
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z",
              "id": 21
            }
          ]
        },
        {
          "position": {
            "id": 44
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z",
              "id": 9
            }
          ]
        }
      ];
      var targetPositions = [
        {id: 32 },
        {id: 11 },
        {id: 44 }
      ];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, targetPositions);

      expect(collatedInfo["2016-06-22T04:00:00Z"][0]).toEqual(jasmine.objectContaining({position: jasmine.objectContaining({id: 32}), id: 12}));
      expect(collatedInfo["2016-06-22T04:00:00Z"][1]).toEqual(jasmine.objectContaining({position: jasmine.objectContaining({id: 11}), id: 21}));
      expect(collatedInfo["2016-06-22T04:00:00Z"][2]).toEqual(jasmine.objectContaining({position: jasmine.objectContaining({id: 44}), id: 9}));
    });

    it('should generate a placeholder time entry for any missing time entries for a position for a day', function() {
      var targetPositionInfo = [
        {
          "position": {
            "id": 32
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z",
              "id": 12
            }
          ]
        },
        {
          "position": {
            "id": 11
          },
          "timeEntries": [
            {
              "date": "2016-06-23T04:00:00Z",
              "id": 21
            }
          ]
        },
        {
          "position": {
            "id": 44
          },
          "timeEntries": [
            {
              "date": "2016-06-22T04:00:00Z",
              "id": 9
            }
          ]
        }
      ];
      var targetPositions = [
        {id: 32 },
        {id: 11 },
        {id: 44 }
      ];

      var collatedInfo = TimesheetUtil.collateDays(targetPositionInfo, targetPositions);

      expect(collatedInfo["2016-06-22T04:00:00Z"][1]).toEqual(jasmine.objectContaining({position: jasmine.objectContaining({id: 11}), id: "placeholder_11_2016-06-22"}));
    });
  });

  describe('collatePositions()', function() {
    it('should return an empty array if there are no positions in the position info', function() {
      var targetPositionInfo = [];

      var collatedInfo = TimesheetUtil.collatePositions(targetPositionInfo);

      expect(collatedInfo.length).toEqual(0);
    });

    it('should return an element for each position in the position info', function() {
      var targetPositionInfo = [
        {
          "position": {
            "id": 32
          }
        },
        {
          "position": {
            "id": 11
          }
        }
      ];

      var collatedInfo = TimesheetUtil.collatePositions(targetPositionInfo);

      expect(collatedInfo.length).toEqual(2);
      expect(collatedInfo[0].id).toEqual(32);
      expect(collatedInfo[1].id).toEqual(11);
    });

    it('should capture the position name', function() {
      var targetPositionInfo = [
        {
          "position": {
            "id": 32,
            "name": "joe"
          }
        }
      ];

      var collatedInfo = TimesheetUtil.collatePositions(targetPositionInfo);

      expect(collatedInfo[0].name).toEqual("joe");
    });

    it('should capture the position note', function() {
      var targetPositionInfo = [
        {
          "position": {
            "id": 32,
            "note": "joe's note"
          }
        }
      ];

      var collatedInfo = TimesheetUtil.collatePositions(targetPositionInfo);

      expect(collatedInfo[0].note).toEqual("joe's note");
    });
  });

  describe('convertToTimeEntries()', function() {
    it('should contain a single time entry when only one entered hours information was provided', function() {
      var enteredHours = {
        "123": {
          id: 123,
          date: "2016-06-22T04:00:00Z",
          'last-saved-hours': 5,
          hours: 6
        }
      };

      var timeEntries = TimesheetUtil.convertToTimeEntries(enteredHours);

      expect(timeEntries.length).toEqual(1);
    });

    it('should contain a time entry for each entered hours information provided', function() {
      var enteredHours = {
        "123": {
          id: 123,
          date: "2016-06-22T04:00:00Z",
          'last-saved-hours': 5,
          hours: 6
        },
        "456": {
          id: 456,
          date: "2016-06-23T04:00:00Z",
          'last-saved-hours': 2,
          hours: 2
        }
      };

      var timeEntries = TimesheetUtil.convertToTimeEntries(enteredHours);

      expect(timeEntries.length).toEqual(2);
    });

    it('should contain the id and hours for the time entry for the entered hours information provided', function() {
      var enteredHours = {
        "123": {
          id: 123,
          date: "2016-06-22T04:00:00Z",
          'last-saved-hours': 5,
          hours: 6
        },
        "456": {
          id: 456,
          date: "2016-06-23T04:00:00Z",
          'last-saved-hours': 2,
          hours: 2
        }
      };

      var timeEntries = TimesheetUtil.convertToTimeEntries(enteredHours);

      var timeEntriesIds = [];
      timeEntries.forEach(function(value) {
        timeEntriesIds.push(value.id);
      });
      expect(timeEntriesIds).toContain(123);
      expect(timeEntriesIds).toContain(456);
    });

    it('should contain the hours for the time entry for the entered hours information provided', function() {
      var enteredHours = {
        "123": {
          id: 123,
          date: "2016-06-22T04:00:00Z",
          'last-saved-hours': 5,
          hours: 6
        }
      };

      var timeEntries = TimesheetUtil.convertToTimeEntries(enteredHours);

      expect(timeEntries[0].hours).toEqual(6);
    });
  });
});
