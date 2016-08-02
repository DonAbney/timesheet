describe('Error handling', function() {
  beforeEach(function() {
    var fixture = "<div id='fixture'><div class='wrapper-generatedErrorInfo'></div></div>";
    document.body.insertAdjacentHTML('afterbegin', fixture);
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });

  describe('for showing error response information', function() {
    describe('via displayError()', function() {
      var jqXHR = {
        status: 302,
        statusText: "standard status code message",
        responseText: '{ "status": 302, "message": "request was lost during testing"}'
      };

      var requestInfo = {
        value1: "some value",
        value2: "another value"
      };

      it('should set the status code to the provided status code', function() {
        ResponseHandling.displayError(jqXHR, requestInfo);

        expect($('.wrapper-generatedErrorInfo .statusCode').text()).toEqual("[302] standard status code message");
      });

      it('should set the status message to the provided message', function() {
        ResponseHandling.displayError(jqXHR, requestInfo);

        expect($('.wrapper-generatedErrorInfo .statusMessage').text()).toEqual("request was lost during testing");
      });

      it('should display the provided request information', function() {
        ResponseHandling.displayError(jqXHR, requestInfo);

        expect($('.wrapper-generatedErrorInfo .requestInfo-key:eq(0)').text()).toEqual("value1");
        expect($('.wrapper-generatedErrorInfo .requestInfo-value:eq(0)').text()).toEqual("some value");
        expect($('.wrapper-generatedErrorInfo .requestInfo-key:eq(1)').text()).toEqual("value2");
        expect($('.wrapper-generatedErrorInfo .requestInfo-value:eq(1)').text()).toEqual("another value");
      });
    });

    describe('via displayErrorMessage()', function() {
      var message = "some generic error message for testing";

      it('should not include any information within the status code area', function() {
        ResponseHandling.displayErrorMessage(message);

        expect($('.wrapper-generatedErrorInfo .statusCode').text()).toEqual("");
      });

      it('should set the status message to the provided message', function() {
        ResponseHandling.displayErrorMessage(message);

        expect($('.wrapper-generatedErrorInfo .statusMessage').text()).toEqual(message);
      });

      it('should not display any request information', function() {
        ResponseHandling.displayErrorMessage(message);

        expect($('.wrapper-generatedErrorInfo .requestInfo-key').length).toEqual(0);
        expect($('.wrapper-generatedErrorInfo .requestInfo-value').length).toEqual(0);
      });
    });
  });
});
