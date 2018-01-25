import React, { Component } from "react"

import withStyles from "material-ui/styles/withStyles"
import List from "material-ui/List/List"
import ListItem from "material-ui/List/ListItem"
import ListItemText from "material-ui/List/ListItemText"

import AccountsUIWrapper from "./AccountsUIWrapper"

import { styles } from "./Theme"
import ListItemSecondaryAction from "material-ui/List/ListItemSecondaryAction";

class SidebarInfo extends Component {
    render() {
        const { currentUser, classes } = this.props

        return (
            <List className={classes.sidebar}>
                <ListItem>
                    <AccountsUIWrapper />
                    <ListItemText primary="Account" />
                </ListItem>
            </List>
        )
    }
}

export default withStyles(styles)(SidebarInfo)