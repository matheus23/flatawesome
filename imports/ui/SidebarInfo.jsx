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
import { Session } from "meteor/session"
import Divider from "material-ui/Divider/Divider"
import ListItemIcon from "material-ui/List/ListItemIcon"
import ArrowBackIcon from "material-ui-icons/ArrowBack"
import Typography from "material-ui/Typography/Typography"
import Button from "material-ui/Button/Button"
import TextField from "material-ui/TextField/TextField"

import DeleteIcon from "material-ui-icons/Delete"
import IconButton from "material-ui/IconButton/IconButton"

class SidebarInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            invitedUsername: "",
            invitationError: undefined
        }
    }

    render() {
        const { currentUser, currentFlat, classes, onClose } = this.props

        // TODO: This is ugly AS FUCK fix that PLEASE FIXME
        return (
            <div className={classes.sidebar}>
                <List>
                    <ListItem
                        button
                        onClick={() => onClose()}
                    >
                        <ListItemIcon>
                            <ArrowBackIcon />
                        </ListItemIcon>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary={currentFlat.flatName} />
                        <ListItemSecondaryAction>
                            <Button
                                raised
                                className={classes.dangerButton}
                                onClick={() => this.moveOut()}
                            >
                                Move out
                            </Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <Typography type="title">Members:</Typography>
                    { currentFlat.members.map((member) => 
                        <ListItem key={member}>
                            <ListItemText primary={member} />
                        </ListItem>)
                    }
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
                
                <Typography type="title">Invite users to the flat:</Typography>
                <TextField
                    label="Username"
                    value={this.state.invitedUsername}
                    error={!!this.state.invitationError}
                    helperText={this.state.invitationError}
                    onChange={(event) => this.setState({ invitationError: undefined, invitedUsername: event.target.value })}
                />
                <Button onClick={() => this.invite()} disabled={!this.state.invitedUsername}>Invite</Button>
                
                <Divider />
                
                <Typography type="title">Outstanding invitations</Typography>
                <List>
                    { currentFlat.invitations.map((userId) => 
                        <ListItem key={userId}>
                            <ListItemText primary={userId} />
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => this.deleteInvitation(userId)} disabled={currentFlat.ownerId !== currentUser._id}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>) 
                    }
                </List>
            </div>
        )
    }

    logout() {
        Meteor.logout()
    }

    moveOut() {
        Meteor.call("flats.moveOut")
    }

    invite() {
        Meteor.call("flats.inviteUser", this.state.invitedUsername, (error, result) => {
            if (error) {
                this.setState({ invitationError: error.reason })
            }
        })
    }

    deleteInvitation(userId) {
        Meteor.call("flats.deleteInvitation", userId)
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