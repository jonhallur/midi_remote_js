import React, {Component} from "react";
import * as firebase from "firebase/app";
import 'firebase/auth'
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import MenuIcon from "@material-ui/icons/Menu"
import HomeIcon from "@material-ui/icons/Home"
import AdminIcon from "@material-ui/icons/Settings"
import LinkIcon from "@material-ui/icons/Link"
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import {initializeFirebase} from "./App";
import {NavLink} from "react-router-dom";
import Menu from "@material-ui/core/Menu/Menu";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import * as R from 'ramda'

const LinkToHome = () => (
  <NavLink to="/">
    <MenuItem>
      <ListItemIcon>
        <HomeIcon/>
      </ListItemIcon>
      <ListItemText>Home</ListItemText>
    </MenuItem>
  </NavLink>
);

const LinkToAdmin = (props) => {
  if(props.isAdmin === true) {
    return (
      <NavLink to="/admin">
        <MenuItem>
          <ListItemIcon>
            <AdminIcon/>
          </ListItemIcon>
          <ListItemText>Admin</ListItemText>
        </MenuItem>
      </NavLink>
    )
  } else {
    return "";
  }
};

const BreadCrumbs = () => {
  let fullPathList = window.location.pathname.split("/");
  let filteredPathList = R.filter(n => n !== "" && n !== "admin",R.dropLast(1,fullPathList));
  return filteredPathList.map((name, index) => {
    let indexOf = R.indexOf(name, fullPathList);
    let link = R.join("", R.take(indexOf+1, R.map(path => R.concat(path, "/"), fullPathList)));
    return (
      <NavLink key={index} to={link}>
        <MenuItem>
          <ListItemIcon>
            <LinkIcon/>
          </ListItemIcon>
          <ListItemText>{name}</ListItemText>
        </MenuItem>
      </NavLink>
      )
    }
  );
};

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      isAdmin: false,
      anchorEl: null
    }
  }

  componentDidMount() {
    initializeFirebase();
    firebase.auth().onAuthStateChanged((authUser) => {
      let user = undefined;
      let isAdmin = false;
      if (authUser) {
        user = authUser;
        firebase.database().ref("v2/private/admins").child(authUser.uid).once("value", (snapshot) => {
          isAdmin = snapshot.exists();
          this.setState({user, isAdmin});
          this.props.changeUser(user, isAdmin);
        })
      } else {
        isAdmin = false;
        user = undefined;
      }
      this.setState({user, isAdmin});
      this.props.changeUser(user, isAdmin);
    });
  }

  onLoginClick() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
      const token = result.credential.accessToken;
      console.log("token", token);
      console.log(result)
    }).catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
      console.error("Google Login error", email, credential, errorMessage, errorCode);
    });
  }

  onMenuClick(event) {
    this.setState({anchorEl: event.currentTarget})
  }

  onMenuClose() {
    this.setState({anchorEl: null})
  }

  render() {
    let {user, anchorEl} = this.state;
    let dropDownMenu = (
      <Menu
        id="nav-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClick={this.onMenuClose.bind(this)}
      >
        <LinkToHome />
        <LinkToAdmin {...this.state} />
        <BreadCrumbs/>
      </Menu>
    );
    return (
      <div style={{flexGrow: 1}}>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu">
              <MenuIcon
                aria-owns={anchorEl ? 'nav-menu' : undefined}
                aria-haspopup="true"
                onClick={this.onMenuClick.bind(this)}
              />
            </IconButton>
            {dropDownMenu}
            <Typography variant="h6" color="inherit" style={{flexGrow: 1}}>
              MIDI Remotes
            </Typography>
            {user
              ? <Button variant="contained" color="secondary" onClick={(event) => this.onLogoutClick()}>Logout</Button>
              : <Button variant="contained" color="secondary" onClick={(event) => this.onLoginClick()}>Login</Button>
            }

          </Toolbar>
        </AppBar>
      </div>
    )
  }

  onLogoutClick() {
    firebase.auth().signOut().then(function () {
      console.info("User signed out", "Authentication", 3000)
    }, function (error) {
      console.error("Could not sign user out", "Authentication", 5000, error)
    });
  }
}