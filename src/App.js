import React, {Component} from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/database";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import {Header} from "./Header";
import {Route} from 'react-router-dom';
import {UserView} from "./UserView";
import {AdminRoutes} from "./admin/AdminRoutes";

const userTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: "#f8ffd7",
      main: "#c5e1a5",
      dark: "#94af76",
    },
    secondary: {
      light: "#e4e65e",
      main: "#afb42b",
      dark: "#7c8500",
    }
  }
});

const adminTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: "#efdcd5",
      main: "#bcaaa4",
      dark: "#8c7b75",
    },
    secondary: {
      light: "#8e8e8e",
      main: "#616161",
      dark: "#373737",
    }
  }
});

var config = {
  apiKey: "AIzaSyCb0Xe0-wxCskS2fVwfNEe_b1NdfbYff90",
  authDomain: "midi-remote-23d30.firebaseapp.com",
  databaseURL: "https://midi-remote-23d30.firebaseio.com",
  storageBucket: "midi-remote-23d30.appspot.com",
};

let firebase_initialized = false;

export function initializeFirebase() {
  if (firebase_initialized) {
    return;
  }
  firebase.initializeApp(config);
  firebase_initialized = true;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      isAdmin: false
    }
  }

  setUser(user, isAdmin) {
    this.setState({
      user: user,
      isAdmin: isAdmin
    })
  }

  render() {
    return (
      <MuiThemeProvider theme={this.state.isAdmin ? adminTheme : userTheme}>
        <Header changeUser={this.setUser.bind(this)}/>
          <Route exact path="/" render={(props) => <UserView {...props} {...this.state} />} />
          <AdminRoutes {...this.state} />
      </MuiThemeProvider>
    );
  }
}


export default App;
