import React, {Component} from "react";
import {AddRemoteInput} from "./AddRemoteForm";
import {ListOfRemotes} from "./SimpleRemoteList";

export class UserView extends Component {
  render() {
    return (
      <>
        {
          this.props.isAdmin
            ? <AddRemoteInput user={this.props.user}/>
            : ''
        }
        <ListOfRemotes isAdmin={this.props.isAdmin}/>
      </>
    )
  }
}