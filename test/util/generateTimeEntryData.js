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
        "date": timeEntryInfo[key].hasOwnProperty("date") ? timeEntryInfo[key].date : "2015-05-03T04:00:00Z",
        "hours": timeEntryInfo[key].hasOwnProperty("hours") ? timeEntryInfo[key].hours : 0
      };
      entries.push(entry);
    });
    return entries;
  };

  return {
    "position": {
      "id": positionInfo.hasOwnProperty("id") ? positionInfo.id : "001",
      "name": positionInfo.hasOwnProperty("name") ? positionInfo.name : "someName",
      "note": positionInfo.hasOwnProperty("note") ? positionInfo.note : "someNote"
    },
    "timeEntries": generateTimeEntries(timeEntryInfo)
  }
};
