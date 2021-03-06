var TimesheetApiWrapper = (function(){
  var self = {};

  self.registerCredentials = function(token, username) {
    var deferred = $.Deferred();
    if (username) {
      deferred.resolve();
    } else {
      deferred.reject({
        jqXHR: {
          status: '403',
          statusText: 'Forbidden',
          responseText: '{"message": "Access Denied.  Please ensure that you are logging in with your Pillar account."}'
        },
        valueMap: {}
      });
    }
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
      valueMap["{requestBody}"] = hoursForTimesheetEntries;
      deferred.reject({
        jqXHR: jqXHR,
        valueMap: valueMap
      });
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
      deferred.reject({
        jqXHR: jqXHR,
        valueMap: valueMap
      });
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
      deferred.reject({
        jqXHR: jqXHR,
        valueMap: valueMap
      });
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
