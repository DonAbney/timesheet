var TimesheetConfig = (function() {
  var self = {
    requestHeaders: {
      'Application-Identifier': "github.com/donabney/timesheet"
    },
    protocol: "https",
    host: "jee1vvadic.execute-api.us-east-1.amazonaws.com",
    api: {
      getTimesheetForUser: "/mock/api/timesheet/{email_shortname}/{date}",
      saveTimesheet: "/mock/api/timesheet/{id}",
      validateTimesheet: "/mock/api/timesheet/{id}/validate"
    },
    crossDomain: true
  };

  return self;
})();
