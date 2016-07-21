function generateBasicTimesheetInstanceData() {
  return {
    "id": 789,
    "startDate": "2016-05-14T04:00:00Z",
    "endDate": "2016-05-21T04:00:00Z",
    "employee": {
      "id": 23
    },
    "validated": false
  };
};

function generateBasicValidatedTimesheetInstanceData() {
  return {
    "id": 789,
    "startDate": "2016-05-14T04:00:00Z",
    "endDate": "2016-05-21T04:00:00Z",
    "employee": {
      "id": 23
    },
    "validated": true
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

function generateTimesheetInfo() {
  return {
    "timesheetInstance": generateBasicTimesheetInstanceData(),
    "timeEntryPositionMapByDate": [
      generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}, "te2": {date: "2016-05-30T04:00:00Z"}}),
      generatePositionAndTimeEntryInfo({"id": "p2"}, {"te3": {date: "2016-05-31T04:00:00Z"}, "te4": {date: "2016-05-30T04:00:00Z"}})
    ]
  };
};

function generateValidatedTimesheetInfo() {
  return {
    "timesheetInstance": generateBasicValidatedTimesheetInstanceData(),
    "timeEntryPositionMapByDate": [
      generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}, "te2": {date: "2016-05-30T04:00:00Z"}}),
      generatePositionAndTimeEntryInfo({"id": "p2"}, {"te3": {date: "2016-05-31T04:00:00Z"}, "te4": {date: "2016-05-30T04:00:00Z"}})
    ]
  };
};

function generateTimesheetInfoWithExistingHours() {
  return {
    "timesheetInstance": generateBasicTimesheetInstanceData(),
    "timeEntryPositionMapByDate": [
      generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z", hours: 1}, "te2": {date: "2016-05-30T04:00:00Z", hours: 2}}),
      generatePositionAndTimeEntryInfo({"id": "p2"}, {"te3": {date: "2016-05-31T04:00:00Z", hours: 3}, "te4": {date: "2016-05-30T04:00:00Z", hours: 5}})
    ]
  };
};

function generateTimesheetInfoWithOneTimeEntry() {
  return {
    "timesheetInstance": generateBasicTimesheetInstanceData(),
    "timeEntryPositionMapByDate": [
      generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z"}})
    ]
  };
};

function generateTimesheetInfoWithOneTimeEntryAndExistingHours() {
  return {
    "timesheetInstance": generateBasicTimesheetInstanceData(),
    "timeEntryPositionMapByDate": [
      generatePositionAndTimeEntryInfo({"id": "p1"}, {"te1": {date: "2016-05-31T04:00:00Z", hours: 3}})
    ]
  };
};

function enterHours(timeEntryId, numHours) {
  $('#' + timeEntryId).val("" + numHours);
  $('#' + timeEntryId).change();
};
