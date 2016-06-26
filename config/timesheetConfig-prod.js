var TimesheetConfig = (function() {
  var self = {
    requestHeaders: {
      'Application-Identifier': "github.com/donabney/timesheet"
    },
    protocol: "https",
    host: "jee1vvadic.execute-api.us-east-1.amazonaws.com",
    api: {
      getTimesheetForUser: "/prod/api/timesheet/{email_shortname}/{date}",
      saveTimesheet: "/prod/api/timesheet/{id}",
      validateTimesheet: "/prod/api/timesheet/{id}/validate"
    },
    crossDomain: true
  };

  return self;
})();
