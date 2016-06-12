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

  self.displayError = function(jqXHR) {
    $('.statusCode').text("[" + jqXHR.status + "] " + jqXHR.statusText);
    $('.statusMessage').text(JSON.parse(jqXHR.responseText).message);
  };

  return self;
})();
