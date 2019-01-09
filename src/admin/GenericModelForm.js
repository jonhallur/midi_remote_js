import React, {Component} from "react";
import {initializeFirebase} from "../App";
import * as firebase from "firebase/app";
import "firebase/database";
import * as R from 'ramda'
import {FORM_TYPE} from "../pojos/const";
import MDCInput from "@material-ui/core/Input/Input";
import MDCButton from "@material-ui/core/Button/Button";
import MDCFormGroup from "@material-ui/core/FormGroup/FormGroup";
import Paper from "@material-ui/core/Paper/Paper";

export class GenericModelForm extends Component {
  constructor(props) {
    super(props);
    this.state = R.mapObjIndexed(
      (value, key, obj) => {
        return "";
      }, props.model)
}

  createUIComponent(value, key) {
    switch(value.type) {
      case FORM_TYPE.number:
      case FORM_TYPE.string:
        return <MDCInput
          key={key}
          value={this.state[key]}
          onChange={(event) => this.setState({[key]: event.target.value})}
          placeholder={value.help}
        />;
      case FORM_TYPE.number_list:
      case FORM_TYPE.string_list:
        return <MDCInput
          key={key}
          value={this.state[key]}
          onChange={(event) => {
            let newValue = event.target.value.split(",");
            this.setState({[key]: newValue})
          }}
          placeholder={value.help}
        />;
      default:
        return (<h1>Error, model element missing type</h1>)

    }
  }

  nothingIsEmpty() {
    return R.none(R.isEmpty, R.values(this.state))
  }

  onAddModelClick(event) {
    event.preventDefault();
    if(this.nothingIsEmpty()) {
      initializeFirebase();
      let newModelRef = firebase.database().ref(this.props.path).push();
      let newModel = {
        ...this.state,
        timestamp: new Date().toISOString(),
        userId: this.props.user.uid,
        userEmail: this.props.user.email
      };
      newModelRef.set(newModel);
      R.keys(this.state).forEach((key) => {
        this.setState({[key]: ""});
      })
    }
  }
  render() {
    let inputs = [];
    R.forEachObjIndexed((value, key) => {
      inputs.push(this.createUIComponent(value, key));
    },this.props.model);
    return (
      <Paper elevation={10}>
      <MDCFormGroup>
        {inputs}
        <MDCButton
          color="secondary"
          variant="contained"
          onClick={(event) => this.onAddModelClick(event)}
        >Add</MDCButton>
      </MDCFormGroup>
      </Paper>
    );
  }
}