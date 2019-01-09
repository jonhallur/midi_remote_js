import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

const navList = [
  {name: "Remotes", path: "/admin/remotes"},
  {name: "Manufacturers", path: "/admin/manufacturers"}
];

export class AdminView extends Component {
  render() {
    return (
      <div>
        <List dense={true} component={"nav"}>
          {
            navList.map((entry, i) => (
            <NavLink to={entry.path} key={i}>
              <ListItemText>
                {entry.name}
              </ListItemText>
              <ListItem>
              </ListItem>
            </NavLink>
            ))
          }
        </List>
      </div>
    )
  }
}