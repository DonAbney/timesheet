var ResponseHandling = (function() {
  var self = {};

  self.AUTO_CLOSE_DURATION = 3000;
  self.WAIT_BEFORE_REMOVE = 2000;

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
    registerCloseEvents(closeButton, messageElement);
    return messageElement;
  }

  function registerCloseEvents(closeButton, messageElement) {
    $(closeButton).click(function() {
      window.setTimeout(function() {
        try {
          document.getElementById('messageArea').removeChild(messageElement).remove();
        } catch (e) { /* safe to ignore */ }
      }, self.WAIT_BEFORE_REMOVE);
    });
    window.setTimeout(function() {
      $(closeButton).click();
    }, self.AUTO_CLOSE_DURATION);
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
