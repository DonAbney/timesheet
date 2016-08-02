var ResponseHandling = (function() {
  var self = {};

  self.displayMessage = function(type, message) {
    var messageArea = $('#messageArea');
    messageArea.append(constructMessageElement(type, message));
  };

  function constructMessageElement(type, message) {
    var messageElement = document.createElement('div');
    messageElement.className = type + ' callout';
    messageElement.innerHTML = message;
    messageElement.setAttribute('data-closable', 'slide-out-right');
    var closeButton = constructMessageCloseButton();
    messageElement.insertAdjacentElement('beforeend', closeButton);
    $(closeButton).click(function() {
      document.getElementById('messageArea').removeChild(messageElement).remove();
    });
    return messageElement;
  }

  function constructMessageCloseButton() {
    var messageCloseButton = document.createElement('button');
    messageCloseButton.className = 'close-button';
    messageCloseButton.setAttribute('aria-label', 'Dismiss alert');
    messageCloseButton.setAttribute('data-close', '');
    messageCloseButton.setAttribute('type', 'button');
    var decorator = document.createElement('span');
    decorator.setAttribute('aria-hidden', 'true');
    decorator.innerHTML = '&times;';
    messageCloseButton.insertAdjacentElement('beforeend', decorator);
    return messageCloseButton;
  }

  self.displayError = function(jqXHR, requestInfo) {
    var statusMessage = JSON.parse(jqXHR.responseText).message;
    self.displayMessage('alert', statusMessage);
  };

  self.displayErrorMessage = function(message) {
    self.displayMessage('alert', message);
  };

  self.displaySuccessMessage = function(message) {
    self.displayMessage('success', message);
  };

  return self;
})();
