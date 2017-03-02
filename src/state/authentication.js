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
    loginPassword: '',
    showEmailLogin: false,
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
      authentication.setUsingKeyValue({key: 'loggedIn', value: true});
      authentication.setUsingKeyValue({key: 'showLoginModal', value: false});

    } else {
      authentication.setUsingKeyValue({key: 'user', value: ''});
      authentication.setUsingKeyValue({key: 'userName', value: ''});
      authentication.setUsingKeyValue({key: 'userEmail', value: ''});
      authentication.setUsingKeyValue({key: 'loggedIn', value: false});
      authentication.setUsingKeyValue({key: 'showLoginModal', value: true});
    }
  });
}

export function loginEmailUser(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    NotificationManager.error(errorMessage, "Login Error: " + errorCode, 5000)
  })
}

export function signOutUser(){
  firebase.auth().signOut().then(function() {
    NotificationManager.info("User signed out", "Authentication", 3000)
  }, function(error) {
    NotificationManager.error("Could not sign user out", "Authentication", 5000)
  });
}

export function createEmailUser(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    NotificationManager.error(errorMessage, "Create User Error: " + errorCode, 5000)
  }).then(function() {
    setTimeout(() => {
      loginEmailUser(email, password)
    }, 5000);
  });
}

export function loginGoogleUser() {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    NotificationManager.error(error.message, error.code);
    // ...
  });
}

export function createGoogleUser() {
  firebase.auth()
}

export function initializeFirebase() {
  if (firebase_initialized) {
    return;
  }
  firebase.initializeApp(config);
  firebase_initialized = true;
}