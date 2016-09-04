
import { State } from 'jumpsuit';
var firebase = require('firebase');
export var firebase_initialized = false;

var config = {
  apiKey: "AIzaSyCb0Xe0-wxCskS2fVwfNEe_b1NdfbYff90",
  authDomain: "midi-remote-23d30.firebaseapp.com",
  databaseURL: "https://midi-remote-23d30.firebaseio.com",
  storageBucket: "midi-remote-23d30.appspot.com",
};

const firebaseState = State('database', {
  initial: {
    ready: false,
    data: [],
    extendedHeader: false,
  },

  updateSearch: (state, payload) => ({
      ready: true,
      data: payload
  }),
    setExtended: (state, extended) => ({
        extendedHeader: extended
    })
});

export default firebaseState

export function addData(data) {
  var key = firebase.database().ref('user_input');
  key.push({data: data});
  return key;
}

export function toggleExtended(value, event) {
    firebaseState.setExtended(!value);
}

export function initializeFirebase() {
    if (firebase_initialized) {
        return;
    }
    firebase.initializeApp(config);
    firebase_initialized = true;
}
