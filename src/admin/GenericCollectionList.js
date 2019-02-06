import React, {Component} from "react";
import {initializeFirebase} from "../App";
import * as firebase from "firebase/app";
import "firebase/database";
import {ListItem, ListItemText, ListItemSecondaryAction, IconButton, List} from '@material-ui/core'
import DeleteIcon from "@material-ui/icons/Delete";
import {GenericModelForm} from "./GenericModelForm";
import {NavLink} from "react-router-dom";
//import {manufacturers} from '../pojos/predefined'

export class GenericCollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    initializeFirebase();
    let modelPath = this.props.modelPath;
    this.getList(modelPath);
  }

  componentWillUnmount() {
    initializeFirebase();
    let modelPath = this.props.modelPath;
    firebase.database().ref(modelPath).off();
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if(this.props.setStateFromChild !== undefined) {
      this.props.setStateFromChild(nextState);
    }
    return true;
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
      //   var ref = firebase.database().ref(this.props.modelPath);
      //   manufacturers.forEach((item) => {
      //     ref.push(item);
      //   })
      }
      this.setState({
        list: list
      })
    })
  }

  deleteListItem(key) {
    let ref = firebase.database().ref(this.props.modelPath);
    ref.child(key).remove(function(error) {
      if(!error) {
        console.log("Remote", key, "removed")
      }
      else {
        console.error("Remote removal error")
      }
    })
  }

  render() {
    console.log(this.props.model)
    console.log(this.state)
    const genericList = this.state.list.map((item) =>
      <ListItem key={item.key}>
        <NavLink to={this.props.modelPath.replace("v2/private/", "/admin/") + '/' + item.key}>
          <ListItemText
            primary={item.name}
            secondary={`Created at ${new Date(item.created).toLocaleTimeString()} on ${new Date(item.created).toLocaleDateString()} by ${item.userEmail}`}/>
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
      <>
        {
          this.props.model
            ? <GenericModelForm {...this.props} />
            : ""
        }
        <List dense={true} >
          {genericList}
        </List>
      </>
    )
  }
}