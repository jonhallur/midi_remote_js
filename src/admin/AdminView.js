import React, {Component} from "react";
import {Grid, List, ListItem, ListItemText} from "@material-ui/core";
import {NavLink} from "react-router-dom";

const navList = [
  {name: "Remotes", path: "/admin/remotes"},
  {name: "Manufacturers", path: "/admin/manufacturers"}
];
const AdminNavigation = (props) => (
  <List component={"nav"}>
    {
      navList.map((entry, i) => (
        <NavLink to={entry.path} key={i}>
          <ListItem>
            <ListItemText>
              {entry.name}
            </ListItemText>
          </ListItem>
        </NavLink>
      ))
    }
  </List>
);

export const AdminLayout = (props) => (
  <Grid container spacing={24}>
    <Grid item xs={1}/>
    <Grid item xs={10}>
      {props.children}
    </Grid>
    <Grid item xs={1}/>
  </Grid>
);


export class AdminView extends Component {
  render() {
    return (
      <AdminLayout>
        <AdminNavigation/>
      </AdminLayout>
    )
  }
}