describe('Messaging', function() {
  beforeEach(function() {
    var fixture = "<div id='fixture'><div id='messageArea'></div></div>";
    document.body.insertAdjacentHTML('afterbegin', fixture);
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });

  function getMessageText() {
    return document.getElementById('messageArea').childNodes[0].childNodes[0].nodeValue;
  }

  describe('via displayMessage()', function() {
    it('should add an element to the messageArea with the target type as a class of the element', function() {
      ResponseHandling.displayMessage('personalMessage', 'some message text');

      expect($('#messageArea .personalMessage').length).toEqual(1);
    });

    it('should include the message text in the element added to the messageArea', function() {
      ResponseHandling.displayMessage('testMessage', 'some silly message text');

      expect(getMessageText()).toEqual('some silly message text');
    });

    it('should include a button to close the message', function() {
      ResponseHandling.displayMessage('testMessage', 'some message');

      expect($('#messageArea .testMessage button').length).toEqual(1);
    });

    it('should allow for multiple messages to be added', function() {
      ResponseHandling.displayMessage('testMessage', "message 1");
      ResponseHandling.displayMessage('testMessage', "message 2");

      expect($('#messageArea .testMessage').length).toEqual(2);
    });
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

      it('should set the status message to the provided message', function() {
        ResponseHandling.displayError(jqXHR, requestInfo);

        expect(getMessageText()).toEqual("request was lost during testing");
      });

      it('should have a class of alert', function() {
        ResponseHandling.displayError(jqXHR, requestInfo);

        expect($('#messageArea .alert').length).toEqual(1);
      });
    });

    describe('via displayErrorMessage()', function() {
      var message = "some generic error message for testing";

      it('should set the status message to the provided message', function() {
        ResponseHandling.displayErrorMessage(message);

        expect(getMessageText()).toEqual(message);
      });

      it('should have a class of alert', function() {
        ResponseHandling.displayErrorMessage(message);

        expect($('#messageArea .alert').length).toEqual(1);
      });
    });
  });
});
