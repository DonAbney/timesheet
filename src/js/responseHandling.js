var ResponseHandling = (function() {
  var self = {};

  self.makeErrorResponseVisible = function() {
    $('#errorResponse').show();
    $('#successfulResponse').hide();
  };

  self.makeSuccessResponseVisible = function() {
    $('#successfulResponse').show();
    $('#errorResponse').hide();
  };

  self.displayError = function(jqXHR, requestInfo) {
    var wrapper = $('.wrapper-generatedErrorInfo');
    var statusCodeText = "[" + jqXHR.status + "] " + jqXHR.statusText;
    var statusMessage = JSON.parse(jqXHR.responseText).message;
    wrapper.append(constructErrorInfo(statusCodeText, statusMessage, requestInfo));
  };

  self.displayErrorMessage = function(message) {
    var wrapper = $('.wrapper-generatedErrorInfo');
    wrapper.append(constructErrorInfo('', message, ''));
  }

  function constructErrorInfo(statusCodeText, statusMessage, requestInfo) {
    var errorInfo = document.createElement('div');
    errorInfo.className = 'errorInfo';
    errorInfo.insertAdjacentElement('beforeend', constructErrorStatus(statusCodeText));
    errorInfo.insertAdjacentElement('beforeend', constructStatusMessage(statusMessage));
    errorInfo.insertAdjacentElement('beforeend', constructRequestInfo(requestInfo));
    return errorInfo;
  };

  function constructErrorStatus(statusCodeText) {
    var statusCode = document.createElement('div');
    statusCode.className = 'statusCode';
    statusCode.innerHTML = statusCodeText;
    return statusCode;
  };

  function constructStatusMessage(statusMessage) {
    var statusMessageElement = document.createElement('div');
    statusMessageElement.className = 'statusMessage';
    statusMessageElement.innerHTML = statusMessage;
    return statusMessageElement;
  }

  function constructRequestInfo(requestInfo) {
    var requestInfoWrapper = document.createElement('div');
    requestInfoWrapper.className = 'requestInfo';
    TimesheetUtil.mapKeys(requestInfo).forEach(function(key) {
      requestInfoWrapper.insertAdjacentElement('beforeend', constructKeyElement(key));
      requestInfoWrapper.insertAdjacentElement('beforeend', constructValueElement(requestInfo[key]));
    });
    return requestInfoWrapper;
  }

  function constructKeyElement(key) {
    var keyElement = document.createElement('div');
    keyElement.className = 'requestInfo-key';
    keyElement.innerHTML = key;
    return keyElement;
  }

  function constructValueElement(value) {
    var valueElement = document.createElement('div');
    valueElement.className = 'requestInfo-value';
    valueElement.innerHTML = value;
    return valueElement;
  }

  return self;
})();
