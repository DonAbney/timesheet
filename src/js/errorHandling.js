var ErrorHandling = (function() {
  var self = {};

  self.makeErrorResponseVisible = function() {
    $('#errorResponse').show();
    $('#successfulResponse').hide();
  };

  self.makeSuccessResponseVisible = function() {
    $('#successfulResponse').show();
    $('#errorResponse').hide();
  };

  return self;
})();
