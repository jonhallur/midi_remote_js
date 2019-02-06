import React, {Component} from 'react'
import {GenericModelForm} from "./GenericModelForm";
import {GenericCollectionList} from "./GenericCollectionList";
import * as R from "ramda";
import {FORM_TYPE} from "../pojos/const";

let PanelModel = {
  name: {type: FORM_TYPE.STRING, help: "Type the panel name here"}
};

export class RemoteEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panelName: "",
      panels: []
    }
  }

  render() {
    console.log("this", this.props)
    return (
      <>
        <GenericModelForm
          {...this.props}

        />
        {
          R.hasPath(["match", "params", this.props.paramKey])
          ? <GenericCollectionList
              {...this.props}
              modelPath={[
                "v2/private/panels",
                this.props.match.params.remote_key].join('/')}
              paramKey="panel_key"
              model={PanelModel}
              title="Panel list"
            />
          : ""
        }
      </>
    )
  }
}