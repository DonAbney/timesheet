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

  self.displayError = function(statusCode, message) {
    $('.statusCode').text("" + statusCode);
    $('.statusMessage').text("" + message);
  };

  return self;
})();
