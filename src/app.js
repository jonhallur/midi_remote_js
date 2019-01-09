import React, {Component} from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/database";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import {Header} from "./Header";
import {Route} from 'react-router-dom';
import {UserView} from "./UserView";
import {AdminView} from "./AdminView";
import {GenericCollectionList} from "./admin/GenericCollectionList";
import {FORM_TYPE} from './pojos/const'

const userTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#8ea981"
    },
    secondary: {
      main: "#96b6b7"
    }
  }
});

const adminTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#967228"
    },
    secondary: {
      main: "#d4cdee"
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
          <Route exact path="/admin" render={(props) => <AdminView {...props} {...this.state}/>} />
          <Route exact
                 path="/admin/manufacturers"
                 render={(props) => <GenericCollectionList
                                        path="v2/private/manufacturers"
                                        title="Manufacturers List"
                                        model={
                                          {
                                            name: {type: FORM_TYPE.string, help: "Type manufacturer name here"},
                                            sys_ex_id: {type: FORM_TYPE.number_list, help: "Comma separated list, extended starts with 0"}}}
                                        {...props} {...this.state}/>} />
      </MuiThemeProvider>
    );
  }
}


export default App;
