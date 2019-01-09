import React, {Component} from "react";
import {initializeFirebase} from "../App";
import * as firebase from "firebase/app";
import "firebase/database";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {GenericModelForm} from "./GenericModelForm";
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper/Paper";
import {NavLink} from "react-router-dom";
import List from "@material-ui/core/List/List";
import {manufacturers} from '../pojos/predefined'

export class GenericCollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    initializeFirebase();
    let path = this.props.path;
    this.getList(path);
  }

  getList(path) {
    firebase.database().ref(path).on("value", (snapshot) => {
      let data = snapshot.val();
      let list = [];
      if (data !== undefined && data !== null) {
        snapshot.forEach(remote => {
          list.push({...remote.val(), key: remote.key})
        })
      } else {
        var ref = firebase.database().ref(this.props.path);
        manufacturers.forEach((item) => {
          ref.push(item);
        })
      }
      this.setState({
        list: list
      })
    })
  }

  deleteListItem(key) {
    let ref = firebase.database().ref(this.props.path);
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
    const genericList = this.state.list.map((item) =>
      <ListItem key={item.key}>
        <NavLink to={this.props.path + '/' + item.key}>
          <ListItemText
            primary={item.name}
            secondary={`Created at ${new Date(item.timestamp).toLocaleTimeString()} on ${new Date(item.timestamp).toLocaleDateString()} by ${item.userEmail}`}/>
        </NavLink>
        {
          this.props.isAdmin ?
            <ListItemSecondaryAction>
              <IconButton aria-label="Delete" disabled={!this.props.isAdmin} onClick={() => this.deleteListItem(item.key)}>
                <DeleteIcon/>
              </IconButton>
            </ListItemSecondaryAction> : undefined

        }
      </ListItem>
    );
    return (
      <Paper elevation={5}>
        <Typography variant={"h3"}>{this.props.title}</Typography>
       <GenericModelForm {...this.props} />
        <List>
          {genericList}
        </List>
      </Paper>
    )
  }
}