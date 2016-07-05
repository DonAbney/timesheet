var TimesheetConfig = (function() {
  var self = {
    requestHeaders: {
      'Application-Identifier': "github.com/donabney/timesheet"
    },
    protocol: "https",
    host: "jee1vvadic.execute-api.us-east-1.amazonaws.com",
    api: {
      getTimesheetForUser: "/timesheet/api/timesheet/{email_shortname}/{date}",
      saveTimesheet: "/timesheet/api/timesheet/{id}",
      validateTimesheet: "/timesheet/api/timesheet/{id}/validate"
    },
    crossDomain: true,
    aws: {
      useApiGateway: true
    }
  };

  return self;
})();
