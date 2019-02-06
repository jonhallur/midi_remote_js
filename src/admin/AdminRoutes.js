import React, {Component} from "react";
import {Route} from "react-router-dom";
import {GenericCollectionList} from "./GenericCollectionList";
import {GenericModelForm} from "./GenericModelForm";
import {FORM_TYPE, getModelType} from "../pojos/const";
import {AdminView} from "./AdminView";
import {Typography} from "@material-ui/core";
import {RemoteEditForm} from "./RemoteEditForm";
import {PanelEditForm} from "./PanelEditForm";
import {AddRemoteInput} from "../AddRemoteForm";
import {ControlEditForm} from "./ControlEditForm";

let ManufacturerModel = {
  name: {type: FORM_TYPE.STRING, help: "Type manufacturer name here"},
  sys_ex_id: {type: FORM_TYPE.NUMBER_LIST, help: "Comma separated list, extended starts with 0"}};

let RemoteModel = {
  name: {type: FORM_TYPE.STRING, help: "Type the remote name here"},
  manufacturer_id: {type: FORM_TYPE.DATA_KEY, default: "Manufacturer", help: "Select manufacturer", dataPath:"v2/private/manufacturers"}
};

const Restricted = () => (
  <Typography variant="h3">This page requires Administrator access</Typography>
);

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    rest.isAdmin === true
      ? <Component {...props} {...rest} />
      : <Restricted />
  )} />
);

const GenericFormAndCollection = (props) => (
  <>
    <GenericModelForm {...props}/>
    <GenericCollectionList {...props} />
  </>
);

export class AdminRoutes extends Component {
  render() {
    return (
      <>
        <AdminRoute {...this.props} exact path="/admin" component={AdminView} />
        <AdminRoute
          {...this.props}
          exact path="/admin/remotes/:remote_key"
          paramKey="remote_key"
          modelPath="v2/private/remotes"
          model={RemoteModel}
          title="Edit Remote"
          component={RemoteEditForm}
        />
        <AdminRoute
          {...this.props}
          exact path="/admin/panels/:remote_key/:panel_key"
          paramKey="panel_key"
          title="Edit Panel"
          component={PanelEditForm}
        />
        <AdminRoute
          {...this.props}
          exact path={"/admin/panels/:remote_key/:panel_key/:control_key"}
          paramKey={"control_key"}
          title={"Edit Control"}
          component={ControlEditForm}
        />

        <AdminRoute
          {...this.props}
          exact path="/admin/remotes"
          modelPath="v2/private/remotes"
          model={RemoteModel}
          title="Remote list"
          component={GenericFormAndCollection}
        />
        <AdminRoute
          {...this.props}
          exact path="/admin/manufacturers/:manufacturer_key"
          paramKey="manufacturer_key"
          modelPath="v2/private/manufacturers"
          model={ManufacturerModel}
          title="Edit Manufacturer"
          component={GenericModelForm}
        />
        <AdminRoute
          {...this.props}
          exact path="/admin/manufacturers"
          modelPath="v2/private/manufacturers"
          model={ManufacturerModel}
          title="Manufacturers List"
          component={GenericFormAndCollection}
        />
      </>
    )
  }
}