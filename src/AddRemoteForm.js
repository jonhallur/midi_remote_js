import React, {Component} from "react";
import * as R from "ramda";
import * as firebase from "firebase/app";
import "firebase/database"
import MDCFormGroup from "@material-ui/core/FormGroup/FormGroup";
import MDCInput from "@material-ui/core/Input/Input";
import MDCButton from "@material-ui/core/Button/Button";

export class AddRemoteInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remoteName: ""
    }
  }

  onAddModelClick(event) {
    event.preventDefault();
    if (R.isEmpty(this.state.remoteName)) {
      return;
    }
    let newRemote = firebase.database().ref("v2/public/remotes").push();
    newRemote.set({
      name: this.state.remoteName,
      timestamp: new Date().toISOString(),
      userId: this.props.user.uid,
      userEmail: this.props.user.email
    });
    this.setState({remoteName: ""});
  }

  render() {
    return (
      <div style={{flexGrow: 1}}>
          <MDCFormGroup row={true}>
            <MDCInput
              value={this.state.remoteName}
              onChange={(event) => this.setState({remoteName: event.target.value})}
              placeholder={"Name of remote to add"}
            />
            <MDCButton
              color="secondary"
              variant="contained"
              onClick={(event) => this.onAddModelClick(event)}
            >Add</MDCButton>
          </MDCFormGroup>
      </div>
    );
  }
}