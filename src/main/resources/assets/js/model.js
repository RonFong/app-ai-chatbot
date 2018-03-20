const templates = {
  utter_greet: { says: ['Hey there!'] },
  utter_goodbye: { says: ['Bye-bye!'] },
  utter_default: { says: ['default message'] },
  utter_ack_dosearch: { says: ['Okay, let me see what I can find.'] },
  utter_ack_findalternatives: { says: ['Okay, let me see what else there is'] },
  utter_ack_makereservation: {
    says: ['Okay, making a reservation.'],
    reply: [
      {
        question: 'Thank you!',
        answer: 'thankyouHandler'
      }
    ]
  },
  utter_ask_cuisine: { says: ['What kind of cuisine would you like?'] },
  utter_ask_howcanhelp: { says: ['How can I help you?'] },
  utter_ask_location: { says: ['Where?'] },
  utter_ask_moreupdates: {
    says: ["If you'd like to modify anything else, please tell me what."]
  },
  utter_ask_numpeople: { says: ['For how many people?'] },
  utter_ask_price: {
    says: ['In which price range?'],
    reply: [
      {
        question: 'cheap',
        answer: 'cheapOptionEvents'
      },
      {
        question: 'expensive',
        answer: 'expensiveOptionEvents'
      }
    ]
  },
  utter_on_it: { says: ["I'm on it"] }
};

let buttonClickListeners = [];

function notifyButtonClick(json) {
  buttonClickListeners.forEach(listener => listener(json));
}

window.cheapOptionEvents = function cheapOptionEvents() {
  notifyButtonClick({ event: 'slot', name: 'price', value: 'cheap' });
};

window.expensiveOptionEvents = function expensiveOptionEvents() {
  notifyButtonClick({ event: 'slot', name: 'price', value: 'expensive' });
};

function onButtonClick(callback) {
  buttonClickListeners.push(callback);
}

function unButtonClick(callback) {
  buttonClickListeners = buttonClickListeners.filter(
    current => current !== callback
  );
}

module.exports = {
  templates,
  onButtonClick,
  unButtonClick
};
