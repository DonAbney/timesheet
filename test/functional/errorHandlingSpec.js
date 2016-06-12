describe('Showing and hiding response areas', function() {
  beforeEach(function() {
    var fixture = "<div id='fixture'><div id='errorResponse'></div><div id='successfulResponse'></div></div>";
    document.body.insertAdjacentHTML('afterbegin', fixture);
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });

  function setupErrorResponseAreaVisible() {
    $('#errorResponse').show();
  };

  function setupErrorResponseAreaNotVisible() {
    $('#errorResponse').hide();
  };

  function setupSuccessResponseAreaVisible() {
    $('#successfulResponse').show();
  };

  function setupSuccessResponseAreaNotVisible() {
    $('#successfulResponse').hide();
  };

  function isErrorResponseAreaVisible() {
    return $('#errorResponse').is(":visible");
  };

  function isSuccessResponseAreaVisible() {
    return $('#successfulResponse').is(":visible");
  };

  describe('makeErrorResponseVisible()', function() {
    it('should make sure the error response area is visible if it was previously not visible', function() {
      setupErrorResponseAreaNotVisible();

      ErrorHandling.makeErrorResponseVisible();

      expect(isErrorResponseAreaVisible()).toEqual(true);
    });

    it('should make sure the error response area remains visible if it was previously visible', function() {
      setupErrorResponseAreaVisible();

      ErrorHandling.makeErrorResponseVisible();

      expect(isErrorResponseAreaVisible()).toEqual(true);
    });

    it('should make sure the success response area is not visible if it was previously visible', function() {
      setupSuccessResponseAreaVisible();

      ErrorHandling.makeErrorResponseVisible();

      expect(isSuccessResponseAreaVisible()).toEqual(false);
    });

    it('should make sure the success response area remains not visible if it was previously not visible', function() {
      setupSuccessResponseAreaNotVisible();

      ErrorHandling.makeErrorResponseVisible();

      expect(isSuccessResponseAreaVisible()).toEqual(false);
    });
  });

  describe('makeSuccessResponseVisible()', function() {
    it('should make sure the success response area is visible if it was previously not visible', function() {
      setupSuccessResponseAreaNotVisible();

      ErrorHandling.makeSuccessResponseVisible();

      expect(isSuccessResponseAreaVisible()).toEqual(true);
    });

    it('should make sure the success response area remains visible if it was previously visible', function() {
      setupSuccessResponseAreaVisible();

      ErrorHandling.makeSuccessResponseVisible();

      expect(isSuccessResponseAreaVisible()).toEqual(true);
    });

    it('should make sure the error response area is not visible if it was previously visible', function() {
      setupErrorResponseAreaVisible();

      ErrorHandling.makeSuccessResponseVisible();

      expect(isErrorResponseAreaVisible()).toEqual(false);
    });

    it('should make sure the error response area remains not visible if it was previously not visible', function() {
      setupErrorResponseAreaNotVisible();

      ErrorHandling.makeSuccessResponseVisible();

      expect(isErrorResponseAreaVisible()).toEqual(false);
    });
  });
});
