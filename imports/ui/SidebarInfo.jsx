import React, { Component } from "react"

import { findUserById } from "../api/Common"

import withStyles from "material-ui/styles/withStyles"
import List from "material-ui/List/List"
import ListItem from "material-ui/List/ListItem"
import ListItemText from "material-ui/List/ListItemText"

import { UserAvatar } from "./Common"

import { styles } from "./Theme"
import ListItemSecondaryAction from "material-ui/List/ListItemSecondaryAction"
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
import ListSubheader from "material-ui/List/ListSubheader"
import Dialog from "material-ui/Dialog/Dialog";
import DialogTitle from "material-ui/Dialog/DialogTitle";
import DialogContent from "material-ui/Dialog/DialogContent";
import DialogContentText from "material-ui/Dialog/DialogContentText";
import DialogActions from "material-ui/Dialog/DialogActions";

class SidebarInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentlyInviting: false
        }
    }

    render() {
        const { currentUser, currentFlat, relatedUsers, classes, onClose } = this.props

        return (
            <div className={classes.sidebar}>
                { this.renderLogoutAndCloseControls(currentUser, onClose) }
                <Divider />
                { this.renderFlatMemberList(currentFlat, relatedUsers) }
                <Divider />
                { this.renderMoveOutButton() }
                <Divider />
                { this.renderInvitationList(currentFlat, relatedUsers) }
                <InvitationDialog
                    open={this.state.currentlyInviting}
                    onClose={() => this.setState({ currentlyInviting: false })}
                />
            </div>
        )
    }

    renderLogoutAndCloseControls(currentUser, onClose) {
        return (
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
                <ListItem
                    button
                    onClick={() => this.logout()}
                >
                    <UserAvatar user={currentUser} />
                    <ListItemText primary="Log out" secondary={currentUser ? "Logged in as: " + currentUser.username : undefined} />
                </ListItem>
            </List>
        )
    }

    renderFlatMemberList(currentFlat, relatedUsers) {
        const { classes } = this.props
        return (
            <List dense subheader={<ListSubheader>Members of {currentFlat.flatName}:</ListSubheader>}>
                {
                    currentFlat.members.map((memberId) => {
                        const member = findUserById(memberId, relatedUsers)
                        return (
                            <ListItem key={memberId}>
                                <UserAvatar className={classes.smallAvatar} user={member} />
                                <ListItemText primary={member.username} />
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }

    renderMoveOutButton() {
        const { classes } = this.props
        return (
            <Typography component="div" className={classes.padded}>
                <Button
                    raised
                    className={classes.dangerButton}
                    onClick={() => this.moveOut()}
                    fullWidth
                >
                    Move out
                </Button>
            </Typography>
        )
    }

    renderInvitationList(currentFlat, relatedUsers) {
        const { classes } = this.props
        return (
            <div>
                <List dense subheader={<ListSubheader>Invitations</ListSubheader>}>
                    {
                        currentFlat.invitations.length !== 0
                            ? ""
                            : <Typography className={classes.centerContainer} type="caption">No invitations</Typography>
                    }
                    {
                        currentFlat.invitations.map((invitedUserId) => {
                            const invitedUser = findUserById(invitedUserId, relatedUsers)
                            return (
                                <ListItem key={invitedUserId}>
                                    <UserAvatar className={classes.smallAvatar} user={invitedUser} />
                                    <ListItemText primary={invitedUser.username} />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            onClick={() => this.deleteInvitation(invitedUserId)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })
                    }
                </List>
                <Typography component="div" className={classes.padded}>
                    <Button
                        raised
                        color="primary"
                        onClick={() => this.startInvitingSomeone()}
                        fullWidth
                    >
                        Invite someone
                    </Button>
                </Typography>
            </div>
        )
    }

    logout() {
        Meteor.logout()
    }

    moveOut() {
        Meteor.call("flats.moveOut")
    }

    startInvitingSomeone() {
        this.setState({
            currentlyInviting: true
        })
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

class InvitationDialog extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: "",
            errorText: undefined,
            textFieldFocused: false,
        }
    }

    render() {
        const { open, onClose } = this.props

        return (
            <Dialog
                open={open}
                onClose={onClose}
            >
                <DialogTitle>Invite someone</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {/* TODO: This seems like a forced text. Maybe think about what would acutally be useful information */}
                        Users invited will recieve the option to accept an invitation and then automatically
                        join this flat. You can still cancel an invitation as long as the recpient did not
                        accept it.
                    </DialogContentText>
                    <TextField
                        label="Username to invite"
                        onFocus={() => this.setState({ textFieldFocused: true })}
                        onBlur={() => this.setState({ textFieldFocused: false })}
                        onKeyDown={(event) => this.onKeyDown(event)}
                        error={this.state.errorText && this.state.textFieldFocused}
                        helperText={this.state.textFieldFocused ? this.state.errorText : ""}
                        value={this.state.username}
                        onChange={(event) => this.setState({ username: event.target.value })}
                        autoFocus
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button 
                        onClick={() => this.tryToInviteUser(this.state.username)} 
                        color="primary"
                        raised
                    >
                        Invite
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    onKeyDown(event) {
        if (event.key === "Enter") {
            this.tryToInviteUser(this.state.username)
        }
    }

    tryToInviteUser(username) {
        Meteor.call("flats.inviteUser", username, (error, result) => {
            if (error) {
                this.setState({ errorText: error.reason })
            } else {
                this.setState({ errorText: undefined, textFieldFocused: false, username: "" })
                this.props.onClose() // request closing this dialog
            }
        })
    }
}

export default withStyles(styles)(SidebarInfo)