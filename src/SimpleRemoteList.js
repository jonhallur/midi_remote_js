import React, {Component} from "react";
import * as firebase from "firebase/app";
import "firebase/database";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import DeleteIcon from "@material-ui/icons/Delete"
import List from "@material-ui/core/List/List";
import {initializeFirebase} from "./App";

export class ListOfRemotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remotes: []
    }
  }

  componentDidMount() {
    initializeFirebase();
    this.getSynthRemotes();
  }

  getSynthRemotes() {
    firebase.database().ref("v2/public/remotes").on("value", (snapshot) => {
      let data = snapshot.val();
      let remotes = [];
      if (data !== undefined) {
        snapshot.forEach(remote => {
          remotes.push({...remote.val(), key: remote.key})
        })
      }
      this.setState({
        remotes: remotes
      })
    })
  }

  deleteRemote(key) {
    let ref = firebase.database().ref("v2/public/remotes");
    ref.child(key).remove(function(error) {
      if(!error) {
        console.log("Remote", key, "removed")
      }
      else {
        console.log("Remote removal error")
      }
    })
  }

  render() {
    const remoteList = this.state.remotes.map((remote) =>
      <ListItem key={remote.key}>
        <ListItemText primary={remote.name} secondary={`Created at ${new Date(remote.timestamp).toLocaleTimeString()} on ${new Date(remote.timestamp).toLocaleDateString()} by ${remote.userEmail}`}/>
        {
          this.props.isAdmin ?
            <ListItemSecondaryAction>
              <IconButton aria-label="Delete" disabled={!this.props.isAdmin} onClick={() => this.deleteRemote(remote.key)}>
                <DeleteIcon/>
              </IconButton>
            </ListItemSecondaryAction> : undefined

        }

      </ListItem>
    );
    return (
      <div>
        <h1>Remotes</h1>
        <List dense={true}>
          {remoteList}
        </List>
      </div>
    )
  }
}