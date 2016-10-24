/**
 * Created by jonh on 23.10.2016.
 */
import {State} from 'jumpsuit'
import firebase from 'firebase'
import {NotificationManager} from 'react-notifications'

export var firebase_initialized = false;

var config = {
  apiKey: "AIzaSyCb0Xe0-wxCskS2fVwfNEe_b1NdfbYff90",
  authDomain: "midi-remote-23d30.firebaseapp.com",
  databaseURL: "https://midi-remote-23d30.firebaseio.com",
  storageBucket: "midi-remote-23d30.appspot.com",
};


const authentication = State('authentication', {
  initial: {
    loggedIn: false,
    user: '',
    userName: '',
    userEmail: '',
    showLoginModal: false,
    loginEmail: '',
    loginPassword: ''
  },

  setUsingKeyValue: (state, payload) => ({
    [payload.key]: payload.value
  }),

});

export default authentication

export function startFirebaseAuthStateMonitor() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      authentication.setUsingKeyValue({key: 'user', value: user});
      authentication.setUsingKeyValue({key: 'userName', value: user.displayName});
      authentication.setUsingKeyValue({key: 'userEmail', value: user.email});

    } else {
      authentication.setUsingKeyValue({key: 'user', value: ''});
      authentication.setUsingKeyValue({key: 'userName', value: ''});
      authentication.setUsingKeyValue({key: 'userEmail', value: ''});
    }
  });
}

export function loginUser(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    NotificationManager.error(errorMessage, "Login Error: " + errorCode, 5000)
  });
}

export function signOutUser(){
  firebase.auth().signOut().then(function() {
    NotificationManager.info("User signed out", "Authentication", 3000)
  }, function(error) {
    NotificationManager.error("Could not sign user out", "Authentication", 5000)
  });
}
export function initializeFirebase() {
  if (firebase_initialized) {
    return;
  }
  firebase.initializeApp(config);
  firebase_initialized = true;
}