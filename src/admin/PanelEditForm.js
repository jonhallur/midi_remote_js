import React, {Component} from "react"
import {CONTROL_METHOD, control_methods, CONTROL_TYPE, control_types, getModelType} from "../pojos/const";
import {Divider, FormGroup, Select, Typography} from "@material-ui/core";
import {AdminLayout} from "./AdminView";
import {GenericCollectionList} from "./GenericCollectionList";

export class PanelEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      control_method: "",
      control_type: ""
    };
    this.handleMethodTypeChanges.bind(this);

  }

  handleMethodTypeChanges(childState) {
    let {control_method, control_type} = childState;
    console.log(control_type, control_method)
    if(this.setState) {
      this.setState({control_method, control_type})
    }
  }

  render() {
    return (
      <AdminLayout>
        <Typography variant={"h3"}>Panel edit</Typography>
          <GenericCollectionList
            {...this.state}
            {...this.props}
            setStateFromChild={this.handleMethodTypeChanges}
            paramKey={undefined}
            model={getModelType(this.state.control_type, this.state.control_method)}
            title={"Edit Control"}
            modelPath={["v2/private/controls", this.props.match.params.remote_key, this.props.match.params.panel_key].join("/")}
          />
      </AdminLayout>
    )
  }

  static getModel(control_method, control_type) {
    let typeModel = getModelType[control_type];
    return {...typeModel};
  }
}

//so084187