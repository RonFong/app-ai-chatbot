var portalLib = require('/lib/xp/portal');

exports.getAppUrl = function getAppUrl() {
  return portalLib.url({ path: '/app/' + app.name });
};

exports.getRasaUrl = function getRasaUrl(conversationId) {
  var url = portalLib.url({ path: '/', type: 'absolute' });
  var firstIndex = url.indexOf(':');
  var lastIndex = url.lastIndexOf(':');
  if (firstIndex !== lastIndex && lastIndex >= 0) {
    url = url.substring(0, lastIndex) + ':7454/';
  }
  return url + 'conversations/' + conversationId + '/';
};

exports.getBaseUrl = function() {
  var appUrl = this.getAppUrl();
  return this.endsWithSlash(appUrl) ? appUrl.slice(0, -1) : appUrl;
};

exports.getLoginUrl = function() {
  return portalLib.loginUrl({
    redirect: this.getAppUrl()
  });
};

exports.endsWithSlash = function(url) {
  return url.slice(-1) === '/';
};
