var TimesheetConfig = (function() {
  var self = {
    requestHeaders: {
      'Application-Identifier': "github.com/donabney/timesheet"
    },
    aws: {
      apigClient: null
    }
  };

  return self;
})();
