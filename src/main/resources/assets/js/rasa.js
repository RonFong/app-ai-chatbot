let responseListeners = [];
let failureListeners = [];
const sender = Date.now();

const actions = {
  ACTION_LISTEN: 'action_listen',
  ASK_PRICE: 'utter_ask_price',
  ON_IT: 'utter_on_it'
};

function postAjax(url, method, data, success, failure) {
  const params = `data=${JSON.stringify(data)}`;

  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onreadystatechange = () => {
    if (xhr.readyState > 3) {
      if (success && xhr.status === 200) {
        success(JSON.parse(xhr.responseText));
      } else if (failure) {
        failure(JSON.parse(xhr.responseText), xhr.status);
      }
    }
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', '*/*');
  xhr.send(params);
  return xhr;
}

function notifyResponse(json) {
  console.log('RASA RESPONSE', json);
  responseListeners.forEach(listener => listener(json));
}

function notifyFailure(json) {
  console.log('RASA FAILURE', json);
  failureListeners.forEach(listener => listener(json));
}

function results(params) {
  const data = {};
  if (params) {
    data.sender = params.sender;
    data.user = params.user;
    data.startDate = params.start;
    data.endDate = params.end;
  }
  return postAjax(
    // eslint-disable-next-line no-undef
    `${appUrl}/rasa/results`,
    'POST',
    data,
    notifyResponse,
    notifyFailure
  );
}

function message(query) {
  postAjax(
    // eslint-disable-next-line no-undef
    `${appUrl}/rasa/parse`,
    'POST',
    { query, sender },
    notifyResponse,
    notifyFailure
  );
}

function version() {
  postAjax(
    // eslint-disable-next-line no-undef
    `${appUrl}/rasa/version`,
    'POST',
    { sender },
    notifyResponse,
    notifyFailure
  );
}

function tracker() {
  postAjax(
    // eslint-disable-next-line no-undef
    `${appUrl}/rasa/tracker`,
    'POST',
    { sender },
    notifyResponse,
    notifyFailure
  );
}

function action(a, events) {
  const data = {};
  if (a) {
    data.action = a;
  }
  if (events) {
    data.events = [].concat(events);
  }
  // eslint-disable-next-line no-undef
  postAjax(`${appUrl}/rasa/continue`, 'POST', data, notifyResponse);
}

function restart() {
  action(actions.ACTION_LISTEN, { event: 'restart' });
}

function onResponse(callback) {
  responseListeners.push(callback);
}

function unResponse(callback) {
  responseListeners = responseListeners.filter(current => current !== callback);
}

function onFailure(callback) {
  failureListeners.push(callback);
}

function unFailure(callback) {
  failureListeners = failureListeners.filter(current => current !== callback);
}

function getSender() {
  return sender;
}

module.exports = {
  message,
  action,
  version,
  restart,
  tracker,
  results,
  actions,
  getSender,
  onResponse,
  unResponse,
  onFailure,
  unFailure
};
