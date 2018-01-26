import React, { Component } from "react"

import withStyles from "material-ui/styles/withStyles"
import List from "material-ui/List/List"
import ListItem from "material-ui/List/ListItem"
import ListItemText from "material-ui/List/ListItemText"

import AccountsUIWrapper from "./AccountsUIWrapper"

import { styles } from "./Theme"
import ListItemSecondaryAction from "material-ui/List/ListItemSecondaryAction"
import Avatar from "material-ui/Avatar/Avatar"
import { Meteor } from "meteor/meteor"
import Divider from "material-ui/Divider/Divider"
import ListItemIcon from "material-ui/List/ListItemIcon"
import ArrowBackIcon from "material-ui-icons/ArrowBack"

class SidebarInfo extends Component {
    render() {
        const { currentUser, classes, onClose } = this.props

        return (
            <List className={classes.sidebar}>
                <ListItem
                    button
                    onClick={() => onClose()}
                >
                    <ListItemIcon>
                        <ArrowBackIcon />
                    </ListItemIcon>
                </ListItem>
                <Divider />
                <ListItem
                    button
                    onClick={() => this.logout()}
                >
                    <UserAvatar user={currentUser} />
                    <ListItemText primary="Log out" secondary={currentUser ? "Logged in as: " + currentUser.username : undefined} />
                </ListItem>
                <Divider />
            </List>
        )
    }

    logout() {
        Meteor.logout()
    }
}

function UserAvatar(props) {
    const { username } = props.user || { username: "?" }

    const usernameShort = username.slice(0, 1).toUpperCase()

    return (
        <Avatar alt={username}>{usernameShort}</Avatar>
    )
}

export default withStyles(styles)(SidebarInfo)