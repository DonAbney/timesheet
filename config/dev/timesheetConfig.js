var TimesheetConfig = (function() {
  var self = {
    requestHeaders: {
      'Application-Identifier': "github.com/donabney/timesheet"
    },
    protocol: "http",
    host: "private-696ecf-ddaugherfba.apiary-mock.com",
    api: {
      getTimesheetForUser: "/fba/api/timesheet/{email_shortname}/{date}",
      saveTimesheet: "/fba/api/timesheet/{id}",
      validateTimesheet: "/fba/api/timesheet/{id}/validate"
    },
    crossDomain: true,
    aws: {
      useApiGateway: false
    }
  };

  // self.requestHeaders.Prefer = "status=404"  // This is for mocked error responses with apiary to assist with manual testing

  return self;
})();
