import React, {Component} from "react";
import {initializeFirebase} from "../App";
import * as firebase from "firebase/app";
import "firebase/database";
import * as R from 'ramda'
import {CONTROL_METHOD, control_methods, CONTROL_TYPE, control_types, FORM_TYPE} from "../pojos/const";
import {Input, Button, Select, FormGroup, Typography} from '@material-ui/core'

export class GenericModelForm extends Component {
  constructor(props) {
    super(props);
    let modelState = R.mapObjIndexed(
      () => {
        return "";
      }, props.model);
    this.state = {modelState, externals: {}}
  }

  componentDidMount() {
    let inputsNeedingData = R.filter(n => R.propEq("type", FORM_TYPE.DATA_KEY, n), this.props.model);
    if(R.not(R.isEmpty(inputsNeedingData))) {
      this.getNeededData(inputsNeedingData);
    }
    if(R.hasPath(["match", "params", this.props.paramKey], this.props)) {
      this.getModelValuesFromDataStore();
    }
  }


  getNeededData(needsData) {
    initializeFirebase();
    let pathList = [];
    R.forEachObjIndexed((val, key) => pathList.push({key: key, path: val.dataPath}), needsData);
    pathList.forEach((item) => {
      firebase.database().ref(item.path).once("value").then((snapshot) => {
        if(snapshot.val() !== null) {
          let ext = [];
          snapshot.forEach((entry) => {
            ext.push({value: entry.key, name: entry.val().name});
          });
          this.setState({externals: {...this.state.externals, [item.key]: ext}})
        }
      })
    });
  }
  getModelValuesFromDataStore() {
    initializeFirebase();
    let pathToModel = [this.props.modelPath, this.props.match.params[this.props.paramKey]].join('/');
    firebase.database().ref(pathToModel).once("value").then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        R.keys(this.props.model).forEach((key) => {
          let value = data[key];
          if (this.props.model.type === FORM_TYPE.NUMBER_LIST || this.props.model.type === FORM_TYPE.STRING_LIST) {
            value = value.join(',')
          }
          this.setState({modelState: {...this.state.modelState, [key]: value}})
        })
      }
    })
  }

  createUIComponent(value, key) {
    switch(value.type) {
      case FORM_TYPE.NUMBER:
      case FORM_TYPE.STRING:
        return <Input
          key={key}
          value={this.state.modelState[key]}
          onChange={(event) => this.setState({modelState:{...this.state.modelState, [key]: event.target.value}})}
          placeholder={value.help}
        />;
      case FORM_TYPE.NUMBER_LIST:
      case FORM_TYPE.STRING_LIST:
        return <Input
          key={key}
          value={this.state.modelState[key]}
          onChange={(event) => {
            let newValue = event.target.value.split(",");
            this.setState({modelState: {...this.state.modelState, [key]: newValue}})
          }}
          placeholder={value.help}
        />;
      case FORM_TYPE.DATA_KEY:
        if(this.state.externals[key] === undefined) {
          return (<div key={key}>...loading</div>);
        } else {
          return (
            <Select
              native
              key={key}
              value={this.state.modelState[key]}
              onChange={(event) => {
                this.setState({modelState: {...this.state.modelState, [key]: event.target.value}})
              }}
            >
              <option key="0" value="" />
              {
                this.state.externals[key].map((item) => (
                  <option key={item.value} value={item.value}>{item.name}</option>
                ))
              }
            </Select>
          );
        }
      case FORM_TYPE.CONTROL_KEY:
          return [
            <Select
              native
              key={"control_method"}
              value={this.state.control_method}
              onChange={(event) => {
                this.setState({control_method: event.target.value})
              }}
            >
              <option disabled value={""}>Please select method</option>
              {
                control_methods.map((name) => (
                  <option key={CONTROL_METHOD[name]} value={CONTROL_METHOD[name]}>{name}</option>
                ))
              }
            </Select>,
            <Select
              native
              key={"control_type"}
              value={this.state.control_type}
              onChange={(event) => {
                this.setState({control_type: event.target.value})
               }}
              >
               <option disabled value={""}>Please select type</option>
                {
                  control_types.map((name) => (
                    <option key={CONTROL_TYPE[name]} value={CONTROL_TYPE[name]}>{name}</option>
                  ))
                }
                 </Select>
          ];

      default:
        return (<h1 key={key}>Error, model element missing type</h1>)

    }
  }

  nothingIsEmpty() {
    return R.none(R.isEmpty, R.values(this.state.modelState))
  }

  onAddOrUpdateModelClick(event) {
    event.preventDefault();
    if (this.nothingIsEmpty()) {
      initializeFirebase();
      if (R.hasPath(["match", "params", this.props.paramKey], this.props)) {
        this.updateModelItem();
      } else {
        this.createModelItem();
        let modelState = R.mapObjIndexed(
          () => {
            return "";
          }, this.props.model);
        this.setState({modelState});
      }
    } else {
      console.log("input form has empty items")
    }
  }

  createModelItem() {
    let newModelRef = firebase.database().ref(this.props.modelPath).push();
    let newModel = {
      ...this.state.modelState,
      created: new Date().toISOString(),
      userId: this.props.user.uid,
      userEmail: this.props.user.email
    };
    newModelRef.set(newModel);
  }

  updateModelItem() {
    let pathToModel = [this.props.modelPath, this.props.match.params.key].join('/');
    firebase.database().ref(pathToModel).set({
        ...this.state.modelState,
        updated: new Date().toISOString(),
        userId: this.props.user.uid,
        userEmail: this.props.user.email
    });
  }

  render() {
    console.log("render", this)
    let inputs = [];
    let buttonText = R.hasPath(["match", "params", this.props.paramKey], this.props) ? "Update" : "Add";
    R.forEachObjIndexed((value, key) => {
      inputs.push(this.createUIComponent(value, key));
    },this.props.model);
    return (
      <FormGroup>
        <Typography variant={"h3"}>{this.props.title}</Typography>
        {inputs}
        <Button
          color="secondary"
          variant="contained"
          onClick={(event) => this.onAddOrUpdateModelClick(event)}
        >{buttonText}</Button>
      </FormGroup>
    );
  }
}
