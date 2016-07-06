var TimesheetApiWrapper = (function(){
  var self = {};

  self.registerCredentials = function(token, username) {
    var deferred = $.Deferred();
    deferred.resolve();
    return deferred.promise();
  };

  self.saveTimesheet = function(timesheetId, hoursForTimesheetEntries) {
    var deferred = $.Deferred();
    var valueMap = {
      "{id}": timesheetId
    };

    $.ajax({
      url: generateURL(TimesheetConfig.api.saveTimesheet, valueMap),
      method: 'POST',
      crossDomain: TimesheetConfig.crossDomain,
      headers: TimesheetConfig.requestHeaders,
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify(hoursForTimesheetEntries)
    }).done(function(data) {
      deferred.resolve();
    }).fail(function(jqXHR) {
      ResponseHandling.makeErrorResponseVisible();
      valueMap["{requestBody}"] = hoursForTimesheetEntries;
      ResponseHandling.displayError(jqXHR, valueMap);
      deferred.reject();
    });

    return deferred.promise();
  };

  self.validateTimesheet = function(timesheetId) {
    var deferred = $.Deferred();
    var valueMap = {
      "{id}": timesheetId
    };

    $.ajax({
      url: generateURL(TimesheetConfig.api.validateTimesheet, valueMap),
      method: 'POST',
      crossDomain: TimesheetConfig.crossDomain,
      headers: TimesheetConfig.requestHeaders
    }).done(function(data) {
      deferred.resolve();
    }).fail(function(jqXHR) {
      ResponseHandling.makeErrorResponseVisible();
      ResponseHandling.displayError(jqXHR, valueMap);
      deferred.reject();
    });

    return deferred.promise();
  };

  self.fetchTimesheetInfo = function(username, date) {
    var deferred = $.Deferred();
    var valueMap = {
      "{email_shortname}": username,
      "{date}": TimesheetUtil.formatDateYYYYMMDD(date)
    };

    $.ajax({
      url: generateURL(TimesheetConfig.api.getTimesheetForUser, valueMap),
      crossDomain: TimesheetConfig.crossDomain,
      headers: TimesheetConfig.requestHeaders
    }).done(function(data) {
      deferred.resolve(data);
    }).fail(function(jqXHR) {
      ResponseHandling.makeErrorResponseVisible();
      ResponseHandling.displayError(jqXHR, valueMap);
      deferred.reject();
    });

    return deferred.promise();
  };

  function replaceAll(targetString, replacementMapping){
    var regex = new RegExp(Object.keys(replacementMapping).join("|"), "g");
    return targetString.replace(regex, function(matched) {
      return replacementMapping[matched];
    });
  };

  function generateURL(api, valueMap) {
    return TimesheetConfig.protocol + "://" + TimesheetConfig.host + replaceAll(api, valueMap);
  };

  return self;
})();
